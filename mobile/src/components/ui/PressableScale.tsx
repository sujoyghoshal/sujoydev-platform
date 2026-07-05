import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Spring-scale press feedback (0.97) — the standard micro-interaction for
 * tappable surfaces that are not Paper components with built-in ripple.
 */
export function PressableScale({ children, onPress, disabled, style, accessibilityLabel }: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(pressed.value ? 0.97 : 1, { damping: 22, stiffness: 320 }) },
    ],
    opacity: withTiming(pressed.value ? 0.94 : 1, { duration: 110 }),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={onPress}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}
