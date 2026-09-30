import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  BookmarkPlus, 
  Printer,
  Scissors,
  Eye,
  EyeOff,
  Sliders,
  FileText,
  Layers,
  Download,
  Code,
  CheckCircle2,
  Clock,
  Cpu,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Zap
} from 'lucide-react';
import { callGeminiApi, CANDIDATE_FLASH_MODELS } from '../../services/geminiEngine';
import { scanTextForPrivacyViolations, PrivacyScanResult } from '../../services/privacyGuard';
import { PrivacyWarningModal } from '../security/PrivacyWarningModal';
import { PromptTemplate } from '../../types/prompt';
import { PupilReadyRenderer } from './PupilReadyRenderer';
import { DetectedPedagogicalFormat, detectPedagogicalFormat } from '../../services/pedagogicalParser';

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

  // Schülerhände-Ready Controls
  const [viewMode, setViewMode] = useState<'pupil-ready' | 'raw-markdown'>('pupil-ready');
  const [selectedFormat, setSelectedFormat] = useState<DetectedPedagogicalFormat | 'auto'>('auto');
  const [showCutLines, setShowCutLines] = useState<boolean>(true);
  const [showSolutions, setShowSolutions] = useState<boolean>(false);
  const [isFullWidthPreview, setIsFullWidthPreview] = useState<boolean>(false);

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
      setViewMode('pupil-ready'); // Automatically switch to Pupil Ready on response
      onShowToast('Erfolgreich generiert', `Antwort in ${Math.round(end - start)} ms mit ${res.modelUsed} erhalten.`, 'success');
    } catch (err: any) {
      onShowToast('Ausführungsfehler', err.message || 'Verbindung zur KI fehlgeschlagen.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRaw = async () => {
    if (!outputResult) return;
    try {
      await navigator.clipboard.writeText(outputResult.text);
      setCopied(true);
      onShowToast('Kopiert', 'Markdown in die Zwischenablage kopiert.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('Fehler', 'Konnte nicht kopiert werden.', 'error');
    }
  };

  const handleCopyRichHtml = async () => {
    const el = document.getElementById('printable-schueler-output');
    if (!el || !outputResult) return;

    try {
      const html = el.innerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([outputResult.text], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })];
      await navigator.clipboard.write(data);
      onShowToast('Formatierter Text kopiert!', 'Du kannst ihn direkt mit Formatierung in Word oder Pages einfügen.', 'success');
    } catch {
      await navigator.clipboard.writeText(outputResult.text);
      onShowToast('Kopiert', 'Text in die Zwischenablage gelegt.', 'info');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const el = document.getElementById('printable-schueler-output');
    if (!el) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${promptTitle || 'Unterrichtsmaterial'} - Heimbürgeschule Kahla</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 2cm; color: #0f172a; line-height: 1.5; background: #ffffff; }
    @media print { body { margin: 1.2cm; } }
  </style>
</head>
<body>
  ${el.innerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(promptTitle || 'Material').replace(/\s+/g, '_')}_SchuelerhaendeReady.html`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('HTML heruntergeladen', 'Dokument wurde als eigenständige HTML-Datei gesichert.', 'success');
  };

  const detectedFormat = outputResult ? detectPedagogicalFormat(outputResult.text) : 'arbeitsblatt';

  return (
    <div className="w-full max-w-[2100px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 sm:py-6 space-y-5 sm:space-y-6">
      
      {/* HEADER BANNER (Hidden on print) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-school-primary p-5 sm:p-8 rounded-3xl text-white shadow-float flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2.5">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-200" />
            <span>Integrierte Schul-Testarea</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
            Live-Labor & Schülerhände-Ready Studio
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1.5 max-w-2xl leading-relaxed">
            Teste Schul-Prompts risikofrei im Browser und erhalte den Output direkt als druckfertige Tischstationen, 4-Farben Hilfekarten oder A4-Arbeitsblätter.
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

      {/* TWO-COLUMN OR EXPANDED WORKBENCH */}
      <div className={`grid gap-6 items-start ${isFullWidthPreview ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        
        {/* LEFT COLUMN: PROMPT COMPOSER (Hidden if full width preview or print) */}
        {!isFullWidthPreview && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-4 sm:p-6 space-y-4 print:hidden lg:col-span-6 xl:col-span-5 2xl:col-span-5">
            
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
                rows={13}
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                placeholder="Schreibe deinen Prompt hier oder lade eine Vorlage aus der Bibliothek... z.B. 'Konzipiere ein Stationenlernen mit 5 Stationen zum Thema Stromkreise in Klasse 8...'"
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
        )}

        {/* RIGHT COLUMN: DIDACTIC SCHÜLERHÄNDE-READY WORKBENCH */}
        <div className={`space-y-4 ${isFullWidthPreview ? 'w-full' : 'lg:col-span-6 xl:col-span-7 2xl:col-span-7'}`}>
          
          {/* TOOLBAR FOR SCHÜLERHÄNDE OUTPUT (Print: hidden) */}
          {outputResult && (
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-soft space-y-3 print:hidden animate-fadeIn">
              
              {/* TOP ROW: VIEW MODE SWITCHER & EXPAND */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
                  <button
                    onClick={() => setViewMode('pupil-ready')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      viewMode === 'pupil-ready'
                        ? 'bg-school-primary text-white shadow-soft'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>🎓 Schülerhände-Ready</span>
                  </button>

                  <button
                    onClick={() => setViewMode('raw-markdown')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      viewMode === 'raw-markdown'
                        ? 'bg-slate-800 text-white shadow-soft'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>📝 Roh-Markdown</span>
                  </button>
                </div>

                {/* Diagnostics Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {outputResult.durationMs} ms
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {outputResult.modelUsed}
                  </span>

                  {/* Toggle Fullwidth */}
                  <button
                    onClick={() => setIsFullWidthPreview(!isFullWidthPreview)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title={isFullWidthPreview ? "Geteilte Ansicht wiederherstellen" : "Vorschau auf volle Breite vergrößern"}
                  >
                    {isFullWidthPreview ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SECOND ROW: DIDACTIC FORMAT SELECTION & CONTROLS */}
              {viewMode === 'pupil-ready' && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  
                  {/* Format Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-school-primary" />
                      Format:
                    </span>
                    <select
                      value={selectedFormat}
                      onChange={e => setSelectedFormat(e.target.value as any)}
                      className="text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-school-primary"
                    >
                      <option value="auto">Auto ({detectedFormat.toUpperCase()})</option>
                      <option value="stationen">🗂️ Stationenlernen & Tischkarten</option>
                      <option value="tippkarten">💡 Gestufte Hilfekarten (4-Farben)</option>
                      <option value="differenzierung">📈 3-Stufen-Differenzierung (AFB I-III)</option>
                      <option value="rubrik">📊 Kriterienraster & Rubrik</option>
                      <option value="elternbrief">✉️ Elternbrief mit Abriss</option>
                      <option value="verlaufsplan">⏱️ 45-Min-Verlaufsplan</option>
                      <option value="arbeitsblatt">📄 Schüler-Arbeitsblatt</option>
                    </select>
                  </div>

                  {/* Toggles: Solutions & Cutlines */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Cut Lines Toggle */}
                    <button
                      onClick={() => setShowCutLines(!showCutLines)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                        showCutLines
                          ? 'bg-blue-50 border-blue-300 text-school-primary'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                      title="Schnittlinien mit Scherensymbol für Papierschneider einblenden"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Schnittlinien {showCutLines ? 'An' : 'Aus'}</span>
                    </button>

                    {/* Solutions Toggle */}
                    <button
                      onClick={() => setShowSolutions(!showSolutions)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                        showSolutions
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                      title={showSolutions ? "Musterlösungen verbergen (für Schüler-Ausdruck)" : "Musterlösungen einblenden (Lehrkraft-Exemplar)"}
                    >
                      {showSolutions ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{showSolutions ? 'Lehrer (mit Lösung)' : 'Schüler (ohne Lösung)'}</span>
                    </button>
                  </div>

                </div>
              )}

              {/* THIRD ROW: ACTION BUTTONS (PRINT, COPY, SAVE) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={runApiCall}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Alternative Antwort generieren"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerieren</span>
                  </button>

                  <button
                    onClick={() => onSaveAsPrompt(promptText, promptTitle)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-school-primary border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Als Vorlage in meiner Bibliothek ablegen"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>In Bibliothek sichern</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Copy for Word */}
                  <button
                    onClick={handleCopyRichHtml}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Kopiert formatierten HTML-Text für Microsoft Word oder LibreOffice"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Für Word kopieren</span>
                  </button>

                  {/* Download HTML */}
                  <button
                    onClick={handleDownloadHtml}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                    title="Als eigenständige HTML-Datei herunterladen"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* PRINT AS PDF BUTTON */}
                  <button
                    onClick={handlePrintPdf}
                    className="px-4 py-2 bg-school-primary hover:bg-school-primaryDark text-white rounded-xl text-xs font-black shadow-float flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    title="Öffnet den Druckdialog (sauberes DIN-A4 PDF ohne Website-Menüs)"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Als A4 PDF drucken</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* MAIN OUTPUT DISPLAY */}
          {outputResult ? (
            viewMode === 'pupil-ready' ? (
              /* SCHÜLERHÄNDE-READY VISUAL RENDERER */
              <PupilReadyRenderer
                rawText={outputResult.text}
                selectedFormat={selectedFormat}
                showCutLines={showCutLines}
                showSolutions={showSolutions}
                topicTitle={promptTitle}
              />
            ) : (
              /* RAW MARKDOWN TEXTBOX */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                    Roher Markdown-Text
                  </span>
                  <button
                    onClick={handleCopyRaw}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopiert' : 'Markdown kopieren'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all max-h-[600px] overflow-y-auto">
                  {outputResult.text}
                </div>
              </div>
            )
          ) : isLoading ? (
            /* LOADING STATE */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-700">
                Gemini Flash generiert schülergerechte Unterrichtsinhalte...
              </p>
              <p className="text-[11px] text-slate-400">
                Antwort wird automatisch für das Schülerhände-Ready Layout formatiert.
              </p>
            </div>
          ) : (
            /* EMPTY INITIAL STATE */
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <FlaskConical className="w-12 h-12 text-slate-300 mb-3 stroke-1" />
              <h4 className="text-sm font-black text-slate-700">Noch kein Testlauf gestartet</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Wähle links einen Prompt oder tippe eine Idee ein und klicke auf "Jetzt ausführen". Der Output wird sofort druckfertig für Schülerhände aufbereitet.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* DSGVO WARNING MODAL */}
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
