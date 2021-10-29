import SearchUser from "../../screens/searchuserscreen";
import PrivateChat from "../../screens/privatechatscreen";
import AboutUser from "../../screens/aboutuserscreen";
import * as Notifications from "expo-notifications";
import { createStackNavigator } from "react-navigation-stack";
import { Linking } from "react-native";

export const PrivateChatStackNavigator = createStackNavigator(
  {
    Search: {
      screen: SearchUser,
      navigationOptions: {
        headerShown: false,
      },
    },
    Chat: {
      screen: PrivateChat,
      navigationOptions: {
        headerShown: false,
      },
    },
    About: {
      screen: AboutUser,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "Search" }
);
