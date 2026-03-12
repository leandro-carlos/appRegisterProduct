export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFilters = {
  name: string;
  description: string;
  minPrice: string;
  maxPrice: string;
};

export type ProductQueryParams = Partial<{
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
}>;

export type ProductPayload = {
  name: string;
  description: string;
  price: number;
};

