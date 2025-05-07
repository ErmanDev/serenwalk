import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../app/constants/ThemeContext';
import * as Location from 'expo-location';

interface LocationType {
  latitude: number;
  longitude: number;
}

// Sample data for safe and danger zones
const safeZones = [
  {
    id: 1,
    coordinate: { latitude: 14.5995, longitude: 120.9842 }, // Manila
    title: 'Safe Zone 1',
    description: 'Well-lit area with security cameras',
  },
  {
    id: 2,
    coordinate: { latitude: 14.5895, longitude: 120.9742 },
    title: 'Safe Zone 2',
    description: 'Police station nearby',
  },
];

const dangerZones = [
  {
    id: 1,
    coordinate: { latitude: 14.6095, longitude: 120.9942 },
    title: 'High Risk Area 1',
    description: 'Poorly lit area, reported incidents',
  },
  {
    id: 2,
    coordinate: { latitude: 14.5795, longitude: 120.9642 },
    title: 'High Risk Area 2',
    description: 'Isolated area, limited visibility',
  },
];

export default function NavigationScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const openGoogleMaps = () => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${currentLocation.latitude},${currentLocation.longitude}`;
      Linking.openURL(url);
    }
  };

  const openDirections = () => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=14.5995,120.9842&travelmode=walking`;
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      {/* Header */}
      <View style={[styles.header, isDarkMode && { backgroundColor: '#333' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && { color: '#fff' }]}>
          Map Navigation
        </Text>
        <Ionicons
          name="notifications"
          size={24}
          color={isDarkMode ? '#fff' : '#000'}
        />
      </View>

      {/* Map Container */}
      <View
        style={[styles.mapContainer, isDarkMode && { backgroundColor: '#333' }]}
      >
        {currentLocation ? (
          <View style={styles.mapPlaceholder}>
            <Text style={[styles.mapText, isDarkMode && { color: '#fff' }]}>
              Current Location:
            </Text>
            <Text style={[styles.coordinates, isDarkMode && { color: '#fff' }]}>
              {currentLocation.latitude.toFixed(4)},{' '}
              {currentLocation.longitude.toFixed(4)}
            </Text>
            <TouchableOpacity
              style={styles.openMapsButton}
              onPress={openGoogleMaps}
            >
              <Text style={styles.openMapsText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, isDarkMode && { color: '#fff' }]}>
              {errorMsg || 'Loading location...'}
            </Text>
          </View>
        )}
      </View>

      {/* Legend */}
      <View style={[styles.legend, isDarkMode && { backgroundColor: '#333' }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={[styles.legendText, isDarkMode && { color: '#fff' }]}>
            Safe Route
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#DA549B' }]} />
          <Text style={[styles.legendText, isDarkMode && { color: '#fff' }]}>
            High Risk Area
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
          <Text style={[styles.legendText, isDarkMode && { color: '#fff' }]}>
            Current Location
          </Text>
        </View>
      </View>

      {/* Navigation Controls */}
      <View
        style={[styles.controls, isDarkMode && { backgroundColor: '#333' }]}
      >
        <TouchableOpacity style={styles.controlButton} onPress={openGoogleMaps}>
          <Ionicons name="locate" size={24} color="#DA549B" />
          <Text style={[styles.controlText, isDarkMode && { color: '#fff' }]}>
            My Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={openDirections}>
          <MaterialIcons name="directions" size={24} color="#DA549B" />
          <Text style={[styles.controlText, isDarkMode && { color: '#fff' }]}>
            Directions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="layers" size={24} color="#DA549B" />
          <Text style={[styles.controlText, isDarkMode && { color: '#fff' }]}>
            Layers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View
        style={[styles.bottomNav, isDarkMode && { backgroundColor: '#333' }]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/home')}
        >
          <Ionicons
            name="home"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/sos')}
        >
          <MaterialIcons
            name="sos"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
            SOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="compass"
            size={24}
            color={isDarkMode ? '#DA549B' : '#DA549B'}
          />
          <Text
            style={[styles.navTextActive, isDarkMode && { color: '#DA549B' }]}
          >
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/safetytips')}
        >
          <Ionicons
            name="bulb"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
            Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/profile')}
        >
          <Ionicons
            name="person"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  openMapsButton: {
    backgroundColor: '#DA549B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  openMapsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#000',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    marginTop: 4,
    fontSize: 12,
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
  navTextActive: {
    marginTop: 4,
    fontSize: 12,
    color: '#DA549B',
  },
});
