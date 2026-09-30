import React from 'react';
import { AlertTriangle, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { PrivacyScanResult } from '../../services/privacyGuard';

interface PrivacyWarningModalProps {
  isOpen: boolean;
  scanResult: PrivacyScanResult;
  onProceed: () => void;
  onCancel: () => void;
}

export const PrivacyWarningModal: React.FC<PrivacyWarningModalProps> = ({
  isOpen,
  scanResult,
  onProceed,
  onCancel
}) => {
  if (!isOpen || !scanResult.hasWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border-2 border-rose-300 w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-rose-50 p-5 border-b border-rose-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-soft">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-rose-950 leading-tight">
                DSGVO & Schülerdaten-Warnung!
              </h3>
              <p className="text-xs text-rose-800 mt-0.5">
                Mögliche personenbezogene Daten im Prompt erkannt
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-rose-200/50 hover:bg-rose-200 text-rose-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-slate-700 leading-relaxed">
            Vor dem Senden an eine KI (Gemini, ChatGPT, Claude) dürfen <strong>keine personenbezogenen Schülerdaten</strong> oder medizinischen Diagnosen übertragen werden:
          </p>

          <div className="space-y-2.5">
            {scanResult.warnings.map((w, idx) => (
              <div key={idx} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-amber-900 uppercase text-[10px] px-2 py-0.5 rounded bg-amber-200">
                    Gefunden: {w.matchedText}
                  </span>
                </div>
                <p className="text-amber-900 font-medium leading-relaxed">
                  👉 {w.suggestion}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tipp: Verwende immer neutrale Rollenbezeichnungen wie "Schüler A", "Kind 1" oder "Klasse 8b".</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Zurück & Prompt anpassen
          </button>

          <button
            onClick={onProceed}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Trotzdem fortfahren</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
