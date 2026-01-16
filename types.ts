
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ImageGenerationResult {
  url: string;
  prompt: string;
}

export enum AppMode {
  CHAT = 'chat',
  VOICE = 'voice',
  IMAGE = 'image',
  HOME = 'home'
}
