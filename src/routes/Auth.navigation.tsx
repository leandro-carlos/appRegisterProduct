import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "@/controllers/AuthProvider";
import Login from "@/screen/auth/Login";
import Register from "@/screen/auth/Register";
import ProductDetails from "@/screen/public/ProductDetails";
import ProductForm from "@/screen/private/ProductForm";
import { MainTabs } from "./BottomTabs.navigation";
import { theme } from "@/theme";
import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      id="auth"
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="ProductForm" component={ProductForm} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </>
      )}
    </Stack.Navigator>
  );
}

export { AuthStack };

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});
