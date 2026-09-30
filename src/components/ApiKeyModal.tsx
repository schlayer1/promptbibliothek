import React, { useState } from 'react';
import { X, Key, ShieldCheck, Eye, EyeOff, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SCHOOL_GEMINI_KEY } from '../services/geminiEngine';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return localStorage.getItem('hbs_custom_gemini_key') || '';
  });
  const [showKey, setShowKey] = useState<boolean>(false);

  const handleSave = () => {
    const trimmed = geminiKey.trim();
    if (trimmed) {
      localStorage.setItem('hbs_custom_gemini_key', trimmed);
      onShowToast('Gespeichert', 'Dein persönlicher Gemini API-Schlüssel wurde aktiviert.', 'success');
    } else {
      localStorage.removeItem('hbs_custom_gemini_key');
      onShowToast('Zurückgesetzt', 'Schul-Standardschlüssel der Heimbürgeschule ist aktiv.', 'info');
    }
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('hbs_custom_gemini_key');
    setGeminiKey('');
    onShowToast('Entfernt', 'Persönlicher Key gelöscht. Schulschlüssel aktiv.', 'info');
  };

  const isCustomActive = Boolean(geminiKey.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-school-primary to-school-primaryContainer p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">API-Schlüssel & Live-Testarea</h3>
              <p className="text-xs text-school-primaryLight">Google Gemini Kaskade (HBS Standard)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 bg-school-surface">
          {/* Active Status Badge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-start gap-3.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isCustomActive ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">
                  {isCustomActive ? 'Persönlicher Gemini-Schlüssel aktiv' : 'Schul-Standardschlüssel aktiv (HBS)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Sofort bereit
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {isCustomActive 
                  ? 'Deine Testläufe nutzen dein eigenes Gemini-Kontingent.'
                  : 'Das Kollegium kann die Testarea sofort nutzen, ohne sich bei Google registrieren zu müssen.'
                }
              </p>
            </div>
          </div>

          {/* Key Input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-school-primary" />
                Persönlicher Google Gemini Key (Optional):
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-school-primary hover:underline"
              >
                Kostenlosen Key holen ↗
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={DEFAULT_SCHOOL_GEMINI_KEY ? 'Schulschlüssel ist als Fallback hinterlegt' : 'AIzaSy...'}
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-school-primary focus:bg-white transition text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showKey ? 'Key verbergen' : 'Key anzeigen'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Wird sicher nur lokal im Browser gespeichert (kein Server-Upload).
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          {geminiKey ? (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Key zurücksetzen
            </button>
          ) : (
            <span className="text-xs text-slate-400">Standard: HBS Schul-Key</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-school-primary hover:bg-school-primaryDark text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
