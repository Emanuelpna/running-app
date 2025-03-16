import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import MapView, { Polyline } from "react-native-maps";

import * as Location from "expo-location";

import store from "../../../storage/storage";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.requestBackgroundPermissionsAsync();

      const location = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
    }

    getCurrentLocation();
  }, []);

  if (location === null) return null;

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} initialRegion={location}>
        <Polyline
          coordinates={[
            { latitude: -21.7608521, longitude: -43.3506258 },
            { latitude: -21.7639058, longitude: -43.3499989 },
          ]}
          strokeColor="#000"
          strokeWidth={6}
        />
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
});
