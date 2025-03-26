import { Stack } from "expo-router";

export default function TracksLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Meus Trajetos",
        }}
      />
      <Stack.Screen
        name="track-watcher"
        options={{
          title: "Rastreamento em Tempo Real",
        }}
      />
      <Stack.Screen
        name="new-track"
        options={{
          title: "Novo Trajeto",
        }}
      />
      <Stack.Screen
        name="track-details"
        options={{
          title: "Detalhes de um Trajeto",
        }}
      />
    </Stack>
  );
}
