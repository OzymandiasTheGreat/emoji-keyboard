import React, { useRef } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import {
	useFocusEffect,
	NavigationProp,
	RouteProp,
} from "@react-navigation/native";
import Emoji from "./emoji";
import { Group } from "../types";

const Palette: React.FC<{
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
	group: Group;
	onFocus: (view: string) => void;
	selected: number;
	setScroller: (scroller: ScrollView) => void;
}> = ({ group, onFocus, selected, setScroller }) => {
	const scroller = useRef<ScrollView>(null);
	useFocusEffect(() => {
		onFocus(group.name);
		setScroller(scroller.current as ScrollView);
	});

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView
				ref={scroller}
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "center",
					padding: 8,
				}}
			>
				{group.data.map((emoji, i) => (
					<Emoji
						key={emoji.char}
						char={emoji.char}
						slug={emoji.slug}
						index={i}
						selected={selected}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default Palette;
