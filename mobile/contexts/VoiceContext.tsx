/**
 * RARE 4N - Voice Context
 * Context للصوت
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';
import { voiceGlobalService } from '../services/VoiceGlobalService';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  toggleVoice: () => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

const VoiceContext = createContext<VoiceContextType>({
  isVoiceEnabled: false,
  isListening: false,
  isSpeaking: false,
  toggleVoice: async () => {},
  startListening: async () => {},
  stopListening: async () => {},
});

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    initVoice();
    loadGlobalVoiceState();
  }, []);

  const initVoice = async () => {
    try {
      await voiceConsciousness.init();
    } catch (error) {
      console.error('Voice initialization error:', error);
    }
  };

  const loadGlobalVoiceState = async () => {
    try {
      const isGlobalEnabled = voiceGlobalService.isVoiceEnabled();
      setIsVoiceEnabled(isGlobalEnabled);
    } catch (error) {
      console.error('Error loading global voice state:', error);
    }
  };

  const toggleVoice = async () => {
    try {
      const newState = await voiceGlobalService.toggle();
      setIsVoiceEnabled(newState);
      setIsListening(newState);
    } catch (error) {
      console.error('Voice toggle error:', error);
    }
  };

  const startListening = async () => {
    try {
      await voiceConsciousness.start();
      setIsVoiceEnabled(true);
      setIsListening(true);
    } catch (error) {
      console.error('Start listening error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await voiceConsciousness.stop();
      setIsListening(false);
      setIsVoiceEnabled(false);
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isVoiceEnabled,
        isListening,
        isSpeaking,
        toggleVoice,
        startListening,
        stopListening,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  return useContext(VoiceContext);
}


 * Context للصوت
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';
import { voiceGlobalService } from '../services/VoiceGlobalService';

interface VoiceContextType {
  isVoiceEnabled: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  toggleVoice: () => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

const VoiceContext = createContext<VoiceContextType>({
  isVoiceEnabled: false,
  isListening: false,
  isSpeaking: false,
  toggleVoice: async () => {},
  startListening: async () => {},
  stopListening: async () => {},
});

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    initVoice();
    loadGlobalVoiceState();
  }, []);

  const initVoice = async () => {
    try {
      await voiceConsciousness.init();
    } catch (error) {
      console.error('Voice initialization error:', error);
    }
  };

  const loadGlobalVoiceState = async () => {
    try {
      const isGlobalEnabled = voiceGlobalService.isVoiceEnabled();
      setIsVoiceEnabled(isGlobalEnabled);
    } catch (error) {
      console.error('Error loading global voice state:', error);
    }
  };

  const toggleVoice = async () => {
    try {
      const newState = await voiceGlobalService.toggle();
      setIsVoiceEnabled(newState);
      setIsListening(newState);
    } catch (error) {
      console.error('Voice toggle error:', error);
    }
  };

  const startListening = async () => {
    try {
      await voiceConsciousness.start();
      setIsVoiceEnabled(true);
      setIsListening(true);
    } catch (error) {
      console.error('Start listening error:', error);
    }
  };

  const stopListening = async () => {
    try {
      await voiceConsciousness.stop();
      setIsListening(false);
      setIsVoiceEnabled(false);
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isVoiceEnabled,
        isListening,
        isSpeaking,
        toggleVoice,
        startListening,
        stopListening,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  return useContext(VoiceContext);
}

