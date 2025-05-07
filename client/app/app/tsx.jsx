import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from './constants/ThemeContext';

const Tip1 = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fefefe' }]}>
      <View style={[styles.headerWrapper, { backgroundColor: isDarkMode ? '#444' : '#d63384' }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('safetytips')}
            style={styles.backButton}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={30} 
              color={isDarkMode ? '#ccc' : '#fff'} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: isDarkMode ? '#ccc' : '#fff' }]}>Safety Tips</Text>
        </View>
        <View style={[styles.headerCurve, { backgroundColor: isDarkMode ? '#333' : '#fefefe' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#d63384' : '#d63384' }]}>Know you surroundings.</Text>
        <Image
          source={require('@/assets/images/know.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={[styles.subtitle, { color: isDarkMode ? '#ddd' : '#333' }]}>Situational Awareness.</Text>
        <Text style={[styles.paragraph, { color: isDarkMode ? '#ccc' : '#333' }]}>
          Being aware of your environment is key to staying safe. Take note of who's around you, what's ahead, and potential 
          exits or safe spaces nearby. Stay off your phone when moving through unfamiliar areas, and check behind you from time to time. 
          Awareness helps you spot unusual behavior early and make quick, smart decisions if needed.
        </Text>
      </View>
    </View>
  );
};

const Tip2 = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <View style={[styles.headerWrapper, isDarkMode && { backgroundColor: '#333' }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('safetytips')}
            style={styles.backButton}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={30} 
              color={isDarkMode ? '#fff' : '#000'} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, isDarkMode && { color: '#fff' }]}>Safety Tips</Text>
        </View>
        <View style={[styles.headerCurve, isDarkMode && { backgroundColor: '#000' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>Know you surroundings.</Text>
        <Image
          source={require('@/assets/images/know.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={[styles.subtitle, isDarkMode && { color: '#ccc' }]}>Situational Awareness.</Text>
        <Text style={[styles.paragraph, isDarkMode && { color: '#ccc' }]}>
          Being aware of your environment is key to staying safe. Take note of who's around you, what's ahead, and potential 
          exits or safe spaces nearby. Stay off your phone when moving through unfamiliar areas, and check behind you from time to time. 
          Awareness helps you spot unusual behavior early and make quick, smart decisions if needed.
        </Text>
      </View>
    </View>
  );
};

export default Tip1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    overflow: 'hidden',
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 4,
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerCurve: {
    height: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -10,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 24,
  },
});
