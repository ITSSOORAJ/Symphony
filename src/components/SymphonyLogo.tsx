import React from 'react';

interface SymphonyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SymphonyLogo: React.FC<SymphonyLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Golden Oval Emblem Badge */}
      <div className={`${dimensions} relative shrink-0 rounded-full p-0.5 bg-gradient-to-b from-[#F0D571] via-[#D4AF37] to-[#8C6D1F] shadow-lg flex items-center justify-center`}>
        <div className="w-full h-full bg-[#080808] rounded-full flex items-center justify-center border border-[#D4AF37]/40 relative overflow-hidden">
          {/* Inner Golden Oval */}
          <div className="w-[72%] h-[85%] rounded-[50%] border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-b from-[#18150C] to-[#050505] shadow-inner">
            <svg
              viewBox="0 0 100 120"
              className="w-[80%] h-[80%] text-[#D4AF37] drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]"
              fill="currentColor"
            >
              {/* Stylized 'S' Monogram & Treble Clef Curves */}
              <path d="M 50,15 C 32,15 25,28 25,40 C 25,58 72,52 72,76 C 72,92 56,102 42,102 C 30,102 20,95 18,85 L 28,83 C 30,89 36,94 43,94 C 52,94 62,87 62,76 C 62,58 15,62 15,40 C 15,22 32,7 51,7 C 68,7 78,18 80,30 L 70,32 C 68,23 60,15 50,15 Z" />
              <path d="M 48,0 L 52,0 L 52,118 L 48,118 Z" opacity="0.3" />
              <circle cx="50" cy="110" r="4" fill="#D4AF37" />
            </svg>
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold serif tracking-tight gold-text leading-tight flex items-center gap-1.5">
            SYMPHONY <span className="text-white text-[10px] font-sans tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-full border border-white/10 font-normal">EVENTS</span>
          </span>
          <span className="text-[10px] text-white/50 tracking-wider uppercase font-medium">& Caterers Kerala</span>
        </div>
      )}
    </div>
  );
};
