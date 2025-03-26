import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Polyline, Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";

import { TrackRepository } from "../../../data/repositories/TrackRepository";

const trackRepository = new TrackRepository();

export default function TrackDetails() {
  const { trackId } = useLocalSearchParams();
  const router = useRouter();

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    loadTrackDetails();
  }, [trackId]);

  const loadTrackDetails = async () => {
    try {
      setLoading(true);

      // Buscar o trajeto específico pelo ID
      const selectedTrack = await trackRepository.getById(trackId);

      if (!selectedTrack) {
        Alert.alert(
          "Trajeto não encontrado",
          "Não foi possível carregar os detalhes do trajeto.",
          [{ text: "Voltar", onPress: () => router.back() }]
        );
        return;
      }

      setTrack(selectedTrack);

      // Definir região do mapa com base na primeira coordenada
      if (selectedTrack.coordinates && selectedTrack.coordinates.length > 0) {
        const firstCoord = selectedTrack.coordinates[0];
        setMapRegion({
          latitude: firstCoord.latitude,
          longitude: firstCoord.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do trajeto:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do trajeto.", [
        { text: "Voltar", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular distância total do percurso (em km)
  const calculateDistance = (coordinates) => {
    if (!coordinates || coordinates.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      totalDistance += getDistanceFromLatLonInKm(
        start.latitude,
        start.longitude,
        end.latitude,
        end.longitude
      );
    }

    return totalDistance.toFixed(2);
  };

  // Fórmula de Haversine para calcular distância entre coordenadas
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Formatar data para exibição
  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Compartilhar detalhes do trajeto
  const shareTrackDetails = async () => {
    try {
      const distance = calculateDistance(track.coordinates);
      const shareMessage =
        `Meu trajeto de ${track.name} em ${formatDate(track.date)}:\n` +
        `📍 Distância: ${distance} km\n` +
        `📅 Data: ${formatDate(track.date)}\n` +
        `📍 Número de pontos: ${track.coordinates.length}`;

      await Share.share({
        message: shareMessage,
        title: `Detalhes do Trajeto - ${track.name}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  // Renderizar tela de carregamento
  if (loading || !track) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Carregando detalhes do trajeto...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#1e1eb1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{track.name}</Text>
        <TouchableOpacity
          onPress={shareTrackDetails}
          style={styles.shareButton}
        >
          <FontAwesome5 name="share" size={20} color="#1e1eb1" />
        </TouchableOpacity>
      </View>

      {mapRegion && (
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          showsUserLocation={false}
        >
          {track.coordinates && track.coordinates.length > 0 && (
            <>
              <Polyline
                coordinates={track.coordinates}
                strokeColor="#FF0000"
                strokeWidth={4}
              />
              <Marker
                coordinate={track.coordinates[0]}
                title="Início"
                pinColor="green"
              />
              <Marker
                coordinate={track.coordinates[track.coordinates.length - 1]}
                title="Fim"
                pinColor="red"
              />
            </>
          )}
        </MapView>
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="ruler" size={20} color="#1e1eb1" />
            <Text style={styles.statLabel}>
              Distância: {calculateDistance(track.coordinates)} km
            </Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="map-pin" size={20} color="#1e1eb1" />
            <Text style={styles.statLabel}>
              Pontos: {track.coordinates.length}
            </Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="calendar" size={20} color="#1e1eb1" />
            <Text style={styles.statLabel}>Data: {formatDate(track.date)}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e1eb1",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  map: {
    height: "50%",
    width: "100%",
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});
