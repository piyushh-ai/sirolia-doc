// utils/checkUpdate.js
// Family Documents App — Update Checker

import Constants from 'expo-constants';
import { Linking, Alert } from 'react-native';

const VERSION_JSON_URL = `${process.env.EXPO_PUBLIC_API_URL}/version`;

/**
 * Compares two semver-style version strings (e.g. "1.0.1" vs "1.0.0")
 * Returns true if remoteVersion is newer than currentVersion
 */
const isNewerVersion = (remoteVersion, currentVersion) => {
  const remote = remoteVersion.split('.').map(Number);
  const current = currentVersion.split('.').map(Number);

  for (let i = 0; i < Math.max(remote.length, current.length); i++) {
    const r = remote[i] || 0;
    const c = current[i] || 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
};

/**
 * Checks for app updates by fetching version.json and comparing with
 * the current installed version. Shows an Alert prompting the user to update.
 */
export const checkForUpdate = async () => {
  try {
    const currentVersion = Constants.expoConfig?.version ?? '1.0.0';

    const response = await fetch(VERSION_JSON_URL);
    const data = await response.json();
    const { latestVersion, apkUrl, forceUpdate, releaseNotes } = data;

    if (isNewerVersion(latestVersion, currentVersion)) {
      Alert.alert(
        'Update Available',
        releaseNotes || `A new version (${latestVersion}) is available.`,
        [
          ...(forceUpdate ? [] : [{ text: 'Later', style: 'cancel' }]),
          {
            text: 'Update Now',
            onPress: () => Linking.openURL(apkUrl),
          },
        ],
        { cancelable: !forceUpdate }
      );
    }
  } catch (error) {
    console.error('Update check failed:', error);
    // Silently fail — update check failure should not block the app
  }
};