import { Component, OnInit, AfterViewInit, Input, ViewChildren, QueryList } from "@angular/core";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { ENTER, SPACE } from "@angular/cdk/keycodes";
import { EmojiComponent } from "../emoji/emoji.component";


@Component({
	selector: "app-palette",
	templateUrl: "./palette.component.html",
	styleUrls: [ "./palette.component.scss" ],
})
export class PaletteComponent implements OnInit, AfterViewInit {
	@Input() items: Array<any>;
	@ViewChildren(EmojiComponent) elems: QueryList<EmojiComponent>;
	public keyManager: ActiveDescendantKeyManager<EmojiComponent>;

	constructor() {}

	ngOnInit() {}

	ngAfterViewInit() {
		this.keyManager = new ActiveDescendantKeyManager(this.elems)
			.withHorizontalOrientation('ltr').withWrap();
	}

	onKeyDown(event: KeyboardEvent) {
		if ([ENTER, SPACE].includes(event.keyCode)) {
			this.keyManager.activeItem.click(this.keyManager.activeItem.emoji);
		} else {
			this.keyManager.onKeydown(event);
		}
	}
}
