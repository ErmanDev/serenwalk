import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../app/constants/ThemeContext';
export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = 'https://serenwalk.onrender.com';
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const image = await AsyncStorage.getItem('profileImage');
        const id = await AsyncStorage.getItem('userId');
        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (image) setProfileImage(image);
        if (id) setUserId(id);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const togglePush = () => setIsPushEnabled((prev) => !prev);

  const handlePress = (label: string) => {
    Alert.alert('${label} pressed');
  };
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('profileImage');
      await AsyncStorage.removeItem('userId');
      router.push('/app/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant camera roll permissions to change your profile picture'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setIsLoading(true);
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await fetch(
          `${API_URL}/api/users/profile-image`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              userId: userId,
              profileUrl: result.assets[0].uri,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const newProfileUrl = data.profileUrl || result.assets[0].uri;
          setProfileImage(newProfileUrl);
          await AsyncStorage.setItem('profileImage', newProfileUrl);
          Alert.alert('Success', 'Profile image updated successfully');
        } else {
          Alert.alert('Error', data.error || 'Failed to update profile image');
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        Alert.alert(
          'Error',
          'Failed to update profile image. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAvatarSource = () => {
    if (!profileImage) return require('@/assets/images/avatar.png');
    if (profileImage.endsWith('.svg')) {
      // Convert SVG URL to PNG using DiceBear's PNG endpoint
      const pngUrl = profileImage.replace('/svg?', '/png?');
      return { uri: pngUrl };
    }
    return { uri: profileImage };
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      <View style={styles.headerBackground} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerBar}>
          <Ionicons name="settings-sharp" size={24} color="#fff" />
          <Text style={styles.headerText}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage} disabled={isLoading}>
                <Image
                  source={getAvatarSource()}
                  style={[styles.avatar, isLoading && { opacity: 0.7 }]}
                />
                <View style={styles.editIconContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName || 'Loading...'}</Text>
              <Text style={styles.profileEmail}>
                {userEmail || 'Loading...'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Settings</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => handlePress('Edit Profile')}
          >
            <Text style={styles.rowText}>Edit profile</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.rowText}>Push notifications</Text>
            <Switch value={isPushEnabled} onValueChange={togglePush} />
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, isDarkMode && { color: '#fff' }]}>
              Dark mode
            </Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>More</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => handlePress('About Us')}
          >
            <Text style={styles.rowText}>About us</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => handlePress('Privacy Policy')}
          >
            <Text style={styles.rowText}>Privacy policy</Text>
            <Feather name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#e53935" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/home')}
        >
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/sos')}
        >
          <MaterialIcons name="sos" size={24} color="gray" />
          <Text style={styles.navText}>SOS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}
        onPress={() => router.push('/app/navigation')}
        >
          <Ionicons name="compass" size={24} color="gray" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/app/safetytips')}
        >
          <Ionicons name="bulb" size={24} color="gray" />
          <Text style={styles.navText}>Tips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#DA549B" />
          <Text style={styles.navTextActive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  headerBackground: {
    backgroundColor: '#DA549B',
    position: 'absolute',
    height: 230,
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: -1,
  },
  scroll: {
    paddingBottom: 100,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 48,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -15,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEE',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#DA549B',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  row: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#e53935',
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
