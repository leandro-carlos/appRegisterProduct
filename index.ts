import { registerRootComponent } from "expo";

import App from "./App";

if (__DEV__) {
  try {
    require("./ReactotronConfig");
  } catch (error) {
    console.warn("Reactotron desabilitado no ambiente atual.", error);
  }
}

registerRootComponent(App);
