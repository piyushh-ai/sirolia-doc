import { View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

const SafeScreen = ({ children, backgroundColor }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        backgroundColor: backgroundColor ?? colors.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
