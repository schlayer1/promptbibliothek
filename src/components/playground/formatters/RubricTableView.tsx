import React from 'react';
import { CheckSquare, Award, FileCheck2, UserCheck } from 'lucide-react';
import { FormattedText } from './FormattedText';

interface RubricTableViewProps {
  rawText: string;
}

export const RubricTableView: React.FC<RubricTableViewProps> = ({ rawText }) => {
  // Extract tables and surrounding text
  const lines = rawText.split('\n');
  const tableRows: string[][] = [];
  const textBeforeTable: string[] = [];
  const textAfterTable: string[] = [];
  let isInsideTable = false;
  let hasTablePassed = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      isInsideTable = true;
      // Skip markdown separator (|---|---|)
      if (!/^\|[\s\-:|]+\|$/.test(trimmed)) {
        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map(c => c.trim().replace(/\*\*/g, ''));
        tableRows.push(cells);
      }
      continue;
    }

    if (isInsideTable) {
      isInsideTable = false;
      hasTablePassed = true;
    }

    if (hasTablePassed) {
      textAfterTable.push(line);
    } else {
      textBeforeTable.push(line);
    }
  }

  const headerCells = tableRows.length > 0 ? tableRows[0] : [];
  const bodyRows = tableRows.length > 1 ? tableRows.slice(1) : [];

  return (
    <div className="space-y-6">
      
      {/* TEXT VOR DER TABELLE */}
      {textBeforeTable.length > 0 && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <FormattedText content={textBeforeTable.join('\n')} />
        </div>
      )}

      {/* DIE KRITERIENTABELLE */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-soft print:shadow-none print-avoid-break">
        <div className="flex items-center justify-between border-b-2 border-school-primary pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-school-primary" />
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              Kriterienorientiertes Bewertungsraster (Rubrik)
            </h3>
          </div>
          <span className="text-xs font-bold text-school-primary px-3 py-1 bg-school-primaryLight rounded-full">
            Heimbürgeschule Kahla
          </span>
        </div>

        {tableRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300">
              <thead>
                <tr className="bg-school-primary text-white">
                  {headerCells.map((h, i) => (
                    <th key={i} className="border border-school-primaryDark p-3 text-left font-black tracking-wide">
                      {h}
                    </th>
                  ))}
                  <th className="border border-school-primaryDark p-3 text-center font-black w-20">
                    Punkte
                  </th>
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border border-slate-300 p-3 align-top leading-relaxed text-slate-800">
                        {cell}
                      </td>
                    ))}
                    <td className="border border-slate-300 p-3 text-center align-middle font-bold text-slate-400">
                      [ &nbsp;&nbsp; / &nbsp;&nbsp; ]
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <FormattedText content={rawText} />
        )}

        {/* HBS NOTENSCHLÜSSEL & BEWERTUNGSFUSS */}
        <div className="mt-6 pt-4 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notenschlüssel Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong className="block font-bold text-slate-900 mb-1">
              Offizieller HBS-Notenschlüssel (Regelschule):
            </strong>
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[11px] mt-1">
              <div className="p-1 bg-white rounded border">Note 1<br/>≥ 95%</div>
              <div className="p-1 bg-white rounded border">Note 2<br/>≥ 80%</div>
              <div className="p-1 bg-white rounded border">Note 3<br/>≥ 65%</div>
              <div className="p-1 bg-white rounded border">Note 4<br/>≥ 45%</div>
              <div className="p-1 bg-white rounded border">Note 5<br/>≥ 25%</div>
            </div>
          </div>

          {/* Punkte & Gesamtnote */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col justify-between text-xs">
            <div className="flex justify-between items-center font-bold text-slate-800">
              <span>Erreichte Gesamtpunktzahl:</span>
              <span className="font-mono text-base text-school-primary">______ / ______ Punkte</span>
            </div>
            <div className="flex justify-between items-center font-bold text-slate-800 mt-2">
              <span>Endnote:</span>
              <span className="font-mono text-xl text-slate-900 border-b-2 border-slate-800 px-4">_______</span>
            </div>
          </div>
        </div>

        {/* UNTERSCHRIFTEN */}
        <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500 font-semibold print:grid">
          <div>
            <div className="border-b border-slate-400 h-8" />
            <span className="block mt-1">Datum, Unterschrift Fachlehrkraft</span>
          </div>
          <div>
            <div className="border-b border-slate-400 h-8" />
            <span className="block mt-1">Kenntnisnahme Erziehungsberechtigte</span>
          </div>
        </div>
      </div>

      {/* TEXT NACH DER TABELLE */}
      {textAfterTable.length > 0 && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <FormattedText content={textAfterTable.join('\n')} />
        </div>
      )}

    </div>
  );
};
