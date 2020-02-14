import { remote } from "electron";
import { Titlebar, Color, Themebar } from "custom-electron-titlebar";

import { InjectionToken } from "@angular/core";

const { Menu, BrowserWindow } = remote;


export const APPMENU = new InjectionToken<typeof Menu>("APPMENU");
export const MENUBAR = new InjectionToken<typeof Menu>("MENUBAR");
export const TITLEBAR = new InjectionToken<Titlebar>("TITLEBAR");


export const appmenu = new Menu();
export const menubar = Menu.buildFromTemplate([
	{ label: "Menu", submenu: appmenu },
]);
export const titlebar = new Titlebar({
	backgroundColor: Color.fromHex("#212121"),
	// icon: ,  // TODO
	iconsTheme: Themebar.win,
	shadow: false,
	// drag: false,  // This is borked
	minimizable: true,
	maximizable: false,
	closeable: true,
	menu: menubar,
	menuPosition: "left",
	enableMnemonics: true,
	itemBackgroundColor: Color.fromHex("#FFFFFF0A"),
	hideWhenClickingClose: true,
	unfocusEffect: false,
});


// document.addEventListener("DOMContentLoaded", function() {
// 	const browserWindow = BrowserWindow.fromId(MainWindowId);
// 	const draggable = document.querySelector(".titlebar");
// 	const cruft = document.querySelectorAll(".titlebar-drag-region, .resizer");
// 	for (const elem of cruft) {
// 		elem.remove();
// 	}

// 	let dragging = false;
// 	draggable.addEventListener("mousedown", (event: MouseEvent) => {
// 		dragging = true;
// 		return false;
// 	});
// 	draggable.addEventListener("mousemove", (event: MouseEvent) => {
// 		if (dragging) {
// 			const [x, y] = browserWindow.getPosition();
// 			document.body.style.cursor = "grabbing";
// 			browserWindow.setPosition(x + event.movementX, y + event.movementY);
// 			return false;
// 		}
// 	});
// 	draggable.addEventListener("mouseup", (event: MouseEvent) => {
// 		dragging = false;
// 		document.body.style.cursor = "default";
// 		return false;
// 	});
// 	let resizing = false;
// 	let initialX = 0;
// 	let initialY = 0;
// 	window.addEventListener("mousedown", (event: MouseEvent) => {
// 		const xDistance = Math.min(event.clientX, window.innerWidth - event.clientX);
// 		const yDistance = Math.min(event.clientY, window.innerHeight - event.clientY);
// 		const [x, y] = browserWindow.getPosition();
// 		initialX = x;
// 		initialY = y;
// 		if (xDistance <= 6 || yDistance <= 6) {
// 			event.preventDefault();
// 			event.stopPropagation();
// 			resizing = true;
// 			return false;
// 		}
// 	});
// 	window.addEventListener("mousemove", (event: MouseEvent) => {
// 		const xDistance = Math.min(event.clientX, window.innerWidth - event.clientX);
// 		const yDistance = Math.min(event.clientY, window.innerHeight - event.clientY);
// 		if (xDistance <= 6) {
// 			document.body.style.cursor = "ew-resize";
// 		} else if (yDistance <= 6) {
// 			document.body.style.cursor = "ns-resize";
// 		} else {
// 			document.body.style.cursor = "default";
// 		}
// 		if (resizing) {
// 			event.preventDefault();
// 			event.stopPropagation();
// 			const [width, height] = browserWindow.getSize();
// 			const [x, y] = browserWindow.getPosition();
// 			if (xDistance < event.clientX || yDistance < event.clientY) {
// 				const newX = x + event.movementX;
// 				const newY = y + event.movementY;
// 				const newWidth = width - event.movementX;
// 				const newHeight = height - event.movementY;
// 				browserWindow.setMinimumSize(newWidth, newHeight);
// 				if (xDistance <= 6 && yDistance > 6) {
// 					browserWindow.setBounds({ x: newX, y: initialY, width: newWidth, height });
// 				} else if (xDistance > 6 && yDistance <= 6) {
// 					browserWindow.setBounds({ x: initialX, y: newY, width, height: newHeight });
// 				} else {
// 					browserWindow.setBounds({ x: newX, y: newY, width: newWidth, height: newHeight });
// 				}
// 			} else {
// 				const newWidth = width + event.movementX;
// 				const newHeight = height + event.movementY;
// 				browserWindow.setMinimumSize(newWidth, newHeight);
// 				if (xDistance <= 6 && yDistance > 6) {
// 					browserWindow.setBounds({ x: initialX, y: initialY, width: newWidth, height });
// 				} else if (xDistance > 6 && yDistance <= 6) {
// 					browserWindow.setBounds({ x: initialX, y: initialY, width, height: newHeight });
// 				} else {
// 					browserWindow.setBounds({ x: initialX, y: initialY, width: newWidth, height: newHeight });
// 				}
// 			}
// 			return false;
// 		}
// 	});
// 	window.addEventListener("mouseup", (event: MouseEvent) => {
// 		dragging = false;
// 		resizing = false;
// 		document.body.style.cursor = "default";
// 		return false;
// 	});
// });
