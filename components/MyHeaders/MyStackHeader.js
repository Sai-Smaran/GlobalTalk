import React, { Component } from "react";
import { Header } from "react-native-elements";
import { Icon } from "react-native-elements";

export default class MyStackHeader extends Component {
  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="arrow-back-ios"
            type="material-icons"
            color="white"
            onPress={() => this.props.navigation.goBack()}
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
