import * as React from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UserIcon,
} from "react-native-heroicons/outline";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import CustomAnimatedTabBar from "./components/CustomBottomTab";
import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Screen4 from "./screens/Screen4";

const Tab = createBottomTabNavigator();
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomAnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="page1"
          component={Screen1}
          options={{
            tabBarIcon: HomeIcon,
          }}
        />
        <Tab.Screen
          name="page2"
          component={Screen2}
          options={{
            tabBarIcon: ShoppingCartIcon,
          }}
        />
        <Tab.Screen
          name="page3"
          component={Screen3}
          options={{
            tabBarIcon: Squares2X2Icon,
          }}
        />
        <Tab.Screen
          name="page4"
          component={Screen4}
          options={{
            tabBarIcon: UserIcon,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
