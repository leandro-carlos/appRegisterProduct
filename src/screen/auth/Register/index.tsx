import { Button, Input, Screen, Spacer, Text } from "@/library";
import useRegisterController from "@/controllers/useRegister";
import { theme } from "@/theme";

export default function Register() {
  const controller = useRegisterController();

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
      <Input
        label="Nome de usuario"
        value={controller.form.username}
        onChangeText={(value) => controller.setField("username", value)}
        placeholder="Seu nome de usuario"
        autoCapitalize="words"
      />
      <Spacer />
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
        placeholder="Crie uma senha"
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
        title="Cadastrar"
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
