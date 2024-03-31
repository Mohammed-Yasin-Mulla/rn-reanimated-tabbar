import { useIsFocused } from "@react-navigation/native";
import React from "react";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

const Screen3 = () => {
  const isFocused = useIsFocused();

  return (
    <Animated.View
      style={{
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
      {isFocused && (
        <Animated.Text
        entering={FadeInDown}
          style={{
            color: "white",
            fontSize: 24,
          }}
        >
          Screen3
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default Screen3;
