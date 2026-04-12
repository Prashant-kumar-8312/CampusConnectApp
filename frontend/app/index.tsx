import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeComponent from '../components/Home/HomeComponent';
import LoginComponent from '../components/Logins/LoginComponent';

type AuthUser = {
  id: string;
  erpId: string;
  name: string;
  role: string | null;
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = useMemo(
    () => process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.177.250:5000',
    [],
  );

  // 🔥 Load saved login on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log('Error loading auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // 🔐 Login success handler
  const handleLoginSuccess = async (
    nextToken: string,
    nextUser: AuthUser,
  ) => {
    try {
      await AsyncStorage.setItem('token', nextToken);
      await AsyncStorage.setItem('user', JSON.stringify(nextUser));

      setToken(nextToken);
      setUser(nextUser);
    } catch (error) {
      console.log('Login save error:', error);
    }
  };

  // 🚪 Logout handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      setToken(null);
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // ⏳ Prevent blank screen during startup
  if (loading) {
    return null; // or Splash screen
  }

  // 🔥 Auth routing logic (VERY IMPORTANT)
  if (!token || !user) {
    return (
      <LoginComponent
        apiBaseUrl={apiBaseUrl}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <HomeComponent
      user={user}
      token={token}
      apiBaseUrl={apiBaseUrl}
      onLogout={handleLogout}
    />
  );
}