import React, { useRef } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Emoji as EmojiType } from "../types";
import Emoji from "./emoji";

const SearchView: React.FC<{
	results: EmojiType[];
	selected: number;
	setScroller: (scroller: ScrollView) => void;
}> = ({ results, selected, setScroller }) => {
	const scroller = useRef<ScrollView>(null);

	useFocusEffect(() => setScroller(scroller.current as ScrollView));

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
				{results.map((emoji, i) => (
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

export default SearchView;
