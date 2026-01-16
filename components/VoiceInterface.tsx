
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob } from '@google/genai';
import { UI_TEXT, SYSTEM_INSTRUCTION } from '../constants';
import { decodeBase64, encodeBase64, decodeAudioData } from '../services/geminiService';

const VoiceInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario, we'd close the session properly if the SDK supported it directly
      sessionRef.current = null;
    }
    setIsActive(false);
    setTranscription('');
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
  }, []);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encodeBase64(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outAudioContextRef.current.currentTime);
              const buffer = await decodeAudioData(
                decodeBase64(audioData),
                outAudioContextRef.current,
                24000,
                1
              );
              const source = outAudioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outAudioContextRef.current.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live error', e);
            stopSession();
          },
          onclose: () => {
            console.log('Live closed');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          outputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      stopSession();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-12">
      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isActive ? 'bg-red-500 scale-110 animate-pulse' : 'bg-red-100'
        }`}>
          <span className="text-6xl">{isActive ? '🔊' : '🎙️'}</span>
        </div>
        {isActive && (
          <div className="absolute -inset-4 border-2 border-red-400 rounded-full animate-ping opacity-25"></div>
        )}
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-gray-800">
          {isActive ? 'தமீழி கேட்டுக்கொண்டிருக்கிறது...' : 'தமீழியுடன் உரையாடுங்கள்'}
        </h2>
        <p className="text-gray-500 min-h-[3rem]">
          {isConnecting ? 'இணைக்கப் படுகிறது...' : isActive ? transcription || 'பேசத் தொடங்குங்கள்...' : UI_TEXT.ta.voiceInstruction}
        </p>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`px-12 py-4 rounded-full text-white font-bold text-lg shadow-xl transition-all transform active:scale-95 ${
          isActive ? 'bg-gray-800 hover:bg-gray-900' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isConnecting ? 'காத்திருக்கவும்...' : isActive ? 'நிறுத்து' : 'தொடங்கு'}
      </button>

      <div className="bg-red-50 p-4 rounded-xl text-red-800 text-sm max-w-xs border border-red-100">
        💡 குறிப்பு: தமீழி உங்கள் குரலுக்கு நேரடியாக தமிழில் பதிலளிக்கும்.
      </div>
    </div>
  );
};

export default VoiceInterface;
