import React, { useEffect, useState } from 'react';
import { LineResult, HexagramData, DetailedAnalysis, LibraryTarget } from '../types';
import { calculateHexagrams } from '../utils/iching';
import { generateInterpretation } from '../services/geminiService';
import HexagramIcon from '../components/HexagramIcon';

interface ResultProps {
  lines: LineResult[];
  question: string;
  onBack: () => void;
  aiPromise?: Promise<DetailedAnalysis> | null;
  onNavigateToLibrary?: (target: LibraryTarget) => void;
}

const Result: React.FC<ResultProps> = ({ lines, question, onBack, aiPromise }) => {
  const [data, setData] = useState<{primary: HexagramData, relating?: HexagramData} | null>(null);
  const [aiData, setAiData] = useState<DetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lines.length !== 6) return;

    const { primary, relating } = calculateHexagrams(lines);
    setData({ primary, relating });

    const loadData = async () => {
        setLoading(true);
        try {
            let interpretation: DetailedAnalysis;
            if (aiPromise) {
                interpretation = await aiPromise;
            } else {
                interpretation = await generateInterpretation(question, primary, relating, lines);
            }
            setAiData(interpretation);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [lines, question, aiPromise]);

  if (!data) return <div className="h-screen flex items-center justify-center text-primary">计算中...</div>;

  return (
    <div className="h-screen flex flex-col relative animate-fade-in overflow-hidden bg-background-dark">
       <header className="flex items-center justify-between p-4 z-20 bg-background-dark/95 backdrop-blur-md border-b border-white/5 sticky top-0 shadow-lg">
            <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-lighter transition-colors text-white/70">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display text-lg font-medium tracking-wide text-primary/90">易经神谕</h1>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-lighter transition-colors text-white/70">
                <span className="material-symbols-outlined">share</span>
            </button>
       </header>

       <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4 custom-scrollbar space-y-6">
            
            {/* Hexagram Display Section - Modified to show both if relating exists */}
            <div className={`flex items-stretch justify-center gap-2 ${data.relating ? 'min-h-[160px]' : ''}`}>
                
                {/* Primary Hexagram */}
                <div className={`relative flex-1 flex flex-col items-center justify-center bg-surface-dark rounded-xl border border-primary/20 p-6 shadow-card overflow-hidden group transition-all`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-4">
                             {/* If relating exists, use smaller icon, otherwise medium */}
                            <HexagramIcon binary={data.primary.binary} size={data.relating ? "sm" : "md"} activeLines={lines.map(l => l.isChanging)} />
                        </div>
                        <h1 className={`font-bold tracking-widest text-white drop-shadow-md font-display ${data.relating ? 'text-2xl' : 'text-4xl'}`}>
                            {data.primary.name}
                        </h1>
                         <p className="text-primary/60 text-xs font-normal tracking-wide uppercase italic mt-1">{data.primary.nature}</p>
                         <span className="text-white/20 text-[10px] tracking-widest uppercase mt-3 border border-white/10 px-2 py-0.5 rounded-full">本卦</span>
                    </div>
                </div>

                {/* Arrow Indicator */}
                {data.relating && (
                    <div className="flex flex-col justify-center items-center text-primary/30 w-8">
                        <span className="material-symbols-outlined text-2xl animate-pulse">arrow_forward</span>
                    </div>
                )}

                {/* Relating Hexagram */}
                {data.relating && (
                     <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-dark rounded-xl border border-white/5 p-6 shadow-card overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-4">
                                <HexagramIcon binary={data.relating.binary} size="sm" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-widest text-white drop-shadow-md font-display">
                                {data.relating.name}
                            </h1>
                            <p className="text-white/40 text-xs font-normal tracking-wide uppercase italic mt-1">{data.relating.nature}</p>
                            <span className="text-white/20 text-[10px] tracking-widest uppercase mt-3 border border-white/10 px-2 py-0.5 rounded-full">变卦</span>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Analysis Content */}
            {!loading && aiData ? (
                <div className="space-y-6 animate-slide-up">
                    
                    {/* 1. Concrete Strategy */}
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/30 shadow-glow">
                        <h2 className="flex items-center gap-2 text-primary font-display font-bold text-lg mb-2">
                            <span className="material-symbols-outlined">lightbulb</span>
                            方针指南
                        </h2>
                        <p className="text-lg text-white font-display leading-relaxed font-medium">
                            {aiData.concreteStrategy}
                        </p>
                    </div>

                    {/* 2. Expert Insights (Grouped Master Quotes & Zhang Mingren) */}
                    <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
                         <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                             <span className="material-symbols-outlined text-primary/70">psychology</span>
                             <h3 className="text-white font-display font-bold text-lg">名家见解</h3>
                        </div>

                        {/* Master Quotes */}
                        <div className="mb-6">
                            <h4 className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-2">大师断语</h4>
                            <div className="pl-3 border-l-2 border-primary/20 space-y-2">
                                <p className="text-white/90 text-sm leading-relaxed"><span className="text-primary/70 font-bold mr-2">综合:</span>{aiData.masterQuotes.summary}</p>
                                <p className="text-white/90 text-sm leading-relaxed"><span className="text-primary/70 font-bold mr-2">告诫:</span>{aiData.masterQuotes.advice}</p>
                            </div>
                        </div>

                        {/* Zhang Mingren */}
                        <div>
                             <h4 className="text-primary/60 text-xs font-bold tracking-widest uppercase mb-2">易理精解</h4>
                             <div className="bg-white/5 p-3 rounded-lg mb-4">
                                <span className="block text-primary/40 text-[10px] mb-1">基本解释</span>
                                <p className="text-white text-sm">{aiData.zhangMingren.explanation}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <div className="col-span-2">
                                     <span className="text-primary/60 text-xs block mb-1">特性</span>
                                     <p className="text-white/90">{aiData.zhangMingren.characteristics}</p>
                                </div>
                                <InfoBlock label="运势" value={aiData.zhangMingren.luck} />
                                <InfoBlock label="家运" value={aiData.zhangMingren.family} />
                                <InfoBlock label="疾病" value={aiData.zhangMingren.sickness} />
                                <InfoBlock label="失物" value={aiData.zhangMingren.lost} />
                                <InfoBlock label="诉讼" value={aiData.zhangMingren.lawsuit} />
                                <InfoBlock label="出行" value={aiData.zhangMingren.travel} />
                             </div>
                        </div>
                    </div>

                    {/* 3. Traditional Interpretation */}
                    <div className="bg-surface-dark rounded-xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                             <span className="material-symbols-outlined text-primary/70">history_edu</span>
                             <h3 className="text-white font-display font-bold text-lg">传统解卦</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <InfoRow label="大象" value={aiData.traditional.description} />
                            <InfoRow label="事业" value={aiData.traditional.career} />
                            <InfoRow label="经商" value={aiData.traditional.business} />
                            <InfoRow label="求名" value={aiData.traditional.fame} />
                            <InfoRow label="婚恋" value={aiData.traditional.love} />
                            <InfoRow label="决策" value={aiData.traditional.decision} />
                        </div>
                    </div>

                    {/* 4. Line Analysis / Text */}
                    <div className="bg-surface-dark rounded-xl p-5 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-6xl">format_quote</span>
                        </div>
                        <h3 className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">爻辞详解</h3>
                        <p className="text-white/90 leading-relaxed italic border-l-2 border-primary/40 pl-4 py-1">
                            {aiData.lineAnalysis}
                        </p>
                         <div className="mt-4 pt-4 border-t border-white/5">
                             <p className="text-white/50 text-xs">原文：{aiData.original.split('\n')[0]}</p>
                         </div>
                    </div>

                    <div className="h-8"></div>
                </div>
            ) : (
                /* Loading Skeleton */
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-surface-dark rounded-xl"></div>
                    <div className="h-24 bg-surface-dark rounded-xl"></div>
                    <div className="h-48 bg-surface-dark rounded-xl"></div>
                </div>
            )}
       </div>
    </div>
  );
};

// Helper Components for Layout
const InfoRow: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:gap-2 border-b border-white/5 pb-2 last:border-0 last:pb-0">
        <span className="text-primary/70 font-bold min-w-[3rem] text-xs uppercase tracking-wider mb-1 sm:mb-0">{label}</span>
        <span className="text-white/90 leading-relaxed">{value}</span>
    </div>
);

const InfoBlock: React.FC<{label: string, value: string, fullWidth?: boolean}> = ({ label, value, fullWidth }) => (
    <div className={fullWidth ? 'col-span-2' : ''}>
        <span className="text-primary/60 text-xs block mb-1">{label}</span>
        <p className="text-white/90">{value}</p>
    </div>
);

export default Result;