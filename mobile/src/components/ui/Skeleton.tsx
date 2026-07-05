import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pulsing skeleton placeholder for loading states. */
export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: Props) {
  const theme = useTheme();
  const pulse = useSharedValue(0.45);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1, { duration: 650 }), withTiming(0.45, { duration: 650 })),
      -1,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: theme.colors.surfaceVariant },
        animatedStyle,
        style,
      ]}
    />
  );
}
