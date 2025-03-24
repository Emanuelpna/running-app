import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, SafeAreaView, View, Button, Alert, ActivityIndicator, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";

import { Track } from "../../../domain/models/Track";
import { Coordinate } from "../../../domain/models/Coordinate";

import { TrackRepository } from "../../../data/repositories/TrackRepository";
import { CoordinatesRepository } from "../../../data/repositories/CoordinatesRepository";

import { useWatchPosition } from "../../../infra/hooks/useWatchPosition";

const trackRepository = new TrackRepository();
const coordinatesRepository = new CoordinatesRepository();

export default function TrackWatcher() {
  const { trackId } = useLocalSearchParams();
  const router = useRouter();

  const [initialLocation, setInitialLocation] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [coordinates, setCoordinates] = useState([])
  const [track, setTrack] = useState(null)

  const mapRef = useRef(null)

  useEffect(() => {
    async function setUpTracking() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permissão para acessar a localização foi negada")
        return;
      }

      await Location.requestBackgroundPermissionsAsync()

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
    async () => {
      try {  
        let currentTrack;
        
        if (trackId) {
          currentTrack = await trackRepository.getById(trackId);
          if (!currentTrack) {
            // Se o trackId não existir, criar um novo
            currentTrack = new Track(`Trajeto ${new Date().toISOString()}`, new Date(), []);
            await trackRepository.addTrack(currentTrack);
          }
        } else {
          currentTrack = new Track(`Trajeto ${new Date().toISOString()}`, new Date(), []);
          await trackRepository.addTrack(currentTrack);
        }
        
        setTrack(currentTrack);
        setCoordinates(currentTrack.coordinates || []);
        
        console.log("Rastreamento iniciado para trajeto:", currentTrack.id);
      } catch (error) {
        console.error("Erro ao iniciar rastreamento:", error);
        Alert.alert("Erro", "Não foi possível iniciar o rastreamento");
      }
    },
    async (location) => {
      try {
        if (!track) return;
        const newCoord = new Coordinate(
          track.id,
          location.coords.latitude,
          location.coords.longitude
        );

        await coordinatesRepository.addCoordinate(newCoord);
        await trackRepository.addCoordinate(track, newCoord);

        setCoordinates(prevCoords => [...prevCoords, newCoord]);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          }, 500);
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
          onPress: () => router.push("/(tabs)/(tracks)") 
        }
      ]
    );
  };

  if (initialLocation === null) {
    return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e1eb1" />
          </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rastreamento em Tempo Real</Text>
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
            strokeColor="#FF0000"
            strokeWidth={4}
          />
        )}
      </MapView>
      
      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <Button 
            title="Iniciar Rastreamento" 
            onPress={handleStartTracking} 
            color="#4CAF50"
          />
        ) : (
          <Button 
            title="Finalizar Rastreamento" 
            onPress={handleStopTracking} 
            color="#F44336"
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
  }
});