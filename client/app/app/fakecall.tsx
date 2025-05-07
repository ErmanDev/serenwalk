import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../app/constants/ThemeContext';

export default function FakeCallScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Start call timer
    const timer = setInterval(() => {
      if (isCallActive) {
        setCallDuration((prev) => prev + 1);
      }
    }, 1000);

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/avatar.png')}
            style={styles.avatar}
          />
        </Animated.View>

        <Text style={[styles.callerName, isDarkMode && { color: '#fff' }]}>
          911
        </Text>
        <Text style={[styles.callStatus, isDarkMode && { color: '#ccc' }]}>
          {isCallActive ? 'Calling...' : 'Call ended'}
        </Text>
        <Text style={[styles.callDuration, isDarkMode && { color: '#ccc' }]}>
          {formatTime(callDuration)}
        </Text>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  callStatus: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  callDuration: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
    transform: [{ rotate: '135deg' }],
  },
});
