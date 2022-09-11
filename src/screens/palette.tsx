import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useWindowDimensions, TextInput, View, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme, NavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { invoke } from "@tauri-apps/api/tauri";
import levenshtein from "damerau-levenshtein";
import type { Emoji } from "../types";
import { StoreContext, SettingsContext } from "../context";
import { DATA, GroupIcon } from "../data";
import Palette from "../components/palette";
import RecentView from "../components/recent";
import SearchView from "../components/search";

const Tab = createBottomTabNavigator();

const PaletteView: React.FC<{
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
}> = ({ navigation, route }) => {
	const { width } = useWindowDimensions();
	const theme = useTheme();
	const store = useContext(StoreContext);
	const settings = useContext(SettingsContext);

	const input = useRef<TextInput>(null);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Emoji[]>([]);
	const [recent, setRecent] = useState<string[]>([]);

	const [view, setView] = useState("Recent");
	const [selected, setSelected] = useState(-1);
	const [scroller, setScroller] = useState<ScrollView>();

	const updateRecent = async (char: string) => {
		const recent = (await store.get("recent")) as string[] | null;
		const index = recent?.indexOf(char);
		if (typeof index === "number" && index >= 0) {
			recent?.splice(index, 1);
		}
		recent?.unshift(char);
		return store.set("recent", recent || [char]);
	};

	const navigate = (screen: string) =>
		navigation.navigate("Palette", { screen });
	const onKeyPress = (ev: any) => {
		let data: (string | Emoji)[] = [];
		switch (view) {
			case "Search":
				data = results;
				break;
			case "Recent":
				data = recent;
				break;
			default:
				data = DATA.find((g) => g.name === view)?.data as Emoji[];
				break;
		}
		let index = selected;
		switch (ev.key) {
			case "ArrowDown":
				ev.preventDefault();
				if (index < 0 || index >= data.length) {
					index = 0;
					break;
				}
				++index;
				break;
			case "ArrowUp":
				ev.preventDefault();
				if (index < 0 || index >= data.length) {
					index = data.length - 1;
					break;
				}
				--index;
				break;
			case "Enter":
				ev.preventDefault();
				const emoji = data[selected];
				const char = typeof emoji === "string" ? emoji : emoji.char;
				if (emoji) {
					invoke("paste", {
						text: char,
						terminal: false,
					}).then(() => updateRecent(char));
				}
				break;
			case "Escape":
				if (query) {
					setQuery("");
				} else {
					invoke("hide");
				}
				break;
			case "1":
				if (ev.ctrlKey) {
					navigate("Recent");
				}
				break;
			case "2":
				if (ev.ctrlKey) {
					navigate("Smileys & Emotion");
				}
				break;
			case "3":
				if (ev.ctrlKey) {
					navigate("People & Body");
				}
				break;
			case "4":
				if (ev.ctrlKey) {
					navigate("Animals & Nature");
				}
				break;
			case "5":
				if (ev.ctrlKey) {
					navigate("Food & Drink");
				}
				break;
			case "6":
				if (ev.ctrlKey) {
					navigate("Travel & Places");
				}
				break;
			case "7":
				if (ev.ctrlKey) {
					navigate("Activities");
				}
				break;
			case "8":
				if (ev.ctrlKey) {
					navigate("Objects");
				}
				break;
			case "9":
				if (ev.ctrlKey) {
					navigate("Symbols");
				}
				break;
			case "0":
				if (ev.ctrlKey) {
					navigate("Flags");
				}
				break;
		}
		const size = settings.size + 16;
		const perRow = Math.floor((width - 16) / size);
		const offset = Math.max(0, Math.floor(index / perRow)) * size;
		try {
			scroller?.scrollTo({ y: offset, animated: true });
		} catch {}
		setSelected(index);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => (
				<View
					style={{
						flex: 1,
						backgroundColor: theme.colors.card,
						height: 48,
						paddingVertical: 8,
						paddingHorizontal: 16,
						shadowColor: theme.colors.border,
						shadowOffset: { width: 0, height: 8 },
						shadowRadius: 8,
						shadowOpacity: 0.35,
					}}
				>
					<TextInput
						ref={input}
						style={{
							color: theme.colors.text,
							fontSize: 18,
							width: "100%",
							height: 32,
							paddingHorizontal: 8,
						}}
						autoFocus={true}
						onBlur={() =>
							setTimeout(() => input.current?.focus(), 50)
						}
						value={query}
						onChangeText={setQuery}
						onKeyPress={onKeyPress}
					/>
				</View>
			),
		} as NativeStackNavigationOptions);
	}, [query, view, selected, navigation]);

	useEffect(() => {
		const q = query.trim().replace(/\s+/g, "_");
		setResults(
			DATA.map((group) => group.data)
				.flat()
				.map((emoji) => {
					const scores = emoji.keywords.map(
						(kw) => levenshtein(kw, q).similarity
					);
					return { score: Math.max(...scores), emoji };
				})
				.sort((a, b) => b.score - a.score)
				.filter((entry) => entry.score >= 0.45)
				.map((entry) => entry.emoji)
		);
	}, [query]);

	useEffect(() => {
		store.get("recent").then((recent) => {
			if (recent) {
				setRecent(recent as string[]);
			}
		});
	}, [store]);
	useEffect(() => {
		store.onKeyChange("recent", (recent) => setRecent(recent as string[]));
	}, [store]);

	useEffect(() => {
		if (query.trim()) {
			setView("Search");
		}
	}, [query]);

	useEffect(() => setSelected(-1), [query, view]);

	if (query.trim()) {
		return (
			<SearchView
				results={results}
				selected={selected}
				setScroller={setScroller}
			/>
		);
	}

	return (
		<Tab.Navigator
			initialRouteName="Recent"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tab.Screen
				name="Recent"
				options={{
					tabBarShowLabel: false,
					tabBarIcon: ({ color, size }) => (
						<Icon
							name={GroupIcon["Recent"] as any}
							size={size}
							color={color}
						/>
					),
				}}
			>
				{({ navigation, route }) => (
					<RecentView
						recent={recent}
						onFocus={setView}
						selected={selected}
						setScroller={setScroller}
						navigation={navigation}
						route={route}
					/>
				)}
			</Tab.Screen>
			{DATA.map((group) => (
				<Tab.Screen
					key={group.name}
					name={group.name}
					options={{
						tabBarShowLabel: false,
						tabBarIcon: ({ color, size }) => (
							<Icon
								name={group.icon as any}
								size={size}
								color={color}
							/>
						),
					}}
				>
					{({ navigation, route }) => (
						<Palette
							group={group}
							onFocus={setView}
							selected={selected}
							setScroller={setScroller}
							navigation={navigation}
							route={route}
						/>
					)}
				</Tab.Screen>
			))}
		</Tab.Navigator>
	);
};

export default PaletteView;
