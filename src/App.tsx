import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalConfig, TerminalId } from './types';
import { BunkerHeader } from './components/BunkerHeader';
import { BunkerFooter } from './components/BunkerFooter';
import { AmbientDust } from './components/AmbientDust';
import { MonitorHotspots } from './components/MonitorHotspots';
import { TerminalDetailModal } from './components/TerminalDetailModal';
import { ControlOverlay } from './components/ControlOverlay';
import { bunkerAudio } from './utils/audio';

// Import local template background image asset
import bunkerBgImage from './assets/images/bunker_terminal_landing_1785951212092.jpg';

const TERMINAL_CONFIGS: Record<TerminalId, TerminalConfig> = {
  retro: {
    id: 'retro',
    name: 'RC TERMINAL',
    subtitle: 'RETRO EMAIL GENERATOR',
    version: 'DCAD-TERM-v2.8',
    systemName: 'DENTON CAD EMAIL GENERATOR // CRT SYSTEM 8086',
    targetUrl:
      'https://aistudio.google.com/u/1/apps/e5497897-35e6-40a6-a173-f9e835766c8f?showPreview=true&showAssistant=true',
    badgeLabel: 'USI Pi-3',
    accentColor: 'green',
    glowStyle: 'pulsating',
    description:
      'Legacy CRT terminal designed for generating Denton CAD Roll Correction emails, Start Year Verifications, and Closing Roll group notifications with green phosphor CRT precision.',
  },
  futuristic: {
    id: 'futuristic',
    name: 'OPEN RECORDS TERMINAL',
    subtitle: 'FUTURISTIC EMAIL GENERATOR',
    version: 'TPA TERMINAL v3.01',
    systemName: 'TPA RESPONSE GENERATOR // TNG PADD v3.01',
    targetUrl:
      'https://aistudio.google.com/u/1/apps/251a11a0-1bb4-4e09-b4db-1fd6014b1c0c?showAssistant=true&showPreview=true',
    badgeLabel: 'TNG PADD',
    accentColor: 'blue',
    glowStyle: 'constant',
    description:
      'Advanced futuristic PADD terminal for processing Open Records requests, Public Information Act automated responses, requestor metadata lookup, and formal document matrix outputs.',
  },
};

