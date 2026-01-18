import React from 'react';
import { TabKey } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-sans selection:bg-primary/30 pb-24">
      <main className="w-full max-w-md mx-auto min-h-screen relative overflow-hidden bg-background-dark shadow-2xl">
         {children}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="w-full h-24 bg-gradient-to-t from-background-dark to-transparent absolute bottom-0"></div>
        <div className="max-w-md mx-auto relative pointer-events-auto">
            <div className="absolute bottom-0 w-full backdrop-blur-xl bg-[#171a1c]/85 border-t border-white/5 pb-6 pt-4 px-6 flex justify-between items-center">
                <NavBtn 
                    label="首页" 
                    icon="spa" 
                    active={activeTab === TabKey.Home} 
                    onClick={() => onTabChange(TabKey.Home)} 
                />
                <NavBtn 
                    label="排卦" 
                    icon="balance" 
                    active={activeTab === TabKey.Divination} 
                    onClick={() => onTabChange(TabKey.Divination)} 
                />
                <NavBtn 
                    label="阅览" 
                    icon="menu_book" 
                    active={activeTab === TabKey.Library} 
                    onClick={() => onTabChange(TabKey.Library)} 
                />
                <NavBtn 
                    label="我的" 
                    icon="person" 
                    active={activeTab === TabKey.Profile} 
                    onClick={() => onTabChange(TabKey.Profile)} 
                />
            </div>
        </div>
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{label: string, icon: string, active: boolean, onClick: () => void}> = ({ label, icon, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`flex flex-col items-center gap-1 transition-all duration-300 group ${active ? 'text-primary' : 'text-white/40 hover:text-white'}`}
    >
        <div className="relative p-1">
            <span className={`material-symbols-outlined text-2xl transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </span>
            {active && <span className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-50"></span>}
        </div>
        <span className="text-[10px] font-sans font-bold tracking-wide">{label}</span>
    </button>
);

export default Layout;