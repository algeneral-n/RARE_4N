import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const NAMES = ['NADER', 'OMY', 'NARIMAN', 'NADA', 'ZIEN', 'TAMARA', 'OMAR', 'KAYAN'];

export default function NamesTunnel() {
  const { width, height } = Dimensions.get('window');
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {/* مطر الأسماء النازل ببطء - متباعد */}
      {NAMES.map((name, i) => (
        <RainingName key={i} name={name} index={i} width={width} height={height} />
      ))}
    </View>
  );
}

function RainingName({ name, index, width, height }) {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const leftPosition = (width / (NAMES.length + 1)) * (index + 1);
  const TOTAL_CYCLE = 12000; // كل اسم 12 ثانية

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        // تأخير قبل البداية (stagger effect)
        Animated.delay(index * 1000), // تأخير 1 ثانية بين كل اسم
        // النزول
        Animated.timing(fallAnim, {
          toValue: 1,
          duration: 8000, // نزول 8 ثواني
          useNativeDriver: true,
        }),
        // إعادة للأعلى بسرعة
        Animated.timing(fallAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        // انتظار قبل الدورة التالية
        Animated.delay(3000 - index * 300),
      ])
    ).start();
  }, []);

  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, height + 100],
  });

  return (
    <Animated.Text
      style={[
        styles.nameText,
        {
          position: 'absolute',
          left: leftPosition - 40,
          transform: [{ translateY }],
        },
      ]}
    >
      {name}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0 },
  nameText: { fontSize: 14, fontWeight: '600', color: '#00eaff', letterSpacing: 2, opacity: 0.4 },
});
