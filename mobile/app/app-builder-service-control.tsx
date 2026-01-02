/**
 * RARE 4N - Service Control Component for Builder
 * مكون Service Control للتحكم في Backend و Cloudflare
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import { getSafeColor } from '../utils/safeTheme';

interface ServiceControlProps {
  colors: any;
}

interface ServiceStatus {
  backend: { status: string; pid: number | null };
  cloudflare: { status: string; pid: number | null };
}

export function ServiceControl({ colors }: ServiceControlProps) {
  const [servicesStatus, setServicesStatus] = useState<ServiceStatus>({
    backend: { status: 'stopped', pid: null },
    cloudflare: { status: 'stopped', pid: null },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services status
  const fetchServicesStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-control/status`);
      const data = await res.json();
      if (data.success) {
        setServicesStatus(data.services);
        setError(null);
      } else {
        setError('Failed to fetch services status');
      }
    } catch (err: any) {
      console.error('[ServiceControl] Fetch status error:', err);
      setError(err.message);
    }
  };

  // Handle service action
  const handleServiceAction = async (service: 'backend' | 'cloudflare', action: 'start' | 'stop' | 'restart') => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/api/service-control/${service}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Refresh status after action
        await fetchServicesStatus();
      } else {
        setError(result.message || `Failed to ${action} ${service}`);
      }
    } catch (err: any) {
      console.error(`[ServiceControl] ${action} ${service} error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh status every 5 seconds
  useEffect(() => {
    fetchServicesStatus();
    const interval = setInterval(fetchServicesStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { id: 'backend' as const, name: 'Backend', icon: 'server' },
    { id: 'cloudflare' as const, name: 'Cloudflare Tunnel', icon: 'cloud' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: getSafeColor(colors, 'primary') }]}>
        Service Control
      </Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {services.map((service) => {
        const status = servicesStatus[service.id];
        const isRunning = status.status === 'running' || status.status === 'online';

        return (
          <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.serviceHeader}>
              <Icon name={service.icon} size={20} color={getSafeColor(colors, 'primary')} />
              <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: isRunning ? '#10A37F20' : '#FF3B3020' }]}>
                <View style={[styles.statusDot, { backgroundColor: isRunning ? '#10A37F' : '#FF3B30' }]} />
                <Text style={[styles.statusText, { color: isRunning ? '#10A37F' : '#FF3B30' }]}>
                  {isRunning ? 'Running' : 'Stopped'}
                </Text>
              </View>
            </View>

            {status.pid && (
              <Text style={[styles.pidText, { color: colors.text + '80' }]}>
                PID: {status.pid}
              </Text>
            )}

            <View style={styles.actionsContainer}>
              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: isRunning ? '#FF3B30' : '#10A37F' },
                  loading && styles.actionButtonDisabled,
                ]}
                onPress={() => handleServiceAction(service.id, isRunning ? 'stop' : 'start')}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icon name={isRunning ? 'stop' : 'play-arrow'} size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>{isRunning ? 'Stop' : 'Start'}</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.actionButton,
                  { backgroundColor: getSafeColor(colors, 'primary') },
                  loading && styles.actionButtonDisabled,
                ]}
                onPress={() => handleServiceAction(service.id, 'restart')}
                disabled={loading || !isRunning}
              >
                <Icon name="refresh" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Restart</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  errorContainer: {
    backgroundColor: '#FF3B3020',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
  },
  serviceCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  serviceName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pidText: {
    fontSize: 11,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 5,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});






















