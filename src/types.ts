export type Emoji = {
	char: string;
	toned: boolean;
	slug: string;
	keywords: string[];
	group: string;
};

export type Group = {
	data: Emoji[];
	name: string;
	icon: string;
};

export type Settings = {
	size: number;
	expand: boolean;
	overlay: boolean;
};
