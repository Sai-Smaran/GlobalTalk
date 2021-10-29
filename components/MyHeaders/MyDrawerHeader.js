import React, { Component } from "react";
import { Header } from "react-native-elements";
import { Icon } from "react-native-elements";

export default class MyDrawerHeader extends Component {
  render() {
    return (
      <Header
      placement="left"
        leftComponent={
          <Icon
            name="menu"
            type="entypo"
            color="white"
            size={30}
            onPress={() => this.props.navigation.openDrawer()}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
        }}
        backgroundColor="#666666"
      />
    );
  }
}
