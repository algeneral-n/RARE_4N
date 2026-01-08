/**
 * RARE 4N - Bottom Sheet List Component
 * قائمة من الأسفل
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from '../Icon';

const { height } = Dimensions.get('window');

interface BottomSheetListProps {
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    onPress: () => void;
  }>;
  isVisible: boolean;
  onClose: () => void;
}

export default function BottomSheetList({
  items,
  isVisible,
  onClose,
}: BottomSheetListProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <ScrollView style={styles.content}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={24}
                    color={item.color || '#00EAFF'}
                  />
                )}
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0a0e14',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

 * RARE 4N - Bottom Sheet List Component
 * قائمة من الأسفل
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from '../Icon';

const { height } = Dimensions.get('window');

interface BottomSheetListProps {
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    onPress: () => void;
  }>;
  isVisible: boolean;
  onClose: () => void;
}

export default function BottomSheetList({
  items,
  isVisible,
  onClose,
}: BottomSheetListProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />
          <ScrollView style={styles.content}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={24}
                    color={item.color || '#00EAFF'}
                  />
                )}
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0a0e14',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});


