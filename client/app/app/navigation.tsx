import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../app/constants/ThemeContext';

export default function NavigationScreen() {
  const { isDarkMode } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [destination, setDestination] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSearch = async () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    try {
      Alert.alert('Navigation', `Starting navigation to ${destination}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to start navigation');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      <View style={[styles.header, isDarkMode && { backgroundColor: '#333' }]}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              isDarkMode && { backgroundColor: '#333', color: '#fff' },
            ]}
            placeholder="Enter destination"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            value={destination}
            onChangeText={setDestination}
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              isDarkMode && { backgroundColor: '#444' },
            ]}
            onPress={handleSearch}
          >
            <Ionicons
              name="search"
              size={24}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.headerCurve,
            isDarkMode && { backgroundColor: '#000' },
          ]}
        ></View>
      </View>

      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
          showsTraffic={true}
          showsBuildings={true}
          showsIndoors={true}
          showsPointsOfInterest={true}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          >
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-up" size={24} color="#DA549B" />
            </View>
          </Marker>
        </MapView>
      )}

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    backgroundColor: '#DA549B',
    paddingBottom: 0,
  },
  headerCurve: {
    backgroundColor: '#fff',
    height: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    zIndex: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(218, 84, 155, 0.24)',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(218, 84, 155, 0.24)',
  },
  map: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: -40, // Adjust for iOS header curve
      },
      android: {
        marginTop: -40, // Adjust for Android header curve
      },
    }),
  },
  errorContainer: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 8,
    zIndex: 1,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(218, 84, 155, 0.24)',
  },
});
