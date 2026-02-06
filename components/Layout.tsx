import React from 'react';
import { AppTab } from '../types';
import { Calculator, Timer, Users } from 'lucide-react';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const navItems = [
    { id: AppTab.CALCULATOR, label: 'Calculator', icon: Calculator },
    { id: AppTab.STOPWATCH, label: 'Stopwatch', icon: Timer },
    { id: AppTab.MULTI_RUNNER, label: 'Multi-Runner', icon: Users },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      
      <header className="bg-slate-800 border-b border-slate-700 px-6 shadow-lg sticky top-0 z-50 
                       pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2 py-4">
          <Timer className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold tracking-tight">
            TrackPro <span className="text-emerald-400">Coach</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 pb-32">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-md border-t border-slate-700 px-4 z-50
                      pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto flex justify-between items-center py-3 md:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-emerald-500/10' : 'bg-transparent'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;