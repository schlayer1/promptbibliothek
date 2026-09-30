// DSGVO- & Schülerdaten-Scanner für die Promptbibliothek

export interface PrivacyScanResult {
  hasWarning: boolean;
  warnings: {
    category: 'name' | 'grade' | 'diagnosis' | 'contact';
    matchedText: string;
    suggestion: string;
  }[];
}

const COMMON_FIRST_NAMES = [
  'max', 'felix', 'leon', 'luca', 'noah', 'elias', 'jonas', 'ben', 'paul', 'finng', 'finn',
  'lukas', 'emil', 'anton', 'jakob', 'marlon', 'moritz', 'leo', 'milo', 'liam',
  'mia', 'emma', 'hannah', 'hanna', 'sophia', 'sofia', 'emilia', 'lina', 'ella', 'marie',
  'mila', 'lea', 'clara', 'klara', 'lara', 'charlotte', 'frieda', 'ida', 'anna', 'lena'
];

const DIAGNOSIS_KEYWORDS = [
  'adhs', 'ads', 'asperger', 'autismus', 'förderbedarf', 'sonderpädagog', 'lrs', 'dyskalkulie',
  'legasthenie', 'diagnose', 'psychiat', 'jugendamt', 'kinderheim', 'attest', 'schwerbehinder'
];

const CONTACT_PATTERNS = [
  /\b\d{4,5}\s?\/?\s?\d{5,8}\b/g, // Handynummer / Festnetz
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, // E-Mail
  /\b(?:0[1-9]|[12][0-9]|3[01])\.(?:0[1-9]|1[012])\.(?:19|20)\d\d\b/g // Geburtsdatum TT.MM.JJJJ
];

export function scanTextForPrivacyViolations(text: string): PrivacyScanResult {
  if (!text || text.trim() === '') {
    return { hasWarning: false, warnings: [] };
  }

  const warnings: PrivacyScanResult['warnings'] = [];
  const lower = text.toLowerCase();

  // 1. Diagnosen & sensible Sonderpädagogik-Daten prüfen
  for (const kw of DIAGNOSIS_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(lower)) {
      warnings.push({
        category: 'diagnosis',
        matchedText: kw.toUpperCase(),
        suggestion: 'Vermeide medizinische oder psychologische Diagnosen im Prompt. Formuliere stattdessen neutral: "Schüler benötigt Unterstützung bei strukturierter Aufgabenbearbeitung".'
      });
    }
  }

  // 2. Kontaktdaten & Geburtsdaten
  for (const pattern of CONTACT_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      warnings.push({
        category: 'contact',
        matchedText: matches[0],
        suggestion: 'Entferne Telefonnummern, Geburtsdaten oder private Email-Adressen vollständig.'
      });
    }
  }

  // 3. Typische Schüler-Klarnamen-Muster (z.B. "Max Müller", "Schüler Jonas")
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const w2 = words[i + 1].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    // Wenn Wort 1 ein typischer Vorname ist und Wort 2 großgeschrieben ist
    if (COMMON_FIRST_NAMES.includes(w1.toLowerCase()) && /^[A-ZÄÖÜ]/.test(w2) && w2.length > 2) {
      warnings.push({
        category: 'name',
        matchedText: `${w1} ${w2}`,
        suggestion: 'Ersetze Schülernamen durch Pseudonyme wie "Schüler A" oder "Schülerin B", um die DSGVO einzuhalten.'
      });
      break;
    }
  }

  return {
    hasWarning: warnings.length > 0,
    warnings
  };
}
