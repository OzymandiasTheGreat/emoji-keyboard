import React, { useRef } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import {
	useFocusEffect,
	NavigationProp,
	RouteProp,
} from "@react-navigation/native";
import Data from "unicode-emoji-json/data-by-emoji.json";
import Emoji from "./emoji";

const RecentView: React.FC<{
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
	recent: string[];
	onFocus: (view: string) => void;
	selected: number;
	setScroller: (scroller: ScrollView) => void;
}> = ({ recent, onFocus, selected, setScroller }) => {
	const scroller = useRef<ScrollView>(null);

	useFocusEffect(() => {
		onFocus("Recent");
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
				{recent.map((char, i) => (
					<Emoji
						key={char}
						char={char}
						slug={(Data as Record<string, any>)[char].slug}
						index={i}
						selected={selected}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default RecentView;
