import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { makeStyles } from "../../styles/homeBottomBar.styles";

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: insets.bottom + 8, backgroundColor: colors.background },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;
          const isCenter = index === 1;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // ── Center FAB (Upload) ─────────────────────────────
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.fabTab}
              >
                <View style={[styles.fabWrapper, isFocused && styles.fabWrapperActive]}>
                  <Ionicons name="add" size={28} color="#ffffff" />
                </View>
              </TouchableOpacity>
            );
          }

          // ── Side tabs ───────────────────────────────────────
          const iconName =
            index === 0
              ? isFocused
                ? "home"
                : "home-outline"
              : isFocused
              ? "person"
              : "person-outline";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" options={{ title: "Home", tabBarLabel: "Home" }} />
      <Tabs.Screen name="Create-Document" options={{ title: "Upload", tabBarLabel: "Upload" }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile", tabBarLabel: "Profile" }} />
    </Tabs>
  );
}
