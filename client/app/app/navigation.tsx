import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PolylineDecoder from 'polyline';

const DESTINATION = {
  latitude: 14.672715587849698,
  longitude: 121.04974424012727,
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyDh6wi3p0202wNefUBK_tEXjwUwhnx9yz4';

export default function App() {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-600)).current;
  const mapRef = useRef<MapView>(null);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const locationWatcher = useRef<Location.LocationSubscription | null>(null);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      Alert.alert('Location Permission', errorMsg || 'Permission denied');
      return false;
    }
    return true;
  };

  const fetchSuggestions = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&components=country:ph&key=${GOOGLE_MAPS_APIKEY}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'OK') {
        setSuggestions(json.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = async (placeId: string) => {
    setSuggestions([]);

    if (locationWatcher.current) {
      locationWatcher.current.remove();
      locationWatcher.current = null;
    }

    const geoUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_APIKEY}`;

    try {
      const geoRes = await fetch(geoUrl);
      const geoJson = await geoRes.json();
      const locationData = geoJson.result.geometry.location;

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      await getRouteDirections(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        locationData.lat,
        locationData.lng
      );
    } catch (err) {
      console.error('Place selection error:', err);
      Alert.alert('Failed to find location');
    }
  };

  const getRouteDirections = async (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=walking&key=${GOOGLE_MAPS_APIKEY}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes.length) {
        const points = PolylineDecoder.decode(
          json.routes[0].overview_polyline.points
        );
        const routeCoordinates = points.map(
          ([latitude, longitude]: number[]) => ({
            latitude,
            longitude,
          })
        );
        setRouteCoords(routeCoordinates);
      }
    } catch (err) {
      console.error('Error fetching directions', err);
    }
  };

  const followUser = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    // Stop any existing watcher
    if (locationWatcher.current) {
      locationWatcher.current.remove();
      locationWatcher.current = null;
    }

    locationWatcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc) => {
        setLocation(loc);
        mapRef.current?.animateCamera({
          center: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          },
          pitch: 0,
        });
      }
    );
  };

  const handleSearchLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    setRouteCoords([]);
    followUser();
  };

  const toggleInput = () => {
    if (inputVisible) {
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setInputVisible(false));
    } else {
      setInputVisible(true);
      Animated.timing(slideAnim, {
        toValue: 130,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRouteCoords([]);

      mapRef.current?.animateCamera({
        center: {
          latitude: DESTINATION.latitude,
          longitude: DESTINATION.longitude,
        },
        zoom: 17,
        pitch: 0,
        heading: 0,
      });
    };

    initializeMap();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You"
          />
        )}

        <Marker coordinate={DESTINATION} title="Destination" pinColor="red" />

        <Circle
          center={DESTINATION}
          radius={300}
          strokeColor="rgba(255, 0, 0, 0.5)"
          fillColor="rgba(255, 0, 0, 0.2)"
        />

        <Marker
          coordinate={{
            latitude: 14.66793258010444,
            longitude: 121.0566681907873,
          }}
          title="Police Checkpoint"
          pinColor="blue"
        />

        <Circle
          center={{
            latitude: 14.66793258010444,
            longitude: 121.0566681907873,
          }}
          radius={120} // adjust as needed
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.2)"
        />

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#DA549B"
          />
        )}
      </MapView>

      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter location"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              fetchSuggestions(text);
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText('');
                setSuggestions([]);
              }}
            >
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {suggestions.map((item) => (
          <TouchableOpacity
            key={item.place_id}
            onPress={() => {
              setSearchText(item.description);
              handlePlaceSelect(item.place_id);
            }}
            style={styles.suggestionItem}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <TouchableOpacity style={styles.searchButtonLeft} onPress={toggleInput}>
        <Ionicons name="search" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.searchLocationButton}
        onPress={handleSearchLocation}
      >
        <Ionicons name="locate" size={24} color="#fff" />
      </TouchableOpacity>

      {showGuide && (
        <View style={styles.guideLabel}>
          <View style={styles.guideItem}>
            <View
              style={[styles.colorIndicator, { backgroundColor: 'green' }]}
            />
            <Text style={styles.guideText}>Safe Zone</Text>
          </View>
          <View style={styles.guideItem}>
            <View style={[styles.colorIndicator, { backgroundColor: 'red' }]} />
            <Text style={styles.guideText}>Danger Zone</Text>
          </View>
          <View style={styles.guideItem}>
            <View
              style={[styles.colorIndicator, { backgroundColor: 'blue' }]}
            />
            <Text style={styles.guideText}>Police Zone</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.guideButton}
        onPress={() => setShowGuide(!showGuide)}
      >
        <Ionicons name="help-circle" size={32} color="#DA549B" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/home')}
        >
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/sos')}
        >
          <MaterialIcons name="sos" size={24} color="gray" />
          <Text style={styles.navText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="compass" size={24} color="#DA549B" />
          <Text style={styles.navTextActive}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/safetytips')}
        >
          <Ionicons name="bulb" size={24} color="gray" />
          <Text style={styles.navText}>Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/profile')}
        >
          <Ionicons name="person" size={24} color="gray" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchButtonLeft: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: '#DA549B',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  searchLocationButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#DA549B',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  inputContainer: {
    position: 'absolute',
    top: 30,
    left: -50,
    backgroundColor: '#DA549B',
    borderRadius: 8,
    padding: 5,
    elevation: 5,
    width: 250,
  },
  textInput: {
    flex: 1,
    color: '#000',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  guideButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    elevation: 5,
  },
  guideLabel: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  guideText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6b7280',
  },
  navTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#DA549B',
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    position: 'relative',
  },

  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 4,
    zIndex: 10,
  },
});
