import "react-native-gesture-handler";
import React from "react";
import { LogBox } from "react-native";
import HomeStackNavigator from "./components/navigators/HomeStackNavigator";
import AppDrawerNavigator from "./components/navigators/AppDrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs([`AsyncStorage has been`]);

const Stack = createStackNavigator();

export default function App() {
	enableScreens(true);
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Stack"
				screenOptions={{ headerShown: false, animation: "flip" }}
				detachInactiveScreens
			>
				<Stack.Screen name="Stack" component={HomeStackNavigator} />
				<Stack.Screen name="Drawer" component={AppDrawerNavigator} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
