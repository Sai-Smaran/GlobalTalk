import { useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Prop {
  progress: number,
  borderStyle: StyleProp<ViewStyle>,
  fillStyle: StyleProp<ViewStyle>
}

export default function ProgressBar({
  progress: progressProp,
  borderStyle,
  fillStyle,
}: Prop) {
  const progress = useSharedValue(progressProp || 0);
  const height = useSharedValue(0);

  useAnimatedReaction(
    () => progressProp,
    (val) => {
      if (val) {
        progress.value = withTiming(val, { easing: Easing.inOut(Easing.ease) });
      }
    }
  );

  useFocusEffect(
    useMemo(() => {
      height.value = withTiming(50, { duration: 150 });
      return () => { }
    }, [])
  );

  const overallHeight = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const animatedFillStyle = useAnimatedStyle(() => {
    const fillWidth = interpolate(
      progress.value,
      [0, 1],
      [0, styles.containerStyle.width],
      "clamp"
    );
    return {
      width: fillWidth,
    };
  });

  return (
    <Animated.View style={[borderStyle, styles.containerStyle, overallHeight]}>
      <Animated.View
        style={[
          fillStyle,
          styles.fillStyle,
          borderStyle,
          animatedFillStyle,
          overallHeight,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 2,
  },
  fillStyle: {
    height: 50,
    borderWidth: 1,
    backgroundColor: "gray",
    borderRadius: 2,
  },
});
