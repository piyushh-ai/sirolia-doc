import { View, Text, Button, Image, StyleSheet } from "react-native";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

const Home = () => {
  const { user, logOut } = useAuth();

  const signOut = () => {
    logOut();
    router.replace("/auth/Login");
  };

  return (
    <View style={styles.container}>
      {user?.photo && (
        <Image source={{ uri: user.photo }} style={styles.avatar} />
      )}
      <Text style={styles.welcome}>Welcome, {user?.name || "User"}!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Button title="Logout" onPress={signOut} color="#d9534f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#212529",
  },
  email: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default Home;
