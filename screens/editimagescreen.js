import React, { Component } from "react";
import { ImageEditor } from "expo-image-editor";
import { setStatusBarHidden } from "expo-status-bar";

export default class EditImageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editImgNo: this.props.navigation.getParam("imgIndex"),
      imageData: this.props.navigation.getParam("image"),
    };
  }

  componentDidCatch() {
    setStatusBarHidden(false, "slide");
  }

  render() {
    return (
      <ImageEditor
        onCloseEditor={() =>
          this.props.navigation.navigate("Confirm", {
            imageUrls: this.state.imageData,
          })
        }
        imageUri={this.state.imageData[this.state.editImgNo].uri}
        asView
        minimumCropDimensions={{ width: 100, height: 100 }}
        mode="full"
        onEditingComplete={(result) => {
          let data = this.state.imageData;
          data.splice(this.state.editImgNo, 1, result);
          console.log(data);
          this.props.navigation.navigate("Confirm", {
            imageUrls: data,
          });
        }}
      />
    );
  }
}
