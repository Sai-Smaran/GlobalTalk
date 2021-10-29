import React, { Component } from "react";
import { View, FlatList, Platform } from "react-native";
import { SearchBar, ListItem, Avatar } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import MyDrawerHeader from "../components/MyHeaders/MyDrawerHeader";
import db from "../config";
import firebase from "firebase";

export default class SearchUser extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      search: "",
      allResults: [],
    };
  }

  getUsers = () => {
    db.collection("users")
      .where(
        "searchable_keywords",
        "array-contains",
        this.state.search.trim().toLowerCase()
      )
      .get()
      .then((query) => {
        var searchResults = [];
        query.forEach((doc) => {
          searchResults.push(doc.data());
        });
        this.setState({
          allResults: searchResults,
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem
      onPress={() => {
        if (item.email !== this.state.userId) {
          this.props.navigation.navigate("Chat", {
            details: item,
          });
        }
      }}
      onLongPress={() =>
        this.props.navigation.navigate("About", { details: item })
      }
    >
      <Avatar
        rounded
        source={item.profile_url ? { uri: item.profile_url } : { uri: "#" }}
        title={item.user_name.charAt(0).toUpperCase()}
        size={RFValue(60)}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold" }}>
          {item.user_name}
        </ListItem.Title>
        <ListItem.Subtitle>{item.about}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron color="#ededed" size={50} />
    </ListItem>
  );

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#ededed" }}>
        <MyDrawerHeader
          title="Private chat"
          navigation={this.props.navigation}
        />
        <SearchBar
          platform={Platform.OS}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          value={this.state.search}
          onChangeText={(text) => this.setState({ search: text })}
          placeholder="Search"
          onSubmitEditing={() => {
            this.getUsers();
          }}
          returnKeyType="search"
        />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.allResults}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
