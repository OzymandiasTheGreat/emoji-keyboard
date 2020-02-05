import { Component, OnInit, Input } from "@angular/core";


@Component({
	selector: "app-emoji",
	templateUrl: "./emoji.component.html",
	styleUrls: [ "./emoji.component.sass" ],
})
export class EmojiComponent implements OnInit {
	@Input() emoji;

	constructor() {}

	ngOnInit() {}
}
