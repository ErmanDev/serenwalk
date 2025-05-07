import Constants from 'expo-constants';

// Get the API URL from environment variables or fallback to a default
export const API_URL = process.env.API_URL || 'http://192.168.1.38:5000';

// Export other configuration values as needed
export const Config = {
  API_URL,
  // Add other config values here
}; 