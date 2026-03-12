import Home from "@/screen/public/Home";
import RegisterProduct from "@/screen/public/RegisterProduct";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator id="MainTabs">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="RegisterProduct" component={RegisterProduct} />
    </Tab.Navigator>
  );
}

export { MainTabs };
