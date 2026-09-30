import React from 'react';
import { FileText, CheckSquare, Key, BookOpen } from 'lucide-react';
import { FormattedText } from './FormattedText';

interface WorksheetViewProps {
  rawText: string;
  showSolutions: boolean;
  topicTitle?: string;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({
  rawText,
  showSolutions,
  topicTitle
}) => {
  // Split potential solution part
  const solutionMatch = rawText.split(/(?:###\s*Lösungen|##\s*Musterlösung|Musterlösungen:|Lösungsbogen:)/i);
  const exercisePart = solutionMatch[0];
  const solutionPart = solutionMatch.length > 1 ? solutionMatch.slice(1).join('\n') : '';

  return (
    <div className="space-y-6">
      
      {/* DAS SCHÜLER-ARBEITSBLATT */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-10 shadow-soft print:shadow-none print-avoid-break">
        
        {/* ARBEITSBLATT-KOPF */}
        <div className="border-b-2 border-school-primary pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-school-primary">
                Staatliche Regelschule Heimbürgeschule Kahla
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {topicTitle || 'Unterrichts-Arbeitsblatt'}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Übung & Sicherung
            </span>
          </div>

          {/* NAME / KLASSE / DATUM ZEILE */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-700">
            <div>
              <span>Name:</span>
              <div className="border-b border-slate-400 h-6 w-full" />
            </div>
            <div>
              <span>Klasse:</span>
              <div className="border-b border-slate-400 h-6 w-full" />
            </div>
            <div>
              <span>Datum:</span>
              <div className="border-b border-slate-400 h-6 w-full" />
            </div>
          </div>
        </div>

        {/* INHALTE / AUFGABEN */}
        <div className="py-2">
          <FormattedText content={exercisePart} showWritingLines={true} />
        </div>

        {/* FUSSZEILE */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Staatliche Regelschule Heimbürgeschule Kahla</span>
          <span>Erreichte Punktzahl: ______ / ______ Punkte</span>
        </div>
      </div>

      {/* LÖSUNGEN (WENN VORHANDEN UND LEHRKRAFT-MODUS AKTIV) */}
      {solutionPart && showSolutions && (
        <div className="bg-emerald-50/70 rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-soft print-avoid-break">
          <div className="flex items-center gap-2 border-b-2 border-emerald-300 pb-3 mb-4 text-emerald-950">
            <Key className="w-5 h-5 text-emerald-700" />
            <h3 className="font-black text-base">
              Musterlösung & Erwartungshorizont (Lehrer-Exemplar)
            </h3>
          </div>
          <FormattedText content={solutionPart} />
        </div>
      )}

    </div>
  );
};
