import { router, Stack, useSegments } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DocumentProvider } from "@/hooks/useDocuments";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

// Reads current theme mode and sets StatusBar style accordingly
// dark mode  → style="light" (white icons on dark background)
// light mode → style="dark"  (dark icons on light background)
function ThemedStatusBar() {
  const { mode, colors } = useTheme();
  return (
    <StatusBar
      style={mode === "dark" ? "light" : "dark"}
      backgroundColor={colors.background}
    />
  );
}

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
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <SafeScreen>
            <NavigationProvider />
          </SafeScreen>
          <ThemedStatusBar />
        </DocumentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
