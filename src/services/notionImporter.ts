import { PromptTemplate, PromptVariable } from '../types/prompt';

/**
 * Erkennt automatisch Variablen im Format [Name] im Text
 */
export function extractVariablesFromText(text: string): PromptVariable[] {
  const regex = /\[([A-Za-z0-9äöüÄÖÜß\s\-_/]+)\]/g;
  const found = new Set<string>();
  let match;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[1].trim();
    if (raw && raw.length > 1 && !raw.startsWith('http')) {
      found.add(raw);
    }
  }

  return Array.from(found).map(key => {
    let type: PromptVariable['type'] = 'text';
    let options: string[] | undefined;

    const lower = key.toLowerCase();
    if (lower.includes('fach')) {
      type = 'select';
      options = ["Mathematik", "Deutsch", "Englisch", "Biologie", "Physik", "Chemie", "Geschichte", "Geografie", "WRT", "Ethik"];
    } else if (lower.includes('klasse') || lower.includes('stufe')) {
      type = 'select';
      options = ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"];
    } else if (lower.includes('niveau') || lower.includes('differenzierung')) {
      type = 'select';
      options = ["Basis (AFB I)", "Standard (AFB II)", "Erweitert (AFB III)"];
    } else if (lower.includes('text') || lower.includes('aufgabe') || lower.includes('inhalt') || lower.includes('notiz')) {
      type = 'textarea';
    }

    return {
      key,
      label: key,
      type,
      options,
      placeholder: `${key} angeben...`
    };
  });
}

/**
 * Parst Markdown / Rohtext aus Notion oder Textdateien
 */
export function parseMarkdownPrompts(content: string, authorId: string, authorName: string): PromptTemplate[] {
  const result: PromptTemplate[] = [];

  // Versuche JSON zuerst
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => ({
        ...item,
        id: item.id || `imported_${Date.now()}_${idx}`,
        authorId: authorId,
        authorName: authorName,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
    }
  } catch {}

  // Splitte an Markdown Überschriften (# oder ##)
  const sections = content.split(/\n(?=#{1,3}\s+)/);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    const lines = section.split('\n');
    const headerLine = lines[0].replace(/^#{1,3}\s+/, '').trim();
    const bodyLines = lines.slice(1).join('\n').trim();

    if (!headerLine || !bodyLines) continue;

    const variables = extractVariablesFromText(bodyLines);

    result.push({
      id: `imported_${Date.now()}_${i}`,
      title: headerLine,
      description: bodyLines.substring(0, 120).replace(/[#*`]/g, '') + '...',
      category: 'unterricht',
      tags: ["Importiert", "Notion Guide"],
      templateText: bodyLines,
      variables,
      visibility: 'private',
      authorId,
      authorName,
      source: "Notion Import",
      favoriteCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }

  return result;
}

/**
 * Exportiert die aktuelle Bibliothek als strukturiertes JSON
 */
export function exportPromptsToJson(prompts: PromptTemplate[]): string {
  return JSON.stringify(prompts, null, 2);
}

/**
 * Exportiert die Prompts als druckfertiges oder in Notion einlesbares Markdown
 */
export function exportPromptsToMarkdown(prompts: PromptTemplate[]): string {
  let md = `# HBS Promptbibliothek Export\nErstellt am: ${new Date().toLocaleDateString('de-DE')}\nAnzahl: ${prompts.length} Prompts\n\n---\n\n`;

  for (const p of prompts) {
    md += `## ${p.title}\n\n`;
    md += `* **Kategorie:** ${p.category} | **Autor:** ${p.authorName} | **Sichtbarkeit:** ${p.visibility}\n`;
    md += `* **Tags:** ${p.tags.join(', ')}\n\n`;
    md += `> ${p.description}\n\n`;
    md += `\`\`\`\n${p.templateText}\n\`\`\`\n\n`;
    if (p.colleagueTips && p.colleagueTips.length > 0) {
      md += `**Kollegiums-Tipps:**\n`;
      p.colleagueTips.forEach(tip => {
        md += `- *${tip.authorName}:* ${tip.text}\n`;
      });
      md += `\n`;
    }
    md += `---\n\n`;
  }

  return md;
}
