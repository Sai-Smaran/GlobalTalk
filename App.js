import React from 'react';
import { LogBox } from "react-native";
import { HomeStackNavigator } from './components/navigators/HomeStackNavigator';
import { AppDrawerNavigator } from './components/navigators/AppDrawerNavigator';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default function App() {
  return <AppContainer />;
}

const switchNavigator = createSwitchNavigator({
  Stack: {screen: HomeStackNavigator},
  Drawer: {screen: AppDrawerNavigator},
});

const AppContainer = createAppContainer(switchNavigator);