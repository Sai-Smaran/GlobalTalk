import React, { Component } from "react";
import { TouchableOpacity, View, FlatList, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
// import { SharedElement } from "react-navigation-shared-element";
import MyStackHeader from "../../components/MyHeaders/MyStackHeader";

export default class SentImgList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.route.params.images,
      senderName: this.props.route.params.senderName,
    };
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={{ paddingVertical: 5 }}
      onPress={() => {
        let imgUrls = this.state.images;
        let imageUris = [];
        imgUrls.forEach((element) => {
          imageUris.push({ url: element });
        });
        this.props.navigation.navigate("View", {
          images: imageUris,
          senderName: this.state.senderName,
          imgIndex: index,
        });
      }}
    >
      {/* <SharedElement id={`img-list-${index}`}> */}
        <Image
          source={{ uri: item }}
          style={{ height: RFValue(200) }}
          loadingIndicatorSource={require("../assets/static-images/loading-spinner.gif")}
        />
      {/* </SharedElement> */}
    </TouchableOpacity>
  );

  render() {
    return (
      <View>
        <MyStackHeader
          title={this.state.senderName}
          navigation={this.props.navigation}
        />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.images}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
