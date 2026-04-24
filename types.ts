export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  CHARGING = 'CHARGING'
}

export enum PersonalityMode {
  STRICT_COACH = 'Strict Coach',
  GENTLE_PARTNER = 'Gentle Partner',
  ANIME_CHUUNI = 'Anime Chuuni'
}

export interface Device {
  id: string;
  name: string; // e.g., "Living Room", "Son's Desk"
  owner: string; // e.g., "Mom", "Son"
  status: DeviceStatus;
  batteryLevel: number;
  currentPersona: PersonalityMode;
  stats: {
    caloriesToday: number;
    snacksIntercepted: number;
  };
}

export interface ShellDesign {
  id: string;
  prompt: string;
  imageUrl: string; // URL of the generated concept
  style: string; // e.g., Cyberpunk, Pixel Art
  createdAt: number;
  isPrinted: boolean;
}

export interface RagDocument {
  id: string;
  name: string;
  type: 'Medical' | 'Educational' | 'General';
  uploadDate: string;
}

export interface MotionGame {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  type: 'Neck' | 'Squat' | 'Focus';
}