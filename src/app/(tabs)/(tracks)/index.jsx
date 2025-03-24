import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

import { TrackRepository } from "../../../data/repositories/TrackRepository";

const trackRepository = new TrackRepository();

const TrackItem = ({ track, onPress }) => {
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

  // Calcular duração do percurso (em minutos)
  const calculateDuration = (coordinates) => {
    if (!coordinates || coordinates.length < 2) return 0;

    // Assumindo que as coordenadas têm um timestamp ou calculando aproximadamente
    const duration = 0;
    return duration > 60
      ? `${Math.floor(duration / 60)}h ${duration % 60}min`
      : `${duration}min`;
  };

  const distance = calculateDistance(track.coordinates);

  return (
    <TouchableOpacity style={styles.trackItem} onPress={() => onPress(track)}>
      <View style={styles.trackIcon}>
        <FontAwesome5 name="route" size={24} color="#1e1eb1" />
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{track.name}</Text>
        <Text style={styles.trackDate}>{formatDate(track.date)}</Text>
        <View style={styles.trackStats}>
          <View style={styles.statItem}>
            <FontAwesome5 name="ruler" size={14} color="#666" />
            <Text style={styles.statText}>{distance} km</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="map-pin" size={14} color="#666" />
            <Text style={styles.statText}>
              {track.coordinates?.length || 0} pontos
            </Text>
          </View>
        </View>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
  );
};

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <FontAwesome5 name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default function TrackList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const allTracks = await trackRepository.getAll();

      // Filtrar para garantir que apenas trajetos válidos sejam exibidos
      const validTracks = allTracks.filter(
        (track) => !!track.id && Array.isArray(track.coordinates)
      );

      // Ordenar por data (mais recente primeiro)
      validTracks.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTracks(validTracks);
    } catch (error) {
      console.error("Erro ao carregar trajetos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPress = (track) => {
    // Navegar para a tela de detalhes do trajeto
    router.push({
      pathname: "/(tabs)/(tracks)/track-details",
      params: { trackId: track.id },
    });
  };

  const handleAddNewTrack = () => {
    router.push("/(tabs)/(tracks)/new-track");
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="route" size={60} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhum trajeto encontrado</Text>
      <Text style={styles.emptyMessage}>
        Toque no botão "+" para iniciar um novo trajeto.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Trajetos</Text>
        <Pressable style={styles.refreshButton} onPress={loadTracks}>
          <FontAwesome5 name="sync" size={18} color="#1e1eb1" />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e1eb1" />
          <Text style={styles.loadingText}>Carregando trajetos...</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrackItem track={item} onPress={handleTrackPress} />
          )}
          contentContainerStyle={
            tracks.length === 0 ? { flex: 1 } : styles.list
          }
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FloatingButton onPress={handleAddNewTrack} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1eb1",
  },
  refreshButton: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  trackIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  trackDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  trackStats: {
    flexDirection: "row",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1e1eb1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
