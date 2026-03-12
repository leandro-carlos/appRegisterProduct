import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";

import { useAuth } from "./AuthProvider";
import { productController, productsKeys } from "./ProductController";
import type { Product, ProductFilters } from "@/types/product";
import type { RootStackParamList } from "@/types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const emptyFilters: ProductFilters = {
  name: "",
  description: "",
  minPrice: "",
  maxPrice: "",
};

export function useProductsController() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<ProductFilters>(emptyFilters);
  const queryFilters = useMemo(
    () => productController.getListFilters(filters),
    [filters]
  );

  const productsQuery = useQuery({
    queryKey: productsKeys.list(queryFilters),
    queryFn: () => productController.listProducts(filters),
  });

  return {
    filters,
    products: productsQuery.data ?? [],
    loading: productsQuery.isLoading,
    refreshing: productsQuery.isRefetching,
    errorMessage: productsQuery.error
      ? productController.getErrorMessage(productsQuery.error)
      : "",
    isAuthenticated,
    currentUserId: user?.id ?? null,
    setFilter: (field: keyof ProductFilters, value: string) =>
      setFilters((current) => ({ ...current, [field]: value })),
    clearFilters: () => setFilters(emptyFilters),
    refetch: productsQuery.refetch,
    openLogin: () => navigation.navigate("Login"),
    openRegister: () => navigation.navigate("Register"),
    openDetails: (product: Product) =>
      navigation.navigate("ProductDetails", {
        productId: product.id,
        initialProduct: product,
      }),
    openCreate: () => navigation.navigate("ProductForm", { mode: "create" }),
    canManage: (product: Product) =>
      productController.isOwner(product, user?.id ?? null),
  };
}

export function useProductDetailsController(productId: string, initialProduct?: Product) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: productsKeys.detail(productId),
    queryFn: () => productController.getProductById(productId),
    initialData: initialProduct,
  });

  const deleteMutation = useMutation({
    mutationFn: () => productController.deleteProduct(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsKeys.all });
      navigation.goBack();
    },
  });

  const product = productQuery.data;
  const canManage = Boolean(
    product && productController.isOwner(product, user?.id ?? null)
  );

  return {
    product,
    loading: productQuery.isLoading,
    deleteLoading: deleteMutation.isPending,
    errorMessage: productQuery.error
      ? productController.getErrorMessage(productQuery.error)
      : deleteMutation.error
        ? productController.getErrorMessage(deleteMutation.error)
        : "",
    isAuthenticated,
    canManage,
    refetch: productQuery.refetch,
    edit: () => {
      if (!product) {
        return;
      }

      navigation.navigate("ProductForm", {
        mode: "edit",
        productId,
        initialProduct: product,
      });
    },
    remove: () => deleteMutation.mutate(),
  };
}

export function useUpsertProductController(params: {
  mode: "create" | "edit";
  productId?: string;
  initialProduct?: Product;
}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    name: params.initialProduct?.name ?? "",
    description: params.initialProduct?.description ?? "",
    price: params.initialProduct ? String(params.initialProduct.price) : "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      params.mode === "create"
        ? productController.createProduct(form)
        : productController.updateProduct(params.productId ?? "", form),
    onSuccess: (product) => {
      setErrorMessage("");

      if (params.mode === "create") {
        navigation.replace("ProductDetails", {
          productId: product.id,
          initialProduct: product,
        });
        return;
      }

      navigation.goBack();
    },
    onError: (error) => {
      setErrorMessage(productController.getErrorMessage(error));
    },
  });

  return {
    form,
    errorMessage,
    loading: mutation.isPending,
    setField: (field: "name" | "description" | "price", value: string) => {
      setErrorMessage("");
      setForm((current) => ({ ...current, [field]: value }));
    },
    submit: () => mutation.mutate(),
  };
}
