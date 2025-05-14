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
  Vibration,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PolylineDecoder from 'polyline';
import Toast from 'react-native-root-toast';

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
  const [isMapTouched, setIsMapTouched] = useState(false);
  const hasAlertedZone = useRef<{ [key: string]: boolean }>({});
  const [debugInfo, setDebugInfo] = useState<string>('');

  const isInsideRadius = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radius: number
  ) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // in meters

    return d <= radius;
  };

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

        if (!isMapTouched) {
          mapRef.current?.animateCamera({
            center: {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            },
            pitch: 0,
          });
        }
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
  const handleZoneAlert = (
    zoneId: string,
    title: string,
    isInside: boolean
  ) => {
    if (isInside && !hasAlertedZone.current[zoneId]) {
      hasAlertedZone.current[zoneId] = true;
      Alert.alert('Alert', title);
      Vibration.vibrate([500, 300, 500]);
    } else if (!isInside && hasAlertedZone.current[zoneId]) {
      hasAlertedZone.current[zoneId] = false;
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      Vibration.vibrate([500, 300, 500]);

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRouteCoords([]);

      mapRef.current?.animateCamera({
        center: {
          latitude: DESTINATION.latitude,
          longitude: DESTINATION.longitude,
        },

        pitch: 0,
        heading: 0,
      });
    };
  }, [requestLocationPermission]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false}
        onPanDrag={() => setIsMapTouched(true)}
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

        {[
          {
            id: 'danger1',
            center: DESTINATION,
            radius: 300,
            title: 'You are on the danger zone area',
            color: 'red',
          },
          {
            id: 'danger2',
            center: {
              latitude: 14.667098449216025,
              longitude: 121.05860074237758,
            },
            radius: 120,
            title: 'You are on the danger zone area',
            color: 'red',
          },
          {
            id: 'danger3',
            center: {
              latitude: 7.91875575335728,
              longitude: 125.09193397771749,
            },
            radius: 150, // Or adjust based on your desired alert range
            title: 'You are on the danger zone area',
            color: 'red',
          },
          {
            id: 'police1',
            center: {
              latitude: 14.66793258010444,
              longitude: 121.0566681907873,
            },
            radius: 120,
            title: 'Police Area',
            color: 'blue',
          },
        ].map((zone) => {
          let inside = false;
          if (location) {
            const lat1 = location.coords.latitude;
            const lon1 = location.coords.longitude;
            const lat2 = zone.center.latitude;
            const lon2 = zone.center.longitude;
            const radius = zone.radius;

            const R = 6371e3;
            const φ1 = (lat1 * Math.PI) / 180;
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lon2 - lon1) * Math.PI) / 180;

            const a =
              Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            inside = distance <= radius;
          }

          return (
            <React.Fragment key={zone.id}>
              <Circle
                center={zone.center}
                radius={zone.radius}
                strokeColor={
                  zone.color === 'red'
                    ? 'rgba(255, 0, 0, 0.5)'
                    : 'rgba(0, 0, 255, 0.5)'
                }
                fillColor={
                  zone.color === 'red'
                    ? 'rgba(255, 0, 0, 0.2)'
                    : 'rgba(0, 0, 255, 0.2)'
                }
              />

              {inside && (
                <>
                  <Marker
                    coordinate={zone.center}
                    title={zone.title}
                    pinColor={zone.color}
                  />
                  {(() => {
                    if (!hasAlertedZone.current[zone.id]) {
                      hasAlertedZone.current[zone.id] = true;

                      // Toast + Vibration
                      Toast.show(zone.title, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.TOP,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                      });

                      Vibration.vibrate([500, 300, 500]);
                    }
                    return null;
                  })()}
                </>
              )}

              {!inside &&
                hasAlertedZone.current[zone.id] &&
                (() => {
                  hasAlertedZone.current[zone.id] = false;
                  return null;
                })()}
            </React.Fragment>
          );
        })}

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

      {showGuide && (
        <View style={styles.guideLabel}>
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

  debugOverlay: {
    position: 'absolute',
    bottom: 140,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },

  debugText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
