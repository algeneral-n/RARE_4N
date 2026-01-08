import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
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

export default function MapsScreen() {
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<any>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const mapRef = useRef<MapView>(null);
  
  const { theme, colors = { primary: '#00EAFF', text: '#fff', background: '#000408', surface: '#0a0e14', border: '#1a1f2e' } } = useTheme();
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
      data: { screen: 'maps' } 
    });
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'open maps', type: 'navigation', screen: 'maps' }
    });

    // فحص الصلاحية فقط (لا نطلب تلقائياً)
    checkLocationPermission();

    // تفعيل Real-time Voice إذا كان مفعّل في Home
    if (isVoiceEnabled) {
      kernel.emit({
        type: 'voice:screen:active',
        data: { screen: 'maps', voiceEnabled: true }
      });
    }
  }, [isVoiceEnabled]);

  // فحص الصلاحية فقط - لا نطلب تلقائياً
  const checkLocationPermission = async () => {
    const status = await permissionManager.checkPermission('location');
    if (status.granted) {
      await initializeLocation();
    } else {
      setLoading(false);
      setLocationEnabled(false);
    }
  };

  // تفعيل الموقع فقط عند تفعيل المستخدم
  const handleEnableLocation = async () => {
    const status = await permissionManager.checkPermission('location');
    if (status.granted) {
      await initializeLocation();
      setLocationEnabled(true);
      
      // إرسال للكور
      kernel.emit({
        type: 'user:input',
        data: { text: 'location enabled', type: 'maps', action: 'enable_location' }
      });
    } else {
      Alert.alert(
        tLang('permissionRequired') || 'تنبيه',
        tLang('locationAccessRequired') || 'يجب السماح بالوصول للموقع لتشغيل نظام الملاحة'
      );
    }
  };

  const initializeLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(initialRegion);
      setLocationEnabled(true);
    } catch (e) {
      Alert.alert(tLang('error') || 'خطأ', tLang('gpsConnectionFailed') || 'فشل الاتصال بنظام GPS');
    } finally {
      setLoading(false);
    }
  };

  // وظائف الخرائط الفعلية
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);

  // البحث عن موقع
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/maps/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          location: region ? { lat: region.latitude, lng: region.longitude } : null,
        }),
      });

      const data = await response.json();

      if (data.success && data.results) {
        setSearchResults(data.results);
        kernel.emit({
          type: 'user:input',
          data: { text: `found ${data.results.length} locations for: ${searchQuery}`, type: 'maps', action: 'search', results: data.results.length }
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
    }
  };

  // الحصول على توجيهات
  const handleGetRoute = async (destination: any) => {
    if (!locationEnabled || !region) {
      await handleEnableLocation();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/maps/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { latitude: region.latitude, longitude: region.longitude },
          to: { latitude: destination.location.latitude, longitude: destination.location.longitude },
        }),
      });

      const data = await response.json();

      if (data.success && data.route) {
        setRoute(data.route);
        kernel.emit({
          type: 'user:input',
          data: { text: `route calculated: ${data.route.distance}`, type: 'maps', action: 'route', route: data.route }
        });
      }
    } catch (error: any) {
      console.error('Route error:', error);
    }
  };

  // وظيفة إعادة التركيز على موقعك (بلمسة زر)
  const goToMyLocation = async () => {
    if (!locationEnabled) {
      await handleEnableLocation();
      return;
    }
    
    const loc = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
    
    // إرسال للكور
    kernel.emit({
      type: 'user:input',
      data: { text: 'go to my location', type: 'maps', action: 'center_location' }
    });
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#00EAFF" /></View>
  );

  if (!locationEnabled) return (
    <View style={styles.center}>
      <Icon name="map" size={80} color="#00EAFF" />
      <Text style={styles.enableText}>
        {tLang('enableLocationForMaps') || 'تفعيل الموقع لاستخدام الخرائط'}
      </Text>
      <TouchableOpacity style={styles.enableBtn} onPress={handleEnableLocation}>
        <Text style={styles.enableBtnText}>
          {tLang('enableLocation') || 'تفعيل الموقع'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true} // نقطة زرقاء تتحرك معك
        followsUserLocation={true} // الخريطة تمشي وراك
        showsTraffic={true} // عرض الزحمة المرورية
        showsBuildings={true} // عرض المباني ثلاثية الأبعاد
        showsCompass={true} // البوصلة
        mapType={mapType}
                provider={PROVIDER_DEFAULT} // استخدام Apple Maps (MapKit)
      >
        <Marker coordinate={region} pinColor="#00EAFF">
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>
                {tLang('yourCurrentLocation') || 'موقعك الحالي'}
              </Text>
              <Text style={styles.calloutDesc}>
                {tLang('rareSystemActive') || 'نظام RARE 4N نشط'}
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* شريط البحث */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder={tLang('searchLocation') || 'ابحث عن موقع...'}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* نتائج البحث */}
      {searchResults.length > 0 && (
        <ScrollView style={styles.searchResults}>
          {searchResults.map((result, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.resultItem}
              onPress={() => {
                setSelectedPlace(result);
                mapRef.current?.animateToRegion({
                  latitude: result.location.latitude,
                  longitude: result.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
                handleGetRoute(result);
              }}
            >
              <Icon name="place" size={20} color={getSafeColor(colors, 'primary')} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultAddress}>{result.address}</Text>
                {result.rating && <Text style={styles.resultRating}>[RATING] {result.rating}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* معلومات التوجيهات */}
      {route && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>📏 {route.distance}</Text>
          <Text style={styles.routeText}>⏱️ {route.duration}</Text>
        </View>
      )}

      {/* أدوات التحكم العائمة */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlBtn} 
          onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        >
          <Icon name="layers" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={goToMyLocation}>
          <Icon name="my-location" size={24} color="#00EAFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, backgroundColor: '#000408', justifyContent: 'center', alignItems: 'center', gap: 20 },
  enableText: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 20 },
  enableBtn: { backgroundColor: '#00EAFF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, marginTop: 20 },
  enableBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  controls: { position: 'absolute', right: 20, bottom: 40, gap: 15 },
  controlBtn: { 
    width: 50, height: 50, borderRadius: 25, 
    backgroundColor: 'rgba(0,4,8,0.8)', 
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,234,255,0.3)'
  },
  callout: { padding: 10, minWidth: 120 },
  calloutTitle: { fontWeight: 'bold', textAlign: 'center', color: '#000' },
  calloutDesc: { fontSize: 10, textAlign: 'center', color: '#666' },
  searchBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,4,8,0.9)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,234,255,0.3)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  searchBtn: {
    padding: 5,
  },
  searchResults: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: 'rgba(0,4,8,0.95)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,234,255,0.3)',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,234,255,0.1)',
    gap: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultAddress: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  resultRating: {
    color: '#FFCC00',
    fontSize: 11,
    marginTop: 4,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,234,255,0.2)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#00EAFF',
  },
  routeText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 5,
  },
});