import React from 'react';

interface CoinProps {
  className?: string;
  isFlipping?: boolean;
  side: 'head' | 'tail'; // 3 (Head/Yang) or 2 (Tail/Yin)
}

// 乾隆通宝 style coin
// Tail (Yin) = 2 = 满文 (Back)
// Head (Yang) = 3 = 汉字 (Front)

const Coin: React.FC<CoinProps> = ({ className, isFlipping, side }) => {
  return (
    <div className={`coin-container w-24 h-24 ${className}`}>
      <div className={`coin-inner ${isFlipping ? 'flip-toss' : ''}`} style={{ transform: !isFlipping && side === 'tail' ? 'rotateY(180deg)' : '' }}>
        
        {/* Front (Head/Yang - 3) - 乾隆通宝 */}
        <div className="coin-front absolute inset-0 rounded-full shadow-lg">
           <CoinVisual isFront={true} />
        </div>

        {/* Back (Tail/Yin - 2) - Manchu Script */}
        <div className="coin-back absolute inset-0 rounded-full shadow-lg">
           <CoinVisual isFront={false} />
        </div>

      </div>
    </div>
  );
};

const CoinVisual = ({ isFront }: { isFront: boolean }) => (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#d4af35] via-[#a68625] to-[#755d16] p-1 flex items-center justify-center border border-[#6b5310] relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
        {/* Inner Texture (Noise) */}
        <div className="absolute inset-0 rounded-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        
        {/* Raised Rim */}
        <div className="absolute inset-1 rounded-full border-4 border-[#e8c85e]/40"></div>

        {/* Center Square Hole */}
        <div className="w-8 h-8 bg-[#171a1c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center"></div>
        <div className="absolute w-9 h-9 border border-[#e8c85e]/30 z-10 opacity-50"></div>

        {/* Characters */}
        {isFront ? (
            <>
                <span className="absolute top-2 left-1/2 -translate-x-1/2 font-chinese text-[#f0da8c] font-bold text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-90">乾</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-chinese text-[#f0da8c] font-bold text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-90">隆</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-chinese text-[#f0da8c] font-bold text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-90">通</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 font-chinese text-[#f0da8c] font-bold text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] opacity-90">宝</span>
            </>
        ) : (
            <>
                 {/* Simplified Manchu script representation using vague shapes or unicode if available. Using abstract curves for 'boo' and 'chiowan' */}
                 <div className="absolute left-1/2 top-3 -translate-x-1/2 w-1 h-5 bg-[#f0da8c]/80 rounded-full blur-[0.5px]"></div>
                 <div className="absolute left-1/2 bottom-3 -translate-x-1/2 w-1 h-5 bg-[#f0da8c]/80 rounded-full blur-[0.5px]"></div>
                 {/* Squiggles */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none p-4 opacity-80" viewBox="0 0 100 100">
                    <path d="M20,50 Q35,45 30,55" stroke="#f0da8c" strokeWidth="2" fill="none" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.8))" />
                    <path d="M80,50 Q65,55 70,45" stroke="#f0da8c" strokeWidth="2" fill="none" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.8))" />
                 </svg>
            </>
        )}
        
        {/* Patina/Dirt Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent opacity-40 mix-blend-multiply"></div>
    </div>
);

export default Coin;