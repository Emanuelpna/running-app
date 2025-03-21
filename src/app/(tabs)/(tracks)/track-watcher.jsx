import { Text, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function LapWatcher() {
  const { trackId } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>Observar Trajeto em tempo real</Text>
    </SafeAreaView>
  );
}
