/**
 * RARE 4N - Expo App Configuration
 * iOS Only - Enlisted Distribution
 * لا توجد مفاتيح حساسة هنا - فقط publishable keys
 * جميع المفاتيح الحساسة في Backend فقط
 */

export default {
  expo: {
    name: 'RARE 4N',
    slug: 'rare-4n',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.rare4n.app',
      buildNumber: process.env.EXPO_BUILD_NUMBER || '1',
      infoPlist: {
        // Voice & Audio
        NSMicrophoneUsageDescription: 'RARE 4N needs access to your microphone for voice interactions, voice commands, and real-time communication.',
        NSSpeechRecognitionUsageDescription: 'RARE 4N needs access to speech recognition for voice commands and voice-to-text features.',
        
        // Camera & Photos
        NSCameraUsageDescription: 'RARE 4N needs access to your camera for image analysis, document scanning, and visual recognition.',
        NSPhotoLibraryUsageDescription: 'RARE 4N needs access to your photo library to select and analyze images.',
        NSPhotoLibraryAddUsageDescription: 'RARE 4N needs access to save images and documents to your photo library.',
        
        // Location
        NSLocationWhenInUseUsageDescription: 'RARE 4N needs access to your location for maps, navigation, location-based services, and weather information.',
        NSLocationAlwaysUsageDescription: 'RARE 4N needs access to your location in the background for continuous navigation and location tracking.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'RARE 4N needs access to your location for comprehensive location services and navigation features.',
        
        // Contacts & Calendar
        NSContactsUsageDescription: 'RARE 4N needs access to your contacts to help you communicate and manage relationships.',
        NSCalendarsUsageDescription: 'RARE 4N needs access to your calendar to manage appointments, reminders, and schedule events.',
        NSRemindersUsageDescription: 'RARE 4N needs access to your reminders to help you stay organized and manage tasks.',
        
        // Bluetooth
        NSBluetoothAlwaysUsageDescription: 'RARE 4N needs access to Bluetooth for connecting with external devices and accessories.',
        NSBluetoothPeripheralUsageDescription: 'RARE 4N needs access to Bluetooth for connecting with external devices and accessories.',
        
        // Security & Authentication
        NSFaceIDUsageDescription: 'RARE 4N uses Face ID for secure authentication and protecting your sensitive data.',
        
        // Motion & Health
        NSMotionUsageDescription: 'RARE 4N needs access to motion sensors for activity tracking and enhanced user experience.',
        NSHealthShareUsageDescription: 'RARE 4N needs access to your health data to provide personalized health insights and recommendations.',
        NSHealthUpdateUsageDescription: 'RARE 4N needs access to update your health data for comprehensive health tracking.',
        
        // Media
        NSAppleMusicUsageDescription: 'RARE 4N needs access to Apple Music for music playback and media control.',
        
        // System Integration
        NSAppleEventsUsageDescription: 'RARE 4N needs access to Apple Events for system integration and automation.',
        NSSiriUsageDescription: 'RARE 4N integrates with Siri for voice commands and hands-free operation.',
        NSUserTrackingUsageDescription: 'RARE 4N uses tracking to provide personalized experiences and improve app functionality.',
      },
      config: {
        usesNonExemptEncryption: false,
      },
      associatedDomains: [
        'applinks:zien-ai.app',
        'applinks:api.zien-ai.app',
      ],
      entitlements: {
        'com.apple.developer.associated-domains': [
          'applinks:zien-ai.app',
          'applinks:api.zien-ai.app',
        ],
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'RARE 4N needs access to your location for maps, navigation, location-based services, and weather information.',
        },
      ],
      [
        'expo-av',
        {
          microphonePermission: 'RARE 4N needs access to your microphone for voice interactions, voice commands, and real-time communication.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'RARE 4N needs access to your camera for image analysis, document scanning, and visual recognition.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'RARE 4N needs access to your photo library to select and analyze images.',
        },
      ],
      [
        'expo-contacts',
        {
          contactsPermission: 'RARE 4N needs access to your contacts to help you communicate and manage relationships.',
        },
      ],
      [
        'expo-calendar',
        {
          calendarPermission: 'RARE 4N needs access to your calendar to manage appointments, reminders, and schedule events.',
          remindersPermission: 'RARE 4N needs access to your reminders to help you stay organized and manage tasks.',
        },
      ],
      [
        'expo-speech',
        {
          speechPermission: 'RARE 4N needs access to speech recognition for voice commands and voice-to-text features.',
        },
      ],
      [
        'expo-face-detector',
        {
          faceDetectorPermission: 'RARE 4N uses face detection for secure authentication and enhanced features.',
        },
      ],
      [
        'expo-sensors',
        {
          motionPermission: 'RARE 4N needs access to motion sensors for activity tracking and enhanced user experience.',
        },
      ],
      [
        'expo-health',
        {
          healthSharePermission: 'RARE 4N needs access to your health data to provide personalized health insights and recommendations.',
          healthUpdatePermission: 'RARE 4N needs access to update your health data for comprehensive health tracking.',
        },
      ],
      [
        'expo-media-library',
        {
          mediaLibraryPermission: 'RARE 4N needs access to your media library for managing photos and videos.',
        },
      ],
      [
        'expo-notifications',
        {
          sounds: true,
          badge: true,
          alert: true,
        },
      ],
      [
        'expo-apple-authentication',
        {
          appleAuthenticationPermission: 'RARE 4N uses Sign in with Apple for secure authentication.',
        },
      ],
    ],
    scheme: 'rare4n',
    extra: {
      eas: {
        projectId: process.env.EXPO_PROJECT_ID || 'c2f7ad03-bef4-4e74-b426-4170a9d788b3',
      },
      // ✅ Publishable Keys Only - من EAS Secrets
      // جميع المفاتيح الحساسة في Backend فقط
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app',
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY || '',
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      elevenlabsAgentId: process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID || 'agent_0701kc4axybpf6fvak70xwfzpyka',
    },
  },
};
