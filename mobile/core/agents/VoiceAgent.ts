/**
 * VoiceAgent - AI Voice Interaction
 * Handles Real-time voice, Transcription (Whisper), and Synthesis (ElevenLabs).
 */

import { BaseAgent } from './BaseAgent';
import io from 'socket.io-client';
import { Audio } from 'expo-av';

import { API_URL } from '../../services/config';

export class VoiceAgent extends BaseAgent {
  private socket: any;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;

  constructor() {
    super({
      id: 'voice',
      name: 'Voice Agent',
      description: 'Voice-to-Voice and Speech Recognition Engine',
      capabilities: ['start_recording', 'stop_recording', 'transcribe', 'synthesize_speech'],
    });
  }

  protected async onInit(): Promise<void> {
    this.socket = io(`${API_URL}/voice/realtime`, { transports: ['websocket'] });
    this.socket.on('response', (data: any) => {
      if (data.audioUrl) this.playAudio(data.audioUrl);
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'start_recording':
        return await this.startRecording();
      case 'stop_recording':
        return await this.stopRecording();
      case 'transcribe':
        return await this.transcribe(parameters.audioUri);
      case 'synthesize_speech':
        const res = await fetch(`${API_URL}/api/voice/synthesize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: parameters.text }),
        });
        return await res.json();
      default:
        throw new Error('Action not supported in Voice');
    }
  }

  private async startRecording() {
    // فحص الصلاحية فقط - لا نطلب تلقائياً
    const { status } = await Audio.getPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Audio permission not granted - user must enable manually from Settings');
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await this.recording.startAsync();
  }

  private async stopRecording() {
    if (!this.recording) return null;
    await this.recording.stopAndUnloadAsync();
    return this.recording.getURI();
  }

  private async playAudio(audioUrl: string) {
    if (this.sound) await this.sound.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    this.sound = sound;
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) this.emit({ type: 'voice:playback:finished' });
    });
  }

  private async transcribe(audioUri: string) {
    const formData = new FormData();
    formData.append('audio', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' } as any);
    const res = await fetch(`${API_URL}/api/voice/transcribe`, { method: 'POST', body: formData });
    return await res.json();
  }
}