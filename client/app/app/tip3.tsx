import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './constants/ThemeContext';

const Tip1 = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
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
          <Text style={styles.headerText}>Safety Tips</Text>
        </View>
        <View style={styles.headerCurve} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Be Confident</Text>

        <Image
          source={require('@/assets/images/beconfi.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={styles.subtitle}>Embrace Your Power.</Text>

        <Text style={styles.paragraph}>
          Confidence is about trusting yourself and your abilities, especially
          in challenging situations. It starts with believing in your own
          strengths and taking action, even when things seem uncertain. One way
          to boost confidence is through situational awareness—being present and
          aware of your surroundings. When you're aware of what's going on
          around you, you feel more in control, which enhances your confidence.
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
