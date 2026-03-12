import { theme } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../Text";

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  hideBackButton?: boolean;
};

export default function Header({
  title,
  onBackPress,
  hideBackButton = false,
}: HeaderProps) {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {hideBackButton ? (
        <View style={styles.sidePlaceholder} />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ArrowLeftIcon
            size={18}
            color={theme.colors.primaryActive}
            weight="bold"
          />
        </TouchableOpacity>
      )}

      <Text
        variant="subtitle"
        weight="bold"
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.sidePlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  sidePlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
});
