import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Pressable,
  Text,
  Button,
  Alert,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { Link } from "expo-router";

import * as Location from "expo-location";

import { Track } from "../../../domain/models/Track";
import { Coordinate } from "../../../domain/models/Coordinate";

import { TrackRepository } from "../../../data/repositories/TrackRepository";
import { CoordinatesRepository } from "../../../data/repositories/CoordinatesRepository";

import { useWatchPosition } from "../../../infra/hooks/useWatchPosition";

const trackRepository = new TrackRepository();
const coordinatesRepository = new CoordinatesRepository();

export default function Index() {
  const [tracks, setTracks] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      await Location.requestBackgroundPermissionsAsync();

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.LocationAccuracy.Balanced,
        });

        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error("getCurrentPositionAsync :>> ", error);
      }
    }

    getCurrentLocation();

    (async () => {
      const tracks = await trackRepository.getAll();

      const validTracks = tracks.filter(
        (track) => !!track.id && track.coordinates.length > 0
      );

      setTracks(validTracks);
    })();
  }, []);

  const { startWatching, stopWatching } = useWatchPosition(
    async () => {
      console.log("start");
      try {
        const newTrack = new Track("Percurso 001", new Date(), []);

        await trackRepository.addTrack(newTrack);
      } catch (error) {
        console.error("useWatchPosition.start :>> ", error);
      }
    },
    async (location) => {
      console.log("location update");

      try {
        const track = await trackRepository.getByName("Percurso 001");

        if (!track) return;

        const coords = new Coordinate(
          track.id,
          location.coords.latitude,
          location.coords.longitude
        );

        await coordinatesRepository.addCoordinate(coords);
        await trackRepository.addCoordinate(track, coords);
      } catch (error) {
        console.error("useWatchPosition.locationUpdate :>> ", error);
      }
    }
  );

  if (location === null)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e1eb1" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Link href="/new-track" asChild>
        <Pressable>
          <Text>Novo Trajeto</Text>
        </Pressable>
      </Link>

      <Button title="Começar" onPress={startWatching} />
      <Button title="Parar" onPress={stopWatching} />
      <MapView style={styles.map} initialRegion={location}>
        {tracks.map((lap) => (
          <Polyline
            key={lap.id}
            coordinates={lap.coordinates}
            strokeColor="#000"
            strokeWidth={6}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
