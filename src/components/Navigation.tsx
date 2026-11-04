import React from 'react';
import { ShoppingBag, Sparkles, User, Sun, Moon } from 'lucide-react';
import { UserPersona } from '../types/recsys';

export type NavTab = 
  | 'storefront'
  | 'pipeline'
  | 'collaborative'
  | 'content_based'
  | 'benchmarks'
  | 'behavior';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeUser: UserPersona;
  allUsers: UserPersona[];
  onSelectUser: (user: UserPersona) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  activeUser,
  allUsers,
  onSelectUser,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectTab('storefront')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
              AURA <span className="text-indigo-600 dark:text-indigo-400 font-normal">RecSys</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 5 Concise Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('storefront')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'storefront'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Storefront
          </button>

          <button
            onClick={() => onSelectTab('pipeline')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pipeline'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Data Collection
          </button>

          <button
            onClick={() => onSelectTab('collaborative')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'collaborative'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Collaborative Filtering
          </button>

          <button
            onClick={() => onSelectTab('content_based')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'content_based'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Content-Based Filtering
          </button>

          <button
            onClick={() => onSelectTab('benchmarks')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'benchmarks'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Evaluation &amp; Metrics
          </button>

          <button
            onClick={() => onSelectTab('behavior')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'behavior'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Consumer Behavior</span>
          </button>
        </nav>

        {/* Zone 3: Active Persona Switcher, Dark Mode & Cart Drawer Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active User Persona Dropdown */}
          <div className="relative flex items-center">
            <select
              value={activeUser.id}
              onChange={(e) => {
                const found = allUsers.find(u => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
              title="Switch user persona to see recommendations adapt in real time"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.isColdStart ? '(Cold-Start)' : ''}
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg transition-colors"
            title="Toggle color theme"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectTab('storefront')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'storefront' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Storefront
        </button>
        <button
          onClick={() => onSelectTab('pipeline')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'pipeline' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Data Pipeline
        </button>
        <button
          onClick={() => onSelectTab('collaborative')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'collaborative' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Collaborative Filtering
        </button>
        <button
          onClick={() => onSelectTab('content_based')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'content_based' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Content-Based
        </button>
        <button
          onClick={() => onSelectTab('benchmarks')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'benchmarks' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Evaluation
        </button>
        <button
          onClick={() => onSelectTab('behavior')}
          className={`text-xs whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'behavior' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Consumer Behavior
        </button>
      </div>
    </header>
  );
};