export default function App() {
  const [hoveredTerminal, setHoveredTerminal] = useState<TerminalId | null>(null);
  const [focusedTerminal, setFocusedTerminal] = useState<TerminalId | null>(null);
  const [isSittingDown, setIsSittingDown] = useState<boolean>(false);

  // Audio State
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  // Visuals State
  const [spotlightIntensity, setSpotlightIntensity] = useState<number>(1.0);
  const [isSwayEnabled, setIsSwayEnabled] = useState<boolean>(true);

  // Camera Sway & Mouse Parallax
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [swayPos, setSwayPos] = useState<{ x: number; y: number; r: number }>({
    x: 0,
    y: 0,
    r: 0,
  });

  const requestRef = useRef<number | null>(null);

  // Mouse move handler for Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX; // -1 to 1
      const normY = (e.clientY - centerY) / centerY; // -1 to 1
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // USER REQUIREMENT: Breathing sway to the view so it seems like you're standing in the room
  useEffect(() => {
    let startTime = Date.now();

    const animateSway = () => {
      if (isSwayEnabled && !isSittingDown) {
        const elapsed = (Date.now() - startTime) / 1000;
        // Natural human breathing rhythm (~4 seconds period)
        const swayX = Math.sin(elapsed * 0.8) * 8;
        const swayY = Math.cos(elapsed * 1.2) * 5;
        const swayR = Math.sin(elapsed * 0.5) * 0.6; // subtle tilt

        setSwayPos({ x: swayX, y: swayY, r: swayR });
      } else {
        setSwayPos({ x: 0, y: 0, r: 0 });
      }
      requestRef.current = requestAnimationFrame(animateSway);
    };

    requestRef.current = requestAnimationFrame(animateSway);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSwayEnabled, isSittingDown]);

  // Handle ESC key to stand up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSittingDown) {
        handleStandUp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSittingDown]);

  // Handle Toggle Audio
  const handleToggleAudio = () => {
    const playing = bunkerAudio.toggleMute();
    setIsAudioActive(playing);
  };

  // USER REQUIREMENT: When a monitor is clicked, look like sitting down in front of it to view it
  const handleSitDownAtTerminal = (id: TerminalId) => {
    if (!isAudioActive) {
      // Auto enable audio on first explicit interaction
      bunkerAudio.init();
      setIsAudioActive(true);
    }

    bunkerAudio.playSitDownSfx();
    bunkerAudio.playTerminalClick(id);

    setFocusedTerminal(id);
    setIsSittingDown(true);
  };

  const handleStandUp = () => {
    bunkerAudio.playStandUpSfx();
    setIsSittingDown(false);
    setFocusedTerminal(null);
  };

  const handleLaunchTargetApp = (id: TerminalId) => {
    const config = TERMINAL_CONFIGS[id];
    bunkerAudio.playTerminalClick(id);
    window.open(config.targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Compute 3D camera transforms
  const parallaxX = mousePos.x * 12;
  const parallaxY = mousePos.y * 8;

  // Zoom camera parameters when sitting down at a specific monitor
  let sitScale = 1;
  let sitTranslateX = 0;
  let sitTranslateY = 0;

  if (isSittingDown && focusedTerminal) {
    sitScale = 2.4;
    // Shift camera to center directly on selected monitor screen
    sitTranslateX = focusedTerminal === 'retro' ? 11.0 : -12.0;
    sitTranslateY = focusedTerminal === 'retro' ? -13.0 : -16.5;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-stone-950 font-sans select-none text-stone-100 flex flex-col justify-between">
      {/* 
        ---------------------------------------------------------
        FIRST PERSON CAMERA VIEWPORT STAGE (PICTURE + HOTSPOTS)
        ---------------------------------------------------------
      */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative max-w-full max-h-full w-full aspect-[1376/768] flex items-center justify-center"
          animate={{
            x: (isSwayEnabled ? swayPos.x : 0) + parallaxX + (sitTranslateX * window.innerWidth) / 100,
            y: (isSwayEnabled ? swayPos.y : 0) + parallaxY + (sitTranslateY * window.innerHeight) / 100,
            rotate: isSwayEnabled ? swayPos.r : 0,
            scale: sitScale,
          }}
          transition={{
            type: 'spring',
            stiffness: isSittingDown ? 70 : 120,
            damping: isSittingDown ? 20 : 18,
          }}
        >
          {/* Main Background Bunker Image */}
          <img
            src={bunkerBgImage}
            alt="DCAD Email Bunker Terminals"
            className="h-full w-full object-contain object-center transition-all duration-700"
            style={{
              filter: isSittingDown
                ? 'brightness(0.4) contrast(1.15)'
                : `brightness(${0.9 * spotlightIntensity}) contrast(1.15)`,
            }}
          />

          {/* Hotspots & Glowing Screen Overlays directly mapped to actual picture monitors */}
          <MonitorHotspots
            hoveredTerminal={hoveredTerminal}
            onHover={setHoveredTerminal}
            onClick={handleSitDownAtTerminal}
            isSittingDown={isSittingDown}
          />
        </motion.div>
      </div>

      {/* Vignette & Cinematic Dark Edge Shadows */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] opacity-90" />

      {/* Floating Dust Particles in Spotlight */}
      <AmbientDust lightIntensity={spotlightIntensity} />

      {/* Control Panel Overlay (Sound, Sway, Spotlight, Info) */}
      <ControlOverlay
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        spotlightIntensity={spotlightIntensity}
        setSpotlightIntensity={setSpotlightIntensity}
        isSwayEnabled={isSwayEnabled}
        setIsSwayEnabled={setIsSwayEnabled}
        isSittingDown={isSittingDown}
        onStandUp={handleStandUp}
      />

      {/* Bunker Header Banner */}
      <motion.div
        className="relative z-20"
        animate={{
          opacity: isSittingDown ? 0.15 : 1,
          y: isSittingDown ? -20 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <BunkerHeader />
      </motion.div>

      {/* Spacer */}
      <div className="flex-1 pointer-events-none" />

      {/* Bunker Footer Bar */}
      <motion.div
        className="relative z-20"
        animate={{
          opacity: isSittingDown ? 0.15 : 1,
          y: isSittingDown ? 20 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <BunkerFooter />
      </motion.div>

      {/* Sat-Down Focused Terminal Modal Interface */}
      <AnimatePresence>
        {isSittingDown && focusedTerminal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            {/* Backdrop click to stand up */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleStandUp}
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            />

            <TerminalDetailModal
              terminal={TERMINAL_CONFIGS[focusedTerminal]}
              onStandUp={handleStandUp}
              onLaunch={() => handleLaunchTargetApp(focusedTerminal)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

