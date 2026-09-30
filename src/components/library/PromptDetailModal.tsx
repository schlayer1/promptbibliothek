import React, { useState, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  FlaskConical, 
  Sparkles, 
  MessageSquare, 
  Send, 
  ShieldAlert, 
  Share2, 
  BookOpen, 
  User, 
  Info
} from 'lucide-react';
import { PromptTemplate, PromptVariable } from '../../types/prompt';
import { useAuth } from '../../context/AuthContext';
import { scanTextForPrivacyViolations, PrivacyScanResult } from '../../services/privacyGuard';
import { PrivacyWarningModal } from '../security/PrivacyWarningModal';

interface PromptDetailModalProps {
  prompt: PromptTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onRunInTestarea: (filledPromptText: string, promptTitle: string) => void;
  onAddTip: (promptId: string, text: string) => Promise<void>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onRunInTestarea,
  onAddTip,
  onShowToast
}) => {
  if (!isOpen || !prompt) return null;

  const { currentUser, isAuthenticated } = useAuth();

  // State für die Werte der Variablen
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables?.forEach(v => {
      initial[v.key] = v.defaultValue || '';
    });
    return initial;
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [newTipText, setNewTipText] = useState<string>('');
  const [isSubmittingTip, setIsSubmittingTip] = useState<boolean>(false);

  // DSGVO Warnung
  const [privacyWarningOpen, setPrivacyWarningOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [currentScanResult, setCurrentScanResult] = useState<PrivacyScanResult>({ hasWarning: false, warnings: [] });

  // Dynamische Ersetzung der Platzhalter im Text
  const renderedPromptText = useMemo(() => {
    let result = prompt.templateText;
    Object.entries(variableValues).forEach(([key, val]) => {
      const pattern = new RegExp(`\\[${key}\\]`, 'gi');
      result = result.replace(pattern, val || `[${key}]`);
    });
    return result;
  }, [prompt.templateText, variableValues]);

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [key]: value }));
  };

  // Führt eine Aktion nach DSGVO-Prüfung aus
  const executeWithPrivacyCheck = (action: () => void) => {
    const scan = scanTextForPrivacyViolations(renderedPromptText);
    if (scan.hasWarning) {
      setCurrentScanResult(scan);
      setPendingAction(() => action);
      setPrivacyWarningOpen(true);
    } else {
      action();
    }
  };

  // In Zwischenablage kopieren
  const handleCopy = () => {
    executeWithPrivacyCheck(async () => {
      try {
        await navigator.clipboard.writeText(renderedPromptText);
        setCopied(true);
        onShowToast('Kopiert!', 'Prompt mit deinen Werten in die Zwischenablage gelegt.', 'success');
        setTimeout(() => setCopied(false), 2500);
      } catch {
        onShowToast('Fehler', 'Konnte nicht kopiert werden.', 'error');
      }
    });
  };

  // Multi-KI Direktlinks
  const handleOpenAi = (platform: 'chatgpt' | 'claude' | 'copilot') => {
    executeWithPrivacyCheck(async () => {
      try {
        await navigator.clipboard.writeText(renderedPromptText);
        let url = 'https://chatgpt.com/';
        let name = 'ChatGPT';
        if (platform === 'claude') {
          url = 'https://claude.ai/new';
          name = 'Claude';
        } else if (platform === 'copilot') {
          url = 'https://copilot.microsoft.com/';
          name = 'Microsoft Copilot';
        }
        window.open(url, '_blank', 'noopener,noreferrer');
        onShowToast('Bereit für ' + name, 'Prompt kopiert! Du kannst ihn direkt im geöffneten Tab mit Strg+V / Cmd+V einfügen.', 'success');
      } catch {
        onShowToast('Hinweis', 'Bitte kopiere den Prompt manuell.', 'info');
      }
    });
  };

  // In Testarea ausführen
  const handleRunTestarea = () => {
    executeWithPrivacyCheck(() => {
      onRunInTestarea(renderedPromptText, prompt.title);
      onClose();
    });
  };

  // Tipp einreichen
  const handleSubmitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipText.trim()) return;

    setIsSubmittingTip(true);
    await onAddTip(prompt.id, newTipText.trim());
    setIsSubmittingTip(false);
    setNewTipText('');
    onShowToast('Tipp geteilt!', 'Vielen Dank für deinen Praxistipp an das Kollegium.', 'success');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-school-primary to-school-primaryContainer p-5 sm:p-6 text-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {prompt.category.toUpperCase()}
                </span>
                {prompt.subject && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                    {prompt.subject}
                  </span>
                )}
                {prompt.recommendedModel && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200">
                    💡 Empfohlen: {prompt.recommendedModel}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black leading-snug">{prompt.title}</h2>
              <p className="text-xs text-school-primaryLight mt-1">{prompt.description}</p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN SCROLLABLE CONTENT */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-school-surface">
            
            {/* ROW: VARIABLEN AUSFÜLLEN */}
            {prompt.variables && prompt.variables.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-school-primary" />
                    <span>Prompt-Variablen anpassen (Echtzeit-Vorschau)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Wird automatisch in den Text eingesetzt
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prompt.variables.map(v => (
                    <div key={v.key} className={v.type === 'textarea' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        [{v.label}]:
                      </label>

                      {v.type === 'select' && v.options ? (
                        <select
                          value={variableValues[v.key] || ''}
                          onChange={e => handleVariableChange(v.key, e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
                        >
                          {v.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : v.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={variableValues[v.key] || ''}
                          onChange={e => handleVariableChange(v.key, e.target.value)}
                          placeholder={v.placeholder}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
                        />
                      ) : (
                        <input
                          type="text"
                          value={variableValues[v.key] || ''}
                          onChange={e => handleVariableChange(v.key, e.target.value)}
                          placeholder={v.placeholder}
                          className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PREVIEW: DER EINSATZBEREITE PROMPT */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-school-primary" />
                  Einsatzbereiter Prompt (Kopierfertig)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {renderedPromptText.length} Zeichen
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all max-h-64 overflow-y-auto">
                {renderedPromptText}
              </div>
            </div>

            {/* PRAXISTIPPS DES KOLLEGIUMS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  Praxistipps & Erfahrungen aus dem Unterricht ({prompt.colleagueTips?.length || 0})
                </h4>
              </div>

              {prompt.colleagueTips && prompt.colleagueTips.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {prompt.colleagueTips.map(tip => (
                    <div key={tip.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-amber-900 mb-1">
                        <strong className="font-bold flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {tip.authorName}
                        </strong>
                        <span className="text-[10px] text-amber-800/70">
                          {new Date(tip.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic mb-4">
                  Noch keine Kollegiums-Tipps hinterlegt. Teile als Erste/r deine Erfahrung mit diesem Prompt!
                </p>
              )}

              {/* Tipp hinzufügen Form */}
              {isAuthenticated ? (
                <form onSubmit={handleSubmitTip} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Kurzen Unterrichts-Tipp für Kollegen teilen..."
                    value={newTipText}
                    onChange={e => setNewTipText(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingTip || !newTipText.trim()}
                    className="px-3.5 py-2 bg-school-primary hover:bg-school-primaryDark disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Teilen</span>
                  </button>
                </form>
              ) : (
                <div className="text-xs text-slate-400 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-school-primary" />
                  <span>Melde dich mit deinem Kollegiums-PIN an, um eigene Praxistipps zu teilen.</span>
                </div>
              )}
            </div>

          </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Multi-KI Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 hidden lg:inline">Öffnen mit:</span>
              
              <button
                onClick={() => handleOpenAi('chatgpt')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
                title="Kopiert den Prompt und öffnet ChatGPT"
              >
                <span>ChatGPT</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleOpenAi('claude')}
                className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
                title="Kopiert den Prompt und öffnet Claude AI"
              >
                <span>Claude</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleOpenAi('copilot')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
                title="Kopiert den Prompt und öffnet Microsoft Copilot"
              >
                <span>Copilot</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Live Testarea Run */}
              <button
                onClick={handleRunTestarea}
                className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Diesen Prompt sofort mit der Gemini Schul-API testen"
              >
                <FlaskConical className="w-4 h-4 text-emerald-700" />
                <span>In Testarea ausführen</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-float flex items-center gap-2 transition active:scale-95 cursor-pointer ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-school-primary hover:bg-school-primaryDark text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopiert!' : 'Prompt kopieren'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* DSGVO WARNING DIALOG */}
      <PrivacyWarningModal
        isOpen={privacyWarningOpen}
        scanResult={currentScanResult}
        onCancel={() => {
          setPrivacyWarningOpen(false);
          setPendingAction(null);
        }}
        onProceed={() => {
          setPrivacyWarningOpen(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />
    </>
  );
};
