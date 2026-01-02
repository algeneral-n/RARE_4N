/**
 * RARE 4N - API Service Layer
 * Central service for AI, Maps, Weather integrations
 * 
 * ✅ SECURITY: Integrated with CostManager for rate limiting and cost caps
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import { getCostManager } from './costManager.js';
import { randomUUID } from 'crypto';
import appleMapsService from './appleMapsService.js';
import weatherKitService from './weatherKitService.js';
import { 
  validateOpenAIKey, 
  validateGeminiKey, 
  validateAnthropicKey,
  getOpenAIKey,
  getGeminiKey,
  getAnthropicKey
} from './apiKeyValidator.js';

// Lazy initialization - only create clients when needed and API keys are available
let openai = null;
let genAI = null;
let anthropic = null;

function getOpenAI() {
  if (!openai) {
    // ✅ SECURITY: Validate API key before creating client
    const validation = validateOpenAIKey();
    if (!validation.valid) {
      throw new Error(`OpenAI API Key Error: ${validation.error}`);
    }
    openai = new OpenAI({ apiKey: validation.key });
  }
  return openai;
}

function getGenAI() {
  if (!genAI) {
    // ✅ SECURITY: Validate API key before creating client
    const validation = validateGeminiKey();
    if (!validation.valid) {
      throw new Error(`Gemini API Key Error: ${validation.error}`);
    }
    genAI = new GoogleGenerativeAI(validation.key);
  }
  return genAI;
}

function getAnthropic() {
  if (!anthropic) {
    // ✅ SECURITY: Validate API key before creating client
    const validation = validateAnthropicKey();
    if (!validation.valid) {
      throw new Error(`Anthropic API Key Error: ${validation.error}`);
    }
    anthropic = new Anthropic({ apiKey: validation.key });
  }
  return anthropic;
}

const costManager = getCostManager();

export const AI = {
  /**
   * Chat with AI (with cost management)
   * @param {string} message - User message
   * @param {string} aiModel - AI model to use ('gpt', 'gemini', 'claude')
   * @param {string} openaiModel - Specific OpenAI model (optional)
   * @param {string} userId - User ID for cost tracking (required)
   */
  async chat(message, aiModel = 'gpt', openaiModel = null, userId = 'anonymous') {
    try {
      // Map model names to actual model identifiers
      let requestedModel = openaiModel || 'gpt-4o-mini';
      if (aiModel.toLowerCase() === 'gemini' || aiModel.toLowerCase() === 'google') {
        requestedModel = 'gemini-pro';
      } else if (aiModel.toLowerCase() === 'claude' || aiModel.toLowerCase() === 'anthropic') {
        requestedModel = 'claude-3-sonnet';
      }

      // ✅ Check cost limits and rate limiting
      const costCheck = await costManager.canMakeRequest(userId, requestedModel);
      if (!costCheck.allowed) {
        throw new Error(`AI request denied: ${costCheck.message}`);
      }

      // Use fallback model if suggested
      const finalModel = costCheck.model || requestedModel;
      let actualModel = finalModel;

      // Adjust OpenAI model if needed
      if (finalModel !== requestedModel && (aiModel.toLowerCase() === 'gpt' || aiModel.toLowerCase() === 'openai')) {
        actualModel = finalModel;
      }

      let completion;
      let usage = null;
      let reply = '';

      switch (aiModel.toLowerCase()) {
        case 'gpt':
        case 'openai':
          const openaiClient = getOpenAI();
          if (!openaiClient) {
            throw new Error('OpenAI API key is not configured');
          }
          completion = await openaiClient.chat.completions.create({
            model: actualModel,
            messages: [{ role: 'user', content: message }],
          });
          reply = completion.choices[0].message.content;
          usage = completion.usage;
          break;

        case 'gemini':
        case 'google':
          const genAIClient = getGenAI();
          if (!genAIClient) {
            throw new Error('Gemini API key is not configured');
          }
          const model = genAIClient.getGenerativeModel({ model: actualModel });
          const result = await model.generateContent(message);
          reply = result.response.text();
          // Estimate tokens for Gemini (approximate)
          usage = {
            prompt_tokens: Math.ceil(message.length / 4),
            completion_tokens: Math.ceil(reply.length / 4),
            total_tokens: Math.ceil((message.length + reply.length) / 4),
          };
          break;

        case 'claude':
        case 'anthropic':
          const anthropicClient = getAnthropic();
          if (!anthropicClient) {
            throw new Error('Anthropic API key is not configured');
          }
          const claudeResult = await anthropicClient.messages.create({
            model: actualModel,
            max_tokens: 4096,
            messages: [{ role: 'user', content: message }],
          });
          reply = claudeResult.content[0].text;
          usage = claudeResult.usage;
          break;

        default:
          throw new Error(`Unknown AI model: ${aiModel}`);
      }

      // ✅ Calculate and log cost
      const cost = costManager.calculateCost(actualModel, usage.prompt_tokens || 0, usage.completion_tokens || 0);
      await costManager.logUsage(userId, actualModel, usage.prompt_tokens || 0, usage.completion_tokens || 0, cost);

      return {
        reply,
        model: actualModel,
        usage,
        cost: cost.toFixed(4),
        costCheck: {
          remainingDaily: costCheck.remainingDaily,
          remainingMonthly: costCheck.remainingMonthly,
        },
      };
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  },

  /**
   * Generate code (with cost management)
   * @param {string} prompt - Code generation prompt
   * @param {string} language - Programming language
   * @param {string} userId - User ID for cost tracking (required)
   */
  async generateCode(prompt, language = 'typescript', userId = 'anonymous') {
    try {
      const requestedModel = 'gpt-4o';
      
      // ✅ Check cost limits
      const costCheck = await costManager.canMakeRequest(userId, requestedModel);
      if (!costCheck.allowed) {
        throw new Error(`Code generation denied: ${costCheck.message}`);
      }

      const finalModel = costCheck.model || requestedModel;
      const openaiClient = getOpenAI();
      if (!openaiClient) {
        throw new Error('OpenAI API key is not configured');
      }
      const completion = await openaiClient.chat.completions.create({
        model: finalModel,
        messages: [
          { role: 'system', content: `You are an expert ${language} developer. Generate clean, well-documented code.` },
          { role: 'user', content: prompt }
        ],
      });

      // ✅ Calculate and log cost
      const usage = completion.usage;
      const cost = costManager.calculateCost(finalModel, usage.prompt_tokens, usage.completion_tokens);
      await costManager.logUsage(userId, finalModel, usage.prompt_tokens, usage.completion_tokens, cost);

      return {
        code: completion.choices[0].message.content,
        model: finalModel,
        cost: cost.toFixed(4),
      };
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  },

  /**
   * Analyze content (with cost management)
   * @param {string} content - Content to analyze
   * @param {string} type - Content type
   * @param {string} userId - User ID for cost tracking (required)
   */
  async analyze(content, type = 'text', userId = 'anonymous') {
    try {
      const requestedModel = 'gpt-4o';
      
      // ✅ Check cost limits
      const costCheck = await costManager.canMakeRequest(userId, requestedModel);
      if (!costCheck.allowed) {
        throw new Error(`Analysis denied: ${costCheck.message}`);
      }

      const finalModel = costCheck.model || requestedModel;
      const openaiClient = getOpenAI();
      if (!openaiClient) {
        throw new Error('OpenAI API key is not configured');
      }
      const completion = await openaiClient.chat.completions.create({
        model: finalModel,
        messages: [
          { role: 'system', content: 'Analyze the following content and provide detailed insights.' },
          { role: 'user', content }
        ],
      });

      // ✅ Calculate and log cost
      const usage = completion.usage;
      const cost = costManager.calculateCost(finalModel, usage.prompt_tokens, usage.completion_tokens);
      await costManager.logUsage(userId, finalModel, usage.prompt_tokens, usage.completion_tokens, cost);

      return {
        analysis: completion.choices[0].message.content,
        type,
        model: finalModel,
        cost: cost.toFixed(4),
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  },

  /**
   * Get cost usage statistics
   * @param {string} userId - User ID
   */
  async getUsageStats(userId) {
    return await costManager.getUsageStats(userId);
  },
};

export const Maps = {
  async getRoute(from, to, provider = 'apple') {
    try {
      // ✅ استخدام Apple Maps أولاً
      if (provider === 'apple' || !process.env.GOOGLE_MAPS_API_KEY) {
        try {
          return await appleMapsService.getRoute(from, to);
        } catch (appleError) {
          console.warn('Apple Maps failed, falling back to Google:', appleError.message);
          // Fallback to Google
        }
      }
      
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('No Maps API key configured');

      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: typeof from === 'string' ? from : `${from.latitude},${from.longitude}`,
          destination: typeof to === 'string' ? to : `${to.latitude},${to.longitude}`,
          key: apiKey,
          language: 'ar',
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Route not found');
      }

      const route = response.data.routes[0];
      return {
        distance: route.legs[0].distance,
        duration: route.legs[0].duration,
        steps: route.legs[0].steps.map(step => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance,
          duration: step.duration,
        })),
        polyline: route.overview_polyline.points,
        destination: {
          latitude: route.legs[0].end_location.lat,
          longitude: route.legs[0].end_location.lng,
        }
      };
    } catch (error) {
      console.error('Maps route error:', error);
      throw error;
    }
  },

  async searchLocation(query, location = null, provider = 'apple', radius = 5000, type = null) {
    try {
      // ✅ استخدام Apple Maps أولاً
      if (provider === 'apple' || !process.env.GOOGLE_MAPS_API_KEY) {
        try {
          return await appleMapsService.searchLocation(query, location, radius);
        } catch (appleError) {
          console.warn('Apple Maps failed, falling back to Google:', appleError.message);
          // Fallback to Google
        }
      }
      
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('No Maps API key configured');

      const params = {
        query,
        key: apiKey,
        language: 'ar',
      };
      if (location) {
        params.location = `${location.latitude},${location.longitude}`;
        params.radius = radius;
      }
      if (type) params.type = type;

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', { params });

      return {
        places: response.data.results.map(place => ({
          name: place.name,
          address: place.formatted_address,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          rating: place.rating,
          types: place.types,
        })),
        provider: 'google',
      };
    } catch (error) {
      console.error('Maps search error:', error);
      throw error;
    }
  },

  async geocodeAddress(address, provider = 'google') {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('Google Maps API key not configured');

      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address, key: apiKey, language: 'ar' }
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
  },

  async reverseGeocode(latitude, longitude, provider = 'google') {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('Google Maps API key not configured');

      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { latlng: `${latitude},${longitude}`, key: apiKey, language: 'ar' }
      });

      if (response.data.status !== 'OK') {
        throw new Error('Location not found');
      }

      return response.data.results[0].formatted_address;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      throw error;
    }
  },

  async getNearby(latitude, longitude, type = null, radius = 1000, provider = 'google') {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('Google Maps API key not configured');

      const params = {
        location: `${latitude},${longitude}`,
        radius,
        key: apiKey,
        language: 'ar',
      };
      if (type) params.type = type;

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', { params });

      return {
        places: response.data.results.map(place => ({
          name: place.name,
          address: place.vicinity,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          rating: place.rating,
          types: place.types,
        })),
      };
    } catch (error) {
      console.error('Nearby places error:', error);
      throw error;
    }
  },

  async getTrafficInfo(route, location) {
    return { status: 'normal', congestion: 'low' };
  },

  async calculateETA(from, to, route) {
    try {
      const routeData = await this.getRoute(from, to);
      return {
        eta: new Date(Date.now() + routeData.duration.value * 1000).toISOString(),
        distance: routeData.distance,
        duration: routeData.duration,
      };
    } catch (error) {
      console.error('ETA calculation error:', error);
      throw error;
    }
  }
};

