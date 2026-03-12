import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Input, Screen, Spacer, Text } from "@/library";
import useRegisterController from "@/controllers/useRegister";
import { theme } from "@/theme";
import { Controller } from "react-hook-form";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";

export default function Register() {
  const controller = useRegisterController();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen showHeader headerTitle="Cadastro" keyboardAvoiding>
      <Text variant="title" weight="bold">
        Crie sua conta
      </Text>
      <Spacer />
      <Text color={theme.colors.textSecondary}>
        Cadastre-se para anunciar e gerenciar produtos.
      </Text>
      <Spacer size={20} />
      <Controller
        control={controller.control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome de usuario"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Seu nome de usuario"
            autoCapitalize="words"
            errorMessage={controller.errors.username?.message}
          />
        )}
      />
      <Spacer />
      <Controller
        control={controller.control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="voce@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={controller.errors.email?.message}
          />
        )}
      />
      <Spacer />
      <Controller
        control={controller.control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Crie uma senha"
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword((current) => !current)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
                hitSlop={8}
              >
                {showPassword ? (
                  <EyeClosedIcon
                    color={theme.colors.textSecondary}
                    size={20}
                  />
                ) : (
                  <EyeIcon color={theme.colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
            }
            errorMessage={controller.errors.password?.message}
          />
        )}
      />
      {controller.errors.root?.message ? (
        <>
          <Spacer />
          <Text color={theme.colors.error}>{controller.errors.root.message}</Text>
        </>
      ) : null}
      <Spacer size={20} />
      <Button
        title="Cadastrar"
        disabled={!controller.isValid}
        loading={controller.loading}
        onPress={controller.submit}
      />
      <Spacer />
      <Button
        title="Ja tenho conta"
        variant="outlined"
        onPress={controller.goToLogin}
      />
    </Screen>
  );
}
