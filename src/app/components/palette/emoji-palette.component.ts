import { Component, OnInit, Input } from "@angular/core";
import DATA from "../../../assets/data/emoji.json";


const THEME = "emojitwo";


@Component({
	selector: "app-emoji-palette",
	templateUrl: "./emoji-palette.component.html",
	styleUrls: [ "./emoji-palette.component.sass" ],
})
export class EmojiPaletteComponent implements OnInit {
	data: Array<{}>;

	constructor() {
		this.data = [];
		for (const emoji of DATA) {
			const codePoints = emoji.unified.split("-");
			this.data.push({
				codePoints,
				imagePath: `assets/emoji/${THEME}/${emoji.unified}.svg`,
				char: codePoints.map((i) => String.fromCodePoint(parseInt(i, 16))).join(String.fromCodePoint(0x200D)),
				name: emoji.name,
				shortName: `:${emoji.short_name}: ${emoji.text ? emoji.text : ""}`,
			});
		}
	}

	ngOnInit() {}
}
