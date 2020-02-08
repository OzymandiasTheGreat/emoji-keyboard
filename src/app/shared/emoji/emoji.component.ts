import { Component, OnInit, Input } from "@angular/core";
import { Highlightable } from "@angular/cdk/a11y";


const THEME = "blobmoji";


@Component({
	selector: "app-emoji",
	templateUrl: "./emoji.component.html",
	styleUrls: [ "./emoji.component.scss" ],
})
export class EmojiComponent implements OnInit, Highlightable {
	@Input() emoji;
	@Input() disabled = false;
	theme: string = THEME;
	style = {
		visibility: "visible",
		outline: "none",
	};

	constructor() {}

	ngOnInit() {}

	setActiveStyles() {
		this.style.outline = "2px solid -webkit-focus-ring-color";
	}

	setInactiveStyles() {
		this.style.outline = "none";
	}

	getLabel() {
		return this.emoji.name;
	}

	click(emoji) {
		console.log(emoji.codePoints);
	}
}
