import React, { Component } from "react";
import { setStatusBarHidden } from "expo-status-bar";

interface Props {
  route: any
}

interface State {
  editImgNo: number
  imageData: {uri: string}[]
}

export default class EditImageScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editImgNo: this.props.route.params.imgIndex,
      imageData: this.props.route.params.image,
    };
  }

  componentDidCatch() {
    setStatusBarHidden(false, "slide");
  }

  render() {
    return (
      null
      // <ImageEditor
      //   onCloseEditor={() =>
      //     this.props.navigation.navigate("Confirm", {
      //       imageUrls: this.state.imageData,
      //     })
      //   }
      //   imageUri={this.state.imageData[this.state.editImgNo].uri}
      //   asView
      //   minimumCropDimensions={{ width: 100, height: 100 }}
      //   mode="full"
      //   onEditingComplete={(result) => {
      //     let data = this.state.imageData;
      //     data.splice(this.state.editImgNo, 1, result);
      //     console.log(data);
      //     this.props.navigation.navigate("Confirm", {
      //       imageUrls: data,
      //     });
      //   }}
      // />
    );
  }
}
