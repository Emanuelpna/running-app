import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="(home)/index">
      <Tabs.Screen
        name="(home)/index"
        options={{
          lazy: true,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(tracks)"
        options={{
          lazy: true,
          title: "Tracks",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="person-running" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
