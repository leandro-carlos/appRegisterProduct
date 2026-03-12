import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "./AuthProvider";
import type { RootStackParamList } from "@/types/navigation";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authController, registerSchema } from "./AuthController";
import type { RegisterPayload } from "@/types/auth";

export default function useRegisterController() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      form.clearErrors("root");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs", params: { screen: "Home" } }],
      });
    },
    onError: (error) => {
      form.setError("root", {
        message: authController.getErrorMessage(error),
      });
    },
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    loading: mutation.isPending,
    submit: form.handleSubmit((values) => mutation.mutate(values)),
    goToLogin: () => navigation.navigate("Login"),
  };
}
