import keywords from "emojilib";
import categories from "unicode-emoji-json/data-by-group.json";
import ordered from "unicode-emoji-json/data-ordered-emoji.json";
import { Emoji, Group } from "./types";

const GroupOrder = [
	"Smileys & Emotion",
	"People & Body",
	"Animals & Nature",
	"Food & Drink",
	"Travel & Places",
	"Activities",
	"Objects",
	"Symbols",
	"Flags",
];

export const GroupIcon: Record<string, string> = {
	Search: "magnify",
	Recent: "history",
	"Smileys & Emotion": "emoticon",
	"People & Body": "account",
	"Animals & Nature": "cat",
	"Food & Drink": "pizza",
	"Travel & Places": "car",
	Activities: "tennis",
	Objects: "lightbulb",
	Symbols: "heart",
	Flags: "flag",
};

export const DATA: Group[] = [];

const data: { [group: string]: Group } = {};
const seen: Set<string> = new Set();
for (let [group, emojis] of Object.entries(categories)) {
	const category: Emoji[] = [];
	for (let emoji of emojis) {
		const kws = (keywords as Record<string, string[]>)[emoji.emoji];
		const slugs = kws
			.filter((kw) => /^\w+$/.test(kw))
			.sort((a, b) => a.length - b.length);
		let slug = "";
		for (let s of slugs) {
			if (!seen.has(s)) {
				slug = s;
				seen.add(s);
				break;
			}
			seen.add(s);
		}
		const entry: Emoji = {
			char: emoji.emoji,
			group,
			slug,
			keywords: kws,
			toned: emoji.skin_tone_support,
		};
		category.push(entry);
	}
	data[group] = {
		data: category.sort(
			(a, b) => ordered.indexOf(a.char) - ordered.indexOf(b.char)
		),
		name: group,
		icon: GroupIcon[group],
	};
}
Object.values(data)
	.sort((a, b) => GroupOrder.indexOf(a.name) - GroupOrder.indexOf(b.name))
	.forEach((group) => DATA.push(group));
