import { Component, Inject, NgZone, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";

import { AppConfig } from "../environments/environment";
import { ElectronService, SettingsService, MessengerService } from "./services";


@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	private prevRoute: string = "/";
	constructor(
		@Inject(ElectronService) public electron: ElectronService,
		@Inject(SettingsService) public prefs: SettingsService,
		@Inject(MessengerService) public messenger: MessengerService,
		@Inject(Router) private router: Router,
		@Inject(NgZone) private zone: NgZone,
		@Inject(ChangeDetectorRef) private cd: ChangeDetectorRef,
	) {
		document.body.className = `theme theme-${this.prefs.settings.app_theme}`;
		if (this.prefs.settings.type_expand) {
			this.messenger.setSkinTone(this.prefs.settings.skin_tone);
			this.messenger.loadEmoji();
		}
		this.messenger.on("navigate", (event, route) => {
			let url = route;
			if (route === "category") url = "category/(category:Recent)";
			this.zone.run(function() {
				this.router.navigateByUrl(`/${url}`).then((success) => {
					if (route === "category") this.electron.toggleMenuItem("Back", false);
					else {
						this.prevRoute = this.router.url;
						this.electron.toggleMenuItem("Back", true);
					}
					// this.cd.detectChanges();
				});
			}.bind(this));
		})

		this.electron.appendMenubar({ id: "search", label: "Search" }).subscribe(() => {
			if (this.router.url === "/search") {
				this.zone.run(this.navigateBack.bind(this));
			} else {
				this.zone.run(this.navigateSearch.bind(this));
			}
		});
		this.electron.appendMenubar({ id: "back", label: "Back" }).subscribe(() => this.zone.run(this.navigateBack.bind(this)));
		this.electron.refreshMenubar();
		this.electron.toggleMenuItem("Back", false);
		this.electron.appendAppMenu({ id: "prefs", label: "Preferences" }).subscribe(() => {
			if (this.router.url === "/settings") {
				this.zone.run(this.navigateBack.bind(this));
			} else {
				this.zone.run(this.navigatePrefs.bind(this));
			}
		});
		this.electron.appendAppMenu({ id: "about", label: "About" }).subscribe(() => this.electron.showAbout());
		if (!AppConfig.production) {
			this.electron.appendAppMenu({ id: "reload", label: "Reload", role: "forceReload" }).subscribe(() => {});
			this.electron.appendAppMenu({ id: "devtools", label: "Dev Tools", role: "toggleDevTools" }).subscribe(() => {});
		}
		this.electron.appendAppMenu({ id: "quit", label: "Quit", role: "quit" }).subscribe(() => {});

		this.electron.registerHotkey(this.prefs.hotkeys.palette, this.paletteHotkeyCallback.bind(this));
		this.electron.registerHotkey(this.prefs.hotkeys.search, this.searchHotkeyCallback.bind(this));
		this.prefs.subscribe((changes) => {
			for (const change of changes) {
				if (change.path.includes("HOTKEYS")) {
					this.electron.unregisterHotkey(change.oldValue);
					if (change.path.includes("palette")) {
						this.electron.registerHotkey(change.value, this.paletteHotkeyCallback.bind(this));
					} else if (change.path.includes("search")) {
						this.electron.registerHotkey(change.value, this.searchHotkeyCallback.bind(this));
					}
				}
			}
		})
	}

	navigateSearch(): void {
		if (/\(category\:\w+\)/.test(this.router.url)) {
			this.prevRoute = this.router.url;
		}
		this.zone.run(function() {
			this.router.navigateByUrl("/search").then((success) => this.electron.toggleMenuItem("Back", true));
		}.bind(this));
	}

	navigatePrefs(): void {
		if (/\(category\:\w+\)/.test(this.router.url)) {
			this.prevRoute = this.router.url;
		}
		this.zone.run(function() {
			this.router.navigateByUrl("/settings").then((success) => {
				this.electron.toggleMenuItem("Back", true);
				// this.cd.detectChanges();
			});
		}.bind(this));
	}

	navigateBack(): void {
		let tick = false;
		if (/settings/.test(this.router.url)) {
			tick = true;
		}
		this.prevRoute = this.prevRoute === this.router.url ? "/category/(category:Recent)" : this.prevRoute;
		this.zone.run(function() {
			this.router.navigateByUrl(this.prevRoute).then((success) => {
				this.electron.toggleMenuItem("Back", false);
				if (tick) {
					// this.cd.detectChanges();
				}
			});
		}.bind(this));
	}

	paletteHotkeyCallback(): void {
		if (this.electron.visible) {
			if (/\(category\:\w+\)/.test(this.router.url)) {
				this.electron.hide();
			} else {
				this.zone.run(function() {
					this.router.navigateByUrl("/category/(category:Recent)");
				}.bind(this));
				this.electron.toggleMenuItem("Back", false);
			}
		} else {
			this.zone.run(function() {
				this.router.navigateByUrl("/category/(category:Recent)");
			}.bind(this));
			this.electron.toggleMenuItem("Back", false);
			this.electron.show();
		}
	}

	searchHotkeyCallback(): void {
		if (!this.electron.visible) {
			this.navigateSearch();
			this.electron.show();
		} else {
			if (this.router.url === "/search") {
				this.navigateBack();
			} else {
				this.navigateSearch();
			}
		}
	}
}
