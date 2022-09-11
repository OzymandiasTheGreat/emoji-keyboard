import React from "react";
import { Store } from "tauri-plugin-store-api";
import type { Settings } from "./types";

export const StoreContext = React.createContext<Store>(new Store(".data"));
export const SettingsContext = React.createContext<Settings>({
	size: 32,
	expand: false,
	overlay: false,
});
