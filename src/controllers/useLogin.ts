import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { useAuth } from "./AuthProvider";
import type { RootStackParamList } from "@/types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authController } from "./AuthController";

type LoginFormState = {
  email: string;
  password: string;
};

export default function useLoginController() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signIn } = useAuth();
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: signIn,
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
    setField: (field: keyof LoginFormState, value: string) => {
      setErrorMessage("");
      setForm((current) => ({ ...current, [field]: value }));
    },
    submit: () => mutation.mutate(form),
    goToRegister: () => navigation.navigate("Register"),
  };
}

