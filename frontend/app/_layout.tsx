import { Stack } from 'expo-router';
import { useEffect } from 'react';

import {
  requestNotificationPermission,
  getFCMToken,
  setupForegroundListener
} from '../services/notificationService';

export default function RootLayout() {

  useEffect(() => {
    async function initNotifications() {

      console.log("APp started");

      const granted = await requestNotificationPermission();

      if (granted) {
        const token = await getFCMToken();
        console.log("Device Token:", token);

        // 🔥 TODO: send this token to your backend
      }
    }

    const unsubscribe = setupForegroundListener();

    initNotifications();

    return unsubscribe;
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}