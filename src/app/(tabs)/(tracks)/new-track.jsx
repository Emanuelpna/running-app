import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { Track } from "../../../domain/models/Track";

import { TrackRepository } from "../../../data/repositories/TrackRepository";

const trackRepository = new TrackRepository();

export default function NewTrackForm() {
  const [location, setLocation] = useState(null);
  const [trackName, setTrackName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão para acessar a localização foi negada");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };
    getLocation();
  }, []);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do Trajeto</Text>
        <TextInput
          style={styles.input}
          value={trackName}
          onChangeText={setTrackName}
          placeholder="Digite o nome do trajeto"
        />
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      </MapView>

      <Pressable
        style={styles.startButton}
        onPress={async () => {
          if (!trackName)
            return Alert.alert(
              "Nome de Trajeto inválido",
              "É preciso informar um nome pro Trajeto antes de continuar"
            );

          const track = new Track(trackName, new Date(), []);

          await trackRepository.addTrack(track);

          router.push({
            pathname: "/(tabs)/(tracks)/track-watcher",
            params: { trackId: track.id },
          });
        }}
      >
        <FontAwesome6 name="bolt-lightning" size={20} color="#fff" />
        <Text style={styles.startButtonText}>Iniciar Trajeto</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  map: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 16,
    margin: 16,
    borderRadius: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
