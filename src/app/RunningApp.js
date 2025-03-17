import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline } from 'react-native-maps';

const RunningApp = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadCoordinates = async () => {
    try {
      const data = await AsyncStorage.getItem('coordinates');
      if (data !== null) {

        const parsedData = JSON.parse(data);
        setCoordinates(parsedData);
      } else {
        Alert.alert('Nenhuma coordenada encontrada', 'Verifique se você já armazenou algum trajeto.');
      }
    } catch (error) {
      console.error('Erro ao carregar as coordenadas do Async Storage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoordinates();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  const initialRegion = coordinates.length > 0 ? {
    latitude: coordinates[0].latitude,
    longitude: coordinates[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView style={styles.map} initialRegion={initialRegion}>
      <Polyline
        coordinates={coordinates}
        strokeColor="#0000FF"
        strokeWidth={4}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RunningApp;
