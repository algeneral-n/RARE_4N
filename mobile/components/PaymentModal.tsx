/**
 * RARE 4N - Payment Modal Component
 * دعم Stripe Elements و Apple Pay Button
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

interface PaymentModalProps {
  visible: boolean;
  request: PaymentRequest | null;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentModal({
  visible,
  request,
  onClose,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'apple-pay'>('stripe');

  const handlePayment = async () => {
    if (!request) return;

    setIsProcessing(true);

    try {
      let endpoint = '';
      let body: any = {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        metadata: request.metadata || {},
      };

      if (paymentMethod === 'stripe') {
        endpoint = `${API_URL}/api/payments/create`;
      } else if (paymentMethod === 'apple-pay') {
        endpoint = `${API_URL}/api/payments/apple-pay`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        onSuccess(data.paymentIntentId || data.paymentId);
        Alert.alert(t('success') || 'نجح', t('paymentSuccess') || 'تم الدفع بنجاح');
        onClose();
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
      Alert.alert(t('error') || 'خطأ', error.message || 'فشل الدفع');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface || '#0a0e14',
              borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontFamily }]}>
              {t('payment') || 'الدفع'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountLabel, { color: colors.textSecondary, fontFamily }]}>
                {t('amount') || 'المبلغ'}
              </Text>
              <Text style={[styles.amount, { color: colors.primary, fontFamily }]}>
                {request.amount} {request.currency.toUpperCase()}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionLabel, { color: colors.textSecondary, fontFamily }]}>
                {t('description') || 'الوصف'}
              </Text>
              <Text style={[styles.description, { color: colors.text, fontFamily }]}>
                {request.description}
              </Text>
            </View>

            <View style={styles.paymentMethods}>
              <Text style={[styles.methodsTitle, { color: colors.text, fontFamily }]}>
                {t('paymentMethod') || 'طريقة الدفع'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: paymentMethod === 'stripe' ? colors.primary + '20' : colors.surface,
                    borderColor: paymentMethod === 'stripe' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPaymentMethod('stripe')}
              >
                <Icon name="credit-card" size={24} color={colors.primary} />
                <Text style={[styles.methodText, { color: colors.text, fontFamily }]}>
                  Stripe
                </Text>
                {paymentMethod === 'stripe' && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: paymentMethod === 'apple-pay' ? colors.primary + '20' : colors.surface,
                    borderColor: paymentMethod === 'apple-pay' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPaymentMethod('apple-pay')}
              >
                <Icon name="apple" size={24} color={colors.primary} />
                <Text style={[styles.methodText, { color: colors.text, fontFamily }]}>
                  Apple Pay
                </Text>
                {paymentMethod === 'apple-pay' && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  backgroundColor: colors.primary || '#00EAFF',
                  opacity: isProcessing ? 0.6 : 1,
                },
              ]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Icon name="payment" size={20} color="#000" />
                  <Text style={[styles.payButtonText, { fontFamily }]}>
                    {t('pay') || 'دفع'} {request.amount} {request.currency.toUpperCase()}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
  paymentMethods: {
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 234, 255, 0.2)',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

 * RARE 4N - Payment Modal Component
 * دعم Stripe Elements و Apple Pay Button
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { useFont } from '../hooks/useFont';
import Icon from './Icon';
import { API_URL } from '../services/config';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

interface PaymentModalProps {
  visible: boolean;
  request: PaymentRequest | null;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentModal({
  visible,
  request,
  onClose,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { fontFamily } = useFont();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'apple-pay'>('stripe');

  const handlePayment = async () => {
    if (!request) return;

    setIsProcessing(true);

    try {
      let endpoint = '';
      let body: any = {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        metadata: request.metadata || {},
      };

      if (paymentMethod === 'stripe') {
        endpoint = `${API_URL}/api/payments/create`;
      } else if (paymentMethod === 'apple-pay') {
        endpoint = `${API_URL}/api/payments/apple-pay`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        onSuccess(data.paymentIntentId || data.paymentId);
        Alert.alert(t('success') || 'نجح', t('paymentSuccess') || 'تم الدفع بنجاح');
        onClose();
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'Payment failed');
      Alert.alert(t('error') || 'خطأ', error.message || 'فشل الدفع');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface || '#0a0e14',
              borderColor: colors.border || 'rgba(0, 234, 255, 0.3)',
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontFamily }]}>
              {t('payment') || 'الدفع'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountLabel, { color: colors.textSecondary, fontFamily }]}>
                {t('amount') || 'المبلغ'}
              </Text>
              <Text style={[styles.amount, { color: colors.primary, fontFamily }]}>
                {request.amount} {request.currency.toUpperCase()}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={[styles.descriptionLabel, { color: colors.textSecondary, fontFamily }]}>
                {t('description') || 'الوصف'}
              </Text>
              <Text style={[styles.description, { color: colors.text, fontFamily }]}>
                {request.description}
              </Text>
            </View>

            <View style={styles.paymentMethods}>
              <Text style={[styles.methodsTitle, { color: colors.text, fontFamily }]}>
                {t('paymentMethod') || 'طريقة الدفع'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: paymentMethod === 'stripe' ? colors.primary + '20' : colors.surface,
                    borderColor: paymentMethod === 'stripe' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPaymentMethod('stripe')}
              >
                <Icon name="credit-card" size={24} color={colors.primary} />
                <Text style={[styles.methodText, { color: colors.text, fontFamily }]}>
                  Stripe
                </Text>
                {paymentMethod === 'stripe' && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  {
                    backgroundColor: paymentMethod === 'apple-pay' ? colors.primary + '20' : colors.surface,
                    borderColor: paymentMethod === 'apple-pay' ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPaymentMethod('apple-pay')}
              >
                <Icon name="apple" size={24} color={colors.primary} />
                <Text style={[styles.methodText, { color: colors.text, fontFamily }]}>
                  Apple Pay
                </Text>
                {paymentMethod === 'apple-pay' && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.payButton,
                {
                  backgroundColor: colors.primary || '#00EAFF',
                  opacity: isProcessing ? 0.6 : 1,
                },
              ]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Icon name="payment" size={20} color="#000" />
                  <Text style={[styles.payButtonText, { fontFamily }]}>
                    {t('pay') || 'دفع'} {request.amount} {request.currency.toUpperCase()}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
  paymentMethods: {
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  methodText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 234, 255, 0.2)',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});


