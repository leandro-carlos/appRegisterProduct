import axios from "axios";
import { z } from "zod";

import { apiClient } from "@/query/apiClient";
import { queryClient } from "@/query/queryClient";
import type {
  Product,
  ProductFilters,
  ProductPayload,
  ProductQueryParams,
} from "@/types/product";

export const productsKeys = {
  all: ["products"] as const,
  list: (filters: ProductQueryParams) => [...productsKeys.all, filters] as const,
  detail: (id: string) => [...productsKeys.all, "detail", id] as const,
};

const productSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do produto."),
  description: z
    .string()
    .trim()
    .min(3, "Informe uma descricao com pelo menos 3 caracteres."),
  price: z
    .number({ error: "Informe um preco valido." })
    .positive("O preco deve ser maior que zero."),
});

const productFilterSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  minPrice: z.string().default(""),
  maxPrice: z.string().default(""),
});

const resolveOwnerId = (payload: any) =>
  String(
    payload?.ownerId ??
      payload?.userId ??
      payload?.owner?.id ??
      payload?.user?.id ??
      ""
  );

const normalizeProduct = (payload: any): Product => ({
  id: String(payload?.id ?? payload?._id ?? ""),
  name: String(payload?.name ?? ""),
  description: String(payload?.description ?? ""),
  price: Number(payload?.price ?? 0),
  ownerId: resolveOwnerId(payload),
  createdAt: payload?.createdAt,
  updatedAt: payload?.updatedAt,
});

const normalizeProductList = (payload: any): Product[] => {
  const collection = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.products)
        ? payload.products
        : [];

  return collection.map(normalizeProduct);
};

const buildQueryParams = (filters?: Partial<ProductFilters>): ProductQueryParams => {
  const parsedFilters = productFilterSchema.parse(filters ?? {});
  const minPrice = Number(parsedFilters.minPrice);
  const maxPrice = Number(parsedFilters.maxPrice);

  return {
    ...(parsedFilters.name.trim() ? { name: parsedFilters.name.trim() } : {}),
    ...(parsedFilters.description.trim()
      ? { description: parsedFilters.description.trim() }
      : {}),
    ...(parsedFilters.minPrice.trim() && Number.isFinite(minPrice)
      ? { minPrice }
      : {}),
    ...(parsedFilters.maxPrice.trim() && Number.isFinite(maxPrice)
      ? { maxPrice }
      : {}),
  };
};

const mapProductError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Dados do produto invalidos.";
  }

  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (error.response?.status === 403) {
      return "Voce nao pode alterar este produto.";
    }
  }

  return "Nao foi possivel concluir a operacao com o produto.";
};

export const productController = {
  getListFilters(filters?: Partial<ProductFilters>) {
    return buildQueryParams(filters);
  },

  async listProducts(filters?: Partial<ProductFilters>) {
    const params = buildQueryParams(filters);
    const response = await apiClient.get("/api/products", { params });
    return normalizeProductList(response.data);
  },

  async getProductById(productId: string) {
    const response = await apiClient.get(`/api/products/${productId}`);
    return normalizeProduct(response.data?.data ?? response.data);
  },

  async createProduct(payload: {
    name: string;
    description: string;
    price: string;
  }) {
    const body = productSchema.parse({
      ...payload,
      price: Number(payload.price),
    }) as ProductPayload;

    const response = await apiClient.post("/api/products", body);
    await queryClient.invalidateQueries({ queryKey: productsKeys.all });
    return normalizeProduct(response.data?.data ?? response.data);
  },

  async updateProduct(
    productId: string,
    payload: { name: string; description: string; price: string }
  ) {
    const body = productSchema.parse({
      ...payload,
      price: Number(payload.price),
    }) as ProductPayload;

    const response = await apiClient.patch(`/api/products/${productId}`, body);
    await queryClient.invalidateQueries({ queryKey: productsKeys.all });
    await queryClient.invalidateQueries({
      queryKey: productsKeys.detail(productId),
    });
    return normalizeProduct(response.data?.data ?? response.data);
  },

  async deleteProduct(productId: string) {
    await apiClient.delete(`/api/products/${productId}`);
    await queryClient.invalidateQueries({ queryKey: productsKeys.all });
    await queryClient.removeQueries({ queryKey: productsKeys.detail(productId) });
  },

  isOwner(product: Product, currentUserId?: string | null) {
    return Boolean(currentUserId && product.ownerId === currentUserId);
  },

  getErrorMessage(error: unknown) {
    return mapProductError(error);
  },
};
