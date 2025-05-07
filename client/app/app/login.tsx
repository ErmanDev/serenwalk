import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    console.log('API_URL:', API_URL); // Debugging log for API_URL
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        router.push('/app/home'); // Redirect to home if token exists
      }
    };
    checkLoginStatus();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        console.log('Attempting login with:', { email, password }); // Debugging log
        const response = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status); // Debugging log
        const data = await response.json();
        console.log('Response data:', data); // Debugging log

        if (response.ok) {
          await AsyncStorage.setItem('accessToken', data.accessToken);
          if (data.user?.fullName)
            await AsyncStorage.setItem('userName', data.user.fullName);
          if (data.user?.email)
            await AsyncStorage.setItem('userEmail', data.user.email);
          if (data.user?.id) await AsyncStorage.setItem('userId', data.user.id);
          if (data.user?.profileUrl)
            await AsyncStorage.setItem('profileImage', data.user.profileUrl);
          Alert.alert('Logged in successfully!', `Welcome back, ${email}`);
          router.push('/home');
        } else {
          Alert.alert('Error', data.error || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error); // Debugging log
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Let's sign you in.</Text>
      <Text style={styles.subtitle}>Welcome back.</Text>

      {/* Email Field */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Field */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#999"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#999"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Are you new here?{' '}
        <Text style={styles.link} onPress={() => router.push('/signup')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DA549B',
    textAlign: 'center',
    marginRight: 100,
    marginTop: -50,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginRight: 200,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  forgotPassword: {
    marginLeft: 180,
    marginTop: 5,
    color: '#DA549B',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#DA549B',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#DA549B',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    width: '100%',
    height: 50,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },

  icon: {
    marginRight: 10,
  },
});
