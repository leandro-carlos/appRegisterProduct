import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { useAuth } from "./AuthProvider";
import type { RootStackParamList } from "@/types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authController } from "./AuthController";

type RegisterFormState = {
  username: string;
  email: string;
  password: string;
};

export default function useRegisterController() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterFormState>({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setErrorMessage("");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "Home" } }],
      });
    },
    onError: (error) => {
      setErrorMessage(authController.getErrorMessage(error));
    },
  });

  return {
    form,
    errorMessage,
    loading: mutation.isPending,
    setField: (field: keyof RegisterFormState, value: string) => {
      setErrorMessage("");
      setForm((current) => ({ ...current, [field]: value }));
    },
    submit: () => mutation.mutate(form),
    goToLogin: () => navigation.navigate("Login"),
  };
}

