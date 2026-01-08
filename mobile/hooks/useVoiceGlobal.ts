/**
 * RARE 4N - Voice Global Hook
 * Hook للصوت العالمي
 */

import { useState, useEffect } from 'react';
import { voiceGlobalService } from '../services/VoiceGlobalService';

export function useVoiceGlobal() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadState();
    
    // Listen for changes
    const kernel = require('../core/RAREKernel').RAREKernel.getInstance();
    const handler = (event: any) => {
      if (event.type === 'voice:global:enabled' || event.type === 'voice:global:disabled') {
        setIsEnabled(event.data?.enabled || false);
      }
    };
    
    kernel.on('voice:global:enabled', handler);
    kernel.on('voice:global:disabled', handler);
    
    return () => {
      kernel.off?.('voice:global:enabled', handler);
      kernel.off?.('voice:global:disabled', handler);
    };
  }, []);

  const loadState = () => {
    setIsEnabled(voiceGlobalService.isVoiceEnabled());
  };

  const toggle = async () => {
    const newState = await voiceGlobalService.toggle();
    setIsEnabled(newState);
    return newState;
  };

  const enable = async () => {
    await voiceGlobalService.enable();
    setIsEnabled(true);
  };

  const disable = async () => {
    await voiceGlobalService.disable();
    setIsEnabled(false);
  };

  return {
    isEnabled,
    toggle,
    enable,
    disable,
  };
}

 * RARE 4N - Voice Global Hook
 * Hook للصوت العالمي
 */

import { useState, useEffect } from 'react';
import { voiceGlobalService } from '../services/VoiceGlobalService';

export function useVoiceGlobal() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    loadState();
    
    // Listen for changes
    const kernel = require('../core/RAREKernel').RAREKernel.getInstance();
    const handler = (event: any) => {
      if (event.type === 'voice:global:enabled' || event.type === 'voice:global:disabled') {
        setIsEnabled(event.data?.enabled || false);
      }
    };
    
    kernel.on('voice:global:enabled', handler);
    kernel.on('voice:global:disabled', handler);
    
    return () => {
      kernel.off?.('voice:global:enabled', handler);
      kernel.off?.('voice:global:disabled', handler);
    };
  }, []);

  const loadState = () => {
    setIsEnabled(voiceGlobalService.isVoiceEnabled());
  };

  const toggle = async () => {
    const newState = await voiceGlobalService.toggle();
    setIsEnabled(newState);
    return newState;
  };

  const enable = async () => {
    await voiceGlobalService.enable();
    setIsEnabled(true);
  };

  const disable = async () => {
    await voiceGlobalService.disable();
    setIsEnabled(false);
  };

  return {
    isEnabled,
    toggle,
    enable,
    disable,
  };
}


