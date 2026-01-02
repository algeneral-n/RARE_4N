import React from 'react';
import Svg, { Path } from 'react-native-svg';

const icons: Record<string, string> = {
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
};

export default function Icon({ name, size = 24, color = '#00eaff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icons[name] || icons.chat} fill={color} />
    </Svg>
  );
}