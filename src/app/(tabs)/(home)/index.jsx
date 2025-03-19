import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";

import * as Location from "expo-location";

import { Lap } from "../../../domain/models/Lap";
import { Track } from "../../../domain/models/Track";
import { Coordinate } from "../../../domain/models/Coordinate";

import { LapRepository } from "../../../data/repositories/LapRepository";
import { TrackRepository } from "../../../data/repositories/TrackRepository";
import { CoordinatesRepository } from "../../../data/repositories/CoordinatesRepository";

import { useWatchPosition } from "../../../infra/hooks/useWatchPosition";
import { Button } from "react-native";

const lapRepository = new LapRepository();
const trackRepository = new TrackRepository();
const coordinatesRepository = new CoordinatesRepository();

export default function Index() {
  const [location, setLocation] = useState({
    latitude: -21.7608521,
    longitude: -43.3506258,
    latitudeDelta: 0.0062,
    longitudeDelta: 0.0062,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
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
        console.error(error);
      }
    }

    getCurrentLocation();

    (async () => {
      const laps = await lapRepository.getAll();

      const validLaps = laps.filter(
        (lap) => !!lap.id && lap.coordinates.length > 0
      );

      setLaps(validLaps);
    })();
  }, []);

  const { startWatching, stopWatching } = useWatchPosition(
    async () => {
      console.log("start");
      try {
        const newTrack = new Track("Percurso 001", []);

        await trackRepository.addTrack(newTrack);

        const lap = new Lap(newTrack.id, new Date(), []);

        await lapRepository.addLap(lap);
      } catch (error) {
        console.error(error);
      }
    },
    async (location) => {
      console.log("location update");

      try {
        const track = await trackRepository.getByName("Percurso 001");

        if (!track) return;

        const laps = await lapRepository.getAllByTrackId(track.id);

        const lastLap = laps.at(-1);

        const coords = new Coordinate(
          lastLap.id,
          location.coords.latitude,
          location.coords.longitude
        );

        await coordinatesRepository.addCoordinate(coords);
        await lapRepository.addCoordinatesToLap(lastLap.id, coords);
      } catch (error) {
        console.error(error);
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
      <Button title="Começar" onPress={startWatching} />
      <Button title="Parar" onPress={stopWatching} />
      <MapView style={styles.map} initialRegion={location}>
        {laps.map((lap) => (
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
