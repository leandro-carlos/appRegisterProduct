import { Button, Input, Screen, Spacer, Text } from "@/library";
import useLoginController from "@/controllers/useLogin";
import { theme } from "@/theme";

export default function Login() {
  const controller = useLoginController();

  return (
    <Screen
      showHeader
      headerTitle="Entrar"
      keyboardAvoiding
      hideBackButton
    >
      <Text variant="title" weight="bold">
        Acesse sua conta
      </Text>
      <Spacer />
      <Text color={theme.colors.textSecondary}>
        Use seu email e senha para continuar.
      </Text>
      <Spacer size={20} />
      <Input
        label="Email"
        value={controller.form.email}
        onChangeText={(value) => controller.setField("email", value)}
        placeholder="voce@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Spacer />
      <Input
        label="Senha"
        value={controller.form.password}
        onChangeText={(value) => controller.setField("password", value)}
        placeholder="Sua senha"
        secureTextEntry
      />
      {controller.errorMessage ? (
        <>
          <Spacer />
          <Text color={theme.colors.error}>{controller.errorMessage}</Text>
        </>
      ) : null}
      <Spacer size={20} />
      <Button
        title="Entrar"
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
