import React from 'react';

interface FormattedTextProps {
  content: string;
  showWritingLines?: boolean;
}

function parseTableCells(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.includes('|', 1);
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?[\s\-:|]+\|[\s\-:|]*$/.test(trimmed) && trimmed.includes('-');
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, showWritingLines = false }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`sp-${idx}`} className="h-1.5" />);
      continue;
    }

    // Horizontal rule (---, ***, ___)
    if (/^([-*_])\1{2,}$/.test(trimmed)) {
      elements.push(<hr key={`hr-${idx}`} className="border-t border-slate-200 my-3" />);
      continue;
    }

    // Markdown Tables: group consecutive table lines into a real responsive <table>
    if (isTableRow(trimmed)) {
      const tableLines: string[] = [];
      let j = idx;
      while (j < lines.length && isTableRow(lines[j].trim())) {
        tableLines.push(lines[j].trim());
        j++;
      }

      const dataRows = tableLines.filter((tl) => !isTableSeparator(tl)).map(parseTableCells);
      if (dataRows.length > 0) {
        const hasHeader = tableLines.length > 1 && isTableSeparator(tableLines[1]);
        const headerRow = hasHeader ? dataRows[0] : null;
        const bodyRows = hasHeader ? dataRows.slice(1) : dataRows;
        const colCount = Math.max(...dataRows.map((r) => r.length));

        elements.push(
          <div key={`tbl-${idx}`} className="overflow-x-auto my-2">
            <table className="w-full text-xs sm:text-sm border-collapse border border-slate-300 rounded-lg overflow-hidden">
              {headerRow && (
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    {Array.from({ length: colCount }).map((_, cIdx) => (
                      <th key={cIdx} className="border border-slate-300 p-2 text-left font-bold">
                        {renderInline(headerRow[cIdx] || '')}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    {Array.from({ length: colCount }).map((_, cIdx) => (
                      <td key={cIdx} className="border border-slate-300 p-2 align-top text-slate-800">
                        {renderInline(row[cIdx] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        idx = j - 1;
        continue;
      }
    }

    // Headers (#, ##, ###, ####+)
    if (/^#{4,6}\s+/.test(trimmed)) {
      elements.push(
        <h5 key={idx} className="font-bold text-slate-800 text-xs sm:text-sm mt-2.5 mb-0.5">
          {renderInline(trimmed.replace(/^#{4,6}\s*/, ''))}
        </h5>
      );
      continue;
    }
    if (/^###\s+/.test(trimmed)) {
      elements.push(
        <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
          {renderInline(trimmed.replace(/^###\s*/, ''))}
        </h4>
      );
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      elements.push(
        <h3 key={idx} className="font-black text-slate-900 text-base mt-4 mb-1.5 border-b border-slate-200 pb-1">
          {renderInline(trimmed.replace(/^##\s*/, ''))}
        </h3>
      );
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      elements.push(
        <h2 key={idx} className="font-black text-slate-900 text-base sm:text-lg mt-4 mb-2 border-b-2 border-slate-200 pb-1">
          {renderInline(trimmed.replace(/^#\s*/, ''))}
        </h2>
      );
      continue;
    }

    // Checkbox items ([ ] or [x]) - check before bullet lists if "- [ ] ..."
    const checkboxMatch = trimmed.match(/^(?:[-*]\s+)?\[([ xX])\]\s+(.*)$/);
    if (checkboxMatch) {
      const isChecked = checkboxMatch[1].toLowerCase() === 'x';
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-2">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            className="mt-1 rounded text-school-primary focus:ring-school-primary cursor-pointer"
          />
          <div className="flex-1 font-medium">{renderInline(checkboxMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Bullet lists (- or * or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*•]\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-school-primary mt-1.5 shrink-0" />
          <div className="flex-1">{renderInline(itemText)}</div>
        </div>
      );
      continue;
    }

    // Numbered lists (1. , 2. )
    const numMatch = trimmed.match(/^([0-9]+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-2">
          <span className="font-bold text-school-primary font-mono text-xs mt-0.5 shrink-0">
            {numMatch[1]}.
          </span>
          <div className="flex-1">{renderInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    // Blockquotes (> )
    if (trimmed.startsWith('>')) {
      const quote = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote key={idx} className="border-l-3 border-school-primary pl-3 py-1 bg-school-primaryLight/40 rounded-r-lg italic text-slate-700 my-1">
          {renderInline(quote)}
        </blockquote>
      );
      continue;
    }

    // Writing lines for answers if prompt asks for an answer
    const plainForCheck = trimmed.replace(/[*_`]/g, '').trim();
    const isQuestionOrTask = /^(?:Aufgabe|Frage|Arbeitsauftrag|Begründe|Erkläre|Berechne)\b/i.test(plainForCheck);

    elements.push(
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
  }

  return (
    <div className="space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {elements}
    </div>
  );
};

// Helper for inline markdown like **bold**, *italic*, `code`
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i} className="italic text-slate-700">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} className="px-1 py-0.5 bg-slate-100 rounded text-school-primary font-mono text-[11px]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
