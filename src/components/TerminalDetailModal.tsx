import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowLeft, Terminal, Shield, Cpu, Play } from 'lucide-react';
import { TerminalConfig } from '../types';

interface TerminalDetailModalProps {
  terminal: TerminalConfig;
  onStandUp: () => void;
  onLaunch: () => void;
}

export const TerminalDetailModal: React.FC<TerminalDetailModalProps> = ({
  terminal,
  onStandUp,
  onLaunch,
}) => {
  const isRetro = terminal.id === 'retro';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto relative z-40 max-w-2xl w-full mx-auto p-4 sm:p-6 font-mono"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border-2 backdrop-blur-xl shadow-2xl p-6 sm:p-8 ${
          isRetro
            ? 'border-emerald-500/70 bg-stone-950/95 text-emerald-300 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
            : 'border-cyan-500/70 bg-slate-950/95 text-cyan-200 shadow-[0_0_50px_rgba(34,211,238,0.3)]'
        }`}
      >
        {/* Background scanline grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b border-current/20 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isRetro
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-400'
                  : 'border-cyan-500/50 bg-cyan-950/60 text-cyan-400'
              }`}
            >
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full animate-ping bg-current" />
                <span>TERMINAL ACTIVE // {terminal.badgeLabel}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white">
                {terminal.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onStandUp}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-all active:scale-95 ${
              isRetro
                ? 'border-emerald-700/60 bg-stone-900 text-emerald-400 hover:bg-emerald-950'
                : 'border-cyan-700/60 bg-slate-900 text-cyan-300 hover:bg-cyan-950'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>STAND UP [ESC]</span>
          </button>
        </div>

        {/* Terminal Info & System Specifications */}
        <div className="my-6 space-y-4">
          <div className="rounded-xl border border-current/20 bg-black/40 p-4 text-xs space-y-2">
            <div className="flex justify-between text-stone-400 border-b border-white/10 pb-2">
              <span>SYSTEM ARCHITECTURE:</span>
              <span className="font-bold text-white">{terminal.systemName}</span>
            </div>
            <div className="flex justify-between text-stone-400 border-b border-white/10 pb-2">
              <span>SECURITY CLEARANCE:</span>
              <span className="font-bold text-amber-400">LEVEL 3 AUTHORIZED</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>TARGET URL:</span>
              <span className="font-mono text-[10px] text-current truncate max-w-[260px] sm:max-w-md">
                {terminal.targetUrl}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-stone-300">
            {terminal.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onLaunch}
            className={`w-full sm:flex-1 flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-98 shadow-lg ${
              isRetro
                ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400 shadow-emerald-950/60'
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-cyan-950/60'
            }`}
          >
            <Play className="h-4 w-4 fill-current" />
            <span>ENTER APPLICATION NOW</span>
            <ExternalLink className="h-4 w-4" />
          </button>

          <button
            onClick={onStandUp}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-stone-700 bg-stone-900/80 text-stone-300 hover:bg-stone-800 text-xs font-bold uppercase transition-all"
          >
            RETURN TO BUNKER
          </button>
        </div>

        {/* Security watermark */}
        <div className="mt-6 flex items-center justify-between text-[10px] text-stone-500 border-t border-white/10 pt-3">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-amber-500" />
            DENTON CENTRAL APPRAISAL DISTRICT SECURE SYSTEM ACCESS
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            BUILD 638 // READY
          </span>
        </div>
      </div>
    </motion.div>
  );
};
