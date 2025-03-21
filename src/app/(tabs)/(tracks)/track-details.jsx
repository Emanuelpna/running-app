import { Text, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function TrackDetails() {
  const { trackId } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>Detalhes de um Trajeto</Text>
    </SafeAreaView>
  );
}
