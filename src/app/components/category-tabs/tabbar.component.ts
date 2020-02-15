<<<<<<< HEAD
<<<<<<< HEAD
import { Component, OnInit, AfterViewInit, ViewChild, Inject } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { MzTabComponent } from "ngx-materialize";
import { DataService } from "../../providers/data.service";
import M from "materialize-css";
const COMPACT = true;
=======
=======
>>>>>>> c8da92906c2b44849a6c4b3c83ce1e6715699a77
import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { DirectoryService, DataService, ICategory, SettingsService } from "../../services";


// const COMPACT = true;
<<<<<<< HEAD
>>>>>>> - Prepared configs for packaging
=======
>>>>>>> c8da92906c2b44849a6c4b3c83ce1e6715699a77


@Component({
	selector: "app-tabbar",
	templateUrl: "./tabbar.component.html",
	styleUrls: [ "./tabbar.component.scss" ],
})
<<<<<<< HEAD
export class TabbarComponent implements OnInit, AfterViewInit {
	@ViewChild(MzTabComponent) tabbar: MzTabComponent;
	categories: Array<any>;
	items: {};
=======
export class TabbarComponent implements OnInit {
	categories: Array<any>;
>>>>>>> c8da92906c2b44849a6c4b3c83ce1e6715699a77
	compact: boolean;
	constructor(
		@Inject(DirectoryService) private dir: DirectoryService,
		@Inject(DataService) private data: DataService,
<<<<<<< HEAD
		@Inject(Router) public router: Router,
	) {
		this.categories = data.getCategories();
		this.items = data.getEmoji();
		this.compact = COMPACT;
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationEnd) {
				// this.tabbar.initTabs();
				M
			}
		});
<<<<<<< HEAD
		const tabbar = this.tabbar.tabs.nativeElement.querySelectorAll("ul.tabs li.tab a");
		for (const tabLabel of Array.from(tabbar) as Array<HTMLLinkElement>) {
			const label = tabLabel.textContent.trim();
			const iconName = this.categories.find((cat) => cat.name === label).icon;
			const icon: HTMLImageElement = document.createElement("img");
			icon.src = `../../../assets/emoji/categories/${iconName}`;
			if (this.compact) {
				tabLabel.innerText = "";
			}
			(<any> tabLabel).prepend(icon);
			tabLabel.title = label;
=======
=======
		@Inject(SettingsService) private prefs: SettingsService,
		@Inject(Router) public router: Router,
		@Inject(DomSanitizer) private sanitizer: DomSanitizer,
		@Inject(MatIconRegistry) private registry: MatIconRegistry,
	) {
		this.categories = data.getCategories();
		this.compact = prefs.settings.compact;
		prefs.subscribe((changes) => {
			const change = changes.pop();
			if (change.type === "update" && change.path.includes("compact")) {
				this.compact = change.value;
			}
		});
>>>>>>> c8da92906c2b44849a6c4b3c83ce1e6715699a77
		for (const category of this.categories as ICategory[]) {
			registry.addSvgIcon(
				category.icon,
				sanitizer.bypassSecurityTrustResourceUrl(
					this.dir.getAsset(`emoji/categories/${category.icon}`)
				)
			);
<<<<<<< HEAD
>>>>>>> - Prepared configs for packaging
		}
	}
=======
		}
	}

	ngOnInit() {}
>>>>>>> c8da92906c2b44849a6c4b3c83ce1e6715699a77
}
