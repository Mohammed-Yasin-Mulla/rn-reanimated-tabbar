import { useReducer } from 'react';
import { LayoutChangeEvent, Platform, Pressable, Text, View } from 'react-native';
import Animated, {
    ReduceMotion, useAnimatedStyle, useDerivedValue, withSpring
} from 'react-native-reanimated';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomAnimatedTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
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
    return layout.find(({ index }) => index === activeIndex)!.x;
    // Calculate the offset new if the activeIndex changes (e.g. when a new tab is selected)
    // or the layout changes (e.g. when the components haven't finished rendering yet)
  });

  const animateTranslate = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(xOffset.value, {
          duration: 3000,
          dampingRatio: 0.5,
          stiffness: 100,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.System,
        }),
      },
    ],
  }));

  return (
    <View
      style={{
        width: "90%",
        height: 40,
        backgroundColor: "purple",
        padding: 10,
        position: "absolute",
        bottom: 10,
        right: "5%",
        left: "5%",
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "red",
            position: "absolute",
            height: 25,
            width: 25,
            top: 6,
            borderRadius: 25,
          },
          animateTranslate,
        ]}
      />
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          paddingBottom: Platform.OS === "ios" ? 8 : 0,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const Icon = options.tabBarIcon
            ? options.tabBarIcon
            : () => <Text>?</Text>;
          const label = options.tabBarLabel === undefined ? options.title : "";
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
                style={[{ position: "relative" }]}
              >
                {/* @ts-ignore */}
                <Icon size={25} color={isFocused ? "blue" : "green"} />
                <Text
                  style={[
                    {
                      color: isFocused ? "blue" : "green",
                    },
                  ]}
                >
                  {label || ""}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CustomAnimatedTabBar;
