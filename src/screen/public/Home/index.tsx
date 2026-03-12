import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import { Button, Input, Screen, Spacer, Text } from "@/library";
import { useProductsController } from "@/controllers/useProduct";
import { theme } from "@/theme";
import Fab from "@/library/Fab";
import { PlusIcon } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const controller = useProductsController();
  const navigation = useNavigation();

  const handleCreateProduct = () => {
    // @ts-ignore
    navigation.navigate("ProductForm", { mode: "create" });
  };

  return (
    <Screen scrollEnabled={false}>
      <FlatList
        style={styles.list}
        data={controller.products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={controller.refreshing}
            onRefresh={() => controller.refetch()}
            tintColor={theme.colors.primaryActive}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="title" weight="bold">
              Explore os produtos
            </Text>
            <Spacer />
            <Text color={theme.colors.textSecondary}>
              Filtre por nome, descricao e faixa de preco.
            </Text>
            <Spacer size={20} />

            <View style={styles.filtersCard}>
              <Input
                label="Nome"
                value={controller.filters.name}
                onChangeText={(value) => controller.setFilter("name", value)}
                placeholder="Buscar por nome"
              />
              <Spacer />
              <Input
                label="Descricao"
                value={controller.filters.description}
                onChangeText={(value) =>
                  controller.setFilter("description", value)
                }
                placeholder="Buscar por descricao"
              />
              <Spacer />
              <View style={styles.priceRow}>
                <Input
                  label="Preco minimo"
                  value={controller.filters.minPrice}
                  onChangeText={(value) =>
                    controller.setFilter("minPrice", value)
                  }
                  placeholder="0"
                  keyboardType="decimal-pad"
                  containerStyle={styles.priceInput}
                />
                <Input
                  label="Preco maximo"
                  value={controller.filters.maxPrice}
                  onChangeText={(value) =>
                    controller.setFilter("maxPrice", value)
                  }
                  placeholder="1000"
                  keyboardType="decimal-pad"
                  containerStyle={styles.priceInput}
                />
              </View>
              <Spacer />
              <Button
                title="Limpar filtros"
                variant="outlined"
                onPress={controller.clearFilters}
              />
            </View>

            <Spacer size={20} />
          </View>
        }
        ListEmptyComponent={
          controller.loading ? (
            <Text>Carregando produtos...</Text>
          ) : (
            <Text color={theme.colors.textSecondary}>
              Nenhum produto encontrado para os filtros informados.
            </Text>
          )
        }
        ItemSeparatorComponent={() => <Spacer />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => controller.openDetails(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <Fab icon={<PlusIcon />} onPress={() => handleCreateProduct()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  list: {
    flex: 1,
  },
  filtersCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
});
