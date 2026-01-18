import React from 'react';
import { TabKey, LibraryTarget } from '../types';

interface HomeProps {
  onNavigate: (tab: TabKey) => void;
  onNavigateToLibrary?: (target: LibraryTarget) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onNavigateToLibrary }) => {
  return (
    <div className="pb-8 animate-fade-in">
      <header className="flex items-end justify-between px-6 pt-12 pb-4">
        <div className="flex flex-col gap-1">
            <span className="text-white/40 text-xs font-sans font-bold tracking-[0.2em] uppercase">十月廿四</span>
            <h1 className="text-white text-3xl font-medium italic tracking-tight font-display">农历九月</h1>
        </div>
        <button className="text-primary/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5">
            <span className="material-symbols-outlined text-[28px]">notifications</span>
        </button>
      </header>

      <section className="px-4 mb-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-card group min-h-[300px] flex flex-col justify-center">
            <div className="absolute inset-0 bg-surface-dark"></div>
            {/* Background texture */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618588507085-c79565432917?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#171a1c]/20 to-[#171a1c]/90"></div>
            
            <div className="relative p-8 flex flex-col items-center text-center z-10">
                <div className="mb-2 text-primary/80 text-xs font-sans font-bold tracking-widest uppercase border border-primary/20 px-3 py-1 rounded-full bg-[#171a1c]/50 backdrop-blur-sm">
                    每日易言
                </div>
                
                {/* Decorative lines */}
                <div className="flex flex-col gap-[6px] my-6 opacity-90">
                    <div className="flex gap-2 w-16 h-1.5"><div className="w-1/2 bg-primary/40 rounded-sm"></div><div className="w-1/2 bg-primary/40 rounded-sm"></div></div>
                    <div className="w-16 h-1.5 bg-primary rounded-sm shadow-glow"></div>
                    <div className="flex gap-2 w-16 h-1.5"><div className="w-1/2 bg-primary/40 rounded-sm"></div><div className="w-1/2 bg-primary/40 rounded-sm"></div></div>
                </div>

                <h2 className="text-4xl font-normal text-white mb-2 text-glow font-display">泰卦</h2>
                <p className="text-lg text-primary/90 font-medium italic mb-6">第十一卦</p>
                <p className="text-white/90 text-2xl leading-relaxed font-display max-w-xs mx-auto mb-8">
                    “小往大来，<br/>吉亨。”
                </p>
                
                <button 
                    onClick={() => onNavigateToLibrary?.({ hexagramId: 11 })}
                    className="flex items-center justify-center gap-2 w-full max-w-[200px] bg-primary text-[#171a1c] hover:bg-[#e5c145] transition-all duration-300 px-6 py-3.5 rounded-xl font-sans font-bold text-sm tracking-wide shadow-glow"
                >
                    <span>查看全文</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
            <MenuCard 
                icon="balance" 
                title="开始排卦" 
                subtitle="诚心起卦" 
                bgIcon="balance" 
                onClick={() => onNavigate(TabKey.Divination)}
                highlight
            />
            <MenuCard 
                icon="auto_stories" 
                title="易理文库" 
                subtitle="经典阅览" 
                bgIcon="history_edu" 
                onClick={() => onNavigate(TabKey.Library)}
            />
             <MenuCard 
                icon="grid_view" 
                title="六十四卦" 
                subtitle="全卦详解" 
                onClick={() => onNavigate(TabKey.Library)}
            />
             <MenuCard 
                icon="temple_buddhist" 
                title="学习体系" 
                subtitle="循序渐进" 
            />
        </div>
      </section>

      <section className="px-4">
        <h2 className="text-white/90 text-lg font-bold mb-4 px-2 font-display">我的进度</h2>
        <div className="w-full bg-surface-dark border border-white/5 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary ring-1 ring-primary/30">
                    <span className="material-symbols-outlined text-2xl">timeline</span>
                </div>
                <div>
                    <p className="text-white font-bold text-lg">连续 5 天</p>
                    <p className="text-white/50 text-sm font-sans">近期卦象：乾为天</p>
                </div>
            </div>
            {/* Simple graph visualization */}
            <div className="flex items-end gap-1 h-10">
                <div className="w-1.5 h-4 bg-white/10 rounded-full"></div>
                <div className="w-1.5 h-6 bg-white/20 rounded-full"></div>
                <div className="w-1.5 h-3 bg-white/10 rounded-full"></div>
                <div className="w-1.5 h-8 bg-primary rounded-full shadow-glow"></div>
                <div className="w-1.5 h-5 bg-white/20 rounded-full"></div>
            </div>
        </div>
      </section>
    </div>
  );
};

const MenuCard = ({ icon, title, subtitle, bgIcon, onClick, highlight }: any) => (
    <button 
        onClick={onClick}
        className="relative group bg-surface-dark rounded-2xl p-5 flex flex-col justify-between items-start aspect-[1.1/1] overflow-hidden border border-white/5 hover:border-primary/30 transition-all active:scale-95"
    >
        {highlight && <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>}
        <div className={`bg-[#171a1c] p-3 rounded-xl border border-white/5 shadow-lg z-10 transition-colors ${highlight ? 'text-primary' : 'text-white/80 group-hover:text-primary'}`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div className="z-10 text-left">
            <h3 className="text-xl font-bold text-white leading-tight font-display">{title}</h3>
            <p className="text-white/50 text-xs mt-1 font-sans">{subtitle}</p>
        </div>
        {bgIcon && <span className={`material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/[0.02] pointer-events-none ${bgIcon === 'balance' ? 'rotate-12' : '-rotate-12'}`}>{bgIcon}</span>}
    </button>
);

export default Home;