import React from 'react';
import { Lightbulb, Search, Puzzle, Target, Scissors, HelpCircle } from 'lucide-react';
import { parseHintCards, HintCard } from '../../../services/pedagogicalParser';
import { FormattedText } from './FormattedText';

interface HintCardsViewProps {
  rawText: string;
  showCutLines: boolean;
}

export const HintCardsView: React.FC<HintCardsViewProps> = ({
  rawText,
  showCutLines
}) => {
  const { intro, cards } = parseHintCards(rawText);

  const getCardIcon = (level: number) => {
    switch (level) {
      case 1: return <Lightbulb className="w-4 h-4 text-emerald-600" />;
      case 2: return <Search className="w-4 h-4 text-amber-600" />;
      case 3: return <Puzzle className="w-4 h-4 text-orange-600" />;
      case 4: return <Target className="w-4 h-4 text-sky-600" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCardStyles = (color: HintCard['color']) => {
    switch (color) {
      case 'emerald':
        return {
          wrapper: 'bg-emerald-50/70 border-emerald-400',
          badge: 'bg-emerald-600 text-white',
          tag: 'bg-emerald-100 text-emerald-900 border-emerald-200'
        };
      case 'amber':
        return {
          wrapper: 'bg-amber-50/70 border-amber-400',
          badge: 'bg-amber-600 text-white',
          tag: 'bg-amber-100 text-amber-900 border-amber-200'
        };
      case 'orange':
        return {
          wrapper: 'bg-orange-50/70 border-orange-400',
          badge: 'bg-orange-600 text-white',
          tag: 'bg-orange-100 text-orange-900 border-orange-200'
        };
      case 'sky':
        return {
          wrapper: 'bg-sky-50/70 border-sky-400',
          badge: 'bg-school-primary text-white',
          tag: 'bg-sky-100 text-school-primary border-sky-200'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* INTRO HINWEIS */}
      {intro && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs print:p-2">
          <FormattedText content={intro} />
        </div>
      )}

      {/* 2X2 SCHNITTRASTER DER TIPP-KARTEN */}
      <div className="relative">
        
        {/* CUT LINES OVERLAY FOR WHOLE SHEET */}
        {showCutLines && (
          <div className="hidden print:flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2 pb-1 border-b border-dashed border-slate-400">
            <span className="flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-slate-600" />
              Schnittlinien: Entlang der gestrichelten Kanten ausschneiden & laminieren
            </span>
            <span>A4 Kärtchen-Raster (2x2)</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-4">
          {cards.map(card => {
            const styles = getCardStyles(card.color);

            return (
              <div
                key={card.level}
                className={`rounded-3xl border-2 p-5 sm:p-6 shadow-soft print:shadow-none print-avoid-break flex flex-col justify-between relative transition-all ${styles.wrapper}`}
              >
                {/* CARD TOP HEADER */}
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black shadow-xs ${styles.badge}`}>
                        Tipp {card.level}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                        {card.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${styles.tag}`}>
                        {card.tag}
                      </span>
                      {getCardIcon(card.level)}
                    </div>
                  </div>

                  {/* CARD TEXT */}
                  <div className="text-xs sm:text-sm text-slate-800 py-1 leading-relaxed">
                    <FormattedText content={card.content} />
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>HBS Kahla • Hilfekarte</span>
                  {showCutLines && (
                    <span className="flex items-center gap-1 text-slate-500 font-mono">
                      <Scissors className="w-3 h-3 rotate-90" />
                      Schneidekante
                    </span>
                  )}
                  <span>Stufe {card.level} von 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
