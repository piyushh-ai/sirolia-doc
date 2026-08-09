import { router, Stack, useSegments } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DocumentProvider } from "@/hooks/useDocuments";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FontFamily } from "@/constants/fonts";
import { checkForUpdate } from "@/utils/checkUpdate";

// Keep the native splash visible until we are ready
SplashScreen.preventAutoHideAsync();

// ─── Status Bar synced to theme ───────────────────────────────────────────────
function ThemedStatusBar() {
  const { mode, colors } = useTheme();
  return (
    <StatusBar
      style={mode === "dark" ? "light" : "dark"}
      backgroundColor={colors.background}
    />
  );
}

// ─── Navigation logic ─────────────────────────────────────────────────────────
function NavigationProvider() {
  const { getMe, user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (segments[0] !== "auth") {
        router.replace("/auth/Login");
      }
    } else {
      const allowedSegments = ["home", "document"];
      if (!allowedSegments.includes(segments[0])) {
        router.replace("/home/Home");
      }
    }
  }, [user, loading, segments]);

  if (loading) {
     return (
        <View style={styles.loadingContainer}>
           <Text style={styles.loadingText}>Loading...</Text>
        </View>
     );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FontFamily.regular]: require("../../assets/fonts/CabinetGrotesk-Regular.otf"),
    [FontFamily.medium]: require("../../assets/fonts/CabinetGrotesk-Medium.otf"),
    [FontFamily.bold]: require("../../assets/fonts/CabinetGrotesk-Bold.otf"),
    [FontFamily.extrabold]: require("../../assets/fonts/CabinetGrotesk-Extrabold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05081A",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: FontFamily.medium,
  }
});
