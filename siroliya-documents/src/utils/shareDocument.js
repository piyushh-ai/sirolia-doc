// utils/shareDocument.js
// Family Documents App — Document Share Utility

import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

/**
 * Downloads a document to local cache and opens the native share sheet
 * (WhatsApp, Instagram, Facebook, etc.)
 *
 * @param {Object} document - document object { documentName, memberName, fileUrl, fileType }
 * @param {Function} setSharing - optional state setter to show loading UI while sharing
 */
export const shareDocument = async (document, setSharing) => {
  try {
    if (setSharing) setSharing(true);

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
      return;
    }

    const extension = document.fileType === 'pdf' ? 'pdf' : 'jpg';
    const fileName = `${document.memberName}_${document.documentName}.${extension}`.replace(/\s+/g, '_');
    const localUri = FileSystem.cacheDirectory + fileName;

    // document.fileUrl should be a signed/temporary URL here
    // (Fetch from backend if Cloudinary "authenticated" type is used)
    const downloadResult = await FileSystem.downloadAsync(document.fileUrl, localUri);

    await Sharing.shareAsync(downloadResult.uri, {
      mimeType: document.fileType === 'pdf' ? 'application/pdf' : 'image/jpeg',
      dialogTitle: `${document.memberName} - ${document.documentName}`,
    });

    // Optional cleanup — remove file from cache after sharing
    await FileSystem.deleteAsync(localUri, { idempotent: true });
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Error', 'Failed to share the document, please try again');
  } finally {
    if (setSharing) setSharing(false);
  }
};