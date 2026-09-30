import React, { useState } from 'react';
import { X, Sparkles, Copy, FlaskConical, Plus, Check, HelpCircle } from 'lucide-react';

interface FlickModularBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunInTestarea: (promptText: string, title: string) => void;
  onSaveAsTemplate: (promptText: string, title: string) => void;
}

export const FlickModularBuilderModal: React.FC<FlickModularBuilderModalProps> = ({
  isOpen,
  onClose,
  onRunInTestarea,
  onSaveAsTemplate
}) => {
  const [copied, setCopied] = useState(false);

  // Modular Elements based on Manuel Flick
  const [role, setRole] = useState('Erfahrene Lehrkraft an einer Thüringer Regelschule');
  const [task, setTask] = useState('Erstelle');
  const [topic, setTopic] = useState('');
  const [targetGroup, setTargetGroup] = useState('Klasse 8 (Regelschule)');
  const [format, setFormat] = useState('Differenziertes Arbeitsblatt mit Aufgaben');
  const [length, setLength] = useState('1 bis 2 DIN-A4-Seiten');
  const [style, setStyle] = useState('Schülergerecht, motivierend, verständlich');
  const [constraints, setConstraints] = useState<string[]>([
    'Verwende offizielle KMK-Operatoren',
    'Füge am Ende eine vollständige Musterlösung für die Lehrkraft bei'
  ]);

  if (!isOpen) return null;

  const standardRoles = [
    'Erfahrene Lehrkraft an einer Thüringer Regelschule',
    'Didaktischer Fachberater und Unterrichtsplaner',
    'Geduldiger, ermutigender Lerncoach und Nachhilfelehrer',
    'Prüfer und Ersteller von Abschlussprüfungen',
    'Sprachsensibler DaZ-Experte (Deutsch als Zweitsprache)'
  ];

  const standardTasks = [
    'Erstelle',
    'Differenziere auf 3 Niveaustufen (AFB I-III)',
    'Fasse zusammen und erstelle ein Glossar',
    'Entwickle einen 45-Minuten-Stundenentwurf',
    'Formuliere einen verständlichen Elternbrief',
    'Entwirf eine Lernstation mit Hilfekarten',
    'Erstelle ein Quiz mit Erwartungshorizont'
  ];

  const standardTargetGroups = [
    'Klasse 5/6 (Orientierungsstufe)',
    'Klasse 7/8 (Regelschule)',
    'Klasse 9/10 (Haupt- und Realschulabschluss)',
    'Förderschüler mit Förderbedarf Lernen',
    'DaZ-Schüler mit geringen Deutschkenntnissen'
  ];

  const standardFormats = [
    'Differenziertes Arbeitsblatt mit Aufgaben',
    'Stationenlernen mit Tischaufstellern & Laufzettel',
    'Gestufte 4-Farb-Hilfekarten (Tipp 1 bis 4)',
    'Tabellarischer Stundenverlaufsplan mit Phasen',
    'Bewertungsrubrik / Kriterienraster mit Notenschlüssel',
    'Formeller Elternbrief mit abtrennbarem Rücklaufstreifen'
  ];

  const constraintOptions = [
    'Verwende offizielle KMK-Operatoren',
    'Füge am Ende eine vollständige Musterlösung für die Lehrkraft bei',
    'Verwende Einfache Sprache (kurze Sätze, keine Fremdwörter)',
    'Formatiere mit Schnittlinien (✂️) zum Ausschneiden',
    'Beziehe Beispiele direkt aus der Lebenswelt der Jugendlichen ein',
    'Schließe jede Aufgabe mit einem Punkteschlüssel ab'
  ];

  const toggleConstraint = (item: string) => {
    setConstraints(prev =>
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  // Assembled Prompt
  const assembledPrompt = `Du agierst in folgender Rolle: ${role}.

Deine Aufgabe: ${task}${topic ? ` zum Thema "${topic}"` : ''}.
Zielgruppe: ${targetGroup}
Gewünschte Struktur & Format: ${format}
Geplanter Umfang: ${length}
Sprachstil & Tonalität: ${style}

Besondere Anforderungen & Rahmenbedingungen:
${constraints.map(c => `- ${c}`).join('\n')}

Bitte erstelle den Inhalt schülerfertig formatiert mit klarer Gliederung.`;

  const promptTitle = topic
    ? `${task}: ${topic} (${targetGroup})`
    : `Flick-Prompt: ${task} (${format})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assembledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    onRunInTestarea(assembledPrompt, promptTitle);
    onClose();
  };

  const handleSave = () => {
    onSaveAsTemplate(assembledPrompt, promptTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-soft">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Flick-Prompt-Baukasten</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Goldstandard
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Strukturiere deinen Prompt nach Manuel Flicks bewährtem 8-Punkte-System für Schule & Unterricht.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 Columns (Form left, Live Preview right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/50">
          {/* LEFT: Builder Controls */}
          <div className="space-y-4">
            {/* 1. Rolle */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                <span>1. Rolle / Persona</span>
                <span title="Wer soll die KI sein?">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </span>
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {standardRoles.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 2. Aufgabe & Thema */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">2. Aufgabe / Operator</label>
                <select
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {standardTasks.map((t, i) => (
                    <option key={i} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">3. Unterrichtsthema</label>
                <input
                  type="text"
                  placeholder="z.B. Fotosynthese, Weimarer Republik..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 4. Zielgruppe & 5. Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">4. Zielgruppe / Niveau</label>
                <select
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {standardTargetGroups.map((g, i) => (
                    <option key={i} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">5. Gewünschtes Format</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {standardFormats.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Umfang & 7. Stil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">6. Umfang</label>
                <input
                  type="text"
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  placeholder="z.B. ca. 200 Wörter, 5 Aufgaben..."
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">7. Sprachstil</label>
                <input
                  type="text"
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  placeholder="z.B. einfach, motivierend..."
                  className="w-full text-xs font-medium px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* 8. Didaktische Restriktionen */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                8. Didaktische Kriterien & Restriktionen
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {constraintOptions.map((opt, i) => {
                  const active = constraints.includes(opt);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleConstraint(opt)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg border transition flex items-center justify-between cursor-pointer ${
                        active
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                        active ? 'bg-amber-500 text-white' : 'border border-slate-300'
                      }`}>
                        {active ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Vorschau des generierten Prompts
              </span>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Live generiert
              </span>
            </div>

            <textarea
              readOnly
              value={assembledPrompt}
              className="flex-1 w-full text-xs font-mono leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 resize-none focus:outline-none select-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Schließen
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>Als Vorlage anlegen</span>
            </button>

            <button
              onClick={handleRun}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-soft transition cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5 text-emerald-300" />
              <span>🧪 In Testarea testen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
