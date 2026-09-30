import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  User, 
  Star, 
  Plus, 
  Sparkles, 
  Key, 
  ArrowRightLeft, 
  LogOut, 
  Lock, 
  Clock, 
  FolderDown,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FilterOptions } from '../types/prompt';

interface HeaderProps {
  currentTab: FilterOptions['tab'];
  onTabChange: (tab: FilterOptions['tab']) => void;
  onOpenNewPrompt: () => void;
  onOpenOptimizer: () => void;
  onOpenImportExport: () => void;
  onOpenApiKeyModal: () => void;
  onOpenModularBuilder?: () => void;
  promptCount: {
    school: number;
    myPrompts: number;
    favorites: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewPrompt,
  onOpenOptimizer,
  onOpenImportExport,
  onOpenApiKeyModal,
  onOpenModularBuilder,
  promptCount
}) => {
  const { currentUser, isAuthenticated, isGuest, logout, openLoginModal } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
      {/* TOP BAR */}
      <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* School Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-school-primary to-school-primaryContainer text-white flex items-center justify-center shadow-soft shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-school-textMain tracking-tight leading-none">
                HBS Promptbibliothek
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-school-primaryLight text-school-primary">
                Portal
              </span>
            </div>
            <p className="text-xs text-school-textMuted mt-0.5 leading-none">
              Staatliche Regelschule Heimbürgeschule Kahla
            </p>
          </div>
        </div>

        {/* Live Clock & Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* School Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 font-mono shadow-xs">
            <Clock className="w-3.5 h-3.5 text-school-primary" />
            <span>{timeStr}</span>
          </div>

          {/* Quick Create Buttons */}
          <button
            onClick={onOpenNewPrompt}
            className="px-3.5 py-1.5 rounded-xl bg-school-primary hover:bg-school-primaryDark text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Neuer Prompt</span>
          </button>

          <button
            onClick={onOpenOptimizer}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="KI-Prompt-Tuner"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Prompt-Tuner</span>
          </button>

          {onOpenModularBuilder && (
            <button
              onClick={onOpenModularBuilder}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              title="Flick-Prompt-Baukasten (8-Punkte-System)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span className="hidden xl:inline">Flick-Baukasten</span>
            </button>
          )}

          <button
            onClick={onOpenImportExport}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Notion / Markdown Import & Export"
          >
            <FolderDown className="w-4 h-4 text-slate-600" />
            <span className="hidden lg:inline">Import / Export</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 cursor-pointer"
            title="API-Schlüssel Einstellungen"
          >
            <Key className="w-4 h-4 text-school-primary" />
          </button>

          {/* User Auth Pill */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-school-surfaceContainer text-xs font-bold text-school-textMain border border-school-primary/20">
                <User className="w-3.5 h-3.5 text-school-primary" />
                <span className="max-w-[100px] truncate">{currentUser?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Anmelden</span>
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="bg-school-surface border-t border-slate-200/60 px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="w-full max-w-[2100px] mx-auto flex items-center justify-between overflow-x-auto py-2 gap-2 touch-pan-x scrollbar-none">
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* TAB 1: Kollegium */}
            <button
              onClick={() => onTabChange('school')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentTab === 'school'
                  ? 'bg-school-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kollegiums-Bibliothek</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                currentTab === 'school' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {promptCount.school}
              </span>
            </button>

            {/* TAB 2: Mein Bereich */}
            <button
              onClick={() => onTabChange('my-prompts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentTab === 'my-prompts'
                  ? 'bg-school-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mein Bereich</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                currentTab === 'my-prompts' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {promptCount.myPrompts}
              </span>
            </button>

            {/* TAB 3: Favoriten */}
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentTab === 'favorites'
                  ? 'bg-school-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${currentTab === 'favorites' ? 'fill-white' : 'text-amber-500 fill-amber-400'}`} />
              <span>Favoriten</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                currentTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {promptCount.favorites}
              </span>
            </button>

            {/* TAB 4: Flick-Katalog */}
            <button
              onClick={() => onTabChange('flickGuide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentTab === 'flickGuide'
                  ? 'bg-amber-600 text-white shadow-soft'
                  : 'bg-amber-50/80 text-amber-900 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📘 Flick-Katalog</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                currentTab === 'flickGuide' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                200+
              </span>
            </button>

            {/* TAB 5: Live-Testarea */}
            <button
              onClick={() => onTabChange('testarea')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                currentTab === 'testarea'
                  ? 'bg-emerald-600 text-white shadow-soft'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-300" />
              <span>🧪 Live-Testarea</span>
              <span className="hidden sm:inline text-[10px] font-bold px-1.5 rounded bg-emerald-200/50 text-emerald-900">
                API aktiv
              </span>
            </button>
          </nav>

          {/* Quick link back to Appportal */}
          <a
            href="https://appportalhbs.vercel.app/"
            className="text-[11px] font-bold text-slate-500 hover:text-school-primary flex items-center gap-1 shrink-0 ml-2"
            title="Zurück zum Heimbürgeschule App-Portal"
          >
            <span>App-Portal</span>
            <ArrowRightLeft className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
