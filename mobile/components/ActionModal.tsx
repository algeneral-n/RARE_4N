import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import Icon from './Icon';

export interface FieldSchema {
  id: string;
  label: string;
  labelAr: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'multiline' | 'phone';
  defaultValue?: string;
  required?: boolean;
  secure?: boolean;
}

interface ActionModalProps {
  visible: boolean;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  fields: FieldSchema[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>) => void;
  submitLabel?: string;
  submitLabelAr?: string;
  icon?: string;
}

export default function ActionModal({
  visible,
  title,
  titleAr,
  description,
  descriptionAr,
  fields,
  loading = false,
  onCancel,
  onSubmit,
  submitLabel = 'Submit',
  submitLabelAr = 'إرسال',
  icon = 'send',
}: ActionModalProps) {
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e', textSecondary: '#888' } } = useTheme() || {};
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      const initialValues: Record<string, string> = {};
      fields.forEach(field => {
        initialValues[field.id] = field.defaultValue || '';
      });
      setValues(initialValues);
      setErrors({});
    }
  }, [visible, fields]);

  const handleChange = (fieldId: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !values[field.id]?.trim()) {
        newErrors[field.id] = 'هذا الحقل مطلوب';
        isValid = false;
      }
      if (field.type === 'email' && values[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.id])) {
          newErrors[field.id] = 'البريد الإلكتروني غير صحيح';
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onCancel} />
        
        <View style={[styles.modalContainer, { borderColor: getSafeColor(colors, 'primary') }]}>
          <LinearGradient
            colors={['#0a0a1a', '#1a1a2e']}
            style={styles.modalGradient}
          >
            <View style={styles.header}>
              <Icon name={icon} size={28} color={getSafeColor(colors, 'primary')} />
              <Text style={[styles.title, { color: getSafeColor(colors, 'primary') }]}>
                {titleAr}
              </Text>
              <Pressable onPress={onCancel} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            {descriptionAr && (
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {descriptionAr}
              </Text>
            )}

            <ScrollView style={styles.fieldsContainer}>
              {fields.map(field => (
                <View key={field.id} style={styles.fieldWrapper}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    {field.labelAr}
                    {field.required && <Text style={{ color: '#ff0000' }}> *</Text>}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        borderColor: errors[field.id] ? '#ff0000' : getSafeColor(colors, 'primary'),
                        color: colors.text,
                      },
                      field.type === 'multiline' && styles.multilineInput,
                    ]}
                    placeholder={field.placeholder || field.labelAr}
                    placeholderTextColor={colors.textSecondary}
                    value={values[field.id] || ''}
                    onChangeText={(text) => handleChange(field.id, text)}
                    secureTextEntry={field.secure}
                    keyboardType={
                      field.type === 'email' ? 'email-address' :
                      field.type === 'number' ? 'numeric' :
                      field.type === 'phone' ? 'phone-pad' : 'default'
                    }
                    multiline={field.type === 'multiline'}
                    numberOfLines={field.type === 'multiline' ? 4 : 1}
                    editable={!loading}
                  />
                  {errors[field.id] && (
                    <Text style={styles.errorText}>{errors[field.id]}</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.cancelButton, { borderColor: colors.textSecondary }]}
                onPress={onCancel}
                disabled={loading}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                  إلغاء
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.submitButton,
                  { backgroundColor: getSafeColor(colors, 'primary') },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#0a0a1a" size="small" />
                ) : (
                  <>
                    <Icon name={icon} size={18} color="#0a0a1a" />
                    <Text style={styles.submitButtonText}>{submitLabelAr}</Text>
                  </>
                )}
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
    lineHeight: 22,
  },
  fieldsContainer: {
    maxHeight: 300,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#0a0a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
