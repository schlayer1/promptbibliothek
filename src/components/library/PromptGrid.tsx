import React from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  BookOpen, 
  Sliders, 
  CheckSquare, 
  Mail, 
  Calendar, 
  HeartHandshake, 
  Users,
  X,
  Plus,
  Sparkles
} from 'lucide-react';
import { PromptTemplate, FilterOptions, PromptCategory } from '../../types/prompt';
import { PromptCard } from './PromptCard';
import { THUERINGEN_SUBJECTS, GRADE_LEVELS, CATEGORY_LABELS } from '../../data/schoolSubjects';

interface PromptGridProps {
  prompts: PromptTemplate[];
  userFavorites: string[];
  filterOptions: FilterOptions;
  onFilterChange: (newOptions: Partial<FilterOptions>) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (prompt: PromptTemplate) => void;
  onOpenTestarea: (prompt: PromptTemplate) => void;
  onEdit: (prompt: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, newVisibility: 'school' | 'private') => void;
  onFork: (prompt: PromptTemplate) => void;
  onOpenNewPrompt: () => void;
}

export const PromptGrid: React.FC<PromptGridProps> = ({
  prompts,
  userFavorites,
  filterOptions,
  onFilterChange,
  onToggleFavorite,
  onOpenDetail,
  onOpenTestarea,
  onEdit,
  onDelete,
  onToggleShare,
  onFork,
  onOpenNewPrompt
}) => {
  const categories: { key: string; label: string; icon: any }[] = [
    { key: 'all', label: 'Alle', icon: Layers },
    { key: 'unterricht', label: 'Unterricht', icon: BookOpen },
    { key: 'differenzierung', label: 'Differenzierung', icon: Sliders },
    { key: 'bewertung', label: 'Bewertung & Raster', icon: CheckSquare },
    { key: 'eltern', label: 'Elternarbeit', icon: Mail },
    { key: 'orga', label: 'Organisation', icon: Calendar },
    { key: 'sonderpaedagogik', label: 'Inklusion & DaZ', icon: HeartHandshake },
    { key: 'methoden', label: 'Methoden', icon: Users },
  ];

  const hasActiveFilters = 
    filterOptions.category !== 'all' || 
    filterOptions.searchQuery.trim() !== '' || 
    filterOptions.subject !== 'all' || 
    filterOptions.grade !== 'all' || 
    filterOptions.afb !== 'all';

  const resetFilters = () => {
    onFilterChange({
      category: 'all',
      searchQuery: '',
      subject: 'all',
      grade: 'all',
      afb: 'all'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* CATEGORY SELECTOR CAROUSEL */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = filterOptions.category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onFilterChange({ category: cat.key })}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-school-primary text-white shadow-soft'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SEARCH & DETAILED FILTER ROW */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Suchbegriff, Fach, Thema, Operatoren oder Variablen suchen..."
            value={filterOptions.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-school-primary focus:bg-white transition text-slate-900"
          />
          {filterOptions.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Subject Filter */}
          <select
            value={filterOptions.subject}
            onChange={e => onFilterChange({ subject: e.target.value })}
            className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-school-primary"
          >
            <option value="all">Alle Fächer</option>
            {THUERINGEN_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={filterOptions.grade}
            onChange={e => onFilterChange({ grade: e.target.value })}
            className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-school-primary"
          >
            <option value="all">Alle Klassen</option>
            {GRADE_LEVELS.map(g => (
              <option key={g} value={g.replace('Klasse ', '')}>{g}</option>
            ))}
          </select>

          {/* AFB Filter */}
          <select
            value={filterOptions.afb}
            onChange={e => onFilterChange({ afb: e.target.value })}
            className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-school-primary"
          >
            <option value="all">Alle Anforderungsbereiche</option>
            <option value="AFB I">🟢 AFB I (Basis)</option>
            <option value="AFB II">🟡 AFB II (Standard)</option>
            <option value="AFB III">🔴 AFB III (Experte)</option>
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition shrink-0 cursor-pointer"
            >
              Filter löschen
            </button>
          )}
        </div>
      </div>

      {/* PROMPTS GRID */}
      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map(p => (
            <PromptCard
              key={p.id}
              prompt={p}
              isFavorite={userFavorites.includes(p.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onOpenDetail}
              onOpenTestarea={onOpenTestarea}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleShare={onToggleShare}
              onFork={onFork}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-800">Keine Prompts gefunden</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Für die gewählten Such- oder Filterkriterien liegen derzeit keine Prompts vor.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Filter zurücksetzen
              </button>
            )}

            <button
              onClick={onOpenNewPrompt}
              className="px-4 py-2 bg-school-primary hover:bg-school-primaryDark text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Prompt erstellen</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
