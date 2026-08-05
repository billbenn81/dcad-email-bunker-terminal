import React from 'react';

export const BunkerFooter: React.FC = () => {
  return (
    <footer className="pointer-events-none relative z-20 w-full px-4 pb-6 pt-2 select-none">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left Plaque: Authorized Personnel */}
        <div className="hidden md:flex flex-col items-start rounded-lg border border-stone-800 bg-stone-950/80 p-2.5 backdrop-blur-md text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold tracking-wider">
            <span>★ ★ ★</span>
            <span>AUTHORIZED PERSONNEL ONLY</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            CLEARANCE LEVEL 3 REQUIRED
          </div>
        </div>

        {/* Center Plaque: Denton Central Appraisal District */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-amber-900/40 bg-stone-950/90 p-3 shadow-2xl backdrop-blur-md text-center">
          <div className="text-xs font-mono font-extrabold tracking-[0.2em] text-stone-200 uppercase">
            DENTON CENTRAL APPRAISAL DISTRICT
          </div>
          <div className="mt-0.5 flex items-center justify-center gap-2 text-[10px] font-mono text-amber-500/90 font-bold tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>SECURE SYSTEM ACCESS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          </div>
        </div>

        {/* Right Plaque: System Status */}
        <div className="hidden md:flex flex-col items-end rounded-lg border border-stone-800 bg-stone-950/80 p-2.5 backdrop-blur-md text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            VER. 3.01 // BUILD 638
          </div>
        </div>
      </div>
    </footer>
  );
};
