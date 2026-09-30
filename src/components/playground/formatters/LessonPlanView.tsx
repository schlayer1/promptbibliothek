import React from 'react';
import { Clock, BookOpen, Layers, Users, Sparkles } from 'lucide-react';
import { FormattedText } from './FormattedText';

interface LessonPlanViewProps {
  rawText: string;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({ rawText }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-10 shadow-soft print:shadow-none print-avoid-break">
        
        {/* HEADER */}
        <div className="border-b-2 border-school-primary pb-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-school-primary" />
            <h3 className="font-black text-base sm:text-lg text-slate-900">
              Unterrichtsverlaufsplan (Didaktischer Ablauf)
            </h3>
          </div>
          <span className="text-xs font-bold text-school-primary bg-school-primaryLight px-3 py-1 rounded-full">
            Lehrkraft-Exemplar
          </span>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          <FormattedText content={rawText} />
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Staatliche Regelschule Heimbürgeschule Kahla</span>
          <span>Unterrichtsentwurf & Phasenverlauf</span>
        </div>
      </div>
    </div>
  );
};
