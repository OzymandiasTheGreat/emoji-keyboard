import React from "react";
import {
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme, NavigationProp, RouteProp } from "@react-navigation/native";
import { open } from "@tauri-apps/api/shell";
// @ts-ignore
import Logo from "../../assets/app.png";
// @ts-ignore
import DonorBox from "../../assets/donorbox.png";

const AboutView: React.FC<{
	navigation: NavigationProp<any>;
	route: RouteProp<any>;
}> = () => {
	const theme = useTheme();

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					justifyContent: "flex-start",
					paddingVertical: 20,
					paddingHorizontal: 50,
				}}
			>
				<Image
					source={Logo}
					style={{
						width: 128,
						height: 128,
						resizeMode: "contain",
						marginBottom: 20,
					}}
				/>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<Icon
						name="copyright"
						size={24}
						color={theme.colors.text}
					/>
					<Text
						style={{
							fontSize: 18,
							color: theme.colors.text,
							marginLeft: 10,
						}}
					>
						2022 - Tomas Ravinskas
					</Text>
				</View>
				<Text
					style={{
						fontSize: 18,
						color: theme.colors.text,
						marginBottom: 20,
					}}
				>
					This software is released under the terms of MIT license
				</Text>
				<Text
					style={{
						fontSize: 16,
						color: "#0000ff",
						textDecorationLine: "underline",
						marginBottom: 20,
					}}
					onPress={() =>
						open(
							"https://github.com/OzymandiasTheGreat/emoji-keyboard#readme"
						)
					}
				>
					License text and source code available on Github
				</Text>
				<View style={{ padding: 15 }}>
					<Text
						style={{
							fontSize: 18,
							color: theme.colors.text,
							marginBottom: 20,
						}}
					>
						You can support development of emoji-keyboard by
						becoming a patron:
					</Text>
					<TouchableOpacity
						onPress={() =>
							open("https://www.patreon.com/ozymandias")
						}
						style={{
							backgroundColor: theme.colors.primary,
							paddingVertical: 15,
							paddingHorizontal: 25,
							borderRadius: 3,
							marginBottom: 20,
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Icon
								name="patreon"
								size={24}
								color={theme.colors.text}
							></Icon>
							<Text
								style={{
									fontSize: 18,
									color: theme.colors.text,
									marginLeft: 15,
								}}
							>
								Become a Patron
							</Text>
						</View>
					</TouchableOpacity>
					<Text
						style={{
							fontSize: 18,
							color: theme.colors.text,
							marginBottom: 20,
						}}
					>
						Alternatively, You can donate through DonorBox:
					</Text>
					<TouchableOpacity
						onPress={() =>
							open(
								"https://donorbox.org/tomasrav-open-source-development"
							)
						}
						style={{
							backgroundColor: theme.colors.primary,
							paddingVertical: 15,
							paddingHorizontal: 25,
							borderRadius: 3,
							marginBottom: 20,
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Image
								source={DonorBox}
								style={{
									width: 24,
									height: 24,
									resizeMode: "contain",
								}}
							/>
							<Text
								style={{
									fontSize: 18,
									color: theme.colors.text,
									marginLeft: 15,
								}}
							>
								Donate
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default AboutView;
