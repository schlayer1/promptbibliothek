import React, { useMemo } from 'react';
import { 
  detectPedagogicalFormat, 
  DetectedPedagogicalFormat 
} from '../../services/pedagogicalParser';
import { StationCardView } from './formatters/StationCardView';
import { HintCardsView } from './formatters/HintCardsView';
import { TieredDiffView } from './formatters/TieredDiffView';
import { RubricTableView } from './formatters/RubricTableView';
import { ParentLetterView } from './formatters/ParentLetterView';
import { LessonPlanView } from './formatters/LessonPlanView';
import { WorksheetView } from './formatters/WorksheetView';

interface PupilReadyRendererProps {
  rawText: string;
  selectedFormat: DetectedPedagogicalFormat | 'auto';
  showCutLines: boolean;
  showSolutions: boolean;
  topicTitle?: string;
}

export const PupilReadyRenderer: React.FC<PupilReadyRendererProps> = ({
  rawText,
  selectedFormat,
  showCutLines,
  showSolutions,
  topicTitle
}) => {
  // Effektives Format ermitteln
  const effectiveFormat = useMemo(() => {
    if (selectedFormat !== 'auto') return selectedFormat;
    return detectPedagogicalFormat(rawText);
  }, [rawText, selectedFormat]);

  return (
    <div 
      id="printable-schueler-output"
      className="printable-sheet bg-white rounded-3xl border border-slate-200 shadow-float p-6 sm:p-10 max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:w-full"
    >
      {effectiveFormat === 'stationen' && (
        <StationCardView
          rawText={rawText}
          showCutLines={showCutLines}
          showSolutions={showSolutions}
        />
      )}

      {effectiveFormat === 'tippkarten' && (
        <HintCardsView
          rawText={rawText}
          showCutLines={showCutLines}
        />
      )}

      {effectiveFormat === 'differenzierung' && (
        <TieredDiffView
          rawText={rawText}
          showSolutions={showSolutions}
        />
      )}

      {effectiveFormat === 'rubrik' && (
        <RubricTableView
          rawText={rawText}
        />
      )}

      {effectiveFormat === 'elternbrief' && (
        <ParentLetterView
          rawText={rawText}
        />
      )}

      {effectiveFormat === 'verlaufsplan' && (
        <LessonPlanView
          rawText={rawText}
        />
      )}

      {effectiveFormat === 'arbeitsblatt' && (
        <WorksheetView
          rawText={rawText}
          showSolutions={showSolutions}
          topicTitle={topicTitle}
        />
      )}
    </div>
  );
};
