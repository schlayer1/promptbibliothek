import React from 'react';
import { Mail, Scissors, Calendar, MapPin, Euro, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseParentLetter } from '../../../services/pedagogicalParser';
import { FormattedText } from './FormattedText';

interface ParentLetterViewProps {
  rawText: string;
}

export const ParentLetterView: React.FC<ParentLetterViewProps> = ({ rawText }) => {
  const { bodyText, returnSlipText } = parseParentLetter(rawText);

  return (
    <div className="space-y-6">
      
      {/* BRIEFBOGEN */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 sm:p-12 shadow-soft print:shadow-none print-avoid-break">
        
        {/* SCHULKOPF */}
        <div className="border-b-2 border-school-primary pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-sm font-black text-school-primary tracking-widest uppercase">
              Staatliche Regelschule Heimbürgeschule Kahla
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Friedrich-Gottlob-Keller-Straße 11 • 07768 Kahla
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-medium">
            Datum: {new Date().toLocaleDateString('de-DE')}
          </div>
        </div>

        {/* HAUPTTEXT DES BRIEFES */}
        <div className="py-2 text-slate-800 space-y-4">
          <FormattedText content={bodyText} />
        </div>

        {/* PERFORIERTER RÜCKMELDEABSCHNITT */}
        <div className="mt-12 pt-6 border-t-2 border-dashed border-slate-400 relative">
          
          {/* SCHERE & TRENNHINWEIS */}
          <div className="absolute -top-3 left-0 right-0 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold bg-white px-3 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-slate-700" />
              <span>Hier abtrennen und bis zum genannten Termin zurückgeben</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">RÜCKMELDUNG</span>
          </div>

          {/* RÜCKMELDE-INHALT */}
          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 mt-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-extrabold text-sm text-slate-900">
                Rückmeldeabschnitt & Einverständniserklärung
              </h4>
              <span className="text-xs font-bold text-school-primary">Heimbürgeschule Kahla</span>
            </div>

            {returnSlipText ? (
              <FormattedText content={returnSlipText} />
            ) : (
              <div className="space-y-3 text-xs text-slate-700">
                <div>
                  <span className="font-semibold">Name der Schülerin / des Schülers:</span>
                  <div className="border-b border-slate-400 h-6 mt-1" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-school-primary" />
                    <span>Mein Kind <strong>nimmt an der Veranstaltung teil</strong>.</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-school-primary" />
                    <span>Mein Kind kann leider <strong>nicht teilnehmen</strong>.</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="font-semibold">Telefonnummer für Notfälle:</span>
                    <div className="border-b border-slate-400 h-6 mt-1" />
                  </div>
                  <div>
                    <span className="font-semibold">Allergien / Wichtige Besonderheiten:</span>
                    <div className="border-b border-slate-400 h-6 mt-1" />
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-6 text-[11px] text-slate-500 font-semibold">
                  <div>
                    <div className="border-b border-slate-400 h-6" />
                    <span className="block mt-1">Ort, Datum</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 h-6" />
                    <span className="block mt-1">Unterschrift der Erziehungsberechtigten</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
