import React, { useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { tauri, event } from "@tauri-apps/api";
import type { Settings } from "./src/types";
import { Dark, Light } from "./src/theme";
import { StoreContext, SettingsContext } from "./src/context";
import { navigationRef, navigate } from "./src/navigation";
import expansion from "./src/expansion";
import PaletteView from "./src/screens/palette";
import SettingsView from "./src/screens/settings";
import AboutView from "./src/screens/about";

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
	const scheme = useColorScheme();
	const store = useContext(StoreContext);
	const defaults = useContext(SettingsContext);
	const [settings, setSettings] = useState<Settings>(defaults);
	// Tray Navigation
	useEffect(() => {
		const unsub: (() => void)[] = [];
		(async () => {
			unsub.push(
				await event.listen("palette", () => {
					navigate("Palette");
					tauri.invoke("show");
				})
			);
			unsub.push(
				await event.listen("settings", () => {
					navigate("Settings");
					tauri.invoke("show");
				})
			);
			unsub.push(
				await event.listen("about", () => {
					navigate("About");
					tauri.invoke("show");
				})
			);
		})();
		return () => unsub.forEach((f) => f());
	}, []);
	// Settings
	useEffect(() => {
		(async () => {
			const settings = (await store.get("settings")) as Settings;
			store.onKeyChange("settings", (settings) => {
				setSettings(settings as Settings);
				tauri.invoke("toggle_expansion", {
					enabled: (settings as Settings).expand,
				});
			});
			if (settings) {
				setSettings(settings);
				tauri.invoke("toggle_expansion", { enabled: settings.expand });
			}
		})();
	}, []);
	// Expansion
	useEffect(() => {
		let unsub: () => void;
		(async () => {
			unsub = await expansion();
		})();
		return () => unsub?.();
	}, []);

	return (
		<SettingsContext.Provider value={settings}>
			<NavigationContainer
				ref={navigationRef}
				theme={scheme === "dark" ? Dark : Light}
			>
				<Stack.Navigator screenOptions={{contentStyle: {maxHeight: "99%"}}}>
					<Stack.Screen name="Palette" component={PaletteView} />
					<Stack.Screen name="Settings" component={SettingsView} />
					<Stack.Screen name="About" component={AboutView} />
				</Stack.Navigator>
			</NavigationContainer>
		</SettingsContext.Provider>
	);
};

export default App;
