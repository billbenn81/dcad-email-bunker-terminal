import React from 'react';
import { motion } from 'motion/react';
import { TerminalId } from '../types';

interface MonitorHotspotsProps {
  hoveredTerminal: TerminalId | null;
  onHover: (id: TerminalId | null) => void;
  onClick: (id: TerminalId) => void;
  isSittingDown: boolean;
}

export const MonitorHotspots: React.FC<MonitorHotspotsProps> = ({
  hoveredTerminal,
  onHover,
  onClick,
  isSittingDown,
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      {/* 
        ---------------------------------------------------------
        LEFT MONITOR: RETRO CRT (RC TERMINAL)
        Center Illumination (No Border Glow)
        ---------------------------------------------------------
      */}
      <div
        className="group absolute cursor-pointer overflow-visible transition-all duration-300"
        style={{
          left: '34.0%',
          top: '53.5%',
          width: '10.2%',
          height: '17.8%',
        }}
        onMouseEnter={() => onHover('retro')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick('retro')}
      >
        {/* Phosphor Green Radial Illumination from Screen Center */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
          <div
            className={`h-[118%] w-[118%] rounded-full animate-pulse-radial-green transition-all duration-500 ${
              hoveredTerminal === 'retro'
                ? 'opacity-100 scale-110 brightness-130'
                : 'opacity-70 scale-95 brightness-100'
            }`}
            style={{
              background:
                'radial-gradient(circle at center, rgba(16, 185, 129, 0.95) 0%, rgba(16, 185, 129, 0.45) 24%, rgba(16, 185, 129, 0.12) 48%, transparent 72%)',
              filter: hoveredTerminal === 'retro' ? 'blur(3px)' : 'blur(5px)',
            }}
          />
        </div>

        {/* Hover Action Badge over Left CRT Screen */}
        {hoveredTerminal === 'retro' && !isSittingDown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 -top-14 -translate-x-1/2 whitespace-nowrap rounded-lg border border-emerald-500/80 bg-stone-950/95 px-3.5 py-1.5 font-mono text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-md z-30"
          >
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SIT DOWN AT RC TERMINAL</span>
            </div>
            <div className="text-[9px] text-stone-400 font-normal text-center mt-0.5">
              RC EMAIL GENERATOR
            </div>
          </motion.div>
        )}
      </div>

      {/* 
        ---------------------------------------------------------
        RIGHT MONITOR: FUTURISTIC PADD (OPEN RECORDS TERMINAL)
        Center Illumination (No Border Glow)
        ---------------------------------------------------------
      */}
      <div
        className="group absolute cursor-pointer overflow-visible transition-all duration-300"
        style={{
          left: '55.0%',
          top: '58.6%',
          width: '13.4%',
          height: '15.0%',
        }}
        onMouseEnter={() => onHover('futuristic')}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick('futuristic')}
      >
        {/* Cyan Radial Illumination from Screen Center */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
          <div
            className={`h-[100%] w-[100%] rounded-full animate-pulse-radial-cyan transition-all duration-500 ${
              hoveredTerminal === 'futuristic'
                ? 'opacity-100 scale-110 brightness-130'
                : 'opacity-70 scale-95 brightness-100'
            }`}
            style={{
              background:
                'radial-gradient(circle at center, rgba(34, 211, 238, 0.95) 0%, rgba(34, 211, 238, 0.45) 20%, rgba(34, 211, 238, 0.12) 42%, transparent 65%)',
              filter: hoveredTerminal === 'futuristic' ? 'blur(3px)' : 'blur(5px)',
            }}
          />
        </div>

        {/* Hover Action Badge over Right PADD Screen */}
        {hoveredTerminal === 'futuristic' && !isSittingDown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 -top-14 -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan-500/80 bg-slate-950/95 px-3.5 py-1.5 font-mono text-xs font-bold text-cyan-300 shadow-2xl backdrop-blur-md z-30"
          >
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SIT DOWN AT OPEN RECORDS TERMINAL</span>
            </div>
            <div className="text-[9px] text-slate-400 font-normal text-center mt-0.5">
              O.R. EMAIL GENERATOR
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
