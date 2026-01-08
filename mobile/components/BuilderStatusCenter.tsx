/**
 * RARE 4N - Builder Status Center Component
 * مركز حالة البناء - عرض Build Status (iOS, Android, Web)
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';

interface BuildStatus {
  platform: 'ios' | 'android' | 'web';
  status: 'idle' | 'building' | 'success' | 'error';
  progress?: number;
  buildId?: string;
  repoUrl?: string;
  portalUrl?: string;
  error?: string;
  timestamp?: number;
}

interface BuilderStatusCenterProps {
  onRefresh?: () => void;
}

export default function BuilderStatusCenter({ onRefresh }: BuilderStatusCenterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [builds, setBuilds] = useState<BuildStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repoStatus, setRepoStatus] = useState<any>(null);
  const [portalStatus, setPortalStatus] = useState<any>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (builds.some(b => b.status === 'building')) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [builds]);

  const loadStatus = async () => {
    try {
      setIsLoading(true);

      // Load build statuses
      const buildsResponse = await fetch(`${API_URL}/api/auto-builder/status`);
      if (buildsResponse.ok) {
        const buildsData = await buildsResponse.json();
        setBuilds(buildsData.builds || []);
      }

      // Load repo status
      const repoResponse = await fetch(`${API_URL}/api/auto-builder/repo-status`);
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        setRepoStatus(repoData);
      }

      // Load portal status
      const portalResponse = await fetch(`${API_URL}/api/auto-builder/portal-status`);
      if (portalResponse.ok) {
        const portalData = await portalResponse.json();
        setPortalStatus(portalData);
      }
    } catch (error) {
      console.error('Error loading builder status:', error);
    } finally {
      setIsLoading(false);
      if (onRefresh) onRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'building':
        return colors.primary || '#00EAFF';
      case 'success':
        return '#00FF41';
      case 'error':
        return '#FF3B30';
      default:
        return colors.textSecondary || '#888888';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'building':
        return 'sync';
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      default:
        return 'circle';
    }
  };

  if (isLoading && builds.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)' }]}>
        <ActivityIndicator size="large" color={colors.primary || '#00EAFF'} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Build Statuses */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
          {t('buildStatus') || 'Build Status'}
        </Text>
        {builds.map((build, index) => (
          <View
            key={index}
            style={[
              styles.buildCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: getStatusColor(build.status),
              },
            ]}
          >
            <View style={styles.buildHeader}>
              <View style={styles.buildPlatform}>
                <Icon
                  name={build.platform === 'ios' ? 'phone-iphone' : build.platform === 'android' ? 'android' : 'web'}
                  size={24}
                  color={getStatusColor(build.status)}
                />
                <Text style={[styles.platformText, { color: colors.text, fontFamily }]}>
                  {build.platform.toUpperCase()}
                </Text>
              </View>
              {build.status === 'building' && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <ActivityIndicator size="small" color={colors.primary || '#00EAFF'} />
                </Animated.View>
              )}
              <Icon
                name={getStatusIcon(build.status)}
                size={20}
                color={getStatusColor(build.status)}
              />
            </View>
            {build.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.border || 'rgba(0, 234, 255, 0.3)' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${build.progress}%`,
                        backgroundColor: getStatusColor(build.status),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary, fontFamily }]}>
                  {build.progress}%
                </Text>
              </View>
            )}
            {build.error && (
              <Text style={[styles.errorText, { color: '#FF3B30', fontFamily }]}>{build.error}</Text>
            )}
            {build.buildId && (
              <Text style={[styles.buildIdText, { color: colors.textSecondary, fontFamily }]}>
                Build ID: {build.buildId}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Repo Status */}
      {repoStatus && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
            {t('repoStatus') || 'Repository Status'}
          </Text>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: repoStatus.status === 'connected' ? '#00FF41' : '#FF3B30',
              },
            ]}
          >
            <View style={styles.statusRow}>
              <Icon
                name="code"
                size={24}
                color={repoStatus.status === 'connected' ? '#00FF41' : '#FF3B30'}
              />
              <Text style={[styles.statusText, { color: colors.text, fontFamily }]}>
                {repoStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            {repoStatus.url && (
              <Text style={[styles.statusUrl, { color: colors.textSecondary, fontFamily }]}>
                {repoStatus.url}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Portal Status */}
      {portalStatus && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
            {t('portalStatus') || 'Portal Status'}
          </Text>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: portalStatus.status === 'live' ? '#00FF41' : '#FF3B30',
              },
            ]}
          >
            <View style={styles.statusRow}>
              <Icon
                name="web"
                size={24}
                color={portalStatus.status === 'live' ? '#00FF41' : '#FF3B30'}
              />
              <Text style={[styles.statusText, { color: colors.text, fontFamily }]}>
                {portalStatus.status === 'live' ? 'Live' : 'Offline'}
              </Text>
            </View>
            {portalStatus.url && (
              <Text style={[styles.statusUrl, { color: colors.textSecondary, fontFamily }]}>
                {portalStatus.url}
              </Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: colors.primary || '#00EAFF' }]}
        onPress={loadStatus}
      >
        <Icon name="refresh" size={20} color="#000" />
        <Text style={[styles.refreshButtonText, { fontFamily }]}>
          {t('refresh') || 'Refresh'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buildCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  buildHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  buildPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  buildIdText: {
    fontSize: 10,
    marginTop: 4,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusUrl: {
    fontSize: 12,
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});

 * RARE 4N - Builder Status Center Component
 * مركز حالة البناء - عرض Build Status (iOS, Android, Web)
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';

interface BuildStatus {
  platform: 'ios' | 'android' | 'web';
  status: 'idle' | 'building' | 'success' | 'error';
  progress?: number;
  buildId?: string;
  repoUrl?: string;
  portalUrl?: string;
  error?: string;
  timestamp?: number;
}

interface BuilderStatusCenterProps {
  onRefresh?: () => void;
}

export default function BuilderStatusCenter({ onRefresh }: BuilderStatusCenterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [builds, setBuilds] = useState<BuildStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [repoStatus, setRepoStatus] = useState<any>(null);
  const [portalStatus, setPortalStatus] = useState<any>(null);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (builds.some(b => b.status === 'building')) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [builds]);

  const loadStatus = async () => {
    try {
      setIsLoading(true);

      // Load build statuses
      const buildsResponse = await fetch(`${API_URL}/api/auto-builder/status`);
      if (buildsResponse.ok) {
        const buildsData = await buildsResponse.json();
        setBuilds(buildsData.builds || []);
      }

      // Load repo status
      const repoResponse = await fetch(`${API_URL}/api/auto-builder/repo-status`);
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        setRepoStatus(repoData);
      }

      // Load portal status
      const portalResponse = await fetch(`${API_URL}/api/auto-builder/portal-status`);
      if (portalResponse.ok) {
        const portalData = await portalResponse.json();
        setPortalStatus(portalData);
      }
    } catch (error) {
      console.error('Error loading builder status:', error);
    } finally {
      setIsLoading(false);
      if (onRefresh) onRefresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'building':
        return colors.primary || '#00EAFF';
      case 'success':
        return '#00FF41';
      case 'error':
        return '#FF3B30';
      default:
        return colors.textSecondary || '#888888';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'building':
        return 'sync';
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      default:
        return 'circle';
    }
  };

  if (isLoading && builds.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)' }]}>
        <ActivityIndicator size="large" color={colors.primary || '#00EAFF'} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Build Statuses */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
          {t('buildStatus') || 'Build Status'}
        </Text>
        {builds.map((build, index) => (
          <View
            key={index}
            style={[
              styles.buildCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: getStatusColor(build.status),
              },
            ]}
          >
            <View style={styles.buildHeader}>
              <View style={styles.buildPlatform}>
                <Icon
                  name={build.platform === 'ios' ? 'phone-iphone' : build.platform === 'android' ? 'android' : 'web'}
                  size={24}
                  color={getStatusColor(build.status)}
                />
                <Text style={[styles.platformText, { color: colors.text, fontFamily }]}>
                  {build.platform.toUpperCase()}
                </Text>
              </View>
              {build.status === 'building' && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <ActivityIndicator size="small" color={colors.primary || '#00EAFF'} />
                </Animated.View>
              )}
              <Icon
                name={getStatusIcon(build.status)}
                size={20}
                color={getStatusColor(build.status)}
              />
            </View>
            {build.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.border || 'rgba(0, 234, 255, 0.3)' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${build.progress}%`,
                        backgroundColor: getStatusColor(build.status),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary, fontFamily }]}>
                  {build.progress}%
                </Text>
              </View>
            )}
            {build.error && (
              <Text style={[styles.errorText, { color: '#FF3B30', fontFamily }]}>{build.error}</Text>
            )}
            {build.buildId && (
              <Text style={[styles.buildIdText, { color: colors.textSecondary, fontFamily }]}>
                Build ID: {build.buildId}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Repo Status */}
      {repoStatus && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
            {t('repoStatus') || 'Repository Status'}
          </Text>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: repoStatus.status === 'connected' ? '#00FF41' : '#FF3B30',
              },
            ]}
          >
            <View style={styles.statusRow}>
              <Icon
                name="code"
                size={24}
                color={repoStatus.status === 'connected' ? '#00FF41' : '#FF3B30'}
              />
              <Text style={[styles.statusText, { color: colors.text, fontFamily }]}>
                {repoStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            {repoStatus.url && (
              <Text style={[styles.statusUrl, { color: colors.textSecondary, fontFamily }]}>
                {repoStatus.url}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Portal Status */}
      {portalStatus && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily }]}>
            {t('portalStatus') || 'Portal Status'}
          </Text>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.surface || 'rgba(0, 234, 255, 0.1)',
                borderColor: portalStatus.status === 'live' ? '#00FF41' : '#FF3B30',
              },
            ]}
          >
            <View style={styles.statusRow}>
              <Icon
                name="web"
                size={24}
                color={portalStatus.status === 'live' ? '#00FF41' : '#FF3B30'}
              />
              <Text style={[styles.statusText, { color: colors.text, fontFamily }]}>
                {portalStatus.status === 'live' ? 'Live' : 'Offline'}
              </Text>
            </View>
            {portalStatus.url && (
              <Text style={[styles.statusUrl, { color: colors.textSecondary, fontFamily }]}>
                {portalStatus.url}
              </Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: colors.primary || '#00EAFF' }]}
        onPress={loadStatus}
      >
        <Icon name="refresh" size={20} color="#000" />
        <Text style={[styles.refreshButtonText, { fontFamily }]}>
          {t('refresh') || 'Refresh'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buildCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  buildHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  buildPlatform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
  buildIdText: {
    fontSize: 10,
    marginTop: 4,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusUrl: {
    fontSize: 12,
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});


