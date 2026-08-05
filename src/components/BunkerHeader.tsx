import React from 'react';

export const BunkerHeader: React.FC = () => {
  return (
    <header className="pointer-events-none relative z-20 flex flex-col items-center justify-center pt-6 pb-2 text-center select-none">
      {/* Heavy Stenciled Military Heading */}
      <div className="relative">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-[0.2em] text-stone-200 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          DCAD EMAIL BUNKER
        </h1>
        <div className="absolute -inset-1 -z-10 blur-xl bg-amber-500/10 rounded-full" />
      </div>

      {/* Star Decorator Subheading */}
      <div className="mt-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-amber-500/90 uppercase">
        <span className="text-amber-400">★</span>
        <span>SELECT YOUR EMAIL GENERATOR</span>
        <span className="text-amber-400">★</span>
      </div>
    </header>
  );
};
