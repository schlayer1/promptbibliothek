import React, { useState } from 'react';
import { Sliders, Sparkles, CheckSquare, Award } from 'lucide-react';
import { parseTieredDiff, TierBlock } from '../../../services/pedagogicalParser';
import { FormattedText } from './FormattedText';

interface TieredDiffViewProps {
  rawText: string;
  showSolutions: boolean;
}

export const TieredDiffView: React.FC<TieredDiffViewProps> = ({
  rawText,
  showSolutions
}) => {
  const { intro, tiers, tasksOrSolution } = parseTieredDiff(rawText);
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const activeTiers = selectedTier === 'all' 
    ? tiers 
    : tiers.filter(t => t.tierName.toLowerCase() === selectedTier.toLowerCase());

  const getTierStyles = (color: TierBlock['color']) => {
    switch (color) {
      case 'emerald':
        return {
          wrapper: 'bg-emerald-50/60 border-emerald-400',
          badge: 'bg-emerald-600 text-white',
          afb: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'amber':
        return {
          wrapper: 'bg-amber-50/60 border-amber-400',
          badge: 'bg-amber-600 text-white',
          afb: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'rose':
        return {
          wrapper: 'bg-rose-50/60 border-rose-400',
          badge: 'bg-rose-600 text-white',
          afb: 'bg-rose-100 text-rose-900 border-rose-300'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* FILTER TABS (NUR IM BROWSER, BEIM DRUCK ALLE ODER GEWÄHLTE) */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-soft print:hidden">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-school-primary" />
          Differenzierungsstufe filtern:
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTier === 'all' ? 'bg-school-primary text-white shadow-soft' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Alle 3 Stufen
          </button>
          <button
            onClick={() => setSelectedTier('Basis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTier === 'Basis' ? 'bg-emerald-600 text-white shadow-soft' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🟢 Basis (AFB I)
          </button>
          <button
            onClick={() => setSelectedTier('Standard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTier === 'Standard' ? 'bg-amber-600 text-white shadow-soft' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🟡 Standard (AFB II)
          </button>
          <button
            onClick={() => setSelectedTier('Experte')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTier === 'Experte' ? 'bg-rose-600 text-white shadow-soft' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            🔴 Experte (AFB III)
          </button>
        </div>
      </div>

      {/* INTRO HINWEIS */}
      {intro && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs print:p-2">
          <FormattedText content={intro} />
        </div>
      )}

      {/* TIERED CONTAINERS */}
      <div className="space-y-6">
        {activeTiers.map(tier => {
          const styles = getTierStyles(tier.color);

          return (
            <div
              key={tier.tierName}
              className={`rounded-3xl border-2 p-6 sm:p-8 shadow-soft print:shadow-none print-avoid-break relative ${styles.wrapper}`}
            >
              {/* TIER HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1 rounded-xl text-xs font-black shadow-xs ${styles.badge}`}>
                    {tier.tierName}
                  </span>
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {tier.badge}
                  </span>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles.afb}`}>
                  {tier.afb}
                </span>
              </div>

              {/* TIER CONTENT */}
              <div className="py-1">
                <FormattedText content={tier.content} showWritingLines={true} />
              </div>

              {/* TIER FOOTER */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Staatliche Regelschule Heimbürgeschule Kahla</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-school-primary" />
                  Differenzierter Fachtext
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TASKS OR SOLUTIONS BLOCK */}
      {tasksOrSolution && (
        <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-soft print-avoid-break">
          <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3 mb-4">
            <CheckSquare className="w-5 h-5 text-school-primary" />
            <h3 className="font-black text-base text-slate-900">
              Arbeitsaufträge & Differenzierungsaufgaben
            </h3>
          </div>
          <FormattedText content={tasksOrSolution} showWritingLines={true} />
        </div>
      )}

    </div>
  );
};