export const Weather = {
  async getCurrentWeather(latitude, longitude) {
    try {
      // ✅ استخدام WeatherKit أولاً
      try {
        return await weatherKitService.getCurrentWeather(latitude, longitude);
      } catch (weatherKitError) {
        console.warn('WeatherKit failed, falling back to Open-Meteo:', weatherKitError.message);
        // Fallback to Open-Meteo
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude,
            longitude,
            current_weather: true,
            timezone: 'auto',
          }
        });

        const current = response.data.current_weather;
        return {
          temperature: current.temperature,
          windSpeed: current.windspeed,
          windDirection: current.winddirection,
          weatherCode: current.weathercode,
          isDay: current.is_day === 1,
          time: current.time,
        };
      }
    } catch (error) {
      console.error('Weather error:', error);
      throw error;
    }
  },

  async getForecast(latitude, longitude, days = 7) {
    try {
      // ✅ استخدام WeatherKit أولاً
      try {
        return await weatherKitService.getForecast(latitude, longitude, days);
      } catch (weatherKitError) {
        console.warn('WeatherKit failed, falling back to Open-Meteo:', weatherKitError.message);
        // Fallback to Open-Meteo
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude,
            longitude,
            daily: 'temperature_2m_max,temperature_2m_min,weathercode',
            timezone: 'auto',
            forecast_days: days,
          }
        });

        return {
          daily: response.data.daily,
          timezone: response.data.timezone,
        };
      }
    } catch (error) {
      console.error('Forecast error:', error);
      throw error;
    }
  }
};

export const Voice = {
  async transcribe(audioBuffer, language = 'ar') {
    try {
      const openaiClient = getOpenAI();
      if (!openaiClient) {
        throw new Error('OpenAI API key is not configured');
      }
      const response = await openaiClient.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioBuffer,
        language,
      });
      return { text: response.text };
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  },

  async textToSpeech(text, voice = 'alloy') {
    try {
      const openaiClient = getOpenAI();
      if (!openaiClient) {
        throw new Error('OpenAI API key is not configured');
      }
      const response = await openaiClient.audio.speech.create({
        model: 'tts-1',
        voice,
        input: text,
      });
      return response;
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }
};

export default { AI, Maps, Weather, Voice };
