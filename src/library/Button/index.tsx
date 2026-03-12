import { theme } from "@/theme";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import Text from "../Text";

type ButtonVariant = "primary" | "secondary" | "outlined";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  children,
  title,
  variant = "primary",
  disabled = false,
  loading = false,
  onPress,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        stylesByVariant[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading && (
        <View style={styles.spinner}>
          <ActivityIndicator
            color={
              variant === "outlined" ? theme.colors.primary : theme.colors.white
            }
          />
        </View>
      )}

      <Text
        style={[
          styles.text,
          textStylesByVariant[variant],
          loading && styles.textHidden,
        ]}
      >
        {children || title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    backgroundColor: theme.colors.textDisabled,
  },
  spinner: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textHidden: {
    opacity: 0,
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.black,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  // Text variants
  textOnPrimary: {
    color: theme.colors.textPrimary,
  },
  textOnSecondary: {
    color: theme.colors.textSecondary,
  },
  textOnOutlined: {
    color: theme.colors.textSecondary,
  },
});

const stylesByVariant: Record<ButtonVariant, ViewStyle> = {
  primary: styles.primary,
  secondary: styles.secondary,
  outlined: styles.outlined,
};

const textStylesByVariant: Record<ButtonVariant, TextStyle> = {
  primary: styles.textOnPrimary,
  secondary: styles.textOnSecondary,
  outlined: styles.textOnOutlined,
};
