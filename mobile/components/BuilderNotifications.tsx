/**
 * RARE 4N - Builder Notifications Component
 * مركز إشعارات حقيقي للـ Builder
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';

export interface BuilderNotification {
  id: string;
  type: 'build' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface BuilderNotificationsProps {
  visible: boolean;
  onClose: () => void;
}

export default function BuilderNotifications({ visible, onClose }: BuilderNotificationsProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [notifications, setNotifications] = useState<BuilderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
      loadNotifications();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const loadNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/builds/notifications`);
      const data = await response.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: BuilderNotification) => !n.read).length);
      }
    } catch (error) {
      console.error('Load notifications error:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/builds/notifications/${id}/read`, {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'build':
        return 'build';
      case 'error':
        return 'error';
      case 'success':
        return 'check-circle';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'build':
        return colors.primary || '#00EAFF';
      case 'error':
        return '#FF3B30';
      case 'success':
        return '#10A37F';
      case 'info':
        return '#FFCC00';
      default:
        return colors.text || '#ffffff';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface || '#0a0e14',
              borderColor: colors.border || '#1a1f2e',
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border || '#1a1f2e' }]}>
            <Text style={[styles.headerTitle, { color: colors.text || '#ffffff', fontFamily }]}>
              {t('notifications') || 'Notifications'}
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary || '#00EAFF' }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text || '#ffffff'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="notifications-off" size={48} color={colors.textSecondary || '#888888'} />
                <Text style={[styles.emptyText, { color: colors.textSecondary || '#888888', fontFamily }]}>
                  {t('noNotifications') || 'No notifications'}
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    {
                      backgroundColor: notification.read
                        ? 'transparent'
                        : (colors.primary || '#00EAFF') + '10',
                      borderLeftColor: getNotificationColor(notification.type),
                    },
                  ]}
                  onPress={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    if (notification.action) {
                      notification.action.onPress();
                    }
                  }}
                >
                  <View style={styles.notificationIcon}>
                    <Icon
                      name={getNotificationIcon(notification.type)}
                      size={24}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[styles.notificationTitle, { color: colors.text || '#ffffff', fontFamily }]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.notificationMessage, { color: colors.textSecondary || '#888888', fontFamily }]}>
                      {notification.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: colors.textSecondary || '#888888', fontFamily }]}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary || '#00EAFF' }]} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderLeftWidth: 3,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'center',
  },
});

