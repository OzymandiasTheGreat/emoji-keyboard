import * as path from "path";
import * as fs from "fs";

import { Injectable, Inject } from "@angular/core";
import { bindNodeCallback, fromEventPattern, Subscription } from "rxjs";

import * as ini from "ini";
import { Observable as ObjectObservable } from "object-observer/dist/node/object-observer";

import { DirectoryService } from './directory.service';


export interface ISettings {
	PREFERENCES: {
		action: "type" | "copy";
		type_expand: boolean;
		compact: boolean;
		emoji_theme: "emojitwo" | "twemoji" | "noto-emoji" | "blobmoji" | "openmoji";
		skin_tone: null | "1F3FB" | "1F3FC" | "1F3FD" | "1F3FE" | "1F3FF";
		app_theme: "default" | "light" | "dark";
		panel_theme: "dark" | "light";
	};
	HOTKEYS: {
		palette: string;
		search: string;
	}
}


export interface IChanges {
	type: "insert" | "update" | "delete" | "shuffle" | "reverse";
	path: string[];
	value: any;
	oldValue: any;
	object: any;
}


@Injectable({
	providedIn: "root",
})
export class SettingsService {
	private DEFAULT: string;
	private USER: string;
	private SETTINGS: ISettings | any;
	constructor(@Inject(DirectoryService) private dir: DirectoryService) {
		this.DEFAULT = this.dir.getAsset("data/default.ini", true);
		this.USER = path.join(dir.config, "settings.ini");
		const [ _default, user ] = this.load();
		this.SETTINGS = ObjectObservable.from({...ini.parse(_default), ...ini.parse(user)});
		// this.SETTINGS.observe((changes) => this.save());
		this.SETTINGS.observe((changes: IChanges[]) => {
			for (let change of changes) {
				if (change.type === "update" && change.value !== change.oldValue) {
					if (change.path.includes("app_theme")) {
						document.body.className = `theme theme-${change.value}`;
					}
				}
			}
		});
	}

	private load() {
		const _default = fs.readFileSync(this.DEFAULT, "utf8");
		let user;
		try {
			user = fs.readFileSync(this.USER, "utf8");
		} catch(err) {
			user = "";
		}
		return [ _default, user ]
	}

	save() {
		bindNodeCallback(fs.writeFile)(this.USER, ini.stringify(this.SETTINGS)).subscribe(
			() => {},
			(err) => console.log(err),
		);
	}

	get settings(): ISettings["PREFERENCES"] {
		return this.SETTINGS.PREFERENCES;
	}

	get hotkeys(): ISettings["HOTKEYS"] {
		return this.SETTINGS.HOTKEYS;
	}

	subscribe(callback: (next?: IChanges[]) => void): Subscription {
		return fromEventPattern(this.SETTINGS.observe.bind(this.SETTINGS)).subscribe(callback);
	}
}
