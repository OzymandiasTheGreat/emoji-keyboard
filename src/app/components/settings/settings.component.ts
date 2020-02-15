import * as path from "path";

import { Component, OnInit, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';

import { MatSelect } from "@angular/material/select";
import { MatSlideToggle } from "@angular/material/slide-toggle";

import { DirectoryService, SettingsService } from "../../services";


@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
	public tonePath: string;
	public actions: string[] = ["type", "copy"];
	public emojiThemes: string[] = ["emojitwo", "twemoji", "noto-emoji", "blobmoji", "openmoji"];
	public skinTones: (string | null)[] = [null, "1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"];
	public appThemes: string[] = ["default", "light", "dark"];
	public panelThemes: string[] = ["dark", "light"];

	@ViewChild("action") action: MatSelect;
	@ViewChild("typeExpand") typeExpand: MatSlideToggle;
	@ViewChild("compact") compact: MatSlideToggle;
	@ViewChild("emojiTheme") emojiTheme: MatSelect;
	@ViewChild("skinTone") skinTone: MatSelect;
	@ViewChild("appTheme") appTheme: MatSelect;
	@ViewChild("panelTheme") panelTheme: MatSelect;
	@ViewChild("paletteHotkey") paletteHotkey: ElementRef<HTMLInputElement>;
	@ViewChild("searchHotkey") searchHotkey: ElementRef<HTMLInputElement>;

	constructor(
		@Inject(DirectoryService) private dir: DirectoryService,
		@Inject(SettingsService) public prefs: SettingsService,
	) {
		this.tonePath = this.dir.getAsset("emoji/blobmoji/");
	}

	ngOnInit(): void { }

	ngAfterViewInit(): void { }

	onCancel() {
		this.action.value = this.prefs.settings.action;
		this.typeExpand.checked = this.prefs.settings.type_expand;
		this.compact.checked = this.prefs.settings.compact;
		this.emojiTheme.value = this.prefs.settings.emoji_theme;
		this.skinTone.value = this.prefs.settings.skin_tone;
		this.appTheme.value = this.prefs.settings.app_theme;
		this.panelTheme.value = this.prefs.settings.panel_theme;
		this.paletteHotkey.nativeElement.value = this.prefs.hotkeys.palette;
		this.searchHotkey.nativeElement.value = this.prefs.hotkeys.search;
	}

	onSave() {
		const preferences = {
			action: this.action.value,
			type_expand: this.typeExpand.checked,
			compact: this.compact.checked,
			emoji_theme: this.emojiTheme.value,
			skin_tone: this.skinTone.value,
			app_theme: this.appTheme.value,
			panel_theme: this.panelTheme.value,
		};
		const hotkeys = {
			palette: this.paletteHotkey.nativeElement.value,
			search: this.searchHotkey.nativeElement.value,
		};
		Object.assign(this.prefs.settings, preferences);
		Object.assign(this.prefs.hotkeys, hotkeys);
		this.prefs.save();
	}

	join(root: string, file: string): string {
		return path.join(root, `${file}.svg`);
	}
}
