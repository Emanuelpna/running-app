import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";

import { Coordinate } from "../../../domain/models/Coordinate";

import { TrackRepository } from "../../../data/repositories/TrackRepository";
import { CoordinatesRepository } from "../../../data/repositories/CoordinatesRepository";

import { useWatchPosition } from "../../../infra/hooks/useWatchPosition";

const trackRepository = new TrackRepository();
const coordinatesRepository = new CoordinatesRepository();

export default function TrackWatcher() {
  const { trackId } = useLocalSearchParams();
  const router = useRouter();

  const [initialLocation, setInitialLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [track, setTrack] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    async function setUpTracking() {
      if (!trackId) {
        Alert.alert("Erro", "Trajeto não existe");
        return;
      }

      const currentTrack = await trackRepository.getById(trackId);

      setTrack(currentTrack);

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
        });

        setInitialLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("Erro ao obter localização atual:", error);
        Alert.alert("Erro", "Não foi possível obter sua localização atual");
      }
    }

    setUpTracking();
  }, []);

  const { startWatching, stopWatching } = useWatchPosition(
    null,
    async (location) => {
      try {
        const currentTrack = await trackRepository.getById(trackId);

        const newCoord = new Coordinate(
          currentTrack.id,
          location.coords.latitude,
          location.coords.longitude
        );

        await coordinatesRepository.addCoordinate(newCoord);
        await trackRepository.addCoordinate(currentTrack, newCoord);

        setCoordinates((prevCoords) => [...prevCoords, newCoord]);

        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0121,
            },
            500
          );
        }

        console.log("Nova coordenada registrada:", newCoord);
      } catch (error) {
        console.error("Erro ao atualizar coordenadas:", error);
      }
    }
  );

  const handleStartTracking = async () => {
    setIsTracking(true);
    await startWatching();
  };

  const handleStopTracking = async () => {
    await stopWatching();
    setIsTracking(false);
    Alert.alert(
      "Rastreamento Finalizado",
      "O rastreamento foi finalizado com sucesso!",
      [
        {
          text: "Ver Lista de Trajetos",
          onPress: () => router.push("/(tabs)/(tracks)"),
        },
      ]
    );
  };

  if (track === null && initialLocation === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e1eb1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{track?.name}</Text>
        {isTracking && (
          <View style={styles.trackingIndicator}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>Rastreando...</Text>
          </View>
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialLocation}
        showsUserLocation={true}
        followsUserLocation={isTracking}
      >
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#e01d47"
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <Button
            title="Iniciar Rastreamento"
            onPress={handleStartTracking}
            color="#25b329"
          />
        ) : (
          <Button
            title="Finalizar Rastreamento"
            onPress={handleStopTracking}
            color="#ce2216"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trackingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 5,
  },
  trackingText: {
    color: "red",
    fontWeight: "bold",
  },
});
