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
        <Text style={styles.title}>Press the SOS Button</Text>
        
       
        <Image
          source={require('@/assets/images/press.png')} // make sure to update the path to your image
          style={styles.image}
        />
        <Text style={styles.subtitle}>Take Control in Emergencies.</Text>

      
        <Text style={styles.paragraph}>
        In critical moments, the ability to act quickly can make all the difference. Pressing the SOS button is a powerful way to take control in an emergency. It's not just a safety feature; it's a tool that empowers you to reach out for help when needed most.

By pressing the SOS button, you immediately alert those around you or emergency services to your situation. It's a simple yet effective action that can trigger a response and ensure you're not alone when facing danger. Whether it's in a public place or on your own, knowing when to press that button can help you stay calm, stay safe, and stay in control. Confidence comes from being prepared, and the SOS button is your quick response in times of need.

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
