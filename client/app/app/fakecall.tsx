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
import { Audio } from 'expo-av';

export default function FakeCallScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isRinging, setIsRinging] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const ringAnim = new Animated.Value(0);
  const [ringtoneSound, setRingtoneSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    // Start ringing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Play ringtone
    const playRingtone = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/iphone.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        setRingtoneSound(sound);
        await sound.playAsync();

        // After 4 seconds, stop ringing and show timer
        const timeout = setTimeout(async () => {
          if (isCallActive) {
            if (sound) {
              await sound.stopAsync();
              await sound.unloadAsync();
              setRingtoneSound(null);
            }
            setIsRinging(false);
            setShowTimer(true);
          }
        }, 4000);

        // Stop sound immediately if call is in progress
        if (!isRinging && isCallActive && sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setRingtoneSound(null);
        }

        // Cleanup timeout if the component unmounts or call ends early
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Error playing ringtone:', error);
      }
    };

    playRingtone();

    const timer = setInterval(() => {
      if (isCallActive && showTimer) {
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

    // Cleanup function
    return () => {
      clearInterval(timer);
      if (ringtoneSound) {
        ringtoneSound.stopAsync();
        ringtoneSound.unloadAsync();
      }
    };
  }, [isCallActive, showTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    if (ringtoneSound) {
      await ringtoneSound.stopAsync();
      await ringtoneSound.unloadAsync();
    }
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
              transform: [
                { scale: pulseAnim },
                {
                  translateX: isRinging
                    ? ringAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-5, 5],
                      })
                    : 0,
                },
              ],
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
          {isRinging
            ? 'Ringing...'
            : isCallActive
            ? 'Call in progress'
            : 'Call ended'}
        </Text>
        {showTimer && (
          <Text style={[styles.callDuration, isDarkMode && { color: '#ccc' }]}>
            {formatTime(callDuration)}
          </Text>
        )}

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
    borderWidth: 2,
    borderColor: '#DA549B',
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
    color: '#DA549B',
  },
  callStatus: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 8,
  },
  callDuration: {
    fontSize: 16,
    color: '#374151',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  endCallButton: {
    backgroundColor: '#DA549B',
    transform: [{ rotate: '135deg' }],
  },
});
