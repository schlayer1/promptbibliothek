import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  Code
} from 'lucide-react';
import { PromptTemplate } from '../../types/prompt';
import { parseMarkdownPrompts, exportPromptsToJson, exportPromptsToMarkdown } from '../../services/notionImporter';
import { useAuth } from '../../context/AuthContext';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptTemplate[];
  onImportPrompts: (imported: PromptTemplate[]) => Promise<void>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onImportPrompts,
  onShowToast
}) => {
  if (!isOpen) return null;

  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importText, setImportText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImport = async () => {
    if (!importText.trim()) {
      onShowToast('Text fehlt', 'Bitte füge die Notion-Inhalte oder JSON-Daten in das Textfeld ein.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const parsed = parseMarkdownPrompts(
        importText, 
        currentUser?.id || 'import', 
        currentUser?.name || 'Importierte Vorlage'
      );

      if (parsed.length === 0) {
        onShowToast('Keine Prompts erkannt', 'Konnte keine Prompts oder Überschriften im Text finden.', 'error');
        setIsProcessing(false);
        return;
      }

      await onImportPrompts(parsed);
      onShowToast('Import erfolgreich!', `${parsed.length} Prompts wurden in deinen Bereich importiert.`, 'success');
      setImportText('');
      onClose();
    } catch (err: any) {
      onShowToast('Import-Fehler', err.message || 'Format ungültig.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadJson = () => {
    const jsonStr = exportPromptsToJson(prompts);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hbs-prompts-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Heruntergeladen', 'JSON-Exportdatei wurde gespeichert.', 'success');
  };

  const handleDownloadMarkdown = () => {
    const mdStr = exportPromptsToMarkdown(prompts);
    const blob = new Blob([mdStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hbs-prompt-katalog-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Heruntergeladen', 'Markdown-Dokumentation wurde gespeichert.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-school-primary to-school-primaryContainer p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Import & Export</h3>
              <p className="text-xs text-school-primaryLight">Notion, Markdown & JSON-Sicherung</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'import'
                ? 'border-school-primary text-school-primary bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notion & Text importieren
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'export'
                ? 'border-school-primary text-school-primary bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Bibliothek exportieren ({prompts.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-school-surface">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-slate-700 leading-relaxed">
                <strong className="block text-school-primary font-bold mb-1">
                  💡 Manuel Flick Notion Guide & eigene Notizen einfügen:
                </strong>
                Kopiere einfach den Text oder die Markdown-Inhalte aus deiner Notion-Seite hier hinein. Die App erkennt automatisch Überschriften (`# Titel`) als Prompts und wandelt gefundene `[Platzhalter]` direkt in interaktive Formulare um!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Text, Markdown oder JSON hier einfügen:
                </label>
                <textarea
                  rows={10}
                  placeholder={`# Mein erster Prompt\nDu bist eine Lehrkraft für [Fach]... Plane eine Stunde zu [Thema]...\n\n# Zweiter Prompt\nErstelle ein Arbeitsblatt zu [Thema] für [Klassenstufe]...`}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900"
                />
              </div>

              <button
                onClick={handleImport}
                disabled={isProcessing || !importText.trim()}
                className="w-full py-3 bg-school-primary hover:bg-school-primaryDark disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Verarbeite Inhalte...' : 'Inhalte jetzt analysieren & importieren'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Sichere den aktuellen Bestand der Promptbibliothek lokal auf deinem Computer oder exportiere ihn als formatierte Dokumentation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-school-primary flex items-center justify-center mb-3">
                      <Code className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800">JSON-Vollsicherung</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Enthält alle Prompts, Variablen, Notizen und Tags im strukturierten Rohformat.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJson}
                    className="mt-4 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>JSON herunterladen</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800">Markdown-Katalog</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Lesbare Formatierung mit Überschriften, Code-Blöcken und Praxistipps für Notion oder Word.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="mt-4 px-4 py-2.5 bg-school-primary hover:bg-school-primaryDark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Markdown herunterladen</span>
                  </button>
                </div>
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
