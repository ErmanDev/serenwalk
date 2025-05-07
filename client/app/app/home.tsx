import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/app/app/constants/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const image = await AsyncStorage.getItem('profileImage');
        if (name) {
          const firstName = name.split(' ')[0];
          setUserName(firstName);
        }
        if (image) setProfileImage(image);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const getAvatarSource = () => {
    if (!profileImage) return require('@/assets/images/avatar.png');
    if (profileImage.endsWith('.svg')) {
      const pngUrl = profileImage.replace('/svg?', '/png?');
      return { uri: pngUrl };
    }
    return { uri: profileImage };
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      Alert.alert('Logged out', 'You have been logged out successfully.');
      router.push('/app/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, isDarkMode && { backgroundColor: '#000' }]}
    >
      <View
        style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View
            style={[styles.header, isDarkMode && { backgroundColor: '#333' }]}
          >
            <View style={styles.headerRow}>
              <View style={styles.userInfo}>
                <Image source={getAvatarSource()} style={styles.avatar} />
                <View>
                  <Text
                    style={[styles.greeting, isDarkMode && { color: '#fff' }]}
                  >
                    Hey there 👋,
                  </Text>
                  <Text style={[styles.name, isDarkMode && { color: '#fff' }]}>
                    {userName || 'User'}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="notifications"
                size={24}
                color={isDarkMode ? '#fff' : '#000'}
              />
            </View>
            <View
              style={[
                styles.headerCurve,
                isDarkMode && { backgroundColor: '#000' },
              ]}
            ></View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.actionButtons}>
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => router.push('/app/fakecall')}
                >
                  <Image
                    source={require('@/assets/images/fakecall.png')}
                    style={styles.imageIcon}
                  />
                  <Text style={styles.cardText}>Emergency Call</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => router.push('/app/navigation')}
                >
                  <Image
                    source={require('@/assets/images/maps.png')}
                    style={styles.imageIcon}
                  />
                  <Text style={styles.cardText}>Map Navigation</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.journeyCard}>
              <Image
                source={require('@/assets/images/girl.png')}
                style={styles.journeyImage}
              />
              <View style={styles.journeyTextContainer}>
                <Text style={styles.journeyTitle}>Start a journey</Text>
                <Text style={styles.journeySub}>
                  Enter your destination and the app will navigate you on the
                  most safe route.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#374151" />
            </View>

            {/* Nearby Services */}
            <View style={styles.services}>
              {[
                {
                  label: 'Police station near me',
                  icon: (
                    <MaterialIcons
                      name="local-police"
                      size={24}
                      color="#DA549B"
                    />
                  ),
                },
                {
                  label: 'Hospital near me',
                  icon: (
                    <FontAwesome5 name="hospital" size={20} color="#DA549B" />
                  ),
                },
                {
                  label: 'Barangay near me',
                  icon: (
                    <MaterialIcons
                      name="location-city"
                      size={24}
                      color="#DA549B"
                    />
                  ),
                },
              ].map((service, index) => (
                <TouchableOpacity key={index} style={styles.serviceItem}>
                  <View style={styles.serviceLeft}>
                    {service.icon}
                    <Text style={styles.serviceText}>{service.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="gray" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            isDarkMode && { backgroundColor: '#333' },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, isDarkMode && { color: '#fff' }]}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* Bottom Nav */}
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
              color={isDarkMode ? '#fff' : '#DA549B'}
            />
            <Text
              style={[styles.navTextActive, isDarkMode && { color: '#fff' }]}
            >
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
              color={isDarkMode ? '#fff' : 'gray'}
            />
            <Text style={[styles.navText, isDarkMode && { color: '#fff' }]}>
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
              color={isDarkMode ? '#fff' : 'gray'}
            />
            <Text style={[styles.navText, isDarkMode && { color: '#fff' }]}>
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
              color={isDarkMode ? '#fff' : 'gray'}
            />
            <Text style={[styles.navText, isDarkMode && { color: '#fff' }]}>
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
              color={isDarkMode ? '#fff' : 'gray'}
            />
            <Text style={[styles.navText, isDarkMode && { color: '#fff' }]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    height: 150,
    backgroundColor: '#d63384',
    paddingBottom: 0,
  },
  headerCurve: {
    backgroundColor: 'white',
    height: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    zIndex: 0,
  },
  headerRow: {
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 10,
  },
  greeting: {
    color: '#fff',
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mainContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(218, 84, 155, 0.24)',
    padding: 20,
    width: '45%',
    height: 130,
    alignItems: 'center',
    elevation: 10,
  },
  card: {
    alignItems: 'center',
  },
  imageIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  cardText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  journeyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f3c2d9',
    borderRadius: 30,
    padding: 16,
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  journeyImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain',
  },

  journeyTextContainer: {
    flex: 1,
  },

  journeyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937', // dark text
    marginBottom: 4,
  },

  journeySub: {
    fontSize: 13,
    color: '#6b7280', // gray text
  },

  services: {
    paddingBottom: 24,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(218, 84, 155, 0.24)',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
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
  logoutButton: {
    backgroundColor: '#DA549B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
