import "./gesture-handler";

import { useCallback, useEffect, useState } from "react";
import { enableScreens } from "react-native-screens";
import * as SplashScreen from "expo-splash-screen"
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeStackNavigator } from "./navigators/HomeStackNavigator";
import AppDrawerNavigator from "./navigators/AppDrawerNavigator";
import { auth } from "./config";

import type { RootStackParamList } from "./navigators/types";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 100,
	fade: true,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
	const [isLoggedIn, setisLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		enableScreens(true);
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setisLoggedIn(true);
			} else {
				setisLoggedIn(false);
			}
		});
	});


	const onReady = useCallback(() => {
		if (isLoggedIn !== null) {
			SplashScreen.hideAsync();
		}
	}, [isLoggedIn])

	if (isLoggedIn === null) {
		return null;
	}

	return (
		<NavigationContainer onReady={onReady}>
			<Stack.Navigator id={undefined}
				screenOptions={{ headerShown: false }}
			>
				{isLoggedIn ? (
					<Stack.Screen name="Drawer" component={AppDrawerNavigator} />
				) : (
					<Stack.Screen name="Stack" component={HomeStackNavigator} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
