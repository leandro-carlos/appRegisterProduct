import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button, Screen, Spacer, Text } from "@/library";
import { useProductDetailsController } from "@/controllers/useProduct";
import { theme } from "@/theme";
import type { RootStackParamList } from "@/types/navigation";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function ProductDetails() {
  const route = useRoute<RouteProp<RootStackParamList, "ProductDetails">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const controller = useProductDetailsController(
    route.params.productId,
    route.params.initialProduct
  );

  const handleDelete = () => {
    Alert.alert("Remover produto", "Essa acao nao pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: controller.remove,
      },
    ]);
  };

  if (controller.loading && !controller.product) {
    return (
      <Screen showHeader headerTitle="Detalhes do produto">
        <Text>Carregando produto...</Text>
      </Screen>
    );
  }

  if (!controller.product) {
    return (
      <Screen showHeader headerTitle="Detalhes do produto">
        <Text color={theme.colors.error}>
          {controller.errorMessage || "Produto nao encontrado."}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen showHeader headerTitle="Detalhes do produto">
      <View style={styles.card}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          Produto
        </Text>
        <Spacer size={6} />
        <Text variant="title" weight="bold">
          {controller.product.name}
        </Text>
        <Spacer />
        <Text>{controller.product.description}</Text>
        <Spacer size={20} />
        <Text variant="subtitle" weight="bold" color={theme.colors.primaryActive}>
          {formatPrice(controller.product.price)}
        </Text>
      </View>

      {controller.errorMessage ? (
        <>
          <Spacer />
          <Text color={theme.colors.error}>{controller.errorMessage}</Text>
        </>
      ) : null}

      <Spacer size={20} />
      {controller.canManage ? (
        <>
          <Button title="Editar produto" onPress={controller.edit} />
          <Spacer />
          <Button
            title="Remover produto"
            variant="outlined"
            loading={controller.deleteLoading}
            onPress={handleDelete}
          />
        </>
      ) : controller.isAuthenticated ? null : (
        <>
          <Text color={theme.colors.textSecondary}>
            Entre na sua conta para cadastrar e gerenciar seus produtos.
          </Text>
          <Spacer />
          <Button title="Entrar" onPress={() => navigation.navigate("Login")} />
        </>
      )}
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
