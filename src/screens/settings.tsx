import React, { useContext } from "react";
import { SafeAreaView, Switch, Text, TextInput, View } from "react-native";
import { useTheme, NavigationProp, RouteProp } from "@react-navigation/native";
import type { Settings } from "../types";
import { SettingsContext, StoreContext } from "../context";

const SettingsView: React.FC<{
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
}> = ({ navigation, route }) => {
	const theme = useTheme();
	const store = useContext(StoreContext);
	const settings = useContext(SettingsContext);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				alignItems: "stretch",
				justifyContent: "flex-start",
				paddingVertical: 20,
				paddingHorizontal: 50,
			}}
		>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					marginVertical: 20,
				}}
			>
				<Text style={{ fontSize: 18, color: theme.colors.text }}>
					Icon Size
				</Text>
				<TextInput
					style={{
						fontSize: 18,
						color: theme.colors.text,
						width: 48,
						textAlign: "center",
					}}
					value={`${settings.size}`}
					onChangeText={(text) => {
						const size = parseInt(text);
						if (size) {
							store.set("settings", { ...settings, size });
						}
					}}
				/>
			</View>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					marginVertical: 20,
				}}
			>
				<Text style={{ fontSize: 18, color: theme.colors.text }}>
					Show Overlay with Shortcode
				</Text>
				<Switch
					value={settings.overlay}
					onValueChange={(overlay) =>
						store.set("settings", { ...settings, overlay })
					}
				/>
			</View>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-between",
					marginVertical: 20,
				}}
			>
				<Text style={{ fontSize: 18, color: theme.colors.text }}>
					Enable Shortcode Expansion
				</Text>
				<Switch
					value={settings.expand}
					onValueChange={(expand) =>
						store.set("settings", { ...settings, expand })
					}
				/>
			</View>
		</SafeAreaView>
	);
};

export default SettingsView;
