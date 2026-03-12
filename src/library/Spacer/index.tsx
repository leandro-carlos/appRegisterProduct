import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

type SpacerProps = {
  size?: number; // tamanho do espaço
  horizontal?: boolean; // se for true, cria espaço lateral
  style?: StyleProp<ViewStyle>;
};

export default function Spacer({
  size = 12,
  horizontal = false,
  style,
}: SpacerProps) {
  return (
    <View style={[horizontal ? { width: size } : { height: size }, style]} />
  );
}
