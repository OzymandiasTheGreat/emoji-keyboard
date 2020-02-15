import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";
import { DirectoryService, DataService, ICategory, SettingsService } from "../../services";


@Component({
	selector: "app-tabbar",
	templateUrl: "./tabbar.component.html",
	styleUrls: [ "./tabbar.component.scss" ],
})
export class TabbarComponent implements OnInit {
	categories: Array<any>;
	compact: boolean;
	constructor(
		@Inject(DirectoryService) private dir: DirectoryService,
		@Inject(SettingsService) private prefs: SettingsService,
		@Inject(DataService) private data: DataService,
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
		for (const category of this.categories as ICategory[]) {
			registry.addSvgIcon(
				category.icon,
				sanitizer.bypassSecurityTrustResourceUrl(
					this.dir.getAsset(`emoji/categories/${category.icon}`)
				)
			);
		}
	}

	ngOnInit() {}
}
