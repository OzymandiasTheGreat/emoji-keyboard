#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

use std::{
	thread,
	time::{
		Duration,
	},
	sync::{
		Arc,
		Mutex,
	},
};
use tauri::{
	AppHandle,
	Builder,
	ClipboardManager,
	CustomMenuItem,
	Manager,
	Position,
	PhysicalPosition,
	RunEvent,
	Runtime,
	State,
	SystemTray,
	SystemTrayEvent,
	SystemTrayMenu,
	Window,
	generate_context,
	generate_handler, WindowEvent,
};
use once_cell::sync::OnceCell;
use enigo::{Enigo, Key, KeyboardControllable};
use interprocess::local_socket::{LocalSocketListener, LocalSocketStream};

include!("./uiohook.rs");

const LOCKFILE: &str = "/tmp/emoji-keyboard.lock";
static APP: OnceCell<AppHandle> = OnceCell::new();
struct WindowState(Arc<Mutex<Position>>);
struct Expansion(Arc<Mutex<bool>>);

async fn backup_and_hide<R: Runtime>(app: &AppHandle, window: &Window<R>, state: &State<'_, WindowState>) -> String {
	let content = app.clipboard_manager().read_text().unwrap().unwrap();
	let position = window.outer_position().unwrap();
	*state.0.lock().unwrap() = Position::Physical(position);
	window.hide().ok();
	content
}

async fn restore_and_show<R: Runtime>(app: &AppHandle, window: &Window<R>, state: &State<'_, WindowState>, content: String) {
	window.show().ok();
	window.set_position(*state.0.lock().unwrap()).ok();
	window.set_focus().ok();
	app.clipboard_manager().write_text(content).ok();
}

#[tauri::command]
async fn paste<R: Runtime>(app: AppHandle, window: Window<R>, state: State<'_, WindowState>, text: String, terminal: bool) -> Result<(), ()> {
	let content = backup_and_hide(&app, &window, &state).await;
	Some(app.clipboard_manager().write_text(text).ok());
	thread::sleep(Duration::from_millis(50));
	let mut enigo = Enigo::new();
	enigo.key_sequence_parse(if terminal {"{+CTRL}{+SHIFT}v{-SHIFT}{-CTRL}"} else {"{+CTRL}v{-CTRL}"});
	thread::sleep(Duration::from_millis(50));
	restore_and_show(&app, &window, &state, content).await;
	Ok(())
}

#[tauri::command]
async fn hide<R: Runtime>(window: tauri::Window<R>, state: State<'_, WindowState>) -> Result<(), ()> {
	let position = window.outer_position().unwrap();
	*state.0.lock().unwrap() = Position::Physical(position);
	window.hide().ok();
	Ok(())
}

#[tauri::command]
async fn show<R: Runtime>(window: tauri::Window<R>, state: State<'_, WindowState>) -> Result<(), ()> {
	window.show().ok();
	window.set_position(*state.0.lock().unwrap()).ok();
	window.set_focus().ok();
	Ok(())
}

#[tauri::command]
async fn expand(state: State<'_, Expansion>, text: String, clear: usize) -> Result<(), ()> {
	if *state.0.lock().unwrap() {
		let mut enigo = Enigo::new();
		for _ in 0..clear {
			enigo.key_click(Key::Backspace);
		}
		enigo.key_sequence(text.as_ref());
	}
	Ok(())
}

#[tauri::command]
async fn toggle_expansion(app: AppHandle, state: State<'_, Expansion>, enabled: bool) -> Result<(), ()> {
	let tray_item = app.tray_handle().get_item("expansion");
	tray_item.set_title(if enabled { "Disable Expansion" } else { "Enable Expansion" }).ok();
	*state.0.lock().unwrap() = enabled;
	Ok(())
}

fn main() {
	let conn = LocalSocketStream::connect(LOCKFILE);
	if conn.is_ok() {
		std::process::exit(0);
	} else {
		std::fs::remove_file(std::path::Path::new(LOCKFILE)).ok();
	}
	let menu = SystemTrayMenu::new()
		.add_item(CustomMenuItem::new("palette", "Palette"))
		.add_item(CustomMenuItem::new("expansion", "Enable Expansion"))
		.add_item(CustomMenuItem::new("settings", "Settings"))
		.add_item(CustomMenuItem::new("about", "About"))
		.add_item(CustomMenuItem::new("quit", "Quit"));
	let app = Builder::default()
		.setup(|app| {
			let app = app.handle();
			APP.set(app.clone()).unwrap();
			extern "C" fn callback(_event: *mut uiohook_event) {
				let app = APP.get().unwrap();
				unsafe {
					match (*_event).type_ {
						_event_type_EVENT_KEY_TYPED => app.emit_all("keypress", (*_event).data.keyboard.keychar).unwrap(),
						_ => (),
					}
				}
			}
			thread::spawn(move || {
				let app = app.clone();
				let listener = LocalSocketListener::bind(LOCKFILE).unwrap();
				for _conn in listener.incoming() {
					app.emit_all("palette", {}).ok();
				}
			});
			thread::spawn(move || {
				unsafe {
					hook_set_dispatch_proc(Some(callback));
					hook_run();
				}
			});
			Ok(())
		})
		.plugin(tauri_plugin_store::PluginBuilder::default().build())
		.manage(WindowState(Arc::new(Mutex::new(Position::Physical(PhysicalPosition::default())))))
		.manage(Expansion(Arc::new(Mutex::new(false))))
		.invoke_handler(generate_handler![expand, hide, paste, show, toggle_expansion])
		.system_tray(SystemTray::new().with_menu(menu))
		.on_system_tray_event(|app, event| match event {
			SystemTrayEvent::DoubleClick {
				position: _,
				size: _,
				..
			} => {
				app.emit_all("palette", {}).ok();
			}
			SystemTrayEvent::MenuItemClick { id, .. } => {
				match id.as_str() {
					"palette" => {
						app.emit_all("palette", {}).ok();
					}
					"expansion" => {
						let state = app.state::<Expansion>();
						let item = app.tray_handle().get_item(&id);
						let enabled = !(*state.0.lock().unwrap());
						item.set_title(if enabled { "Disable Expansion" } else { "Enable Expansion" }).ok();
						*state.0.lock().unwrap() = enabled;
					}
					"settings" => {
						app.emit_all("settings", {}).ok();
					}
					"about" => {
						app.emit_all("about", {}).ok();
					}
					"quit" => {
						std::process::exit(0);
					}
					&_ => {}
				}
			}
			_ => {}
		})
		.build(generate_context!())
		.expect("error while running tauri application");

		app.run(|handle, event| match event {
			RunEvent::WindowEvent { label, event, ..}  => {
				match event { WindowEvent::CloseRequested { api, .. } => {
					let handle = handle.clone();
					let window = handle.get_window(&label).unwrap();
					let state = handle.state::<WindowState>();
					if label == "main" {
						api.prevent_close();

						let position = window.outer_position().unwrap();
						*state.0.lock().unwrap() = Position::Physical(position);
						window.hide().ok();
					}
				},
				_ => {}
			}
		},
		_ => {}
	});
}
