import React from 'react';
import { Layers, Scissors, CheckSquare, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { parseStations } from '../../../services/pedagogicalParser';
import { FormattedText } from './FormattedText';

interface StationCardViewProps {
  rawText: string;
  showCutLines: boolean;
  showSolutions: boolean;
}

export const StationCardView: React.FC<StationCardViewProps> = ({
  rawText,
  showCutLines,
  showSolutions
}) => {
  const { stations, generalIntro, solutionSection, runningSheetText } = parseStations(rawText);

  return (
    <div className="space-y-6">
      
      {/* INTRO HINWEIS */}
      {generalIntro && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed print:p-2 print:border-none">
          <FormattedText content={generalIntro} />
        </div>
      )}

      {/* DIE STATIONEN-KARTEN */}
      <div className="space-y-6">
        {stations.map(st => {
          const isWahl = st.type === 'Wahl';
          const isZusatz = st.type === 'Zusatz';

          return (
            <div 
              key={st.stationNumber}
              className={`bg-white rounded-3xl border-2 transition-all p-6 sm:p-8 shadow-soft print:shadow-none print-avoid-break relative ${
                isWahl 
                  ? 'border-amber-300' 
                  : isZusatz 
                  ? 'border-purple-300' 
                  : 'border-school-primary/60'
              }`}
            >
              {/* CUT LINES / SCHEREN-HINWEIS */}
              {showCutLines && (
                <div className="absolute -top-3 left-6 right-6 flex items-center justify-between border-t-2 border-dashed border-slate-400 pt-0.5 print:flex">
                  <span className="text-[10px] text-slate-500 font-bold bg-white px-2 flex items-center gap-1">
                    <Scissors className="w-3 h-3 text-slate-600 rotate-90" />
                    Hier als Tischaufsteller falzen oder ausschneiden
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">DIN A4 / A5</span>
                </div>
              )}

              {/* STATION HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-2xl text-white font-black text-sm tracking-wider shadow-sm uppercase ${
                    isWahl 
                      ? 'bg-amber-500' 
                      : isZusatz 
                      ? 'bg-purple-600' 
                      : 'bg-school-primary'
                  }`}>
                    Station {st.stationNumber}
                  </div>

                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                      {st.title}
                    </h3>
                  </div>
                </div>

                {/* TYPE BADGE */}
                <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isWahl 
                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                    : isZusatz 
                    ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                    : 'bg-blue-100 text-school-primary border border-blue-200'
                }`}>
                  {st.type}station
                </span>
              </div>

              {/* STATION CONTENT */}
              <div className="py-2">
                <FormattedText content={st.content} showWritingLines={true} />
              </div>

              {/* STATION FOOTER */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Staatliche Regelschule Heimbürgeschule Kahla</span>
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-school-primary" />
                  Nach Bearbeitung im Laufzettel abhaken
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHÜLER-LAUFZETTEL */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-soft print-avoid-break">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-school-primary" />
            <h3 className="font-black text-base text-slate-900">
              Schüler-Laufzettel & Stationspass
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            Ins Schülerheft einkleben
          </span>
        </div>

        {runningSheetText ? (
          <FormattedText content={runningSheetText} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2.5 text-left font-black w-24">Station</th>
                  <th className="border border-slate-300 p-2.5 text-left font-black">Aufgabe / Thema</th>
                  <th className="border border-slate-300 p-2.5 text-center font-black w-28">Erledigt [✓]</th>
                  <th className="border border-slate-300 p-2.5 text-center font-black w-36">Selbstreflexion</th>
                  <th className="border border-slate-300 p-2.5 text-center font-black w-28">Kürzel LK</th>
                </tr>
              </thead>
              <tbody>
                {stations.map(st => (
                  <tr key={st.stationNumber} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="border border-slate-300 p-2.5 font-bold text-school-primary">
                      Station {st.stationNumber}
                    </td>
                    <td className="border border-slate-300 p-2.5 font-medium text-slate-800">
                      {st.title} ({st.type})
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center">
                      <div className="w-5 h-5 border-2 border-slate-400 rounded mx-auto" />
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center text-base">
                      🙂 &nbsp; 😐 &nbsp; 🙁
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center text-slate-300">
                      ______
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LÖSUNGSSTATION (NUR WENN AKTIV) */}
      {solutionSection && showSolutions && (
        <div className="bg-emerald-50/70 rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-soft print-avoid-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-300 pb-3 mb-4 text-emerald-950">
            <Key className="w-5 h-5 text-emerald-700" />
            <h3 className="font-black text-base">
              Lösungsstation (Zur Selbstkontrolle & Lehrkraft-Einsicht)
            </h3>
          </div>
          <FormattedText content={solutionSection} />
        </div>
      )}

    </div>
  );
};
