# appRegisterProduct

Aplicativo mobile em React Native/Expo para autenticação de usuários e cadastro, consulta, edição e remoção de produtos. Este documento descreve o estado técnico atual do projeto com foco em setup, arquitetura, fluxos e manutenção.

## Visão Geral

O app consome uma API REST para:

- registrar usuários
- autenticar sessão
- consultar perfil autenticado
- listar produtos com filtros
- visualizar detalhes de produto
- criar, editar e remover produtos do usuário autenticado

O projeto usa navegação nativa com abas, cache e sincronização de dados com React Query e persistência segura de sessão com `expo-secure-store`.

## Stack Técnica

- Expo 55
- React Native 0.83
- React 19
- TypeScript
- React Navigation
- TanStack React Query
- Axios
- React Hook Form
- Zod
- Expo Secure Store
- Reactotron em ambiente `__DEV__`

## Requisitos

- Node.js compatível com o ecossistema Expo atual
- Yarn
- Android Studio e/ou Xcode para execução nativa

## Configuração de Ambiente

O projeto depende da variável:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.3:3000
 <!-- (localhost) -->
```

Essa variável é lida em `src/config/env.ts` e usada como `baseURL` do Axios.

Observações importantes:

- o valor é normalizado para remover barra final
- o fallback atual em código é `localhost:3000`
- esse fallback não inclui protocolo e hoje deve ser tratado como limitação técnica, não como valor recomendado

## Instalação e Execução

Instale as dependências:

```bash
yarn
```

Scripts disponíveis:

```bash
yarn android
yarn ios
```

Resumo dos scripts:

- `yarn android`: executa `expo run:android`
- `yarn ios`: executa `expo run:ios`

## Estrutura do Projeto

Estrutura principal de `src/`:

```text
src/
  components/
  config/
  controllers/
  helpers/
  library/
  query/
  routes/
  screen/
  theme/
  types/
```

Responsabilidades por camada:

- `screen/`: telas e composição de UI por fluxo (`auth`, `public`, `private`)
- `controllers/`: regras de negócio, orquestração de chamadas, hooks de tela e integração com contexto global
- `query/`: cliente HTTP e configuração do React Query
- `types/`: contratos TypeScript de autenticação, navegação e produtos
- `library/`: componentes base reutilizáveis como `Button`, `Input`, `Screen`, `Text` e `Header`
- `components/`: componentes compostos de domínio, como `ProductCard`
- `theme/`: tokens visuais usados na interface
- `helpers/`: utilitários puros, como formatação de preço
- `config/`: resolução de variáveis de ambiente
