import type { NavigatorScreenParams } from "@react-navigation/native";
import type { Product } from "./product";

export type RootStackParamList = {
  ProductDetails: { productId: string; initialProduct?: Product };
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductForm:
    | { mode: "create" }
    | { mode: "edit"; productId: string; initialProduct?: Product };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};
