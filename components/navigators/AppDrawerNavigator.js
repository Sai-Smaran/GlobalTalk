import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import PrivateChatStackNavigator from "./PrivateChatStackNavigator";
import { Icon } from "react-native-elements";
import CustomSideBarMenu from "./CustomSideBarMenu";
import { RFValue } from "react-native-responsive-fontsize";
import UserInfoEditingScreen from "../../screens/userinfoeditscreen";
import PublicChat from "../../screens/publicchatscreen";
import { Dimensions, StyleSheet } from "react-native";

const Drawer = createDrawerNavigator();

export default function AppDrawerNavigator() {
  const { width } = Dimensions.get("window");
  return (
    <Drawer.Navigator
      initialRouteName="Public"
      drawerContent={(props) => <CustomSideBarMenu {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: width >= 1024 ? "permanent" : "slide",
        drawerLabelStyle: styles.labelStyles,
        lazy: false,
      }}
    >
      <Drawer.Screen
        options={{
          drawerLabel: "Public Chat",
          drawerIcon: () => (
            <Icon name="users" type="font-awesome-5" size={RFValue(20)} />
          ),
        }}
        name="Public"
        component={PublicChat}
      />
      <Drawer.Screen
        name="Private"
        options={{
          drawerLabel: "Private Chat",
          drawerIcon: () => (
            <Icon
              name="user-friends"
              type="font-awesome-5"
              size={RFValue(20)}
            />
          ),
        }}
        component={PrivateChatStackNavigator}
      />
      <Drawer.Screen
        name="UserInfoEdit"
        options={{
          drawerLabel: "Edit your profile",
          drawerIcon: () => (
            <Icon name="user-edit" type="font-awesome-5" size={RFValue(20)} />
          ),
        }}
        component={UserInfoEditingScreen}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  labelStyles: {
    fontFamily: "sans-serif",
    fontWeight: "700",
    fontSize: 19,
    marginLeft: -15,
  },
});
