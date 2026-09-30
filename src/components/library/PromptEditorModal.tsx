import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Lock, 
  Globe, 
  Plus, 
  Info,
  Layers,
  BookOpen
} from 'lucide-react';
import { PromptTemplate, PromptCategory } from '../../types/prompt';
import { useAuth } from '../../context/AuthContext';
import { THUERINGEN_SUBJECTS, GRADE_LEVELS, CATEGORY_LABELS } from '../../data/schoolSubjects';
import { extractVariablesFromText } from '../../services/notionImporter';

interface PromptEditorModalProps {
  initialPrompt: PromptTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: PromptTemplate) => Promise<void>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  initialPrompt,
  isOpen,
  onClose,
  onSave,
  onShowToast
}) => {
  if (!isOpen) return null;

  const { currentUser } = useAuth();

  const [title, setTitle] = useState(initialPrompt?.title || '');
  const [description, setDescription] = useState(initialPrompt?.description || '');
  const [category, setCategory] = useState<PromptCategory>(initialPrompt?.category || 'unterricht');
  const [subject, setSubject] = useState(initialPrompt?.subject || 'Allgemein');
  const [templateText, setTemplateText] = useState(initialPrompt?.templateText || '');
  const [visibility, setVisibility] = useState<'school' | 'private'>(initialPrompt?.visibility || 'private');
  const [tagsInput, setTagsInput] = useState(initialPrompt?.tags ? initialPrompt.tags.join(', ') : 'Unterricht');
  const [recommendedModel, setRecommendedModel] = useState(initialPrompt?.recommendedModel || 'ChatGPT / Gemini Flash');
  const [selectedGrades, setSelectedGrades] = useState<string[]>(initialPrompt?.gradeLevels || ['7', '8']);
  const [selectedAfb, setSelectedAfb] = useState<('AFB I' | 'AFB II' | 'AFB III')[]>(initialPrompt?.afbLevels || ['AFB I', 'AFB II']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatische Variablen-Erkennung
  const detectedVariables = extractVariablesFromText(templateText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !templateText.trim()) {
      onShowToast('Pflichtfelder fehlen', 'Bitte gib mindestens einen Titel und den Prompt-Text an.', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const now = Date.now();
    const promptToSave: PromptTemplate = {
      id: initialPrompt?.id || `prompt_${now}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim() || 'Schul-Prompt für die Regelschule.',
      category,
      tags,
      subject,
      gradeLevels: selectedGrades,
      afbLevels: selectedAfb,
      templateText: templateText.trim(),
      variables: detectedVariables,
      visibility,
      authorId: initialPrompt?.authorId || currentUser?.id || 'gast',
      authorName: initialPrompt?.authorName || currentUser?.name || 'Lehrkraft',
      source: initialPrompt?.source || (visibility === 'school' ? 'Kollegium HBS' : 'Mein Entwurf'),
      recommendedModel,
      favoriteCount: initialPrompt?.favoriteCount || 0,
      colleagueTips: initialPrompt?.colleagueTips || [],
      createdAt: initialPrompt?.createdAt || now,
      updatedAt: now
    };

    setIsSubmitting(true);
    await onSave(promptToSave);
    setIsSubmitting(false);
    onShowToast('Gespeichert!', `Prompt "${promptToSave.title}" wurde erfolgreich gesichert.`, 'success');
    onClose();
  };

  const toggleGrade = (grade: string) => {
    const rawNumber = grade.replace('Klasse ', '');
    setSelectedGrades(prev => 
      prev.includes(rawNumber) ? prev.filter(g => g !== rawNumber) : [...prev, rawNumber]
    );
  };

  const toggleAfb = (afb: 'AFB I' | 'AFB II' | 'AFB III') => {
    setSelectedAfb(prev => 
      prev.includes(afb) ? prev.filter(a => a !== afb) : [...prev, afb]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-school-primary to-school-primaryContainer p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {initialPrompt ? 'Prompt bearbeiten' : 'Neuen Schul-Prompt erstellen'}
              </h3>
              <p className="text-xs text-school-primaryLight">
                Mit automatischer Platzhalter-Erkennung [Variable]
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

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-school-surface">
          
          {/* TITEL & KATEGORIE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Titel des Prompts: *
              </label>
              <input
                type="text"
                required
                placeholder="z.B. Differenzierter Fachtext zum Thema..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategorie:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PromptCategory)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900"
              >
                {Object.entries(CATEGORY_LABELS).filter(([k]) => k !== 'all').map(([k, meta]) => (
                  <option key={k} value={k}>{meta.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* BESCHREIBUNG */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kurzbeschreibung (Didaktischer Zweck):
            </label>
            <input
              type="text"
              placeholder="z.B. Erstellt in 3 Schritten einen handlungsorientierten Einstieg..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
            />
          </div>

          {/* FACH & KLASSENSTUFE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Schulfach:
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900"
              >
                <option value="Allgemein">Allgemein / Fächerübergreifend</option>
                {THUERINGEN_SUBJECTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Empfohlenes KI-Modell:
              </label>
              <input
                type="text"
                placeholder="z.B. ChatGPT-4o / Gemini Flash"
                value={recommendedModel}
                onChange={e => setRecommendedModel(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
              />
            </div>
          </div>

          {/* KLASSENSTUFEN & AFB CHIPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-2">
                Klassenstufen (Regelschule):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {GRADE_LEVELS.map(g => {
                  const num = g.replace('Klasse ', '');
                  const active = selectedGrades.includes(num);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => toggleGrade(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        active 
                          ? 'bg-school-primary text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Kl. {num}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-2">
                KMK Anforderungsbereiche:
              </label>
              <div className="flex flex-wrap gap-2">
                {(['AFB I', 'AFB II', 'AFB III'] as const).map(afb => {
                  const active = selectedAfb.includes(afb);
                  return (
                    <button
                      type="button"
                      key={afb}
                      onClick={() => toggleAfb(afb)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        active
                          ? afb === 'AFB I' ? 'bg-emerald-600 text-white' : afb === 'AFB II' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {afb}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DER PROMPT TEXT */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-school-primary" />
                Prompt-Vorlage mit Platzhaltern in [Eckigen Klammern]: *
              </label>
              <span className="text-[11px] text-slate-400">
                Tipp: Nutze [Thema], [Fach], [Klasse], etc.
              </span>
            </div>

            <textarea
              rows={8}
              required
              placeholder="Du bist eine Lehrkraft für [Fach]... Erstelle für Klasse [Klassenstufe] zum Thema [Thema]..."
              value={templateText}
              onChange={e => setTemplateText(e.target.value)}
              className="w-full text-xs font-mono p-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-900 leading-relaxed"
            />

            {/* Erkannte Variablen Anzeige */}
            {detectedVariables.length > 0 && (
              <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-school-primary flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {detectedVariables.length} Variablen erkannt:
                </span>
                {detectedVariables.map(v => (
                  <span key={v.key} className="px-2 py-0.5 bg-white border border-blue-200 rounded-md font-mono text-[11px] text-blue-900 font-bold">
                    [{v.key}]
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SICHTBARKEIT & FREIGABE WORKFLOW */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Sichtbarkeit & Kollegiums-Freigabe:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                visibility === 'private' ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200' : 'border-slate-200 bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="mt-0.5 text-school-primary"
                />
                <div>
                  <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Mein persönlicher Bereich (Privat)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nur für dich sichtbar. Du kannst ihn später jederzeit für Kollegen freigeben.
                  </p>
                </div>
              </label>

              <label className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                visibility === 'school' ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-200' : 'border-slate-200 bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="visibility"
                  value="school"
                  checked={visibility === 'school'}
                  onChange={() => setVisibility('school')}
                  className="mt-0.5 text-school-primary"
                />
                <div>
                  <div className="font-bold text-xs text-slate-800 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-school-primary" />
                    <span>Kollegiums-Bibliothek (Schulweit)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sofort für das gesamte Heimbürgeschule-Kollegium in der Schulbibliothek sichtbar.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* TAGS INPUT */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Schlagwörter / Tags (kommagetrennt):
            </label>
            <input
              type="text"
              placeholder="z.B. Biologie, Klasse 8, Fotosynthese, Klausur"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary text-slate-800"
            />
          </div>

        </form>

        {/* FOOTER */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Abbrechen
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-school-primary hover:bg-school-primaryDark text-white text-xs font-black rounded-xl shadow-soft flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Wird gespeichert...' : 'Prompt speichern'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
