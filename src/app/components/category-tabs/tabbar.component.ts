<<<<<<< HEAD
import { Component, OnInit, AfterViewInit, ViewChild, Inject } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { MzTabComponent } from "ngx-materialize";
import { DataService } from "../../providers/data.service";
import M from "materialize-css";
const COMPACT = true;
=======
import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { DirectoryService, DataService, ICategory, SettingsService } from "../../services";


// const COMPACT = true;
>>>>>>> - Prepared configs for packaging


@Component({
	selector: "app-tabbar",
	templateUrl: "./tabbar.component.html",
	styleUrls: [ "./tabbar.component.scss" ],
})
export class TabbarComponent implements OnInit, AfterViewInit {
	@ViewChild(MzTabComponent) tabbar: MzTabComponent;
	categories: Array<any>;
	items: {};
	compact: boolean;
	constructor(
		@Inject(DirectoryService) private dir: DirectoryService,
		@Inject(DataService) private data: DataService,
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
		for (const category of this.categories as ICategory[]) {
			registry.addSvgIcon(
				category.icon,
				sanitizer.bypassSecurityTrustResourceUrl(
					this.dir.getAsset(`emoji/categories/${category.icon}`)
				)
			);
>>>>>>> - Prepared configs for packaging
		}
	}
}
