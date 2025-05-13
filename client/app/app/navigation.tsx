import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
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

export default function App() {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-600)).current;

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      console.error('Permission to access location was denied', errorMsg);
      Alert.alert(
        'Location Permission',
        'Permission to access location was denied.'
      );
      return false;
    }
    return true;
  };

  const handleSearchLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        initialRegion={{
          latitude: 14.672094,
          longitude: 121.050389,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        }}
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
            title="You are here"
          />
        )}

        <Circle
          center={{
            latitude: 14.672715587849698,
            longitude: 121.04974424012727,
          }}
          radius={300} // Increased radius to 1000 meters
          strokeColor="rgba(255, 0, 0, 0.5)" // Red border with transparency
          fillColor="rgba(255, 0, 0, 0.2)" // Red fill with transparency
        />
      </MapView>

      {/* Sliding Input */}
      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Enter location"
          onSubmitEditing={(event) => console.log(event.nativeEvent.text)}
        />
      </Animated.View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButtonLeft} onPress={toggleInput}>
        <Ionicons name="search" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Search Location Button */}
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

      {/* Bottom Nav */}
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/navigation')}
        >
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
});
