import * as path from "path";
import * as fs from "fs";

import { Injectable, Inject } from "@angular/core";
import { Observable, from, fromEventPattern, of } from "rxjs";
import { share, mergeAll } from "rxjs/operators";

import { DirectoryService } from "./directory.service";
import { IEmoji } from "./data.service";


@Injectable({
	providedIn: "root",
})
export class RecentService {
	private path: string;
	private recent: IEmoji[];
	private observable: Observable<IEmoji[]>;
	private emit: Function;
	constructor(@Inject(DirectoryService) dir: DirectoryService) {
		let recentStr;
		this.path = path.join(dir.config, "recent.json");
		try {
			recentStr = fs.readFileSync(this.path, "utf8");
		} catch(err) {
			recentStr = "[]";
		}
		this.observable = <Observable<IEmoji[]>>fromEventPattern((handler) => this.emit = handler).pipe(share());
		this.recent = new Proxy(JSON.parse(recentStr), {
			set: (obj: IEmoji[], prop: number, value: IEmoji): boolean => {
				if (value instanceof Object) {
					const shortNames = obj.map((e) => e.shortName);
					if (obj.length > 49) obj.pop();
					if (shortNames.includes(value.shortName)) obj.splice(obj.findIndex((e) => e.shortName === value.shortName), 1);
					obj.unshift(value);
					fs.writeFile(this.path, JSON.stringify(obj), "utf8", () => {});
					if (this.emit) this.emit(obj);
				}
				return true;
			}
		});
	}

	get observe(): Observable<IEmoji[]> {
		return from([of(this.recent), this.observable]).pipe(mergeAll());
	}

	push(emoji: IEmoji): void {
		this.recent.push(emoji);
	}
}
