import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  Button,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { TrackRepository } from "../../../data/repositories/TrackRepository";
import { CoordinatesRepository } from "../../../data/repositories/CoordinatesRepository";
import { LapRepository } from "../../../data/repositories/LapRepository";

const lapRepository = new LapRepository();
// const trackRepository = new TrackRepository();
const coordinatesRepository = new CoordinatesRepository();

const RunningApp = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    coordinatesRepository
      .getAll()
      .then((response) => {
        // console.log({ response });
        setCoordinates(response);
      })
      .finally(() => {
        setLoading(false);
      });

    // trackRepository
    //   .getAll()
    //   .then((response) => {
    //     console.log({ laps: response?.[0]?.laps });
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });

    lapRepository
      .getAll()
      .then((response) => {
        // console.log({ laps: JSON.stringify(response, null, 4) });
        // setCoordinates(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(JSON.stringify(coordinates, null, 4));
  };

  if (!coordinates || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.map}>
      <Button title="Copiar Coordenadas" onPress={copyToClipboard} />
      <ScrollView>
        <Text>{JSON.stringify(coordinates, null, 4)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RunningApp;
