import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HouseIcon, UserCircleIcon } from "phosphor-react-native";

import Home from "@/screen/public/Home";
import Profile from "@/screen/private/Profile";
import { theme } from "@/theme";
import type { MainTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryActive,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Produtos",
          tabBarIcon: ({ color, size }) => (
            <HouseIcon color={color} size={size} weight="duotone" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Conta",
          tabBarIcon: ({ color, size }) => (
            <UserCircleIcon color={color} size={size} weight="duotone" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export { MainTabs };
