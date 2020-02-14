import * as path from "path";
import { Injectable } from "@angular/core";
import * as XDG from "xdg-portable";
import * as PKG from "../../../package.json";


@Injectable({
	providedIn: "root",
})
export class DirectoryService {
	constructor() {}

	get config(): string {
		return path.resolve(XDG.config(), PKG.name);
	}
}
