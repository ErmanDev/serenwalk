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
        <Text style={styles.title}>Be on Well-Lit Places</Text>

        <Image
          source={require('@/assets/images/light.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={styles.subtitle}>A Key to Confidence and Safety.</Text>

        <Text style={styles.paragraph}>
          Choosing well-lit areas is essential for both safety and confidence.
          Bright, well-lit spaces allow you to stay visible and aware of your
          surroundings, reducing the risk of danger. When walking or waiting in
          unfamiliar areas, stick to places that are well-lit to ensure you can
          spot potential threats early and respond accordingly. Well-lit
          environments also make it easier for others to notice you, which can
          be an added layer of security. In dark or poorly lit areas, you may
          become an easy target, so avoiding those spaces whenever possible
          helps you stay safer. By prioritizing well-lit places, you're not only
          increasing your personal safety but also enhancing your sense of
          control and confidence in any situation.
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
