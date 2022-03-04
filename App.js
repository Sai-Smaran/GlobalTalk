import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import HomeStackNavigator from "./components/navigators/HomeStackNavigator";
import AppDrawerNavigator from "./components/navigators/AppDrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import firebase from "firebase";

LogBox.ignoreLogs([`Setting a timer for a long period`], [`AsyncStorage has been`]);

const Stack = createStackNavigator();

export default function App() {
	const [isLoggedIn, setisLoggedIn] = useState(false);

	useEffect(() => {
		enableScreens(true)
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setisLoggedIn(true);
			} else {
				setisLoggedIn(false);
			}
		});
	});

	return (
		<NavigationContainer>
			<Stack.Navigator
				detachInactiveScreens
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
