import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const Dark: typeof DarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: "#212121",
		card: "#424242",
		primary: "#e53935",
		text: "#fafafa",
	},
};

export const Light: typeof DefaultTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "#fafafa",
		card: "#efefef",
		primary: "#b71c1c",
		text: "#212121",
	},
};
