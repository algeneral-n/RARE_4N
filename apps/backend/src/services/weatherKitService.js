/**
 * RARE 4N - WeatherKit Service
 * استخدام Apple WeatherKit للطقس
 */

import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEATHERKIT_KEY_ID = process.env.APPLE_WEATHERKIT_KEY_ID || process.env.APPLE_WEATHER_KEY_ID;
const WEATHERKIT_TEAM_ID = process.env.APPLE_WEATHERKIT_TEAM_ID || process.env.APPLE_TEAM_ID;
const WEATHERKIT_KEY_PATH = process.env.APPLE_WEATHERKIT_KEY_PATH || process.env.APPLE_WEATHER_KEY_PATH || process.env.APPLE_WEATHER_KEY;
const WEATHERKIT_SERVICE_ID = process.env.APPLE_WEATHERKIT_SERVICE_ID || process.env.APPLE_WEATHER_SERVICE_ID;

/**
 * Load WeatherKit P8 Key
 */
function loadWeatherKitKey() {
  try {
    // Try to load from file path first
    if (WEATHERKIT_KEY_PATH && fs.existsSync(WEATHERKIT_KEY_PATH)) {
      return fs.readFileSync(WEATHERKIT_KEY_PATH, 'utf8');
    }
    
    // Try relative path from backend directory
    const relativePath = path.join(__dirname, '../../', WEATHERKIT_KEY_PATH || 'AuthKey_L3KM677Z7Y.p8');
    if (fs.existsSync(relativePath)) {
      return fs.readFileSync(relativePath, 'utf8');
    }
    
    // Try root directory
    const rootPath = path.join(__dirname, '../../../', WEATHERKIT_KEY_PATH || 'AuthKey_L3KM677Z7Y.p8');
    if (fs.existsSync(rootPath)) {
      return fs.readFileSync(rootPath, 'utf8');
    }
    
    // If it's already a string (P8 content), return it
    if (WEATHERKIT_KEY_PATH && WEATHERKIT_KEY_PATH.includes('-----BEGIN PRIVATE KEY-----')) {
      return WEATHERKIT_KEY_PATH;
    }
    
    throw new Error('WeatherKit P8 key file not found. Please set APPLE_WEATHER_KEY_PATH or APPLE_WEATHER_KEY in .env with the P8 file path or content');
  } catch (error) {
    console.error('WeatherKit key loading error:', error);
    throw error;
  }
}

/**
 * Generate JWT for WeatherKit
 */
function generateWeatherKitJWT() {
  try {
    const privateKey = loadWeatherKitKey();
    
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        iss: WEATHERKIT_TEAM_ID,
        iat: now,
        exp: now + 3600, // 1 hour
        sub: WEATHERKIT_SERVICE_ID,
      },
      privateKey,
      {
        algorithm: 'ES256',
        keyid: WEATHERKIT_KEY_ID,
      }
    );

    return token;
  } catch (error) {
    console.error('WeatherKit JWT generation error:', error);
    throw error;
  }
}

/**
 * Get current weather using WeatherKit
 */
export async function getCurrentWeather(latitude, longitude, language = 'ar') {
  try {
    const token = generateWeatherKitJWT();
    
    const response = await axios.get(
      `https://weatherkit.apple.com/api/v1/weather/${language}/${latitude}/${longitude}`,
      {
        params: {
          dataSets: 'currentWeather',
          timezone: 'Asia/Dubai',
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const currentWeather = response.data.currentWeather;
    
    return {
      temperature: currentWeather.temperature,
      condition: currentWeather.conditionCode,
      humidity: currentWeather.humidity,
      windSpeed: currentWeather.windSpeed,
      windDirection: currentWeather.windDirection,
      pressure: currentWeather.pressure,
      visibility: currentWeather.visibility,
      uvIndex: currentWeather.uvIndex,
      timestamp: currentWeather.asOf,
    };
  } catch (error) {
    console.error('WeatherKit current weather error:', error);
    throw error;
  }
}

/**
 * Get forecast using WeatherKit
 */
export async function getForecast(latitude, longitude, days = 7, language = 'ar') {
  try {
    const token = generateWeatherKitJWT();
    
    const response = await axios.get(
      `https://weatherkit.apple.com/api/v1/weather/${language}/${latitude}/${longitude}`,
      {
        params: {
          dataSets: 'forecastDaily,forecastHourly',
          timezone: 'Asia/Dubai',
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const dailyForecast = response.data.forecastDaily?.days || [];
    const hourlyForecast = response.data.forecastHourly?.hours || [];

    return {
      daily: dailyForecast.slice(0, days).map((day) => ({
        date: day.forecastStart,
        high: day.temperatureMax,
        low: day.temperatureMin,
        condition: day.conditionCode,
        precipitation: day.precipitationAmount,
        windSpeed: day.windSpeed,
      })),
      hourly: hourlyForecast.slice(0, 24).map((hour) => ({
        time: hour.forecastStart,
        temperature: hour.temperature,
        condition: hour.conditionCode,
        precipitation: hour.precipitationAmount,
        windSpeed: hour.windSpeed,
      })),
    };
  } catch (error) {
    console.error('WeatherKit forecast error:', error);
    throw error;
  }
}

export default {
  getCurrentWeather,
  getForecast,
  generateWeatherKitJWT,
};

