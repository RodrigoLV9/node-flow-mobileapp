import {
  View,
  Text,
  PanResponder,
  LayoutChangeEvent,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useRef, useState, useEffect } from "react";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THUMB_SIZE = 18;
const TRACK_HEIGHT = 4;
const TOUCH_AREA = 44;

interface TimeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}

export function TimeSlider({
  label,
  value,
  min,
  max,
  step = 5,
  unit,
  onChange,
}: TimeSliderProps) {
  const containerWidth = useRef(0);
  const [displayValue, setDisplayValue] = useState(value);
  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const stepRef = useRef(step);

  onChangeRef.current = onChange;
  minRef.current = min;
  maxRef.current = max;
  stepRef.current = step;

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const clamp = (ratio: number) => {
    const m = minRef.current;
    const M = maxRef.current;
    const s = stepRef.current;
    const raw = m + ratio * (M - m);
    const stepped = Math.round(raw / s) * s;
    return Math.max(m, Math.min(M, stepped));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX;
        const trackW = containerWidth.current - THUMB_SIZE;
        const paddedX = x - THUMB_SIZE / 2;
        const ratio = Math.max(0, Math.min(1, paddedX / trackW));
        const v = clamp(ratio);
        setDisplayValue(v);
        onChangeRef.current(v);
      },
      onPanResponderMove: (e) => {
        const x = e.nativeEvent.locationX;
        const trackW = containerWidth.current - THUMB_SIZE;
        const paddedX = x - THUMB_SIZE / 2;
        const ratio = Math.max(0, Math.min(1, paddedX / trackW));
        const v = clamp(ratio);
        setDisplayValue(v);
        onChangeRef.current(v);
      },
      onPanResponderRelease: (e) => {
        const x = e.nativeEvent.locationX;
        const trackW = containerWidth.current - THUMB_SIZE;
        const paddedX = x - THUMB_SIZE / 2;
        const ratio = Math.max(0, Math.min(1, paddedX / trackW));
        const v = clamp(ratio);

        LayoutAnimation.configureNext(
          LayoutAnimation.create(200, "easeInEaseOut", "opacity"),
        );

        setDisplayValue(v);
        onChangeRef.current(v);
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width;
    setDisplayValue(value);
  };

  const ratio = (displayValue - min) / (max - min);
  const trackW = containerWidth.current - THUMB_SIZE;
  const fillW = ratio * trackW;
  const thumbLeft = ratio * trackW;

  return (
    <View className="mt-5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-300 text-sm">{label}</Text>
        <Text className="text-cyan-400 text-sm font-bold">
          {displayValue}
          <Text className="text-gray-500 text-xs font-normal"> {unit}</Text>
        </Text>
      </View>

      <View
        style={{ height: TOUCH_AREA }}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            position: "absolute",
            top: (TOUCH_AREA - TRACK_HEIGHT) / 2,
            left: THUMB_SIZE / 2,
            right: THUMB_SIZE / 2,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: "rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          {containerWidth.current > 0 && (
            <View
              style={{
                height: "100%",
                width: fillW,
                borderRadius: TRACK_HEIGHT / 2,
                backgroundColor: "#22d3ee",
              }}
            />
          )}
        </View>

        {containerWidth.current > 0 && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: (TOUCH_AREA - THUMB_SIZE) / 2,
              left: thumbLeft,
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: "#22d3ee",
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.2)",
              shadowColor: "#22d3ee",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 6,
              elevation: 5,
            }}
          />
        )}
      </View>

      <View className="flex-row justify-between mt-2 px-0.5">
        <Text className="text-gray-600 text-[10px]">
          {min} {unit}
        </Text>
        <Text className="text-gray-600 text-[10px]">
          {max} {unit}
        </Text>
      </View>
    </View>
  );
}
