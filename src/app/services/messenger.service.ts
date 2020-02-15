import * as path from "path";

import { ipcRenderer, IpcRenderer } from "electron"
import { Injectable, Inject } from "@angular/core";

import { DirectoryService } from "./directory.service";
import { IEmoji } from "./data.service";
import { RecentService } from './recent.service';
import { SettingsService } from './settings.service';
import { Dir } from '@angular/cdk/bidi';


@Injectable({
	providedIn: "root",
})
export class MessengerService {
	private ipc = ipcRenderer;
	constructor(
		@Inject(DirectoryService) private dir: DirectoryService,
		@Inject(RecentService) private recent: RecentService,
		@Inject(SettingsService) private prefs: SettingsService,
	) {
		this.ipc.on("recent", (event, msg) => this.recent.push(<IEmoji>msg.payload));
		this.ipc.on("indicator", (event, msg) => this.ipc.send("indicator", this.prefs.settings.panel_theme));
		this.prefs.subscribe((changes) => {
			for (let change of changes) {
				if (change.type === "update") {
					if (change.path.includes("skin_tone")) {
						this.ipc.send("python", { action: "skin_tone", payload: change.value });
					} else if (change.path.includes("type_expand")) {
						if (change.value) {
							this.ipc.send("python", { action: "load", payload: this.dir.getAsset("data/emoji.json", true) });
						} else {
							this.ipc.send("python", { action: "unload", payload: null });
						}
					} else if (change.path.includes("panel_theme")) {
						this.ipc.send("indicator", change.value);
					}
				}
			}
		})
	}

	on(channel: string, listener: (event: Event, ...args: any) => void): IpcRenderer {
		return this.ipc.on(channel, listener);
	}

	type(emoji: IEmoji) {
		const string = String.fromCodePoint(
			...emoji.skinTones[this.prefs.settings.skin_tone].codePoints,
		);
		this.ipc.send("python", { action: "type", payload: string, meta: { callback: true } });
	}

	loadEmoji(): void {
		this.ipc.send("python", { action: "load", payload: this.dir.getAsset("data/emoji.json", true) });
	}

	unloadEmoji(): void {
		this.ipc.send("python", { action: "unload", payload: null });
	}

	setSkinTone(skinTone: string): void {
		this.ipc.send("python", { action: "skin_tone", payload: skinTone });
	}
}
