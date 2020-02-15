import * as path from "path";
import { remote } from "electron";
import { Injectable } from "@angular/core";
import * as XDG from "xdg-portable";
import * as PKG from "../../../package.json";

const { app } = remote;


@Injectable({
	providedIn: "root",
})
export class DirectoryService {
	constructor() {}

	get config(): string {
		return path.resolve(XDG.config(), PKG.name);
	}

	getAsset(assetPath: string, file: boolean = false): string {
		const appPath = app.getAppPath();
		return app.isPackaged
			? path.resolve(file ? `${appPath}.unpacked` : appPath, "dist/angular/assets", assetPath)
			: file ? path.resolve(appPath, "src/assets", assetPath) : path.join("assets", assetPath);
	}
}
