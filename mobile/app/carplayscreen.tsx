import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions, BlurView } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { RAREKernel } from '../core/RAREKernel';
import { CognitiveLoop } from '../core/CognitiveLoop';
import { PermissionManager } from '../core/services/PermissionManager';
import { useTheme } from '../hooks/useTheme'
import { getSafeColor, getSafeColors } from '../utils/safeTheme';;
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from '../components/Icon';
import { API_URL } from '../services/config';
import { useVoice } from '../contexts/VoiceContext';

const { width, height } = Dimensions.get('window');

export default function CarPlayScreen() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const { colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
  const { t } = useTranslation();
  const { t: tLang } = useLanguage();
  const { isVoiceEnabled, isListening, startListening, stopListening, speak } = useVoice();
  const kernel = RAREKernel.getInstance();
  const cognitiveLoop = CognitiveLoop.getInstance();
  const permissionManager = PermissionManager.getInstance();

  useEffect(() => {
    // ربط Cognitive Loop
    cognitiveLoop.init(kernel).catch(console.error);
    
    // إرسال حدث فتح الشاشة
    kernel.emit({ 
      type: 'screen:opened', 
      data: { screen: 'carplay' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open carplay', type: 'navigation', screen: 'carplay' }
    });

    // ✅ تفعيل Real-time Voice إذا كان مفعّل في Home
    if (isVoiceEnabled) {
      kernel.emit({
        type: 'voice:screen:active',
        data: { screen: 'carplay', voiceEnabled: true }
      });
    }
  }, [isVoiceEnabled]);

  // ✅ تفعيل النظام فقط عند تفعيل المستخدم
  const activateSystem = async () => {
    setLoading(true);
    
    // فحص الصلاحية أولاً
    const permissionStatus = await permissionManager.checkPermission('location');
    
    if (!permissionStatus.granted) {
      // فحص الصلاحية فقط - لا طلب تلقائي
      Alert.alert(
        tLang('systemDenied') || 'System Denied',
        tLang('locationRequiredForDriveMode') || 'يجب السماح بالوصول للموقع من إعدادات التطبيق لتفعيل وضع القيادة'
      );
      setLoading(false);
      return;
    }

    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'activate drive mode', type: 'carplay', action: 'activate' }
    });

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(coords);

      // جلب الطقس من الباك إند (فعلي)
      try {
        const res = await fetch(`${API_URL}/api/weather/current`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        });
        const data = await res.json();
        
        if (data.success && data.weather) {
          // ✅ استخدام WeatherKit data structure
          setWeather({
            temperature: data.weather.temperature,
            condition: data.weather.condition || data.weather.weatherCode,
            humidity: data.weather.humidity,
            windspeed: data.weather.windSpeed,
            windDirection: data.weather.windDirection,
            pressure: data.weather.pressure,
            uvIndex: data.weather.uvIndex,
          });
        } else {
          // Fallback إلى Open-Meteo
          const fallbackRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`);
          const fallbackData = await fallbackRes.json();
          setWeather(fallbackData.current_weather);
        }
      } catch (error) {
        console.error('Weather error:', error);
        // Fallback
        const fallbackRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`);
        const fallbackData = await fallbackRes.json();
        setWeather(fallbackData.current_weather);
      }
      
      setActive(true);
      
      // إرسال للكور
      kernel.emit({
        type: 'user:input',
        data: { text: 'drive mode activated', type: 'carplay', action: 'activated', location: coords }
      });
    } catch (error: any) {
      Alert.alert(tLang('error') || 'خطأ', error.message || 'فشل تفعيل وضع القيادة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#000', '#001a2c', '#000']} style={StyleSheet.absoluteFill} />

      {!active ? (
        <View style={styles.bootContainer}>
          <Icon name="car" size={120} color={getSafeColor(colors, 'primary')} />
          <Text style={[styles.bootTitle, { color: getSafeColor(colors, 'primary') }]}>RARE CARPLAY SYSTEM</Text>
          <TouchableOpacity 
            style={[styles.bootBtn, { borderColor: getSafeColor(colors, 'primary') }]} 
            onPress={activateSystem}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={getSafeColor(colors, 'primary')} />
            ) : (
              <Text style={[styles.bootBtnText, { color: getSafeColor(colors, 'primary') }]}>
                {tLang('initializeDrive') || 'INITIALIZE DRIVE'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.dashboard}>
          {/* الجانب الأيسر: الخريطة المصغرة */}
          <View style={styles.leftPanel}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={styles.miniMap}
              initialRegion={location}
              customMapStyle={darkMapStyle}
            >
              <Marker coordinate={location} pinColor={getSafeColor(colors, 'primary')} />
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapLabel}>LIVE GPS TRACKING</Text>
            </View>
          </View>

          {/* الجانب الأيمن: الطقس والسرعة والأوامر */}
          <View style={styles.rightPanel}>
            <View style={styles.weatherWidget}>
              <Text style={styles.tempText}>{Math.round(weather?.temperature)}°</Text>
              <Text style={styles.weatherDesc}>CLEAR SKY</Text>
              <View style={styles.windRow}>
                <Icon name="air" size={14} color="#00EAFF" />
                <Text style={styles.windText}>{weather?.windspeed} km/h</Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="mic" size={30} color={getSafeColor(colors, 'primary')} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Icon name="music-note" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]} onPress={() => setActive(false)}>
                <Icon name="power-settings-new" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#383838" }] }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bootContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30 },
  bootTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 5 },
  bootBtn: { paddingVertical: 15, paddingHorizontal: 40, borderWidth: 1, borderRadius: 50 },
  bootBtnText: { fontWeight: 'bold', letterSpacing: 2 },
  
  dashboard: { flex: 1, flexDirection: 'row', padding: 10, paddingTop: 50 },
  leftPanel: { flex: 1.5, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  miniMap: { flex: 1 },
  mapOverlay: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 5, borderRadius: 5 },
  mapLabel: { color: '#00EAFF', fontSize: 8, fontWeight: 'bold' },

  rightPanel: { flex: 1, paddingLeft: 15, justifyContent: 'space-between' },
  weatherWidget: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 25, padding: 20, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tempText: { color: '#fff', fontSize: 60, fontWeight: '900' },
  weatherDesc: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  windRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  windText: { color: '#00EAFF', fontSize: 12 },

  quickActions: { flexDirection: 'row', gap: 10, height: 80 },
  actionBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' }
});