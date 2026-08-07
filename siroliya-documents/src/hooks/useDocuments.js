import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
  const [allDocument, setAllDocument] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true to check local session on mount
  const [error, setError] = useState(null);

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

  return (
    <DocumentContext.Provider
      value={{ allDocument, loading, error, getAllDocument, createDocument }}
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
