import { router, Stack, useSegments } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { Text } from "react-native";

function NavigationProvider() {
  const { getMe, user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // If not logged in, ensure user is in the auth group
      if (segments[0] !== "auth") {
        router.replace("/auth/Login");
      }
    } else {
      // If logged in, ensure user is in the home group
      if (segments[0] !== "home") {
        router.replace("/home/Home");
      }
    }
  }, [user, loading, segments]);


  if (loading) {
    return (
      <SafeScreen>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
      </SafeScreen>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeScreen>
        <NavigationProvider />
      </SafeScreen>
    </AuthProvider>
  );
}


