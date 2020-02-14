import * as v8 from "v8";
import { Injectable } from "@angular/core";
import { from, Observable, asyncScheduler } from "rxjs";


import CATEGORIES from "../../assets/data/categories.json";
import EMOJIS from "../../assets/data/emoji.json";


export interface ICategory {
	name: string;
	categories: string[];
	icon: string;
}


export interface IEmoji {
	name: string | null;
	codePoints: number[],
	imagePath: string;
	char: string;
	shortText: string;
	shortName: string;
	skinTones: {
		null: {
			codePoints: number[],
			imagePath: string,
		},
		"1F3FB": {
			codePoints: number[],
			imagePath: string,
		},
		"1F3FC": {
			codePoints: number[],
			imagePath: string,
		},
		"1F3FD": {
			codePoints: number[],
			imagePath: string,
		},
		"1F3FE": {
			codePoints: number[],
			imagePath: string,
		},
		"1F3FF": {
			codePoints: number[],
			imagePath: string,
		},
	}
}


export interface IEmojiList {
	[key: string]: IEmoji[];
}


@Injectable({
	providedIn: "root",
})
export class DataService {
	constructor() {}

	getCategories(): ICategory[] {
		return v8.deserialize(v8.serialize(CATEGORIES));
	}

	getEmoji(category): Observable<IEmoji> {
		try {
			const res = [...EMOJIS[category]];
			return from(res, asyncScheduler);
		} catch(err) {
			return from([], asyncScheduler);
		}
	}

	getFilteredEmoji(query): Observable<IEmoji> {
		const normalQuery = query ? query.toLowerCase() : null;
		let res = [];
		for (const category of Object.values(EMOJIS as IEmojiList)) {
			res = res.concat(category.filter((i) => {
				return (i.name ? i.name.toLowerCase().includes(normalQuery) : false) || i.shortName.toLowerCase().includes(normalQuery) || i.shortText.includes(query);
			}));
		}
		return from(res, asyncScheduler);
	}
}
