/**
 * RARE 4N - SOS Standby Mode Component
 * وضع التأهب للطوارئ
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';
import { storage } from '../utils/storage';

interface StandbyModeProps {
  onActivate?: () => void;
}

export default function StandbyMode({ onActivate }: StandbyModeProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [isActive, setIsActive] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStandbyState();
  }, []);

  useEffect(() => {
    if (isActive) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isActive]);

  const loadStandbyState = async () => {
    try {
      const saved = await storage.get<boolean>('sos:standby:active');
      const auto = await storage.get<boolean>('sos:standby:autoStart');
      if (saved !== null) {
        setIsActive(saved);
      }
      if (auto !== null) {
        setAutoStart(auto);
      }
    } catch (error) {
      console.error('Load standby state error:', error);
    }
  };

  const handleToggle = async (value: boolean) => {
    setIsActive(value);
    await storage.set('sos:standby:active', value);

    if (value) {
      try {
        const response = await fetch(`${API_URL}/api/sos/standby/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          if (onActivate) {
            onActivate();
          }
        }
      } catch (error) {
        console.error('Activate standby error:', error);
      }
    } else {
      try {
        await fetch(`${API_URL}/api/sos/standby/deactivate`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Deactivate standby error:', error);
      }
    }
  };

  const handleAutoStartToggle = async (value: boolean) => {
    setAutoStart(value);
    await storage.set('sos:standby:autoStart', value);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface || '#0a0e14', borderColor: colors.border || '#1a1f2e' }]}>
      <View style={styles.header}>
        <Icon name="security" size={24} color={colors.primary || '#00EAFF'} />
        <Text style={[styles.title, { color: colors.text || '#ffffff', fontFamily }]}>
          {t('standbyMode') || 'Standby Mode'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary || '#888888', fontFamily }]}>
          {t('standbyModeDescription') || 'Activate standby mode for automatic emergency detection and response'}
        </Text>

        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Text style={[styles.controlLabel, { color: colors.text || '#ffffff', fontFamily }]}>
              {t('standbyMode') || 'Standby Mode'}
            </Text>
            <Text style={[styles.controlSubLabel, { color: colors.textSecondary || '#888888', fontFamily }]}>
              {isActive
                ? t('standbyActive') || 'Active - Monitoring for emergencies'
                : t('standbyInactive') || 'Inactive'}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ scale: isActive ? pulseAnim : 1 }] }}>
            <Switch
              value={isActive}
              onValueChange={handleToggle}
              trackColor={{ false: '#767577', true: (colors.primary || '#00EAFF') + '80' }}
              thumbColor={isActive ? colors.primary || '#00EAFF' : '#f4f3f4'}
            />
          </Animated.View>
        </View>

        <View style={styles.controlRow}>
          <View style={styles.controlInfo}>
            <Text style={[styles.controlLabel, { color: colors.text || '#ffffff', fontFamily }]}>
              {t('autoStart') || 'Auto Start'}
            </Text>
            <Text style={[styles.controlSubLabel, { color: colors.textSecondary || '#888888', fontFamily }]}>
              {t('autoStartDescription') || 'Automatically start standby mode when app launches'}
            </Text>
          </View>
          <Switch
            value={autoStart}
            onValueChange={handleAutoStartToggle}
            trackColor={{ false: '#767577', true: (colors.primary || '#00EAFF') + '80' }}
            thumbColor={autoStart ? colors.primary || '#00EAFF' : '#f4f3f4'}
          />
        </View>

        {isActive && (
          <View style={[styles.statusIndicator, { backgroundColor: (colors.primary || '#00EAFF') + '20', borderColor: colors.primary || '#00EAFF' }]}>
            <Animated.View
              style={[
                styles.pulseDot,
                {
                  backgroundColor: colors.primary || '#00EAFF',
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Text style={[styles.statusText, { color: colors.primary || '#00EAFF', fontFamily }]}>
              {t('monitoring') || 'Monitoring...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  content: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlInfo: {
    flex: 1,
    marginRight: 16,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  controlSubLabel: {
    fontSize: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

