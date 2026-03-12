import React from "react";
import { StyleSheet, View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import { Button, Input, Screen, Spacer, Text } from "@/library";
import { useUpsertProductController } from "@/controllers/useProduct";
import { theme } from "@/theme";
import type { RootStackParamList } from "@/types/navigation";

export default function ProductForm() {
  const route = useRoute<RouteProp<RootStackParamList, "ProductForm">>();
  const controller = useUpsertProductController(route.params);
  const isEdit = route.params.mode === "edit";

  return (
    <Screen
      showHeader
      headerTitle={isEdit ? "Editar produto" : "Novo produto"}
      keyboardAvoiding
    >
      <View style={styles.card}>
        <Text variant="subtitle" weight="bold">
          {isEdit ? "Atualize seu produto" : "Cadastre um novo produto"}
        </Text>
        <Spacer />
        <Input
          label="Nome"
          value={controller.form.name}
          onChangeText={(value) => controller.setField("name", value)}
          placeholder="Ex.: Teclado mecanico"
        />
        <Spacer />
        <Input
          label="Descricao"
          value={controller.form.description}
          onChangeText={(value) => controller.setField("description", value)}
          placeholder="Descreva o produto"
          multiline
          style={styles.multilineInput}
        />
        <Spacer />
        <Input
          label="Preco"
          value={controller.form.price}
          onChangeText={(value) => controller.setField("price", value)}
          placeholder="149.90"
          keyboardType="decimal-pad"
        />

        {controller.errorMessage ? (
          <>
            <Spacer />
            <Text color={theme.colors.error}>{controller.errorMessage}</Text>
          </>
        ) : null}

        <Spacer size={20} />
        <Button
          title={isEdit ? "Salvar alteracoes" : "Criar produto"}
          loading={controller.loading}
          onPress={controller.submit}
        />
      </View>
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
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
});

