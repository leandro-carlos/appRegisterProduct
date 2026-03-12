import Login from "@/screen/auth/Login";
import Register from "@/screen/auth/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabs } from "./BottomTabs.navigation";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator id="auth">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export { AuthStack };
