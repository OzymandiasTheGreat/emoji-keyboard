import { remote, Event, clipboard } from "electron";
import { Injectable, Inject } from "@angular/core";

import { Titlebar } from "custom-electron-titlebar";
import { Observable, fromEventPattern } from 'rxjs';

import { TITLEBAR, MENUBAR, APPMENU } from "../../shared";


const { app, Menu, MenuItem, BrowserWindow, globalShortcut } = remote;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
	private app: Electron.App;
	private window: Electron.BrowserWindow;
	public clipboard = clipboard;
	constructor(
		@Inject(TITLEBAR) private titlebar: Titlebar,
		@Inject(MENUBAR) private menubar: typeof Menu.prototype,
		@Inject(APPMENU) private appMenu: typeof Menu.prototype,
	) {
		this.app = app;
		this.window = BrowserWindow.fromId(MainWindowId);
	}

	isElectron = () => {
		return window && window.process && window.process.type;
	}

	private observableMenuItem(menu: typeof Menu.prototype, options: { id: string, label: string, role?: typeof MenuItem.prototype.role }): Observable<(typeof MenuItem | Electron.BrowserWindow | Event)[]> {
		return fromEventPattern((handler) => {
			const item = new MenuItem({ ...options, click: handler });
			menu.append(item);
		},
		undefined,
		(menuItem: typeof MenuItem, browserWindow: Electron.BrowserWindow, event: Event) => [menuItem, browserWindow, event])
	}

	appendMenubar(options: { id: string, label: string, role?: typeof MenuItem.prototype.role }): Observable<(typeof MenuItem | Electron.BrowserWindow | Event)[]> {
		return this.observableMenuItem(this.menubar, options);
	}

	refreshMenubar(): void {
		this.titlebar.updateMenu(this.menubar);
	}

	toggleMenuItem(label: string, enabled: boolean): void {
		const item = document.querySelector(`.menubar-menu-button[aria-label="${label}"]`);
		if (enabled) {
			item.classList.remove("disabled");
		} else {
			item.classList.add("disabled");
		}
	}

	appendAppMenu(options: { id: string, label: string, role?: typeof MenuItem.prototype.role }): Observable<(typeof MenuItem | Electron.BrowserWindow | Event)[]> {
		return this.observableMenuItem(this.appMenu, options);
	}

	registerHotkey(accel: Electron.Accelerator, callback: () => void): boolean {
		return globalShortcut.register(accel, callback);
	}

	unregisterHotkey(accel: Electron.Accelerator): void {
		globalShortcut.unregister(accel);
	}

	focus(): void {
		this.window.focusOnWebView();
	}

	hide(): void {
		this.window.hide();
	}

	show(): void {
		this.window.show();
		this.window.setAlwaysOnTop(true);
	}

	get visible(): boolean {
		return this.window.isVisible();
	}

	showAbout(): void {
		this.app.showAboutPanel();
	}
}
