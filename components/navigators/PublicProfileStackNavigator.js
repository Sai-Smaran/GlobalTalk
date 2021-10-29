import PrivateChat from "../../screens/publicchatscreen";
import AboutUserScreen from "../../screens/aboutuserscreen";
import { createStackNavigator } from "react-navigation-stack";

export const PublicChatStackNavigator = createStackNavigator(
  {
    Public: {
      screen: PrivateChat,
      navigationOptions: {
        headerShown: false,
      },
    },
    AboutUser: {
      screen: AboutUserScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "Public" }
);
