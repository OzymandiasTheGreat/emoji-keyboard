import { Injectable } from "@angular/core";
import { of as observableOf } from "rxjs";

import CATEGORIES from "../../assets/data/categories.json";
import EMOJIS from "../../assets/data/emoji.json";
import SKINTONES from "../../assets/data/skin-tones.json";


const THEME = "emojitwo";


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
}


export interface IEmojiList {
	[key: string]: IEmoji[];
}


@Injectable()
export class DataService {
	theme = THEME;
	constructor() {}

	getCategories(): ICategory[] {
		return JSON.parse(JSON.stringify(CATEGORIES));
	}

	getEmoji(): IEmojiList {
		const res = {...EMOJIS};
		Object.keys(res).forEach((k) => res[k] = []);
		for (const category in EMOJIS) {
			EMOJIS[category].forEach((e: IEmoji) => {
				res[category].push({ ...e, imagePath: `../../../assets/emoji/${this.theme}/${e.imagePath}` });
			});
		}
		return res;
	}

	getSkinTones(): string[] {
		return JSON.parse(JSON.stringify(SKINTONES));
	}

	getFilteredEmoji(query): IEmoji[] {
		const normalQuery = query ? query.toLowerCase() : null;
		let res = [];
		for (const category of Object.values(EMOJIS as IEmojiList)) {
			res = res.concat(category.filter((i) => {
				return (i.name ? i.name.toLowerCase().includes(normalQuery) : false) || i.shortName.toLowerCase().includes(normalQuery) || i.shortText.includes(query);
			}).map((e) => { return { ...e, imagePath: `../../../assets/emoji/${this.theme}/${e.imagePath}` }; }));
		}
		return res;
	}
}
