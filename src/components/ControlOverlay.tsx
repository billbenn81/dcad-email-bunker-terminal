import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Sparkles, Sliders, Info, ShieldAlert, Upload, Music, RotateCcw } from 'lucide-react';
import { bunkerAudio } from '../utils/audio';

interface ControlOverlayProps {
  isAudioActive: boolean;
  onToggleAudio: () => void;
  spotlightIntensity: number;
  setSpotlightIntensity: (val: number) => void;
  isSwayEnabled: boolean;
  setIsSwayEnabled: (val: boolean) => void;
  isSittingDown: boolean;
  onStandUp: () => void;
}

export const ControlOverlay: React.FC<ControlOverlayProps> = ({
  isAudioActive,
  onToggleAudio,
  spotlightIntensity,
  setSpotlightIntensity,
  isSwayEnabled,
  setIsSwayEnabled,
  isSittingDown,
  onStandUp,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [droneLevel, setDroneLevel] = useState(1);
  const [elecLevel, setElecLevel] = useState(1);
  const [soundPreset, setSoundPreset] = useState<'cavern' | 'bunker'>(bunkerAudio.getPreset());
  const [customAudioFileName, setCustomAudioFileName] = useState<string | null>(bunkerAudio.getCustomAudioName());
  const [urlInput, setUrlInput] = useState('');
  const [urlNotice, setUrlNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomAudioFileName(bunkerAudio.getCustomAudioName());
  }, [isAudioActive]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      bunkerAudio.loadCustomAudioFile(file);
      setCustomAudioFileName(file.name);
      setUrlNotice(null);
      if (!isAudioActive) {
        onToggleAudio();
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const trimmed = urlInput.trim();

    // Check if user pasted Pixabay webpage link (or similar HTML web pages)
    if (trimmed.includes('pixabay.com/sound-effects') || trimmed.includes('pixabay.com/music') || (trimmed.includes('pixabay.com') && !trimmed.includes('cdn.pixabay.com'))) {
      setUrlNotice(
        "⚠️ Pixabay webpage link detected! Browsers cannot stream HTML web pages as raw audio. Please download the .mp3 file from Pixabay to your computer, then click 'CHOOSE LOCAL MP3 FILE' below to upload it!"
      );
      return;
    }

    // Try loading direct audio URL
    setUrlNotice(null);
    bunkerAudio.loadCustomAudioFile(trimmed, 'Custom Audio Stream');
    setCustomAudioFileName('URL: ' + trimmed.split('/').pop());
    if (!isAudioActive) {
      onToggleAudio();
    }
  };

  const handleClearCustomAudio = () => {
    bunkerAudio.clearCustomAudio();
    setCustomAudioFileName(null);
    setUrlNotice(null);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePresetSelect = (preset: 'cavern' | 'bunker') => {
    setSoundPreset(preset);
    bunkerAudio.setPreset(preset);
    if (customAudioFileName) {
      handleClearCustomAudio();
    }
    bunkerAudio.playTerminalClick('futuristic');
  };

  const handleVolumeChange = (dLevel: number, eLevel: number) => {
    setDroneLevel(dLevel);
    setElecLevel(eLevel);
    bunkerAudio.setVolumes(isAudioActive ? 0.6 : 0, dLevel, eLevel);
  };

  return (
    <div className="pointer-events-auto fixed top-4 right-4 z-40 flex items-center gap-2 font-mono">
      {/* Audio Sound Toggle */}
      <button
        onClick={() => {
          onToggleAudio();
          bunkerAudio.playTerminalClick('futuristic');
        }}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold uppercase transition-all shadow-lg active:scale-95 ${
          isAudioActive
            ? 'border-emerald-500/80 bg-stone-900/90 text-emerald-400 shadow-emerald-950/60'
            : 'border-amber-900/60 bg-stone-950/90 text-amber-500/80 hover:text-amber-400'
        }`}
        title="Toggle Ambient Audio (Atmospheric Sub Drone & Cavern Soundscape)"
      >
        {isAudioActive ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {isAudioActive ? 'AUDIO ONLINE' : 'INITIALIZE AUDIO'}
        </span>
      </button>

      {/* Settings / Atmosphere Controls */}
      <button
        onClick={() => {
          setShowSettings(!showSettings);
          setShowInfo(false);
          bunkerAudio.playTerminalClick('retro');
        }}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-950/90 text-stone-300 hover:border-stone-600 hover:bg-stone-900 transition-all shadow-lg active:scale-95"
        title="Bunker Visual & Audio Calibration"
      >
        <Sliders className="h-4 w-4" />
      </button>

      {/* Info / Mission Briefing */}
      <button
        onClick={() => {
          setShowInfo(!showInfo);
          setShowSettings(false);
          bunkerAudio.playTerminalClick('futuristic');
        }}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-950/90 text-stone-300 hover:border-stone-600 hover:bg-stone-900 transition-all shadow-lg active:scale-95"
        title="Bunker Information"
      >
        <Info className="h-4 w-4" />
      </button>

      {/* Settings Drawer Modal */}
      {showSettings && (
        <div className="absolute top-12 right-0 w-80 rounded-2xl border border-amber-900/60 bg-stone-950/95 p-4 text-xs shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-amber-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              BUNKER CALIBRATION
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          </div>

          {/* Camera Sway Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-stone-300">
              <div className="font-bold">FIRST-PERSON BREATH SWAY</div>
              <div className="text-[10px] text-stone-500">Realistic room camera oscillation</div>
            </div>
            <button
              onClick={() => setIsSwayEnabled(!isSwayEnabled)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                isSwayEnabled
                  ? 'border-emerald-500/80 bg-emerald-950/60 text-emerald-400'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
            >
              {isSwayEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Spotlight Intensity */}
          <div className="space-y-1">
            <div className="flex justify-between text-stone-300">
              <span className="font-bold">SPOTLIGHT INTENSITY</span>
              <span className="text-amber-400">{Math.round(spotlightIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.8"
              step="0.1"
              value={spotlightIntensity}
              onChange={(e) => setSpotlightIntensity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-stone-900 h-1.5 rounded"
            />
          </div>

          {/* Sound Preset Switcher */}
          <div className="space-y-1.5 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>ATMOSPHERIC SOUND PRESET</span>
              <span className="text-[9px] text-stone-500 font-normal">SYNTHESIZED</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handlePresetSelect('cavern')}
                className={`flex flex-col items-start gap-0.5 rounded-lg border p-2 text-left transition-all ${
                  soundPreset === 'cavern' && !customAudioFileName
                    ? 'border-emerald-500/90 bg-emerald-950/70 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <span className="font-bold text-[10px] uppercase flex items-center gap-1">
                  🏞️ ARCHI CAVERN
                </span>
                <span className="text-[9px] text-stone-400 leading-tight">
                  Subterranean cavern echoes & deep wind sweeps
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect('bunker')}
                className={`flex flex-col items-start gap-0.5 rounded-lg border p-2 text-left transition-all ${
                  soundPreset === 'bunker' && !customAudioFileName
                    ? 'border-amber-500/90 bg-amber-950/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <span className="font-bold text-[10px] uppercase flex items-center gap-1">
                  ⚡ BUNKER DRONE
                </span>
                <span className="text-[9px] text-stone-400 leading-tight">
                  60Hz high-voltage transformer hum & CRT static
                </span>
              </button>
            </div>
          </div>

          {/* Custom Audio File Override & URL Loader */}
          <div className="space-y-2.5 rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <div className="flex items-center justify-between text-stone-200">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <Music className="h-3.5 w-3.5" />
                CUSTOM AUDIO / FILE OVERRIDE
              </span>
              {customAudioFileName && (
                <button
                  onClick={handleClearCustomAudio}
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-500 hover:text-amber-300"
                  title="Reset to default sound preset"
                >
                  <RotateCcw className="h-3 w-3" />
                  RESET
                </button>
              )}
            </div>

            {customAudioFileName ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-950/80 border border-emerald-500/60 p-2 text-[11px] text-emerald-300 shadow-md">
                <span className="truncate max-w-[180px] font-mono font-bold">🎵 {customAudioFileName}</span>
                <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-900/90 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  PLAYING
                </span>
              </div>
            ) : (
              <p className="text-[10px] text-stone-400 leading-tight">
                Upload an `.mp3` / `.wav` file or paste a direct audio URL to play your soundscape.
              </p>
            )}

            {/* Paste URL Input Form */}
            <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Paste MP3 / Audio link here..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-[10px] text-stone-200 placeholder-stone-600 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-amber-600/80 bg-amber-950/60 px-2.5 py-1.5 text-[10px] font-bold text-amber-300 hover:bg-amber-900/80 transition-all"
              >
                LOAD
              </button>
            </form>

            {/* Pixabay Notice / Helpful Tip Banner */}
            {urlNotice && (
              <div className="rounded-lg border border-amber-500/70 bg-amber-950/80 p-2.5 text-[10px] text-amber-200 leading-normal space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  Pixabay Link Guidance
                </div>
                <p className="text-[10px] text-amber-100/90">
                  Pixabay webpage URLs (<code className="bg-stone-900 px-1 rounded text-amber-300">https://pixabay.com/...</code>) are HTML web pages, not direct raw audio files. Browsers block streaming HTML pages as audio.
                </p>
                <div className="pt-1 font-bold text-emerald-300">
                  👉 To play this sound: Click <span className="underline">"Download"</span> on Pixabay to save the <code className="text-amber-200">.mp3</code> file to your computer, then click the button below to upload it!
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/80 bg-amber-950/50 py-2 text-[11px] font-bold text-amber-300 hover:border-amber-400 hover:bg-amber-900/80 transition-all shadow-md active:scale-98"
            >
              <Upload className="h-3.5 w-3.5" />
              {customAudioFileName ? 'CHOOSE ANOTHER LOCAL FILE' : 'CHOOSE LOCAL AUDIO FILE (.MP3)'}
            </button>
          </div>

          {/* Low Frequency Drone Level */}
          <div className="space-y-1">
            <div className="flex justify-between text-stone-300">
              <span className="font-bold">LOW FREQ SUB DRONE</span>
              <span className="text-emerald-400">{Math.round(droneLevel * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={droneLevel}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value), 0)}
              className="w-full accent-emerald-500 bg-stone-900 h-1.5 rounded"
            />
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="absolute top-12 right-0 w-80 sm:w-96 rounded-2xl border border-stone-800 bg-stone-950/95 p-5 text-xs shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-stone-200 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-amber-500">
              <ShieldAlert className="h-4 w-4" />
              DCAD BUNKER BRIEFING
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-stone-500 hover:text-stone-300"
            >
              ✕
            </button>
          </div>

          <p className="text-stone-300 leading-relaxed text-[11px]">
            Welcome to the Denton Central Appraisal District (DCAD) Secure System Landing Hub.
          </p>

          <div className="space-y-2 rounded-lg bg-black/60 p-3 border border-stone-800 text-[10px] text-stone-400">
            <div>
              <strong className="text-emerald-400 block">RC TERMINAL (LEFT MONITOR)</strong>
              Retro Email Generator system with pulsating phosphor glow.
            </div>
            <div>
              <strong className="text-cyan-400 block">OPEN RECORDS TERMINAL (RIGHT MONITOR)</strong>
              Futuristic PADD response generator with constant luminescent glow.
            </div>
          </div>

          <div className="text-[10px] text-stone-500 flex items-center justify-between pt-1">
            <span>MOUSE PARALLAX & SWAY ACTIVE</span>
            <span className="text-amber-500 font-bold">CLEARANCE LEVEL 3</span>
          </div>
        </div>
      )}
    </div>
  );
};
