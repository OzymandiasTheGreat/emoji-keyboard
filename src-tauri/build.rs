fn main() {
  println!("cargo:rustc-link-lib=static=uiohook");
  println!("cargo:rustc-link-search=native=libuiohook/dist/lib");
  println!("cargo:rustc-link-lib=X11");
  println!("cargo:rustc-link-lib=Xtst");
  println!("cargo:rustc-link-lib=xkbcommon");
  println!("cargo:rustc-link-lib=xkbcommon-x11");
  println!("cargo:rustc-link-lib=xcb");
  println!("cargo:rustc-link-lib=Xinerama");
  println!("cargo:rustc-link-lib=X11-xcb");
  println!("cargo:rustc-link-lib=Xt");
  tauri_build::build()
}
