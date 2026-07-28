import React from 'react';

export function Marquee({ items, direction = 'left', speed = 40, className = '' }) {
  return (
    <div 
      className={`w-full overflow-hidden whitespace-nowrap flex ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div 
        className="flex items-center w-max animate-marquee hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
        {/* Double the items to create seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-display text-[25px] font-bold tracking-wider uppercase text-[var(--color-charcoal)] mx-8">
              {item}
            </span>
            <span className="text-[var(--color-charcoal)] opacity-50 mx-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
