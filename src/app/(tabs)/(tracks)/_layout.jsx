import { Stack } from "expo-router";

export default function TracksLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: "Tracks",
        }}
      />
      <Stack.Screen
        name="track-watcher"
        options={{
          title: "Track Watcher",
        }}
      />
      <Stack.Screen
        name="new-track"
        options={{
          title: "New Track",
        }}
      />
      <Stack.Screen
        name="track-details"
        options={{
          title: "Track",
        }}
      />
    </Stack>
  );
}
