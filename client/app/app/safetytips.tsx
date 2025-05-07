import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './constants/ThemeContext';

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Stay Alert.',
    description:
      'Scan the area as you walk. Be aware of your surroundings and walk with confidence.',
    icon: require('@/assets/images/1.png'),
  },
  {
    id: 2,
    title: 'Know your surroundings.',
    description: 'Keep an eye on people in front and behind of you.',
    icon: require('@/assets/images/2.png'),
  },
  {
    id: 3,
    title: 'Be confident.',
    description: 'Chin up, eyes forward, steady pace.',
    icon: require('@/assets/images/3.png'),
  },
  {
    id: 4,
    title: 'Press the SOS button.',
    description: 'If in an emergency, press the button for a loud sound.',
    icon: require('@/assets/images/4.png'),
  },
  {
    id: 5,
    title: 'Be on well-lit places.',
    description: 'Avoid alleys and other poorly lit, closed spaces.',
    icon: require('@/assets/images/5.png'),
  },
];

const SafetyTips = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handlePress = (TipId: number) => {
    router.push(`/tip${TipId}`);
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <Text style={[styles.header, isDarkMode && { color: '#fff' }]}>
        Safety Tips
      </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {tips.map((tip) => (
          <TouchableOpacity
            key={tip.id}
            style={[
              styles.card,
              isDarkMode && { backgroundColor: '#333', borderColor: '#555' },
            ]}
            onPress={() => handlePress(tip.id)}
          >
            <View style={styles.iconBox}>
              <Image source={tip.icon} style={styles.icon} />
            </View>
            <View style={styles.textBox}>
              <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
                {tip.title}
              </Text>
              <Text
                style={[styles.description, isDarkMode && { color: '#ccc' }]}
              >
                {tip.description}
              </Text>
            </View>
            <Text style={[styles.arrow, isDarkMode && { color: '#ccc' }]}>
              →
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={[styles.bottomNav, isDarkMode && { backgroundColor: '#333' }]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/home')}
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
          onPress={() => router.push('/sos')}
        >
          <MaterialIcons
            name="sos"
            size={24}
            color={isDarkMode ? '#ccc' : 'gray'}
          />
          <Text style={[styles.navText, isDarkMode && { color: '#ccc' }]}>
            SOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
          onPress={() => router.push('/safetytips')}
        >
          <Ionicons
            name="bulb"
            size={24}
            color={isDarkMode ? '#DA549B' : '#DA549B'}
          />
          <Text
            style={[styles.navTextActive, isDarkMode && { color: '#DA549B' }]}
          >
            Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/profile')}
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
    </View>
  );
};

export default SafetyTips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#d63384',
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(218, 84, 155, 0.24)',
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  iconBox: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#444',
  },
  arrow: {
    fontSize: 20,
    color: '#bbb',
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
});
