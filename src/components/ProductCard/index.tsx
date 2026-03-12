import { formatPrice } from "@/helpers/formatPrice";
import { Spacer, Text } from "@/library";
import { theme } from "@/theme";
import { Product } from "@/types/product";
import { Pressable, StyleSheet, View } from "react-native";

function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text variant="subtitle" weight="bold">
        {product?.name}
      </Text>
      <Spacer size={8} />
      <Text numberOfLines={3} color={theme.colors.textSecondary}>
        {product?.description}
      </Text>
      <Spacer size={12} />
      <View style={styles.cardFooter}>
        <Text weight="bold" color={theme.colors.primaryActive}>
          {formatPrice(product?.price)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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

export { ProductCard };
