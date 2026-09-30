import React from 'react';
import { 
  Star, 
  FlaskConical, 
  Copy, 
  Share2, 
  Lock, 
  Globe, 
  GitFork, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { PromptTemplate } from '../../types/prompt';
import { useAuth } from '../../context/AuthContext';

interface PromptCardProps {
  prompt: PromptTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (prompt: PromptTemplate) => void;
  onOpenTestarea: (prompt: PromptTemplate) => void;
  onEdit: (prompt: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, newVisibility: 'school' | 'private') => void;
  onFork: (prompt: PromptTemplate) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onOpenTestarea,
  onEdit,
  onDelete,
  onToggleShare,
  onFork
}) => {
  const { currentUser, isAdmin } = useAuth();

  const isAuthor = currentUser && (currentUser.id === prompt.authorId || isAdmin);
  const isSchoolVisible = prompt.visibility === 'school';
  const hasTips = prompt.colleagueTips && prompt.colleagueTips.length > 0;
  const variableCount = prompt.variables ? prompt.variables.length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-school-primary/40 shadow-soft hover:shadow-float transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* TOP HEADER */}
      <div className="p-5 pb-3">
        {/* BADGES ROW */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Visibility Badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isSchoolVisible 
                ? 'bg-blue-50 text-school-primary border border-blue-200' 
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {isSchoolVisible ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {isSchoolVisible ? 'Kollegium' : 'Privat'}
            </span>

            {/* Subject or Category */}
            {prompt.subject && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {prompt.subject}
              </span>
            )}

            {/* AFB Badges */}
            {prompt.afbLevels?.map(afb => (
              <span 
                key={afb} 
                className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                  afb === 'AFB I' ? 'bg-emerald-100 text-emerald-800' :
                  afb === 'AFB II' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}
              >
                {afb}
              </span>
            ))}
          </div>

          {/* Favorite Star */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500 hover:bg-amber-50 transition cursor-pointer"
            title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* TITLE & DESCRIPTION */}
        <h3 
          onClick={() => onOpenDetail(prompt)}
          className="font-extrabold text-base text-slate-900 group-hover:text-school-primary transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {prompt.title}
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {prompt.description}
        </p>

        {/* AUTHOR & SOURCE */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="truncate">Von: <strong className="text-slate-600 font-semibold">{prompt.authorName}</strong></span>
          {prompt.source && (
            <span className="truncate max-w-[140px] text-[10px] text-slate-400" title={prompt.source}>
              {prompt.source}
            </span>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Left Side: Tips or Variables count */}
        <div className="flex items-center gap-2">
          {variableCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-school-primary">
              {variableCount} {variableCount === 1 ? 'Variable' : 'Variablen'}
            </span>
          )}

          {hasTips && (
            <button
              onClick={() => onOpenDetail(prompt)}
              className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 hover:text-school-primary"
              title={`${prompt.colleagueTips?.length} Kollegiums-Tipps`}
            >
              <MessageSquare className="w-3 h-3 text-amber-500" />
              <span>{prompt.colleagueTips?.length}</span>
            </button>
          )}
        </div>

        {/* Right Side: Interactive Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Fork button if school prompt */}
          {isSchoolVisible && currentUser && currentUser.id !== prompt.authorId && (
            <button
              onClick={() => onFork(prompt)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-school-primary hover:bg-white transition cursor-pointer"
              title="In meinen eigenen Bereich kopieren"
            >
              <GitFork className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Share button if author */}
          {isAuthor && (
            <button
              onClick={() => onToggleShare(prompt.id, isSchoolVisible ? 'private' : 'school')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isSchoolVisible 
                  ? 'text-school-primary hover:bg-white' 
                  : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
              }`}
              title={isSchoolVisible ? "Freigabe aufheben (privat machen)" : "Für das gesamte Kollegium freigeben"}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit & Delete if author */}
          {isAuthor && (
            <>
              <button
                onClick={() => onEdit(prompt)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
                title="Bearbeiten"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Löschen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Test in Testarea Button */}
          <button
            onClick={() => onOpenTestarea(prompt)}
            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
            title="In der Live-Testarea ausführen"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          {/* Open & Fill Button */}
          <button
            onClick={() => onOpenDetail(prompt)}
            className="px-3 py-1.5 rounded-xl bg-school-primary hover:bg-school-primaryDark text-white text-xs font-bold shadow-soft flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <span>Ausfüllen</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
