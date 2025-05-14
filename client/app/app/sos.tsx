import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useTheme } from '../app/constants/ThemeContext';
import * as Location from 'expo-location';

const MAX_VOLUME = 1.0;

export default function SosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  const playSosSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/audio/sos.mp3'),
      { shouldPlay: true, volume: 0.1, isLooping: true }
    );
    soundRef.current = sound;
    setIsSoundPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        if (!status.isPlaying && status.didJustFinish) {
          setIsSoundPlaying(false);
        }
      } else {
        console.warn('Playback status not loaded:', status);
      }
    });

    let currentVolume = 0.1;
    const volumeInterval = setInterval(async () => {
      if (currentVolume < MAX_VOLUME) {
        currentVolume = Math.min(currentVolume + 0.1, MAX_VOLUME);
        await sound.setVolumeAsync(currentVolume);
      } else {
        clearInterval(volumeInterval);
      }
    }, 500);
  };

  const stopSosSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setIsSoundPlaying(false);
    }
  };

  const handleSosPress = () => {
    if (isSoundPlaying) {
      stopSosSound();
      return;
    }

    if (isCounting) return;

    setIsCounting(true);
    let timeLeft = 3;
    setCountdown(timeLeft);

    const interval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft === 0) {
        clearInterval(interval);
        setCountdown(null);
        playSosSound();
        setIsCounting(false);
      } else {
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  const fetchCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (reverseGeocode.length > 0) {
      const { city, region, subregion, name } = reverseGeocode[0];
      setCurrentLocation(`Purok-${name}, ${city}, ${subregion}, ${region}`);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      <View style={[styles.navbar, isDarkMode && { backgroundColor: '#333' }]}>
        <View style={styles.locationLeft}>
          <Ionicons
            name="location"
            size={18}
            color={isDarkMode ? '#fff' : '#000'}
          />
          <View style={styles.locationTextWrapper}>
            <Text
              style={[styles.locationLabel, isDarkMode && { color: '#ccc' }]}
            >
              Current location
            </Text>
            <Text
              style={[styles.locationName, isDarkMode && { color: '#fff' }]}
            >
              {currentLocation || 'Fetching location...'}
            </Text>
          </View>
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={isDarkMode ? '#fff' : '#000'}
        />
      </View>

      <View style={styles.emergencyRow}>
        <View style={styles.textSection}>
          <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
            Are you in an emergency?
          </Text>
          <Text style={[styles.subtitle, isDarkMode && { color: '#ccc' }]}>
            Press the SOS button, it will make a very loud sound, and will
            automatically turn on the flashlight in blinking mode.
          </Text>
        </View>
        <Image
          source={require('@/assets/images/emergency_illustration.png')}
          style={styles.illustration}
        />
      </View>

      <View style={styles.sosContainer}>
        <View
          style={[styles.sosBox, isDarkMode && { backgroundColor: '#333' }]}
        >
          <TouchableOpacity
            style={[
              styles.sosButton,
              isDarkMode && { backgroundColor: '#555' },
            ]}
            onPress={handleSosPress}
          >
            {isSoundPlaying ? (
              <Text style={[styles.sosText, isDarkMode && { color: '#fff' }]}>
                Stop
              </Text>
            ) : countdown !== null ? (
              <Text style={[styles.sosText, isDarkMode && { color: '#fff' }]}>
                {countdown}
              </Text>
            ) : (
              <>
                <Text style={[styles.sosText, isDarkMode && { color: '#fff' }]}>
                  SOS
                </Text>
                <Text
                  style={[styles.sosSubtext, isDarkMode && { color: '#ccc' }]}
                >
                  Press for 3 seconds
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
            color={isDarkMode ? '#DA549B' : '#DA549B'}
          />
          <Text
            style={[styles.navTextActive, isDarkMode && { color: '#DA549B' }]}
          >
            SOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/navigation')}
        >
          <Ionicons
            name="compass"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextWrapper: {
    marginLeft: 6,
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 13,
    color: '#444',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
    marginHorizontal: 20,
  },
  textSection: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  illustration: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  sosContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  sosBox: {
    width: 350,
    height: 260,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#DA549B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  sosText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  sosSubtext: {
    fontSize: 12,
    color: '#fff',
    marginTop: 6,
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
