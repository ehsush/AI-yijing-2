import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="p-6 pt-12 animate-fade-in">
        <h1 className="text-white text-3xl font-medium italic tracking-tight font-display mb-8">我的修习</h1>
        
        <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-background-dark font-bold text-xl shadow-glow">
                悟
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">问道者</h2>
                <p className="text-white/50 text-xs mt-1">坚持每日一卦，修身养性</p>
            </div>
        </div>

        <div className="space-y-4">
            <OptionItem icon="history" title="历史记录" />
            <OptionItem icon="favorite" title="我的收藏" />
            <OptionItem icon="settings" title="系统设置" />
            <OptionItem icon="help" title="关于与帮助" />
        </div>
    </div>
  );
};

const OptionItem = ({ icon, title }: { icon: string, title: string }) => (
    <button className="w-full bg-surface-dark/50 hover:bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center justify-between group transition-colors">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white/60 group-hover:text-primary transition-colors">{icon}</span>
            <span className="text-white/80 group-hover:text-white font-sans text-sm">{title}</span>
        </div>
        <span className="material-symbols-outlined text-white/20 text-sm">arrow_forward_ios</span>
    </button>
);

export default Profile;