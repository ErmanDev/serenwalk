import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      />

      {/* Floating Guide Label */}
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
    height: '100%', // Adjusted map size to accommodate navigation
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
