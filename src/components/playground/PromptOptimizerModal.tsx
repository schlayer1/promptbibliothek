import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  FlaskConical, 
  Edit3, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { optimizePromptWithAI } from '../../services/geminiEngine';

interface PromptOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakeToEditor: (title: string, text: string) => void;
  onTakeToTestarea: (text: string, title: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const PromptOptimizerModal: React.FC<PromptOptimizerModalProps> = ({
  isOpen,
  onClose,
  onTakeToEditor,
  onTakeToTestarea,
  onShowToast
}) => {
  if (!isOpen) return null;

  const [rawIdea, setRawIdea] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [result, setResult] = useState<{
    optimizedTitle: string;
    optimizedPrompt: string;
    detectedVariables: string[];
    tips: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleOptimize = async () => {
    if (!rawIdea.trim()) {
      onShowToast('Idee fehlt', 'Bitte gib kurz ein Thema oder deine Unterrichtsidee ein.', 'error');
      return;
    }

    setIsOptimizing(true);
    try {
      const apiKey = localStorage.getItem('hbs_custom_gemini_key') || undefined;
      const opt = await optimizePromptWithAI(rawIdea.trim(), apiKey);
      setResult(opt);
      onShowToast('Prompt getunt!', 'Dein Entwurf wurde didaktisch strukturiert und optimiert.', 'success');
    } catch (err: any) {
      onShowToast('Optimierungsfehler', err.message || 'Konnte nicht verarbeitet werden.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      onShowToast('Kopiert', 'Optimierter Prompt in die Zwischenablage kopiert.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Fehler', 'Konnte nicht kopiert werden.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">1-Klick KI-Prompt-Tuner</h3>
              <p className="text-xs text-amber-100">
                Verwandelt unausgereifte Gedanken in erprobte, strukturierte Schul-Prompts
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-school-surface">
          {/* Input Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Deine rohe Idee / Gedanken (ganz ungefiltert):
            </label>
            <textarea
              rows={3}
              value={rawIdea}
              onChange={e => setRawIdea(e.target.value)}
              placeholder="z.B. Mach mir ein Arbeitsblatt für Klasse 7 in Mathe über Dreiecke, mit leichten und schweren Aufgaben und einer Textaufgabe aus dem Alltag."
              className="w-full text-xs p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed"
            />

            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !rawIdea.trim()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-black shadow-soft flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOptimizing ? 'Wird didaktisch geschärft...' : 'Prompt jetzt didaktisch tunen ✨'}</span>
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-soft space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Optimiertes Ergebnis
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    {result.optimizedTitle}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5">
                  {result.detectedVariables?.map(v => (
                    <span key={v} className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      [{v}]
                    </span>
                  ))}
                </div>
              </div>

              {/* Prompt Text */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all max-h-64 overflow-y-auto">
                {result.optimizedPrompt}
              </div>

              {/* Didaktischer Tipp */}
              {result.tips && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p><strong>Didaktischer Tipp:</strong> {result.tips}</p>
                </div>
              )}

              {/* Action Buttons for Result */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
                </button>

                <button
                  onClick={() => {
                    onTakeToTestarea(result.optimizedPrompt, result.optimizedTitle);
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                  <span>In Testarea testen</span>
                </button>

                <button
                  onClick={() => {
                    onTakeToEditor(result.optimizedTitle, result.optimizedPrompt);
                    onClose();
                  }}
                  className="px-4 py-2 bg-school-primary hover:bg-school-primaryDark text-white rounded-xl text-xs font-black shadow-soft flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>In Bibliothek ablegen</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
