import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  BookmarkPlus, 
  ShieldAlert, 
  Zap, 
  Cpu, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Sliders
} from 'lucide-react';
import { callGeminiApi, CANDIDATE_FLASH_MODELS } from '../../services/geminiEngine';
import { scanTextForPrivacyViolations, PrivacyScanResult } from '../../services/privacyGuard';
import { PrivacyWarningModal } from '../security/PrivacyWarningModal';
import { PromptTemplate } from '../../types/prompt';

interface LiveTestareaProps {
  initialPromptText?: string;
  initialPromptTitle?: string;
  promptsList: PromptTemplate[];
  onSaveAsPrompt: (text: string, title?: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const LiveTestarea: React.FC<LiveTestareaProps> = ({
  initialPromptText = '',
  initialPromptTitle = '',
  promptsList,
  onSaveAsPrompt,
  onShowToast
}) => {
  const [promptText, setPromptText] = useState<string>(initialPromptText);
  const [promptTitle, setPromptTitle] = useState<string>(initialPromptTitle);
  const [systemInstruction, setSystemInstruction] = useState<string>(
    'Du bist eine erfahrene Lehrkraft und Fachdidaktiker an einer Thüringer Regelschule. Antworte praxisnah, strukturiert und schülergerecht.'
  );
  const [showSystemInstruction, setShowSystemInstruction] = useState<boolean>(false);

  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [temperature, setTemperature] = useState<number>(0.3);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputResult, setOutputResult] = useState<{ text: string; modelUsed: string; durationMs: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Privacy Guard
  const [privacyWarningOpen, setPrivacyWarningOpen] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<PrivacyScanResult>({ hasWarning: false, warnings: [] });

  const handleSelectFromLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const found = promptsList.find(p => p.id === id);
    if (found) {
      setPromptText(found.templateText);
      setPromptTitle(found.title);
      if (found.systemInstruction) {
        setSystemInstruction(found.systemInstruction);
      }
      onShowToast('Prompt geladen', `"${found.title}" in die Testarea übernommen.`, 'info');
    }
  };

  const handleExecute = async () => {
    if (!promptText.trim()) {
      onShowToast('Eingabe fehlt', 'Bitte gib einen Prompt ein, den du testen möchtest.', 'error');
      return;
    }

    // DSGVO-Check
    const scan = scanTextForPrivacyViolations(promptText);
    if (scan.hasWarning) {
      setScanResult(scan);
      setPrivacyWarningOpen(true);
      return;
    }

    runApiCall();
  };

  const runApiCall = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      const apiKey = localStorage.getItem('hbs_custom_gemini_key') || undefined;
      const res = await callGeminiApi({
        apiKey,
        systemPrompt: systemInstruction.trim() || undefined,
        userPrompt: promptText.trim(),
        model: selectedModel,
        temperature
      });

      const end = performance.now();
      setOutputResult({
        text: res.text,
        modelUsed: res.modelUsed,
        durationMs: Math.round(end - start)
      });
      onShowToast('Erfolgreich generiert', `Antwort in ${Math.round(end - start)} ms mit ${res.modelUsed} erhalten.`, 'success');
    } catch (err: any) {
      onShowToast('Ausführungsfehler', err.message || 'Verbindung zur KI fehlgeschlagen.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = async () => {
    if (!outputResult) return;
    try {
      await navigator.clipboard.writeText(outputResult.text);
      setCopied(true);
      onShowToast('Kopiert', 'KI-Ergebnis in die Zwischenablage kopiert.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Fehler', 'Konnte nicht kopiert werden.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-school-primary p-6 sm:p-8 rounded-3xl text-white shadow-float flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2.5">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-200" />
            <span>Integrierte Schul-Testarea</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Live-Labor für deine Schul-Prompts
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 max-w-2xl leading-relaxed">
            Probiere Prompts gefahrlos direkt hier aus, passe Variablen an und überprüfe die Ausgaben, bevor du sie im Unterricht oder mit Kollegen einsetzt.
          </p>
        </div>

        {/* Quick Load from Library */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 w-full md:w-auto shrink-0">
          <label className="block text-[11px] font-bold text-white mb-1">
            Prompt aus Bibliothek laden:
          </label>
          <select
            onChange={handleSelectFromLibrary}
            className="w-full md:w-64 text-xs font-semibold px-3 py-2 bg-white text-slate-800 rounded-xl focus:outline-none shadow-soft"
            defaultValue=""
          >
            <option value="" disabled>-- Vorlage auswählen --</option>
            {promptsList.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TWO-COLUMN WORKBENCH: INPUT VS OUTPUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: PROMPT COMPOSER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 sm:p-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Prompt-Eingabe</span>
            </h3>

            {/* Model Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="text-xs font-bold px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="auto">Auto-Kaskade (Empfohlen)</option>
                {CANDIDATE_FLASH_MODELS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* System Instruction (Collapsible) */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSystemInstruction(!showSystemInstruction)}
              className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-school-primary" />
                System-Rolle & Didaktischer Kontext (Optional)
              </span>
              {showSystemInstruction ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSystemInstruction && (
              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                <textarea
                  rows={2}
                  value={systemInstruction}
                  onChange={e => setSystemInstruction(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-school-primary font-mono text-slate-800"
                  placeholder="System-Rolle vorgeben..."
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Kreativität (Temperature): {temperature}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-28 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Prompt Textarea */}
          <div className="relative">
            <textarea
              rows={12}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="Schreibe deinen Prompt hier oder lade eine Vorlage aus der Bibliothek... z.B. 'Plane eine Gruppenarbeit für Klasse 7 im Fach Biologie...'"
              className="w-full text-xs font-mono p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 leading-relaxed shadow-inner"
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-400 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200">
              ca. {Math.round(promptText.length / 4)} Tokens
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setPromptText('');
                setOutputResult(null);
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Zurücksetzen
            </button>

            <button
              onClick={handleExecute}
              disabled={isLoading || !promptText.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-black shadow-float flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generiere Antwort...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Jetzt ausführen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI RESPONSE INSPECTOR */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 sm:p-6 space-y-4 min-h-[460px] flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-school-primary" />
                <span>KI-Ausgabe & Analyse</span>
              </h3>

              {outputResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {outputResult.durationMs} ms
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {outputResult.modelUsed}
                  </span>
                </div>
              )}
            </div>

            {/* Output Display */}
            {outputResult ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto select-all">
                {outputResult.text}
              </div>
            ) : isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold">Gemini Flash verarbeitet deine Unterrichtsanfrage...</p>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <FlaskConical className="w-10 h-10 text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-bold text-slate-600">Noch kein Testlauf gestartet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Klicke links auf "Jetzt ausführen", um die KI-Antwort live zu generieren und das Resultat zu prüfen.
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls for Output */}
          {outputResult && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={runApiCall}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Generiert eine alternative Antwort"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerieren</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSaveAsPrompt(promptText, promptTitle)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-school-primary border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Diesen Prompt dauerhaft in deiner Bibliothek ablegen"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Als Prompt speichern</span>
                </button>

                <button
                  onClick={handleCopyOutput}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-soft cursor-pointer ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopiert' : 'Ergebnis kopieren'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* DSGVO WARNING */}
      <PrivacyWarningModal
        isOpen={privacyWarningOpen}
        scanResult={scanResult}
        onCancel={() => setPrivacyWarningOpen(false)}
        onProceed={() => {
          setPrivacyWarningOpen(false);
          runApiCall();
        }}
      />
    </div>
  );
};
