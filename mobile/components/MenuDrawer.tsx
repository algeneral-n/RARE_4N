/**
 * RARE 4N - Menu Drawer Component
 * قائمة منسدلة أساسية مع 3 مجموعات
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useMenu, MenuGroup } from '../hooks/useMenu';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';

// Fallback for useFont if not available
const useFontSafe = () => {
  try {
    return useFont();
  } catch {
    return { fontFamily: 'System', isLoading: false };
  }
};

const { width, height } = Dimensions.get('window');

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { menuGroups } = useMenu();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFontSafe();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleItemPress = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        {
          backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
          borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
        },
      ]}
      onPress={() => handleItemPress(item.route)}
      activeOpacity={0.7}
    >
      {item.icon && (
        <Icon
          name={item.icon}
          size={24}
          color={colors.primary || '#00EAFF'}
          style={styles.menuIcon}
        />
      )}
      <Text
        style={[
          styles.menuItemText,
          {
            color: colors.text || '#ffffff',
            fontFamily,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderGroup = (group: MenuGroup) => (
    <View key={group.id} style={styles.groupContainer}>
      <Text
        style={[
          styles.groupTitle,
          {
            color: colors.textSecondary || '#888888',
            fontFamily,
          },
        ]}
      >
        {group.label}
      </Text>
      {group.items.map(renderMenuItem)}
    </View>
  );

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background?.[0] || '#000408',
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text || '#ffffff',
                  fontFamily,
                },
              ]}
            >
              {t('menu') || 'Menu'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={colors.text || '#ffffff'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {menuGroups.map(renderGroup)}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.8,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  groupContainer: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});


 * قائمة منسدلة أساسية مع 3 مجموعات
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useMenu, MenuGroup } from '../hooks/useMenu';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';

// Fallback for useFont if not available
const useFontSafe = () => {
  try {
    return useFont();
  } catch {
    return { fontFamily: 'System', isLoading: false };
  }
};

const { width, height } = Dimensions.get('window');

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { menuGroups } = useMenu();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFontSafe();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleItemPress = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        {
          backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
          borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
        },
      ]}
      onPress={() => handleItemPress(item.route)}
      activeOpacity={0.7}
    >
      {item.icon && (
        <Icon
          name={item.icon}
          size={24}
          color={colors.primary || '#00EAFF'}
          style={styles.menuIcon}
        />
      )}
      <Text
        style={[
          styles.menuItemText,
          {
            color: colors.text || '#ffffff',
            fontFamily,
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderGroup = (group: MenuGroup) => (
    <View key={group.id} style={styles.groupContainer}>
      <Text
        style={[
          styles.groupTitle,
          {
            color: colors.textSecondary || '#888888',
            fontFamily,
          },
        ]}
      >
        {group.label}
      </Text>
      {group.items.map(renderMenuItem)}
    </View>
  );

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background?.[0] || '#000408',
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: colors.text || '#ffffff',
                  fontFamily,
                },
              ]}
            >
              {t('menu') || 'Menu'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={colors.text || '#ffffff'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {menuGroups.map(renderGroup)}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.8,
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  groupContainer: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

