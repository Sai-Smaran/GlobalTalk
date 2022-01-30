import { View, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function Waves({ loudness }) {
  const height = useSharedValue(0);
  const height1 = useSharedValue(0);
  const height2 = useSharedValue(0);
  const height3 = useSharedValue(0);
  const height4 = useSharedValue(0);
  const height5 = useSharedValue(0);

  useAnimatedReaction(
    () => loudness,
    (val) => {
      height.value = interpolate(val, [-120, 0], [20, 400], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      height1.value = interpolate(val, [-120, 0], [20, 360], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      height2.value = interpolate(val, [-120, 0], [20, 200], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      height3.value = interpolate(val, [-120, 0], [20, 130], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      height4.value = interpolate(val, [-120, 0], [20, 50], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
      height5.value = interpolate(val, [-120, 0], [20, 30], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      });
    },
    [loudness]
  );

  const animatedLine = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value),
    };
  });
  const animatedLine1 = useAnimatedStyle(() => {
    return {
      height: withSpring(height1.value),
    };
  });

  const animatedLine2 = useAnimatedStyle(() => {
    return {
      height: withSpring(height2.value),
    };
  });
  const animatedLine3 = useAnimatedStyle(() => {
    return {
      height: withSpring(height3.value),
    };
  });
  const animatedLine4 = useAnimatedStyle(() => {
    return {
      height: withSpring(height4.value),
    };
  });
  const animatedLine5 = useAnimatedStyle(() => {
    return {
      height: withSpring(height5.value),
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View style={[styles.wave, animatedLine5, { marginLeft: 0 }]} />
      <Animated.View style={[styles.wave, animatedLine4]} />
      <Animated.View style={[styles.wave, animatedLine3]} />
      <Animated.View style={[styles.wave, animatedLine2]} />
      <Animated.View style={[styles.wave, animatedLine1]} />
      <Animated.View style={[styles.wave, animatedLine]} />
      <Animated.View style={[styles.wave, animatedLine1]} />
      <Animated.View style={[styles.wave, animatedLine2]} />
      <Animated.View style={[styles.wave, animatedLine3]} />
      <Animated.View style={[styles.wave, animatedLine4]} />
      <Animated.View style={[styles.wave, animatedLine5]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wave: {
    width: 20,
    borderRadius: 20,
    backgroundColor: "lightgray",
    marginLeft: 10,
  },
});
