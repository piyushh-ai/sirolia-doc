import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [allDocument, setAllDocument] = useState(null);
  const [myDocuments, setMyDocuments] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true to check local session on mount
  const [error, setError] = useState(null);
  const [documentDetail, setDocumentDetail] = useState(null)

  const getAllDocument = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found in AsyncStorage");
        setAllDocument(null);
        return;
      }

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/all`;
      console.log("Hitting API URL:", url);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      setAllDocument(response.data.documents);
    } catch (error) {
      console.error(
        "API Error Response:",
        error?.response?.data || error.message || error,
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async ({ documentName, memberName, file }) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found in AsyncStorage");
        return;
      }

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/create`;
      console.log("Hitting API URL:", url);

      const formData = new FormData();
      formData.append("documentName", documentName);
      formData.append("memberName", memberName);
      formData.append("file", {
        uri: file.uri,
        name: file.name || "document",
        type: file.mimeType || "application/octet-stream",
      });

      const response = await axios.post(
        url,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        },
      );
      return response;
    } catch (error) {
      console.error(
        "API Error Response:",
        error?.response?.data || error.message || error,
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentDetail = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found in AsyncStorage");
        return;
      }

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/${documentId}`;
      console.log("Hitting API URL:", url);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      setDocumentDetail(response.data);
    } catch (error) {
      console.error(
        "API Error Response:",
        error?.response?.data || error.message || error,
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getMyDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setMyDocuments(null);
        return;
      }

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/my-documents`;
      console.log("Hitting API URL:", url);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      setMyDocuments(response.data.documents);
    } catch (error) {
      // 404 means no documents yet — treat as empty, not an error
      if (error?.response?.status === 404) {
        setMyDocuments([]);
      } else {
        console.error(
          "API Error Response:",
          error?.response?.data || error.message || error,
        );
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/delete/${documentId}`;
      console.log("Hitting API URL:", url);
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });
      return response;
    } catch (error) {
      console.error(
        "API Error Response:",
        error?.response?.data || error.message || error,
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const editDocument = async (documentId, { documentName, memberName, file }) => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/document/edit/${documentId}`;
      console.log("Hitting API URL:", url);

      const formData = new FormData();
      if (documentName) formData.append("documentName", documentName);
      if (memberName) formData.append("memberName", memberName);
      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "document",
          type: file.mimeType || "application/octet-stream",
        });
      }

      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      });
      return response;
    } catch (error) {
      console.error(
        "API Error Response:",
        error?.response?.data || error.message || error,
      );
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DocumentContext.Provider
      value={{ allDocument, myDocuments, loading, error, getAllDocument, createDocument, documentDetail, getDocumentDetail, deleteDocument, editDocument, getMyDocuments }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within an DocumentProvider");
  }
  return context;
};
