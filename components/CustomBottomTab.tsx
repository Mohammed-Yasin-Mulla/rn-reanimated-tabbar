import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useReducer } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const CustomAnimatedTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { index: activeIndex, routes } = state;

  const reducer = (state: any, action: { x: number; index: number }) => {
    // Add the new value to the state
    return [...state, { x: action.x, index: action.index }];
  };

  const [layout, dispatch] = useReducer(reducer, []);

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    dispatch({ x: event.nativeEvent.layout.x, index });
  };

  // animations ------------------------------------------------------

  const xOffset = useDerivedValue(() => {
    // Our code hasn't finished rendering yet, so we can't use the layout values
    if (layout.length !== routes.length) return 0;
    // We can use the layout values
    // Copy layout to avoid errors between different threads
    return layout.find(({ index }) => index === activeIndex)!.x + 15;
    // Calculate the offset new if the activeIndex changes (e.g. when a new tab is selected)
    // or the layout changes (e.g. when the components haven't finished rendering yet)
  });

  const animateTranslate = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(xOffset.value),
      },
    ],
  }));

  return (
    <View
      style={{
        position: "absolute",
        overflow: "hidden",
        width: "90%",
        bottom: 15,
        right: "5%",
        left: "5%",
        justifyContent: "center",
        borderRadius: 30,
        padding: 2,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 30,
        }}
      >
        <LinearGradient
          colors={["#F3A325", "#F87C5F", "#F87C5F", "#FD5698"]}
          start={{ x: 0.2, y: 0 }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: "black",
          borderRadius: 30,
          padding: 10,
        }}
      >
        <Animated.View
          style={[
            {
              // backgroundColor: "white",
              position: "absolute",
              height: 50,
              width: 25,
              top: 0,
            },
            animateTranslate,
          ]}
        >
          <LottieView
            source={require("../assets/animatedBall.json")}
            autoPlay
            loop
            style={{
              width: 45,
              height: 45,
              position: "absolute",
              top: 0,
            }}
            speed={4}
          />
        </Animated.View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const Icon = options.tabBarIcon
              ? options.tabBarIcon
              : () => <Text>?</Text>;
            const isFocused = state.index === index;
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
            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };
            return (
              <View onLayout={(e) => handleLayout(e, index)} key={route.key}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={() => {
                    onPress();
                  }}
                  onLongPress={onLongPress}
                  style={[
                    {
                      position: "relative",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      width: 55,
                    },
                  ]}
                >
                  {/* @ts-ignore */}
                  <Icon size={25} color={isFocused ? "white" : "#F87C5F"} />
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CustomAnimatedTabBar;
