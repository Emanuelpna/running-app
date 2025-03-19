import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="(home)/index">
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(coords)/index"
        options={{
          lazy: true,
          title: "Coordinates",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="map-marker" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
