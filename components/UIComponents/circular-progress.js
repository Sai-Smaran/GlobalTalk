import React, { useEffect } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 1000;
const r = CIRCLE_LENGTH / (Math.PI * 2);
const SECONDARY_CIRCLE_LENGTH = 790;
const R = SECONDARY_CIRCLE_LENGTH / (Math.PI * 2);

const BACKGROUND_STROKE = "#e0f6ff";
const STROKE = "#A6E1FA";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CircularProgress({
  progress: progressProp,
  percentageTextStyle,
  counterTextStyle,
  maxCount,
  count,
}) {
  const progress = useSharedValue(0);

  const secondaryProgress = useSharedValue(0);

  useAnimatedReaction(
    () => progressProp,
    (val) => {
      progress.value = withTiming(val, {
        easing: Easing.inOut(Easing.ease),
        duration: 250,
      });
    }
  );

  useAnimatedReaction(
    () => count,
    (val) => {
      secondaryProgress.value = withTiming(val / maxCount, {
        duration: 250,
        easing: Easing.inOut(Easing.ease),
      });
    }
  );

  const mainAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    };
  });

  const secondaryAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: SECONDARY_CIRCLE_LENGTH * (1 - secondaryProgress.value),
    };
  });

  const progressText = useDerivedValue(() => {
    return `${Math.round(progress.value * 100)}`;
  });

  return (
    <View style={styles.container}>
      <ReText
        style={[styles.textStyle, percentageTextStyle]}
        text={progressText}
      />
      <Text
        style={[styles.countTextStyle, counterTextStyle]}
      >{`${count}/${maxCount}`}</Text>
      <Svg style={{ position: "absolute", transform: [{ rotateZ: "-90deg" }] }}>
        <Circle
          cx={RFValue(125)}
          cy={RFValue(125)}
          r={r}
          stroke={BACKGROUND_STROKE}
          strokeWidth={35}
        />
        <AnimatedCircle
          cx={RFValue(125)}
          cy={RFValue(125)}
          r={r}
          stroke={STROKE}
          strokeWidth={25}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={mainAnimatedProps}
          strokeLinecap="round"
        />
        {maxCount > 1 ? (
          <>
            <Circle
              cx={RFValue(125)}
              cy={RFValue(125)}
              r={R}
              stroke={BACKGROUND_STROKE}
              strokeWidth={35}
            />

            <AnimatedCircle
              cx={RFValue(125)}
              cy={RFValue(125)}
              r={R}
              stroke="#00c8ff"
              strokeWidth={25}
              strokeDasharray={SECONDARY_CIRCLE_LENGTH}
              animatedProps={secondaryAnimatedProps}
              strokeLinecap="round"
            />
          </>
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RFValue(250),
    height: RFValue(250),
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: RFValue(50),
    color: "rgba(56, 56, 56, 0.7)",
    width: 150,
    textAlign: "center",
    fontFamily: "sans-serif-medium",
  },
  countTextStyle: {
    color: "darkgray",
    fontFamily: "sans-serif-light",
    fontSize: RFValue(20)
  },
});
