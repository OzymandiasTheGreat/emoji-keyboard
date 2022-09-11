import React, { useCallback, useContext, useRef } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useHover } from "react-native-web-hooks";
import { invoke } from "@tauri-apps/api/tauri";
import { writeText } from "@tauri-apps/api/clipboard";
import { SettingsContext, StoreContext } from "../context";

const Emoji: React.FC<{
	char: string;
	slug: string;
	index: number;
	selected: number;
}> = ({ char, slug, index, selected }) => {
	const theme = useTheme();
	const store = useContext(StoreContext);
	const settings = useContext(SettingsContext);
	const ref = useRef(null);
	const hovered = useHover(ref);
	const active = index === selected || hovered;
	const recent = useCallback(async () => {
		const recent = (await store.get("recent")) as string[] | null;
		const index = recent?.indexOf(char);
		if (typeof index === "number" && index >= 0) {
			recent?.splice(index, 1);
		}
		recent?.unshift(char);
		return store.set("recent", recent || [char]);
	}, [char, store]);
	const paste = useCallback(
		(ev: any) =>
			invoke("paste", { text: char, terminal: ev.button !== 0 }).then(
				recent
			),
		[char]
	);
	const copy = useCallback(
		(ev: MouseEvent) => {
			ev.preventDefault();
			writeText(char).then(recent);
		},
		[char]
	);

	return (
		<View
			ref={ref}
			style={{
				width: settings.size + 16,
				height: settings.size + 16,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: theme.colors.background,
				borderRadius: 3,
				shadowColor: theme.colors.border,
				shadowRadius: 8,
				shadowOpacity: active ? 0.6 : 0,
				transform: active ? [{ scale: 1.35 }] : [],
				zIndex: +active * 1000,
			}}
		>
			<Text
				style={{ fontSize: settings.size }}
				onPress={paste}
				// @ts-ignore
				onContextMenu={copy}
			>
				{char}
			</Text>
			<View
				style={{
					display: active && settings.overlay ? "flex" : "none",
					width: "100%",
					backgroundColor: theme.colors.card,
					opacity: 0.75,
					padding: 2,
					borderBottomStartRadius: 3,
					borderBottomEndRadius: 3,
					position: "absolute",
					bottom: 0,
				}}
			>
				<Text
					style={{
						fontSize: 10,
						color: theme.colors.text,
					}}
				>
					:{slug}:
				</Text>
			</View>
		</View>
	);
};

export default Emoji;
