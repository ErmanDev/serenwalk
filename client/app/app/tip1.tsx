import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './constants/ThemeContext';

const Tip1 = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <View
        style={[
          styles.headerWrapper,
          isDarkMode && { backgroundColor: '#333' },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/app/safetytips')}
            style={styles.backButton}
          >
            <MaterialIcons
              name="arrow-back"
              size={30}
              color={isDarkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, isDarkMode && { color: '#fff' }]}>
            Safety Tips
          </Text>
        </View>
        <View
          style={[
            styles.headerCurve,
            isDarkMode && { backgroundColor: '#000' },
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
          Stay Alert.
        </Text>

        <Image
          source={require('@/assets/images/stayalert.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={[styles.subtitle, isDarkMode && { color: '#ccc' }]}>
          Be Vigilant.
        </Text>

        <Text style={[styles.paragraph, isDarkMode && { color: '#ccc' }]}>
          Our safety tip blog is your ultimate resource for all things
          awareness. Whether you're walking at night or navigating a crowded
          area, stay alert and walk with confidence. Trust your instincts, avoid
          distractions, and stay in well-lit areas to reduce risks.
        </Text>
      </View>
    </View>
  );
};

export default Tip1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  headerWrapper: {
    backgroundColor: '#d63384',
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
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerCurve: {
    height: 30,
    backgroundColor: '#fefefe',
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
    color: '#d63384',
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
    color: '#333',
    marginBottom: 24,
  },
});
