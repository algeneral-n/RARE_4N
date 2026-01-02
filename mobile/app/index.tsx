/**
 * RARE 4N - Index Route
 * الصفحة الأولى - إعادة التوجيه إلى Splash Screen الآمن
 */

import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated } from '../utils/secureAuth';

export default function Index() {
  useEffect(() => {
    // Quick auth check
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (authenticated || authToken === 'rare4n_authenticated') {
        // Already authenticated - could redirect to home directly
        // But for security, let splash handle it
      }
    } catch (error) {
      // On error, splash will handle redirect
    }
  };

  // Always go through splash for security check
  return <Redirect href="/splash" />;
}
