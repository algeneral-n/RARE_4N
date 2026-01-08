/**
 * RARE 4N - Dropdown List Component
 * قائمة منسدلة كلاسيكية
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from '../Icon';

interface DropdownListProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    onPress: () => void;
  }>;
}

export default function DropdownList({
  title,
  items,
}: DropdownListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="arrow-drop-down" size={24} color="#00EAFF" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => {
                item.onPress();
                setIsOpen(false);
              }}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  color={item.color || '#00EAFF'}
                />
              )}
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 234, 255, 0.3)',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'rgba(0, 234, 255, 0.05)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

 * RARE 4N - Dropdown List Component
 * قائمة منسدلة كلاسيكية
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from '../Icon';

interface DropdownListProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    onPress: () => void;
  }>;
}

export default function DropdownList({
  title,
  items,
}: DropdownListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name="arrow-drop-down" size={24} color="#00EAFF" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => {
                item.onPress();
                setIsOpen(false);
              }}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  color={item.color || '#00EAFF'}
                />
              )}
              <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 234, 255, 0.3)',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: 'rgba(0, 234, 255, 0.05)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 14,
  },
});


