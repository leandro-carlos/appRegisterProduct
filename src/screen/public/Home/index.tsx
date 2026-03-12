import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

import { Button, Input, Screen, Spacer, Text } from "@/library";
import { useProductsController } from "@/controllers/useProduct";
import { theme } from "@/theme";
import type { Product } from "@/types/product";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

function ProductCard({
  product,
  canManage,
  onPress,
}: {
  product: Product;
  canManage: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text variant="subtitle" weight="bold">
        {product.name}
      </Text>
      <Spacer size={8} />
      <Text numberOfLines={3} color={theme.colors.textSecondary}>
        {product.description}
      </Text>
      <Spacer size={12} />
      <View style={styles.cardFooter}>
        <Text weight="bold" color={theme.colors.primaryActive}>
          {formatPrice(product.price)}
        </Text>
        {canManage ? (
          <Text variant="small" color={theme.colors.info}>
            Seu produto
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Home() {
  const controller = useProductsController();

  return (
    <Screen showHeader headerTitle="Produtos" scrollEnabled={false}>
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

            {!controller.isAuthenticated ? (
              <>
                <Button title="Entrar" onPress={controller.openLogin} />
                <Spacer />
                <Button
                  title="Criar conta"
                  variant="outlined"
                  onPress={controller.openRegister}
                />
                <Spacer size={20} />
              </>
            ) : null}

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
                onChangeText={(value) => controller.setFilter("description", value)}
                placeholder="Buscar por descricao"
              />
              <Spacer />
              <View style={styles.priceRow}>
                <Input
                  label="Preco minimo"
                  value={controller.filters.minPrice}
                  onChangeText={(value) => controller.setFilter("minPrice", value)}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  containerStyle={styles.priceInput}
                />
                <Input
                  label="Preco maximo"
                  value={controller.filters.maxPrice}
                  onChangeText={(value) => controller.setFilter("maxPrice", value)}
                  placeholder="1000"
                  keyboardType="decimal-pad"
                  containerStyle={styles.priceInput}
                />
              </View>
              <Spacer />
              <Button title="Limpar filtros" variant="outlined" onPress={controller.clearFilters} />
            </View>

            {controller.isAuthenticated ? (
              <>
                <Spacer />
                <Button title="Novo produto" onPress={controller.openCreate} />
              </>
            ) : null}

            {controller.errorMessage ? (
              <>
                <Spacer />
                <Text color={theme.colors.error}>{controller.errorMessage}</Text>
              </>
            ) : null}

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
            canManage={controller.canManage(item)}
            onPress={() => controller.openDetails(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
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
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
