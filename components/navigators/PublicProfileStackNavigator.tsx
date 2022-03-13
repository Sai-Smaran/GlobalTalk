import React from "react";
import PublicChat from "../../screens/publicchatscreen";
import AboutUserScreen from "../../screens/Private-stack/aboutuserscreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function PublicChatStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Public"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen component={PublicChat} name="Public" />
      <Stack.Screen component={AboutUserScreen} name="AboutUser" />
    </Stack.Navigator>
  );
}
