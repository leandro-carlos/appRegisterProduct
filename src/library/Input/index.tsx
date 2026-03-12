import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import Text from "../Text";
import { theme } from "@/theme";

type Props = TextInputProps & {
  label?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Input({
  label,
  disabled = false,
  containerStyle,
  style,
  leftIcon,
  rightIcon,
  ...rest
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="caption" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}

      <View style={[styles.inputWrapper, disabled && styles.disabled]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          {...rest}
          editable={!disabled}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, style]}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    marginBottom: 6,
    color: theme.colors.textSecondary,
  },

  inputWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },

  iconLeft: {
    marginRight: 8,
  },

  iconRight: {
    marginLeft: 8,
  },

  disabled: {
    backgroundColor: theme.colors.background,
  },
});
