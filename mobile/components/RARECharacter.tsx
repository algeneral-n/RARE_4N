import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Text } from 'react-native';

export default function RARECharacter({ size = 320 }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: size, height: size * 1.3, justifyContent: 'center', alignItems: 'center' }}>
      {!imageError ? (
        <Animated.Image
          source={require('../assets/character/rare-hero.png')}
          style={[
            styles.character,
            {
              width: size,
              height: size * 1.3,
              transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 8] }) }],
            },
          ]}
          onError={() => setImageError(true)}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size * 1.3 }]}>
          <Text style={styles.placeholderText}>RARE</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  character: {},
  placeholder: {
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00eaff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00eaff',
    letterSpacing: 8,
  },
});