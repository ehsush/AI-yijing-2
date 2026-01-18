import React from 'react';

interface HexagramIconProps {
  binary: string; // 6 chars, 0=Yin, 1=Yang. Index 0 is Bottom.
  size?: 'sm' | 'md' | 'lg';
  activeLines?: boolean[]; // Highlights for moving lines
}

const HexagramIcon: React.FC<HexagramIconProps> = ({ binary, size = 'md', activeLines }) => {
  const lines = binary.split('');
  
  // Size config
  const w = size === 'sm' ? 40 : size === 'md' ? 80 : 120;
  const h = size === 'sm' ? 32 : size === 'md' ? 64 : 96;
  const gap = size === 'sm' ? 2 : 4;
  
  return (
    <div className="flex flex-col-reverse justify-between" style={{ width: w, height: h }}>
      {lines.map((bit, idx) => {
        const isYang = bit === '1';
        const isActive = activeLines && activeLines[idx];
        
        return (
            <div key={idx} className={`w-full h-[15%] rounded-sm flex justify-between relative ${isActive ? 'animate-pulse' : ''}`}>
                {isActive && <div className="absolute -left-2 top-1/2 w-1 h-1 bg-primary rounded-full -translate-y-1/2 shadow-glow"></div>}
                {isYang ? (
                    <div className={`w-full h-full rounded-sm ${isActive ? 'bg-primary shadow-glow' : 'bg-primary-dim'}`}></div>
                ) : (
                    <>
                        <div className={`w-[45%] h-full rounded-sm ${isActive ? 'bg-primary shadow-glow' : 'bg-primary-dim'}`}></div>
                        <div className={`w-[45%] h-full rounded-sm ${isActive ? 'bg-primary shadow-glow' : 'bg-primary-dim'}`}></div>
                    </>
                )}
            </div>
        );
      })}
    </div>
  );
};

export default HexagramIcon;