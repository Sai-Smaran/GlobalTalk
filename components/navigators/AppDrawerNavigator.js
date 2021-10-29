import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { PublicChatStackNavigator } from "./PublicProfileStackNavigator";
import { PrivateChatStackNavigator } from "./PrivateChatStackNavigator";
import { Icon } from "react-native-elements";
import CustomSideBarMenu from "./CustomSideBarMenu";
import { RFValue } from "react-native-responsive-fontsize";
import UserInfoEditingScreen from "../../screens/userinfoeditscreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Public: {
      screen: PublicChatStackNavigator,
      navigationOptions: {
        drawerIcon: (
          <Icon name="users" type="font-awesome-5" size={RFValue(20)} />
        ),
        drawerLabel: "Public chat",
      },
    },
    Private: {
      screen: PrivateChatStackNavigator,
      navigationOptions: {
        drawerIcon: (
          <Icon name="user-friends" type="font-awesome-5" size={RFValue(20)} />
        ),
        drawerLabel: "Private chat",
      },
    },
    EditUserInfo: {
      screen: UserInfoEditingScreen,
      navigationOptions: {
        drawerIcon: (
          <Icon name="user-edit" type="font-awesome-5" size={RFValue(20)} />
        ),
        drawerLabel: "Edit your profile",
      }
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Public",
  }
);
