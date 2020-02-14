import { Component, OnInit, Input, Inject } from "@angular/core";
import { Highlightable } from "@angular/cdk/a11y";

import { SettingsService, ISettings, IEmoji, RecentService, MessengerService, ElectronService } from "../../../services";


@Component({
	selector: "app-emoji",
	templateUrl: "./emoji.component.html",
	styleUrls: [ "./emoji.component.scss" ],
})
export class EmojiComponent implements OnInit, Highlightable {
	@Input() emoji: IEmoji;
	@Input() disabled = false;
	private skinTone: ISettings["PREFERENCES"]["skin_tone"];
	private theme: ISettings["PREFERENCES"]["emoji_theme"];
	public active = false;

	constructor(
		@Inject(SettingsService) private prefs: SettingsService,
		@Inject(RecentService) private recent: RecentService,
		@Inject(MessengerService) private messenger: MessengerService,
		@Inject(ElectronService) private electron: ElectronService,
	) {
		this.skinTone = prefs.settings.skin_tone;
		this.theme = prefs.settings.emoji_theme;
		prefs.subscribe((changes) => {
			const change = changes.pop();
			if (change.type === "update") {
				if (change.path.includes("skin_tone")) {
					this.skinTone = change.value;
				} else if (change.path.includes("emoji_theme")) {
					this.theme = change.value;
				}
			}
		});
	}

	ngOnInit() {}

	setActiveStyles() {
		this.active = true;
	}

	setInactiveStyles() {
		this.active = false;
	}

	getLabel() {
		return this.emoji.name;
	}

	getResource(): string {
		return `../../../../assets/emoji/${this.theme}/${this.emoji.skinTones[this.skinTone].imagePath}`;
	}

	click() {
		this.recent.push(this.emoji);
		if (this.prefs.settings.action === "type") {
			this.electron.hide();
			this.messenger.type(this.emoji);
		} else {
			this.electron.clipboard.writeText(String.fromCodePoint(...this.emoji.skinTones[this.skinTone].codePoints));
		}
	}
}
