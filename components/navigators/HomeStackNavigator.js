import LoginScreen from "../../screens/loginscreen";
import SignUpScreen from "../../screens/signupscreen";
import { createStackNavigator } from "react-navigation-stack";

export const HomeStackNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "Login",
  }
);
