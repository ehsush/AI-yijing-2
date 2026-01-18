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

const Result: React.FC<ResultProps> = ({ lines, question, onBack, aiPromise, onNavigateToLibrary }) => {
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

  // Find the first moving line to highlight in library
  const movingLineIndex = lines.findIndex(l => l.isChanging);
  // Line index 0-5 needs to convert to position 1-6 for library
  const firstMovingLinePos = movingLineIndex !== -1 ? movingLineIndex + 1 : undefined;

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

       <div className="flex-1 overflow-y-auto pb-20 px-4 pt-4 custom-scrollbar space-y-8">
            {/* Hexagram Card */}
            <div className="relative group w-full flex flex-col items-center bg-surface-dark rounded-xl border border-primary/20 p-8 shadow-card overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
                
                <div className="flex flex-col gap-1 mb-8 relative z-10 w-24">
                     <HexagramIcon binary={data.primary.binary} size="md" activeLines={lines.map(l => l.isChanging)} />
                </div>
                
                <div className="text-center relative z-10 space-y-2">
                    <h1 className="text-4xl font-bold tracking-widest text-white drop-shadow-md font-display">{data.primary.name}为{data.primary.name === '乾' ? '天' : data.primary.name === '坤' ? '地' : data.primary.name}</h1>
                    <p className="text-primary/60 text-base font-normal tracking-wide uppercase italic">{data.primary.nature}</p>
                    <p className="text-white/40 text-xs font-sans tracking-widest mt-1">本卦 (PRIMARY)</p>
                </div>
                
                {onNavigateToLibrary && (
                    <div className="mt-8 relative z-10">
                        <button 
                            onClick={() => onNavigateToLibrary({ hexagramId: data.primary.number, highlightLine: 0 })}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-medium hover:bg-primary hover:text-background-dark transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                            <span>查看原文</span>
                        </button>
                    </div>
                )}
            </div>

            {/* AI Analysis */}
            {!loading && aiData && (
                <>
                    <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/30 shadow-glow">
                        <h2 className="flex items-center gap-2 text-primary font-display font-bold text-lg mb-2">
                            <span className="material-symbols-outlined">lightbulb</span>
                            方针指南
                        </h2>
                        <p className="text-lg text-white font-display leading-relaxed font-medium">
                            {aiData.concreteStrategy}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-2 px-1 pt-4 border-t border-white/5">
                            <span className="material-symbols-outlined text-primary text-[20px]">library_books</span>
                            <h2 className="text-white text-xl font-bold leading-tight tracking-tight">经文考证</h2>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => onNavigateToLibrary?.({ hexagramId: data.primary.number, highlightLine: 0 })}
                                className="group flex items-center justify-between p-4 rounded-lg bg-surface-dark border border-white/5 hover:border-primary/40 hover:bg-[#2A2E35] transition-all duration-300 shadow-sm text-left"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-white font-semibold text-lg">查看本卦原文</span>
                                    <span className="text-white/40 text-xs uppercase tracking-wider">{data.primary.name}卦 卦辞</span>
                                </div>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </div>
                            </button>

                            {firstMovingLinePos && (
                                <button 
                                    onClick={() => onNavigateToLibrary?.({ hexagramId: data.primary.number, highlightLine: firstMovingLinePos })}
                                    className="group flex items-center justify-between p-4 rounded-lg bg-surface-dark border border-[#FF5C5C]/20 hover:border-[#FF5C5C]/60 hover:bg-[#2A2E35] transition-all duration-300 shadow-sm text-left relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF5C5C]/60"></div>
                                    <div className="flex flex-col gap-0.5 pl-2">
                                        <span className="text-white font-semibold text-lg">查看动爻原文</span>
                                        <span className="text-[#FF8A8A] text-xs uppercase tracking-wider">
                                            {lines[firstMovingLinePos-1].isYang ? '九' : '六'}{["初", "二", "三", "四", "五", "上"][firstMovingLinePos-1]}爻辞
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5C5C]/10 text-[#FF5C5C] group-hover:bg-[#FF5C5C] group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </div>
                                </button>
                            )}

                            {data.relating && (
                                <button 
                                    onClick={() => onNavigateToLibrary?.({ hexagramId: data.relating!.number, highlightLine: 0 })}
                                    className="group flex items-center justify-between p-4 rounded-lg bg-surface-dark border border-white/5 hover:border-primary/40 hover:bg-[#2A2E35] transition-all duration-300 shadow-sm text-left"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-white font-semibold text-lg">查看变卦原文</span>
                                        <span className="text-white/40 text-xs uppercase tracking-wider">变卦：{data.relating.name}</span>
                                    </div>
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
       </div>
    </div>
  );
};

export default Result;