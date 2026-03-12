import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { theme } from "@/theme";
import Header from "../Header";

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  edges?: Edge[];
  showHeader?: boolean;
  headerTitle?: string;
  onBackPress?: () => void;
  hideBackButton?: boolean;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  keyboardBehavior?: "height" | "position" | "padding";
};

export default function Screen({
  children,
  style,
  contentContainerStyle,
  scrollEnabled = true,
  edges = ["top", "right", "bottom", "left"],
  showHeader = false,
  headerTitle = "",
  onBackPress,
  hideBackButton = false,
  keyboardAvoiding = false,
  keyboardVerticalOffset = 0,
  keyboardBehavior = Platform.OS === "ios" ? "padding" : "height",
}: ScreenProps) {
  const content = scrollEnabled ? (
    <ScrollView
      scrollEnabled
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.contentContainer, styles.flex, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, style]}>
      {showHeader && (
        <View style={styles.headerContainer}>
          <Header
            title={headerTitle}
            onBackPress={onBackPress}
            hideBackButton={hideBackButton}
          />
        </View>
      )}

      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  flex: {
    flex: 1,
  },
});
