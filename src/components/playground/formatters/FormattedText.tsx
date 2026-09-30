import React from 'react';

interface FormattedTextProps {
  content: string;
  showWritingLines?: boolean;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, showWritingLines = false }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet lists (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-school-primary mt-1.5 shrink-0" />
              <div className="flex-1">{renderInline(itemText)}</div>
            </div>
          );
        }

        // Numbered lists (1. , 2. )
        const numMatch = trimmed.match(/^([0-9]+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="font-bold text-school-primary font-mono text-xs mt-0.5 shrink-0">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInline(numMatch[2])}</div>
            </div>
          );
        }

        // Checkbox items ([ ] or [x])
        if (/^\[([ xX])\]\s+/.test(trimmed)) {
          const isChecked = trimmed.startsWith('[x]') || trimmed.startsWith('[X]');
          const text = trimmed.replace(/^\[([ xX])\]\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <input
                type="checkbox"
                defaultChecked={isChecked}
                className="mt-1 rounded text-school-primary focus:ring-school-primary cursor-pointer"
              />
              <div className="flex-1 font-medium">{renderInline(text)}</div>
            </div>
          );
        }

        // Blockquotes (> )
        if (trimmed.startsWith('>')) {
          const quote = trimmed.replace(/^>\s*/, '');
          return (
            <blockquote key={idx} className="border-l-3 border-school-primary pl-3 py-1 bg-school-primaryLight/40 rounded-r-lg italic text-slate-700 my-1">
              {renderInline(quote)}
            </blockquote>
          );
        }

        // Table Rows (| col | col |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          // If separator line (|---|---|), skip or render subtle line
          if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
            return null;
          }
          const cells = trimmed
            .split('|')
            .slice(1, -1)
            .map(c => c.trim());
          
          return (
            <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="overflow-hidden">
                  {renderInline(cell)}
                </div>
              ))}
            </div>
          );
        }

        // Headers
        if (trimmed.startsWith('###')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
              {renderInline(trimmed.replace(/^###\s*/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="font-black text-slate-900 text-base mt-4 mb-1.5 border-b border-slate-200 pb-1">
              {renderInline(trimmed.replace(/^##\s*/, ''))}
            </h3>
          );
        }

        // Writing lines for answers if prompt asks for an answer
        const isQuestionOrTask = /^(?:Aufgabe|Frage|Arbeitsauftrag|Begründe|Erkläre|Berechne)\b/i.test(trimmed);

        return (
          <div key={idx}>
            <p>{renderInline(trimmed)}</p>
            {showWritingLines && isQuestionOrTask && (
              <div className="mt-2 space-y-2 py-1 print:block">
                <div className="border-b border-slate-300 border-dashed h-4 w-full" />
                <div className="border-b border-slate-300 border-dashed h-4 w-full" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper for inline markdown like **bold**, *italic*, `code`
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1 py-0.5 bg-slate-100 rounded text-school-primary font-mono text-[11px]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
