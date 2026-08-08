import { router, Stack, useSegments } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DocumentProvider } from "@/hooks/useDocuments";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FontFamily } from "@/constants/fonts";

// Keep the splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

// StatusBar synced to current theme
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
      <SafeScreen>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
      </SafeScreen>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FontFamily.regular]: require("../../assets/fonts/CabinetGrotesk-Regular.otf"),
    [FontFamily.medium]: require("../../assets/fonts/CabinetGrotesk-Medium.otf"),
    [FontFamily.bold]: require("../../assets/fonts/CabinetGrotesk-Bold.otf"),
    [FontFamily.extrabold]: require("../../assets/fonts/CabinetGrotesk-Extrabold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash once fonts are loaded (or failed gracefully)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are ready
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
