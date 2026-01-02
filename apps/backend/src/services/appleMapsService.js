/**
 * RARE 4N - Apple Maps Service (MapKit JS)
 * استخدام Apple Maps بدلاً من Google Maps
 * 
 * ملاحظة: MapKit JS يعمل في الويب فقط. في React Native، نستخدم PROVIDER_DEFAULT
 * الذي يستخدم Apple Maps natively على iOS.
 * 
 * للـ Backend، نستخدم MapKit JS API أو نعتمد على Google Maps كـ fallback.
 */

import axios from 'axios';

const APPLE_MAPS_TOKEN = process.env.APPLE_MAPS_TOKEN || process.env.APPLE_MAPS_KEY;
// MapKit JS لا يوفر REST API مباشر - نستخدم Google Maps كـ fallback
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Search location using Apple Maps (MapKit JS)
 * 
 * ملاحظة: MapKit JS لا يوفر REST API مباشر للبحث.
 * نستخدم Google Maps Places API كـ fallback مع دعم Apple Maps في الواجهة الأمامية.
 */
export async function searchLocation(query, location = null, radius = 5000) {
  try {
    // MapKit JS يعمل في الويب فقط - للـ Backend نستخدم Google Maps
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key required for backend search (Apple Maps works natively on iOS)');
    }

    const params = {
      query,
      key: GOOGLE_MAPS_API_KEY,
      language: 'ar',
    };
    
    if (location) {
      params.location = `${location.latitude},${location.longitude}`;
      params.radius = radius;
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { params });

    return {
      places: response.data.results.map((place) => ({
        name: place.name,
        address: place.formatted_address,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || null,
        types: place.types || [],
      })),
      provider: 'google', // Backend uses Google, frontend uses Apple Maps natively
    };
  } catch (error) {
    console.error('Maps search error:', error);
    throw error;
  }
}

/**
 * Get route using Google Maps (Apple Maps works natively on iOS)
 */
export async function getRoute(from, to) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key required for backend routing (Apple Maps works natively on iOS)');
    }

    const origin = typeof from === 'string' ? from : `${from.latitude},${from.longitude}`;
    const destination = typeof to === 'string' ? to : `${to.latitude},${to.longitude}`;

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: GOOGLE_MAPS_API_KEY,
        language: 'ar',
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(response.data.error_message || 'Route not found');
    }

    const route = response.data.routes[0];
    return {
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      steps: route.legs[0].steps.map((step) => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
        distance: step.distance,
        duration: step.duration,
      })),
      polyline: route.overview_polyline.points,
      destination: {
        latitude: route.legs[0].end_location.lat,
        longitude: route.legs[0].end_location.lng,
      },
    };
  } catch (error) {
    console.error('Maps route error:', error);
    throw error;
  }
}

/**
 * Geocode address using Google Maps (Apple Maps works natively on iOS)
 */
export async function geocodeAddress(address) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key required for backend geocoding (Apple Maps works natively on iOS)');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
        language: 'ar',
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error('Address not found');
    }

    const result = response.data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error('Geocode error:', error);
    throw error;
  }
}

/**
 * Get place details using Google Maps (Apple Maps works natively on iOS)
 */
export async function getPlaceDetails(placeId) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key required for backend place details (Apple Maps works natively on iOS)');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        language: 'ar',
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error('Place not found');
    }

    const result = response.data.result;
    return {
      name: result.name,
      address: result.formatted_address,
      location: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      },
      rating: result.rating,
      phone: result.formatted_phone_number,
      website: result.website,
    };
  } catch (error) {
    console.error('Place details error:', error);
    throw error;
  }
}

export default {
  searchLocation,
  getRoute,
  geocodeAddress,
  getPlaceDetails,
};

