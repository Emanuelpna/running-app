import { Tabs } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="(tracks)">
      <Tabs.Screen
        name="(tracks)"
        options={{
          title: "Meus Trajetos",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="person-running" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(analytics)"
        options={{
          title: "Meus Desempenho",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="chart-line" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
