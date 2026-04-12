import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

// ✅ Request permission (correct way)
export async function requestNotificationPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
}

// ✅ Get FCM token
export async function getFCMToken() {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
}

// ✅ Foreground listener
export function setupForegroundListener() {
    return messaging().onMessage(async remoteMessage => {
        console.log('Foreground notification:', remoteMessage);
    });
}