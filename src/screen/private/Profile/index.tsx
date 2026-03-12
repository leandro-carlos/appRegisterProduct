import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useMutation } from "@tanstack/react-query";

import { Button, Screen, Spacer, Text } from "@/library";
import { useAuth } from "@/controllers/AuthProvider";
import { theme } from "@/theme";
import { userController } from "@/controllers/UserController";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { user, signOut, refreshUser } = useAuth();
  const navigation = useNavigation();

  const refreshMutation = useMutation({
    mutationFn: refreshUser,
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigation.reset({
        index: 0,
        // @ts-ignore
        routes: [{ name: "Login" }],
      });
    },
  });

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar sua sessao?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.card}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          Usuario autenticado
        </Text>
        <Spacer />
        <Text variant="subtitle" weight="bold">
          {user?.username ?? "Usuario"}
        </Text>
        <Spacer size={4} />
        <Text>{user?.email ?? "Sem email carregado"}</Text>
      </View>

      {refreshMutation.error ? (
        <>
          <Spacer />
          <Text color={theme.colors.error}>
            {userController.getErrorMessage(refreshMutation.error)}
          </Text>
        </>
      ) : null}

      <Spacer size={20} />
      <Button
        title="Atualizar meus dados"
        loading={refreshMutation.isPending}
        onPress={() => refreshMutation.mutate()}
      />
      <Spacer />
      <Button
        title="Sair"
        variant="outlined"
        loading={logoutMutation.isPending}
        onPress={handleLogout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
