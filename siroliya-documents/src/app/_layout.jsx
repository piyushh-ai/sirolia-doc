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

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not logged in and not in the auth group
      router.replace("/auth/Login");
    } else if (user && inAuthGroup) {
      // Redirect to the home page if logged in and trying to access the login page
      router.replace("/home/Home");
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


