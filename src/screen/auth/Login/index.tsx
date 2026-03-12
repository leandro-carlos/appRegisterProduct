import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Input, Screen, Spacer, Text } from "@/library";
import useLoginController from "@/controllers/useLogin";
import { theme } from "@/theme";
import { Controller } from "react-hook-form";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";

export default function Login() {
  const controller = useLoginController();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen showHeader headerTitle="Entrar" keyboardAvoiding hideBackButton>
      <Text variant="title" weight="bold">
        Acesse sua conta
      </Text>
      <Spacer />
      <Text color={theme.colors.textSecondary}>
        Use seu email e senha para continuar.
      </Text>
      <Spacer size={20} />
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
            placeholder="Sua senha"
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
          <Text color={theme.colors.error}>
            {controller.errors.root.message}
          </Text>
        </>
      ) : null}
      <Spacer size={20} />
      <Button
        title="Entrar"
        disabled={!controller.isValid}
        loading={controller.loading}
        onPress={controller.submit}
      />
      <Spacer />
      <Button
        title="Criar conta"
        variant="outlined"
        onPress={controller.goToRegister}
      />
    </Screen>
  );
}
