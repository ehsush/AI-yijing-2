import React, { useState, useEffect, useRef } from 'react';
import { LineResult } from '../types';
import { tossCoins } from '../utils/iching';
import ParticleOverlay, { ParticleRef } from '../components/ParticleOverlay';
import Coin from '../components/Coin';

interface DivinationProps {
  onComplete: (lines: LineResult[], question: string) => void;
  onProcessingStart: (lines: LineResult[], question: string) => void; // New callback for early fetching
  onBack: () => void;
}

const PROMPTS = [
  { label: "运势", id: "luck" },
  { label: "事业", id: "career" },
  { label: "财运", id: "wealth" },
  { label: "感情", id: "love" },
  { label: "健康", id: "health" },
  { label: "学业", id: "study" },
];

const Divination: React.FC<DivinationProps> = ({ onComplete, onProcessingStart, onBack }) => {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<'idle' | 'gathering' | 'tossing' | 'settled' | 'revealing' | 'completed'>('idle');
  const [lines, setLines] = useState<LineResult[]>([]);
  const particleRef = useRef<ParticleRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation Sequence Logic
  const startDivination = () => {
    if (status !== 'idle' || !question.trim()) {
        if (!question.trim()) {
            const input = document.getElementById('question-input');
            input?.classList.add('animate-shake');
            setTimeout(() => input?.classList.remove('animate-shake'), 500);
        }
        return;
    }

    setStatus('gathering');

    // 1. Gathering Phase (Swirl Particles) - 1.5s
    const swirlInterval = setInterval(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            particleRef.current?.triggerSwirl(rect.width / 2, rect.height / 3);
        }
    }, 100);

    setTimeout(() => {
        clearInterval(swirlInterval);
        setStatus('tossing');
        
        if (containerRef.current) {
             const rect = containerRef.current.getBoundingClientRect();
             particleRef.current?.triggerBurst(rect.width/2, rect.height/3);
        }

        // 2. Pre-calculate all 6 lines (logic)
        const allLines: LineResult[] = [];
        for(let i=0; i<6; i++) allLines.push(tossCoins());

        // CRITICAL: Start AI processing NOW, don't wait for animation to finish
        // This gives us ~4-5 seconds of head start
        onProcessingStart(allLines, question);

        // 3. Toss Animation Duration (Coin Flip CSS) - 1.2s
        setTimeout(() => {
            setStatus('settled');
            
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                particleRef.current?.triggerBurst(rect.width/2, rect.height/3);
                particleRef.current?.triggerBurst(rect.width/2 + 20, rect.height/3 + 20);
                particleRef.current?.triggerBurst(rect.width/2 - 20, rect.height/3 - 20);
            }

            // 4. Reveal Phase (One by one) - 3.6s
            setStatus('revealing');
            let revealedCount = 0;
            const revealInterval = setInterval(() => {
                revealedCount++;
                setLines(allLines.slice(0, revealedCount));
                
                const sidebar = document.getElementById('sidebar-lines');
                if (sidebar) {
                    const rect = sidebar.getBoundingClientRect();
                    const slotHeight = rect.height / 6;
                    const top = rect.bottom - (slotHeight * revealedCount);
                    particleRef.current?.triggerSweep({
                        left: rect.left,
                        right: rect.right,
                        top: top,
                        bottom: top + slotHeight
                    });
                }

                if (revealedCount === 6) {
                    clearInterval(revealInterval);
                    setStatus('completed');
                    setTimeout(() => {
                        onComplete(allLines, question);
                    }, 1000);
                }
            }, 600); 

        }, 1200); 

    }, 1500); 
  };

  const handlePromptClick = (label: string) => {
      setQuestion(`近期${label}发展...`);
  };

  return (
    <div className="h-screen flex flex-col relative pb-6 px-4 animate-fade-in overflow-hidden" ref={containerRef}>
        <ParticleOverlay ref={particleRef} />
        
        <header className="flex items-center justify-between p-4 z-20">
            <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-lighter transition-colors text-white/70">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display text-xl font-medium tracking-wide text-primary/90">易经排盘</h1>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-lighter transition-colors text-white/70">
                <span className="material-symbols-outlined">history</span>
            </button>
        </header>

        {/* Question & Prompt Area */}
        <div className={`transition-all duration-500 z-20 flex flex-col items-center mt-4 ${status !== 'idle' ? 'opacity-0 -translate-y-10 pointer-events-none absolute' : 'opacity-100'}`}>
             
             <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                 <Coin side="head" className="scale-75" />
             </div>

             <div className="text-center mb-8 space-y-2">
                 <p className="text-white/60 font-serif italic text-sm">"无事不占，不动不占"</p>
                 <p className="text-white/40 text-xs">凡卜筮者，必先诚意正心</p>
             </div>

             <div className="w-full max-w-xs mb-8">
                 <label className="text-primary/80 text-sm mb-4 block text-center tracking-widest">请输入所求之事</label>
                 <input 
                    id="question-input"
                    type="text" 
                    placeholder="如：近期事业发展..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 text-center text-xl text-white pb-2 focus:outline-none focus:border-primary placeholder-white/10 font-display transition-colors"
                 />
             </div>

             <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                 {PROMPTS.map(p => (
                     <button 
                        key={p.id}
                        onClick={() => handlePromptClick(p.label)}
                        className="border border-white/10 rounded-lg py-3 text-sm text-white/60 hover:border-primary/50 hover:text-primary hover:bg-surface-lighter transition-all active:scale-95"
                     >
                         {p.label}
                     </button>
                 ))}
             </div>
        </div>

        {/* Divination Active Stage */}
        <div className={`flex-1 grid grid-cols-[1fr_80px] gap-4 relative transition-opacity duration-500 ${status === 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative flex flex-col justify-center items-center w-full h-full z-10">
                
                <div className="absolute top-10 w-full text-center z-20">
                    <span className="text-xs font-mono text-primary/60 tracking-widest uppercase animate-pulse">
                        {status === 'gathering' && "凝神聚气 · 感应天地"}
                        {status === 'tossing' && "乾坤运转 · 阴阳交汇"}
                        {status === 'revealing' && "推演卦象 · 探寻天机"}
                        {status === 'completed' && "排盘完成"}
                    </span>
                </div>

                <div className="relative w-64 h-64 flex items-center justify-center mb-16 z-10">
                     <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ${status === 'gathering' ? 'scale-110' : ''}`}>
                         <Coin 
                            side={Math.random() > 0.5 ? 'head' : 'tail'} 
                            className={`absolute transform -translate-x-12 -translate-y-12 transition-all duration-700 ${status === 'gathering' ? 'rotate-12 translate-y-[-60px]' : ''}`} 
                            isFlipping={status === 'tossing'}
                         />
                         <Coin 
                            side={Math.random() > 0.5 ? 'head' : 'tail'} 
                            className={`absolute transform translate-x-12 -translate-y-4 transition-all duration-700 ${status === 'gathering' ? '-rotate-12 translate-x-[60px]' : ''}`} 
                            isFlipping={status === 'tossing'}
                         />
                         <Coin 
                            side={Math.random() > 0.5 ? 'head' : 'tail'} 
                            className={`absolute transform -translate-x-2 translate-y-12 transition-all duration-700 ${status === 'gathering' ? 'rotate-45 translate-y-[60px]' : ''}`} 
                            isFlipping={status === 'tossing'}
                         />
                     </div>
                </div>
            </div>

            <div id="sidebar-lines" className="flex flex-col-reverse justify-between h-full bg-surface-dark/50 rounded-2xl border border-white/5 p-2 py-4 relative backdrop-blur-sm z-20">
                 <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/5 -translate-x-1/2 pointer-events-none"></div>
                 {[...Array(6)].map((_, i) => {
                     const line = lines[i];
                     const isCurrent = i === lines.length && status === 'revealing';
                     
                     return (
                        <div key={i} className={`w-full aspect-[4/3] flex flex-col items-center justify-center gap-1 transition-opacity duration-300 ${!line && !isCurrent ? 'opacity-20' : 'opacity-100'}`}>
                            {line ? (
                                <div className={`w-full h-2 rounded-sm shadow-glow animate-fade-in relative ${line.isYang ? 'bg-gradient-to-r from-primary-dim via-primary to-primary-dim' : 'flex justify-between'}`}>
                                    {!line.isYang && (
                                        <>
                                           <div className="w-[45%] h-full bg-jade rounded-sm shadow-[0_0_8px_rgba(71,108,108,0.5)]"></div>
                                           {line.isChanging && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-primary">✕</div>}
                                           <div className="w-[45%] h-full bg-jade rounded-sm shadow-[0_0_8px_rgba(71,108,108,0.5)]"></div>
                                        </>
                                    )}
                                    {line.isYang && line.isChanging && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-background-dark rounded-full border border-primary"></div>}
                                </div>
                            ) : (
                                <div className={`w-full h-2 rounded-sm border ${isCurrent ? 'border-primary/50 bg-primary/20 animate-pulse' : 'border-white/10'}`}></div>
                            )}
                            <span className={`text-[9px] uppercase tracking-wider font-bold font-mono ${line ? (line.isYang ? 'text-primary' : 'text-jade') : 'text-white/30'}`}>
                                {["初", "二", "三", "四", "五", "上"][i]}爻
                            </span>
                        </div>
                     );
                 })}
            </div>
        </div>
        
        {status === 'idle' && (
             <div className="absolute bottom-12 left-0 w-full px-8 z-30">
                 <button 
                    onClick={startDivination}
                    className="w-full py-4 bg-surface-dark/80 border border-primary/40 text-primary font-display text-lg rounded-xl shadow-lg hover:bg-surface-lighter hover:text-white transition-all active:scale-95"
                 >
                    {question.trim() ? "点击起卦" : "请先输入所求之事"}
                 </button>
             </div>
        )}
        
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-lighter via-background-dark to-black"></div>
    </div>
  );
};

export default Divination;