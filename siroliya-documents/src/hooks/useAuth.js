import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true to check local session on mount
  const [error, setError] = useState(null);

  const signUp = async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/google`;
      console.log("Hitting API URL:", url);
      const response = await axios.post(
        url,
        { idToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        },
      );

      const { token, user: userData } = response.data;
      if (token) {
        await AsyncStorage.setItem("userToken", token);
      }

      setUser(userData);
      return userData; // Return user so caller can verify success
    } catch (error) {
      console.error("API Error Response:", error?.response?.data || error.message || error);
      setError(error);
      throw error; // Re-throw so Login.jsx can catch and show error message
    } finally {
      setLoading(false);
    }
  };

  const getMe = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found in AsyncStorage");
        setUser(null);
        return;
      }
      

      const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/get-me`;
      console.log("Hitting API URL:", url);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        timeout: 5000,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("API Error Response:", error?.response?.data || error.message || error);
      setError(error);
      if (error?.response?.status === 401) {
        await AsyncStorage.removeItem("userToken");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, getMe, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};




