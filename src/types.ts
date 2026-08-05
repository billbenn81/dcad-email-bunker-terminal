export type TerminalId = 'retro' | 'futuristic';

export interface TerminalConfig {
  id: TerminalId;
  name: string;
  subtitle: string;
  version: string;
  systemName: string;
  targetUrl: string;
  badgeLabel: string;
  accentColor: 'green' | 'blue';
  glowStyle: 'pulsating' | 'constant';
  description: string;
}

export interface CameraState {
  focusedTerminal: TerminalId | null;
  isSittingDown: boolean;
  mousePosition: { x: number; y: number };
}

export interface AudioSettings {
  isEnabled: boolean;
  masterVolume: number;
  droneVolume: number;
  electricityVolume: number;
  sfxVolume: number;
}
