import { theme } from "@/theme";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
  StyleProp,
} from "react-native";

type TextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "button"
  | "small";

type TextWeight = "regular" | "medium" | "bold";

type Props = RNTextProps & {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

export default function Text({
  variant = "body",
  weight = "regular",
  color = theme.colors.textPrimary,
  style,
  children,
  ...rest
}: Props) {
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        variantStyles[variant],
        weightStyles[weight],
        { color },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },

  // Variants
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Weights
  regular: {
    fontWeight: "400",
  },
  medium: {
    fontWeight: "500",
  },
  bold: {
    fontWeight: "700",
  },
});

const variantStyles: Record<TextVariant, TextStyle> = {
  title: styles.title,
  subtitle: styles.subtitle,
  body: styles.body,
  caption: styles.caption,
  button: styles.button,
  small: styles.small,
};

const weightStyles: Record<TextWeight, TextStyle> = {
  regular: styles.regular,
  medium: styles.medium,
  bold: styles.bold,
};
