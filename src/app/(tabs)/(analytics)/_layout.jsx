import { Stack } from "expo-router";

export default function AnalyticsLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Meu Desempenho",
        }}
      />
    </Stack>
  );
}
