import React, { useState, useEffect, useRef } from 'react';
import { HEXAGRAMS, getHexagramDetail } from '../constants';
import { HexagramData, LibraryTarget, HexagramTextDetail } from '../types';
import HexagramIcon from '../components/HexagramIcon';

interface LibraryProps {
    initialTarget?: LibraryTarget | null;
}

const Library: React.FC<LibraryProps> = ({ initialTarget }) => {
  // Views: 'home' | 'index' (grid) | 'detail'
  const [view, setView] = useState<'home' | 'index' | 'detail'>('home');
  const [search, setSearch] = useState("");
  const [currentHexagram, setCurrentHexagram] = useState<HexagramTextDetail | null>(null);
  const [highlightLine, setHighlightLine] = useState<number | undefined>(undefined);
  
  // Refs for scrolling
  const lineRefs = useRef<{[key: number]: HTMLElement | null}>({});

  // Deep Link Handling
  useEffect(() => {
      if (initialTarget) {
          const hex = getHexagramDetail(initialTarget.hexagramId);
          setCurrentHexagram(hex);
          setHighlightLine(initialTarget.highlightLine);
          setView('detail');
      }
  }, [initialTarget]);

  // Scroll effect when entering detail view
  useEffect(() => {
      if (view === 'detail' && highlightLine !== undefined) {
          setTimeout(() => {
              const ref = lineRefs.current[highlightLine];
              if (ref) {
                  ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }, 300); // Wait for transition
      }
  }, [view, highlightLine, currentHexagram]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      if (e.target.value && view === 'home') setView('index');
      if (!e.target.value && view === 'index') setView('home');
  };

  const openDetail = (id: number) => {
      setCurrentHexagram(getHexagramDetail(id));
      setHighlightLine(undefined); // Reset highlight
      setView('detail');
  };

  const filteredHexagrams = HEXAGRAMS.filter(h => 
      h.name.includes(search) || 
      h.number.toString().includes(search) || 
      h.judgment.includes(search)
  );

  // --- SUB-COMPONENTS ---

  const LibraryHome = () => (
      <div className="animate-fade-in pb-12">
          {/* Header */}
          <div className="px-5 py-6">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-display text-lg font-bold text-white tracking-wide">浏览文库</h2>
                <span className="text-xs font-sans text-primary/80 uppercase tracking-widest font-semibold">模块</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ModuleCard title="周易原典" subtitle="文王六十四卦" icon="menu_book" onClick={() => setView('index')} />
                <ModuleCard title="十翼精研" subtitle="传记" icon="flight" />
                <ModuleCard title="卦辞速查" subtitle="彖辞检索" icon="gavel" />
                <ModuleCard title="爻辞速查" subtitle="爻辞检索" icon="format_list_numbered" />
                <ModuleCard title="术语词典" subtitle="释义" icon="translate" />
                <ModuleCard title="主题阅读" subtitle="专题" icon="category" />
            </div>
          </div>

          {/* King Wen Sequence List (Vertical) */}
          <div className="px-5 pb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-display text-lg font-bold text-white tracking-wide">文王卦序 (1-64)</h2>
            </div>
            <div className="flex flex-col gap-3">
                {HEXAGRAMS.map(hex => (
                    <div 
                        key={hex.number} 
                        onClick={() => openDetail(hex.number)}
                        className="flex items-center gap-4 bg-surface-dark p-4 rounded-2xl border border-white/5 active:scale-[0.98] transition-transform cursor-pointer hover:bg-white/5 group"
                    >
                        {/* Icon Container */}
                        <div className="w-12 h-12 rounded-lg bg-[#171a1c] border border-white/5 flex items-center justify-center flex-shrink-0 p-1.5 shadow-inner">
                            <div className="w-full h-full transform scale-90 opacity-90 group-hover:opacity-100 transition-opacity">
                                <HexagramIcon binary={hex.binary} size="sm" />
                            </div>
                        </div>
                        
                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white font-display mb-1">{hex.name}</h3>
                            <p className="text-xs text-white/40 font-sans truncate">{hex.judgment}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-white/20 group-hover:text-primary/50 transition-colors">
                            <span className="font-mono text-xs font-bold tracking-widest">#{String(hex.number).padStart(2, '0')}</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      </div>
  );

  const LibraryIndex = () => (
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in pb-20">
            {filteredHexagrams.map(hex => (
                <div key={hex.number} onClick={() => openDetail(hex.number)} className="group bg-surface-dark rounded-xl p-4 border border-white/5 hover:border-primary/40 transition-all duration-300 relative overflow-hidden cursor-pointer hover:shadow-card active:scale-95">
                    <div className="absolute top-0 right-0 p-3 opacity-10 font-display text-4xl text-white group-hover:opacity-20 transition-opacity select-none">{hex.number}</div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-white/30 font-display italic text-sm">#{hex.number}</span>
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity scale-75 origin-top-right">
                             <HexagramIcon binary={hex.binary} size="sm" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-0.5 group-hover:text-primary transition-colors font-display">{hex.name}</h3>
                        <p className="text-white/40 text-xs font-sans truncate">{hex.nature}</p>
                    </div>
                </div>
            ))}
            {filteredHexagrams.length === 0 && (
                <div className="col-span-full text-center py-10 text-white/30">未找到相关卦象</div>
            )}
      </div>
  );

  const HexagramDetailView = () => {
      if (!currentHexagram) return null;

      const copyToClipboard = (text: string, title: string) => {
          navigator.clipboard.writeText(`《周易·${currentHexagram.name}卦》\n${title}\n${text}`);
          // Ideally show toast
      };

      return (
        <div className="animate-slide-up pb-20 relative">
            {/* Header Area */}
            <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
                <div className="flex flex-col gap-1.5 w-24 mb-6 shadow-2xl scale-125">
                     <HexagramIcon binary={currentHexagram.binary} size="lg" />
                </div>
                <h1 className="text-primary text-6xl font-bold tracking-tight mb-2 text-center font-display">{currentHexagram.name}</h1>
                <p className="text-white text-xl font-medium tracking-wide text-center font-sans opacity-80">{currentHexagram.nature}</p>
                <div className="flex items-center gap-2 mt-4">
                    <span className="h-px w-8 bg-primary/30"></span>
                    <p className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase">第{currentHexagram.number}卦</p>
                    <span className="h-px w-8 bg-primary/30"></span>
                </div>
            </div>

            {/* Toggle (Mock) */}
            <div className="sticky top-[72px] z-40 bg-background-dark/95 backdrop-blur shadow-sm mx-4 rounded-xl border border-white/5 mb-6">
                <div className="flex px-1 py-1 justify-between">
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest text-primary bg-white/5 transition-all">原文</button>
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest text-white/40 hover:text-white transition-all">白话</button>
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-bold tracking-widest text-white/40 hover:text-white transition-all">注释</button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 px-4">
                {/* Judgment */}
                <article 
                    ref={(el) => { lineRefs.current[0] = el; }}
                    className={`relative bg-surface-dark rounded-xl p-6 border transition-all duration-500 shadow-lg group ${highlightLine === 0 ? 'border-primary shadow-[0_0_20px_rgba(212,175,53,0.15)] ring-1 ring-primary/30' : 'border-white/5 hover:border-primary/20'}`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-4xl text-white">gavel</span>
                    </div>
                    <h3 className="text-primary text-sm font-bold tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        卦辞
                    </h3>
                    <p className="text-[#D6DBDF] text-xl leading-loose font-display font-medium opacity-90 select-text">
                        {currentHexagram.fullJudgment}
                    </p>
                    <button onClick={() => copyToClipboard(currentHexagram.fullJudgment, '卦辞')} className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-primary">
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                    </button>
                </article>

                {/* Image (Xiang) */}
                <article className="relative bg-surface-dark rounded-xl p-6 border border-white/5 shadow-lg group hover:border-primary/20 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-4xl text-white">landscape</span>
                    </div>
                    <h3 className="text-primary text-sm font-bold tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        象传
                    </h3>
                    <p className="text-[#D6DBDF] text-xl leading-loose font-display font-medium opacity-90 select-text">
                        {currentHexagram.image}
                    </p>
                </article>

                {/* Divider */}
                <div className="flex items-center gap-4 py-4">
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
                    <span className="text-primary/60 text-xs font-bold tracking-[0.5em]">六爻详解</span>
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
                </div>

                {/* Lines */}
                {currentHexagram.lines.map((line, idx) => (
                    <div 
                        key={line.position}
                        ref={(el) => { lineRefs.current[line.position] = el; }}
                        className={`relative rounded-xl p-6 border transition-all duration-500 transform ${
                            highlightLine === line.position 
                            ? 'bg-[#2d2a20] border-primary/40 scale-[1.02] z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]' 
                            : 'bg-surface-dark border-white/5 opacity-80 hover:opacity-100'
                        }`}
                    >
                        {highlightLine === line.position && <div className="absolute -left-1 top-6 w-1 h-8 bg-primary rounded-r-full animate-pulse"></div>}
                        
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold tracking-widest ${highlightLine === line.position ? 'text-primary' : 'text-white/40'}`}>{line.name}</span>
                                {highlightLine === line.position && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-background-dark">关注</span>}
                            </div>
                            <span className="text-xs text-primary/50 font-sans">{line.nature}爻</span>
                        </div>
                        <p className={`text-xl leading-loose font-display font-medium select-text ${highlightLine === line.position ? 'text-white' : 'text-[#D6DBDF]'}`}>
                            {line.text}
                        </p>
                        {line.image && (
                             <p className="mt-4 text-sm text-white/40 font-display border-l-2 border-white/10 pl-3 italic">
                                象曰：{line.image}
                             </p>
                        )}
                        <button onClick={() => copyToClipboard(line.text, line.name)} className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity text-white/20 hover:text-primary">
                            <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                    </div>
                ))}

                <div className="h-12"></div>
            </div>
        </div>
      );
  };

  const ModuleCard = ({ title, subtitle, icon, onClick }: any) => (
    <button onClick={onClick} className="relative overflow-hidden group bg-surface-dark p-4 rounded-3xl border border-white/5 hover:border-primary/30 transition-all hover:bg-surface-light text-left h-32 flex flex-col justify-between">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <span className="block font-display font-bold text-white text-lg">{title}</span>
            <span className="block text-xs text-gray-500 font-sans mt-0.5">{subtitle}</span>
        </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background-dark">
        {/* Navigation / Search Bar */}
        <header className="sticky top-0 z-50 bg-[#171a1c]/95 backdrop-blur-md border-b border-white/5">
            <div className="px-6 py-4 flex items-center justify-between">
                {view !== 'home' ? (
                    <button onClick={() => setView('home')} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary" style={{fontSize: 28}}>auto_stories</span>
                        <h1 className="font-display text-xl font-bold tracking-wide text-white">易理文库</h1>
                    </div>
                )}
                
                {view !== 'detail' && (
                     <div className={`relative group transition-all duration-300 ${view === 'home' ? 'w-48' : 'flex-1 ml-4'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-white/40 text-sm">search</span>
                        </div>
                        <input 
                            className="block w-full pl-9 pr-3 py-2 bg-surface-dark border border-white/10 rounded-full text-gray-200 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm transition-all" 
                            placeholder="搜索..." 
                            type="text"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                )}
            </div>
        </header>

        {view === 'home' && <LibraryHome />}
        {view === 'index' && <LibraryIndex />}
        {view === 'detail' && <HexagramDetailView />}

    </div>
  );
};

export default Library;