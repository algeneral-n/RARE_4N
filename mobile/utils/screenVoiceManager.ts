/**
 * RARE 4N - Screen Voice Manager
 * إدارة الصوت على جميع الشاشات
 */

import { voiceGlobalService } from '../services/VoiceGlobalService';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';

export function initializeScreenVoice(screenName: string) {
  if (voiceGlobalService.isVoiceEnabled()) {
    voiceGlobalService.updateScreen(screenName);
    voiceConsciousness.updateScreenContext(screenName);
  }
}

export default {
  initializeScreenVoice,
};

 * RARE 4N - Screen Voice Manager
 * إدارة الصوت على جميع الشاشات
 */

import { voiceGlobalService } from '../services/VoiceGlobalService';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';

export function initializeScreenVoice(screenName: string) {
  if (voiceGlobalService.isVoiceEnabled()) {
    voiceGlobalService.updateScreen(screenName);
    voiceConsciousness.updateScreenContext(screenName);
  }
}

export default {
  initializeScreenVoice,
};


