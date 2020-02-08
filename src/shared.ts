import { remote } from "electron";
import { Titlebar, Color, Themebar } from "custom-electron-titlebar";

import { InjectionToken } from "@angular/core";

const { Menu } = remote;

export const APPMENU = new InjectionToken<typeof Menu>("APPMENU");
export const MENUBAR = new InjectionToken<typeof Menu>("MENUBAR");
export const TITLEBAR = new InjectionToken<Titlebar>("TITLEBAR");

export const appmenu = new Menu();
export const menubar = Menu.buildFromTemplate([
	{ label: "Menu", submenu: appmenu },
]);
export const titlebar = new Titlebar({
	backgroundColor: Color.fromHex("#333333"),
	// icon: ,  // TODO
	iconsTheme: Themebar.win,
	shadow: false,
	minimizable: true,
	// maximizable: false,
	closeable: true,
	menu: menubar,
	menuPosition: "left",
	enableMnemonics: true,
	itemBackgroundColor: Color.fromHex("#FFFFFF33"),
	hideWhenClickingClose: true,
	unfocusEffect: true,
});
