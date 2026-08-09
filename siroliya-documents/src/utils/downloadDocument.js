// utils/downloadDocument.js
// Family Documents App — Document Download Utility

import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';

/**
 * Downloads a document to device local storage.
 * - PDFs  → Downloads/SiroVault/
 * - Images → Pictures/SiroVault/ (via MediaLibrary if available)
 *
 * @param {Object} doc        - { documentName, memberName, fileUrl, fileType }
 * @param {Function} setLoading - optional state setter for loading UI
 */
export const downloadDocument = async (doc, setLoading) => {
  try {
    if (setLoading) setLoading(true);

    const extension = doc.fileType === 'pdf' ? 'pdf' : 'jpg';
    const safeName  = `${doc.memberName}_${doc.documentName}`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
    const fileName  = `${safeName}.${extension}`;

    // Download to cache first
    const cacheUri = FileSystem.cacheDirectory + fileName;

    const downloadResult = await FileSystem.downloadAsync(doc.fileUrl, cacheUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Download failed with status ${downloadResult.status}`);
    }

    // Move to permanent Downloads folder
    const downloadsDir = FileSystem.documentDirectory + 'SiroVault/';
    const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
    }

    const finalUri = downloadsDir + fileName;

    // If file already exists, overwrite it
    const existing = await FileSystem.getInfoAsync(finalUri);
    if (existing.exists) {
      await FileSystem.deleteAsync(finalUri, { idempotent: true });
    }

    await FileSystem.moveAsync({ from: downloadResult.uri, to: finalUri });

    Alert.alert(
      '✅ Downloaded',
      `"${doc.documentName}" saved to SiroVault folder.\n\nPath: ${finalUri}`,
      [{ text: 'OK' }],
    );

    return finalUri;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Download Failed', 'Could not download the document. Please try again.');
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
};
