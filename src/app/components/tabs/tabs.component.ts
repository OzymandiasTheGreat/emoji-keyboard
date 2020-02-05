import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import CATEGORIES from "../../../assets/data/categories.json";


@Component({
	selector: "app-emoji-tabs",
	templateUrl: "./tabs.component.html",
	styleUrls: [ "./tabs.component.scss" ],
})
export class EmojiTabsComponent implements OnInit {
	categories: Array<any>;
	constructor(private router: Router) {
		console.log(router.url);
		this.router = router;
		this.categories = CATEGORIES;
	}

	ngOnInit() {}
}
