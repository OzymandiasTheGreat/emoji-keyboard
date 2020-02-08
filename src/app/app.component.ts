import { remote, Menu, BrowserWindow, Event } from "electron";
import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ElectronService } from "./providers/electron.service";
import { TranslateService } from "@ngx-translate/core";
import { Titlebar } from "custom-electron-titlebar";
import { Observable, fromEventPattern } from "rxjs";
import { share } from "rxjs/operators";
import { AppConfig } from "../environments/environment";
import { TITLEBAR, MENUBAR, APPMENU } from "../shared";

const { MenuItem } = remote;

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	private prevRoute: string = "/";
	constructor(
	@Inject(ElectronService) public electronService: ElectronService,
	@Inject(TranslateService) private translate: TranslateService,
	@Inject(Router) private router: Router,
	@Inject(TITLEBAR) private titlebar: Titlebar,
	@Inject(MENUBAR) private menubar: Menu,
	@Inject(APPMENU) private appmenu: Menu,
	) {

		translate.setDefaultLang("en");
		console.log("AppConfig", AppConfig);

		if (electronService.isElectron()) {
			console.log("Mode electron");
			console.log("Electron ipcRenderer", electronService.ipcRenderer);
			console.log("NodeJS childProcess", electronService.childProcess);
		} else {
			console.log("Mode web");

		}
		this.observableMenuItem(menubar, "search", "Search").subscribe(() => {
			if (this.router.url === "/search") {
				this.router.navigateByUrl(this.prevRoute);
			} else {
				this.prevRoute = this.router.url;
				this.router.navigateByUrl("/search");
			}
		});
		this.titlebar.updateMenu(menubar);
		this.observableMenuItem(appmenu, "reload", "Reload", "forceReload").subscribe(() => {});
		this.observableMenuItem(appmenu, "devtools", "Dev Tools", "toggleDevTools").subscribe(() => {});
		this.observableMenuItem(appmenu, "quit", "Quit", "quit").subscribe(() => {});
	}

	observableMenuItem(menu: Menu, id: string, label: string, role?: string): Observable<((typeof MenuItem) | BrowserWindow | Event)[]> {
		return fromEventPattern((handler) => {
			const item = new MenuItem({id, label, role, click: handler});
			menu.append(item);
		},
		undefined,
		(menuItem: (typeof MenuItem), browserWindow: BrowserWindow, event: Event) => [menuItem, browserWindow, event])
			.pipe(share());
	}
}
