import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  FlaskConical, 
  Copy, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ExternalLink,
  Code2
} from 'lucide-react';
import { FLICK_SECTIONS, FLICK_CATEGORIES, FlickCategory, FlickSection } from '../../data/flickGuideData';

interface FlickGuideBrowserProps {
  onRunInTestarea: (promptText: string, title: string) => void;
  onAdoptAsTemplate: (promptText: string, title: string) => void;
  onOpenModularBuilder: () => void;
}

export const FlickGuideBrowser: React.FC<FlickGuideBrowserProps> = ({
  onRunInTestarea,
  onAdoptAsTemplate,
  onOpenModularBuilder
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FlickCategory>('Alle Bereiche');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'flick-sec-3-1': true,
    'flick-sec-3-2': true,
    'flick-sec-3-21': true
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle individual section
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand all / collapse all
  const handleExpandAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    FLICK_SECTIONS.forEach(s => {
      next[s.id] = expand;
    });
    setExpandedSections(next);
  };

  // Copy helper
  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter sections
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FLICK_SECTIONS.filter(section => {
      // Category filter
      if (selectedCategory !== 'Alle Bereiche' && section.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (q) {
        const matchTitle = section.title.toLowerCase().includes(q);
        const matchTip = section.didacticTip.toLowerCase().includes(q);
        const matchPrompts = section.prompts.some(p => p.toLowerCase().includes(q));
        const matchNumber = section.number.toLowerCase().includes(q);
        return matchTitle || matchTip || matchPrompts || matchNumber;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const totalPromptsCount = useMemo(() => {
    return FLICK_SECTIONS.reduce((acc, s) => acc + s.prompts.length, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/10">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manuel Flick ChatGPT-Guide für Lehrkräfte • Kapitel 3</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Der kuratierte Schul-Prompt-Katalog
            </h1>
            
            <p className="text-sm text-amber-100/90 leading-relaxed">
              Über 200 praxiserprobte Prompts und didaktische Bausteine für Unterricht, Differenzierung, 
              Aufgabenerstellung und Elternarbeit. Klicke auf einen Prompt, um ihn direkt in der 
              <span className="font-bold text-white"> Live-Testarea</span> auszuführen, zu kopieren oder als eigene Schulvorlage abzuspeichern.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-amber-200">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                33 didaktische Kapitel
              </span>
              <span>•</span>
              <span className="font-bold">{totalPromptsCount} Blitz-Prompts</span>
              <span>•</span>
              <a
                href="https://manuelflick.notion.site/Der-ChatGPT-Guide-f-r-Lehrkr-fte-f214379898ce405089ac05555f06ba04#106399fae7f243d5b081ad8062b5899b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline hover:text-white transition"
              >
                <span>Original Notion-Guide</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Action to open the 8-point builder */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenModularBuilder}
              className="w-full md:w-auto px-5 py-3.5 bg-white hover:bg-amber-50 text-amber-900 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>🧩 Flick-Struktur-Baukasten</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-4">
        {/* Top: Search bar & expand controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="In allen 200+ Prompts, Didaktik-Tipps oder Kapiteln suchen (z.B. Differenzierung, Quiz, Elternbrief)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExpandAll(true)}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Alle aufklappen
            </button>
            <button
              onClick={() => handleExpandAll(false)}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Alle zuklappen
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {FLICK_CATEGORIES.map((cat, idx) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-soft'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTIONS ACCORDION LIST */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-soft">
            <p className="text-slate-500 font-bold text-sm">
              Keine Kapitel oder Prompts für "{searchQuery}" gefunden.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Alle Bereiche'); }}
              className="mt-3 px-4 py-2 bg-amber-50 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-100 transition"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          filteredSections.map(section => {
            const isExpanded = !!expandedSections[section.id];
            return (
              <SectionAccordionCard
                key={section.id}
                section={section}
                isExpanded={isExpanded}
                onToggle={() => toggleSection(section.id)}
                copiedId={copiedId}
                onCopyPrompt={handleCopyPrompt}
                onRunInTestarea={onRunInTestarea}
                onAdoptAsTemplate={onAdoptAsTemplate}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

// Sub-component for individual Accordion Card
interface SectionAccordionCardProps {
  section: FlickSection;
  isExpanded: boolean;
  onToggle: () => void;
  copiedId: string | null;
  onCopyPrompt: (text: string, id: string) => void;
  onRunInTestarea: (promptText: string, title: string) => void;
  onAdoptAsTemplate: (promptText: string, title: string) => void;
}

const SectionAccordionCard: React.FC<SectionAccordionCardProps> = ({
  section,
  isExpanded,
  onToggle,
  copiedId,
  onCopyPrompt,
  onRunInTestarea,
  onAdoptAsTemplate
}) => {
  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden transition duration-200 hover:border-slate-300">
      {/* Header bar (clickable to toggle) */}
      <div
        onClick={onToggle}
        className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/80 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center font-black text-base shrink-0">
            {section.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {section.number}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
                {section.title}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {section.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {section.prompts.length} {section.prompts.length === 1 ? 'Prompt' : 'Prompts'}
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 bg-slate-50/40">
          {/* Didactic tip */}
          {section.didacticTip && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed">
              <span className="font-black text-amber-600 shrink-0 mt-0.5">💡 Didaktik-Tipp:</span>
              <span>{section.didacticTip}</span>
            </div>
          )}

          {/* Structural Formula (if present) */}
          {section.structuralTemplate && (
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
              <button
                type="button"
                onClick={() => setShowFormula(!showFormula)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-amber-800 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mögliche Strukturelemente für ausführliche Prompts (Flick-Formel)</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600">
                  {showFormula ? 'Ausblenden ▲' : 'Anzeigen ▼'}
                </span>
              </button>

              {showFormula && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {section.structuralTemplate}
                  </pre>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => onRunInTestarea(section.structuralTemplate!, `${section.number} Struktur-Formel`)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition"
                    >
                      <FlaskConical className="w-3 h-3" />
                      <span>Formel in Testarea laden</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* List of Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Erprobte Direkt-Prompts
            </span>

            <div className="grid grid-cols-1 gap-2">
              {section.prompts.map((promptText, pIdx) => {
                const promptKey = `${section.id}-p-${pIdx}`;
                const isCopied = copiedId === promptKey;

                return (
                  <div
                    key={pIdx}
                    className="group bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:shadow-soft transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    {/* Prompt Text with highlight on placeholders */}
                    <div className="text-xs text-slate-800 font-medium leading-relaxed flex-1 select-text">
                      <HighlightedPromptText text={promptText} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center opacity-90 group-hover:opacity-100 transition">
                      {/* Copy button */}
                      <button
                        onClick={() => onCopyPrompt(promptText, promptKey)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="In die Zwischenablage kopieren"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        <span>{isCopied ? 'Kopiert' : 'Kopieren'}</span>
                      </button>

                      {/* Adopt as Template */}
                      <button
                        onClick={() => onAdoptAsTemplate(promptText, `${section.number} ${section.title}`)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Als eigene Vorlage speichern & anpassen"
                      >
                        <Plus className="w-3 h-3 text-amber-700" />
                        <span className="hidden sm:inline">Als Vorlage</span>
                      </button>

                      {/* Run in Testarea */}
                      <button
                        onClick={() => onRunInTestarea(promptText, `${section.number} ${section.title}`)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-soft transition cursor-pointer"
                        title="Sofort in der Live-Testarea mit Schülerhände-Ready ausführen"
                      >
                        <FlaskConical className="w-3 h-3 text-emerald-200" />
                        <span>Testen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component to highlight placeholders like "Text einfügen" or "Thema nennen"
const HighlightedPromptText: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match quotes like “...”, "...", »...«, or [Platzhalter]
  const parts = text.split(/([“"»\[][^”"«\]]+[”"«\]])/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (/^[“"»\[].+[”"«\]]$/.test(part)) {
          return (
            <span
              key={i}
              className="inline-block px-1.5 py-0.2 mx-0.5 rounded bg-amber-100 text-amber-950 font-bold border border-amber-300 text-[11px]"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};
