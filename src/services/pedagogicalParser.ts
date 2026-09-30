export type DetectedPedagogicalFormat = 
  | 'stationen'
  | 'tippkarten'
  | 'differenzierung'
  | 'rubrik'
  | 'elternbrief'
  | 'verlaufsplan'
  | 'arbeitsblatt';

/**
 * Erkennt automatisch den didaktischen Typ des KI-Outputs
 */
export function detectPedagogicalFormat(text: string): DetectedPedagogicalFormat {
  const lower = text.toLowerCase();

  // 1. Stationenlernen
  if (
    /station\s+[1-9]/i.test(lower) || 
    lower.includes('stationenlernen') || 
    lower.includes('lernzirkel') || 
    lower.includes('laufzettel')
  ) {
    return 'stationen';
  }

  // 2. Tipp-Karten / Hilfekarten
  if (
    /tipp\s+[1-9]/i.test(lower) || 
    /hilfekarte\s+[1-9]/i.test(lower) || 
    lower.includes('gestufte lernhilfen') || 
    lower.includes('tipp-karten') || 
    lower.includes('hinweiskarte')
  ) {
    return 'tippkarten';
  }

  // 3. Dreifach-Differenzierung
  if (
    (lower.includes('stufe 1') || lower.includes('basis') || lower.includes('grundlegend')) &&
    (lower.includes('stufe 2') || lower.includes('standard') || lower.includes('regelstandard')) &&
    (lower.includes('stufe 3') || lower.includes('experte') || lower.includes('erweitert'))
  ) {
    return 'differenzierung';
  }

  // 4. Bewertungsrubrik / Notenraster
  if (
    (lower.includes('kriterien') || lower.includes('bewertungsraster') || lower.includes('rubrik')) &&
    (lower.includes('note 1') || lower.includes('hervorragend') || lower.includes('punkte'))
  ) {
    return 'rubrik';
  }

  // 5. Elternbrief
  if (
    lower.includes('sehr geehrte eltern') || 
    lower.includes('liebe eltern') || 
    lower.includes('rückmeldeabschnitt') || 
    lower.includes('einverständniserklärung') ||
    lower.includes('wandertag') && lower.includes('unterschrift')
  ) {
    return 'elternbrief';
  }

  // 6. Verlaufsplan
  if (
    lower.includes('verlaufsplan') || 
    lower.includes('stundenentwurf') || 
    (lower.includes('einstieg') && lower.includes('erarbeitung') && lower.includes('sicherung') && lower.includes('minuten'))
  ) {
    return 'verlaufsplan';
  }

  // Fallback
  return 'arbeitsblatt';
}

/**
 * Parst Abschnitte eines Stationenlernens
 */
export interface StationBlock {
  stationNumber: number;
  title: string;
  type?: 'Pflicht' | 'Wahl' | 'Zusatz';
  content: string;
  material?: string;
  solution?: string;
}

export function parseStations(text: string): { stations: StationBlock[]; generalIntro: string; solutionSection: string; runningSheetText: string } {
  const lines = text.split('\n');
  const stations: StationBlock[] = [];
  let currentStation: StationBlock | null = null;
  const introLines: string[] = [];
  const solutionLines: string[] = [];
  let isSolutionArea = false;
  let isRunningSheetArea = false;
  const runningSheetLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Check for solutions section
    if (lower.includes('lösungsstation') || lower.includes('musterlösung') || lower.includes('lösungen:')) {
      isSolutionArea = true;
      if (currentStation) {
        stations.push(currentStation);
        currentStation = null;
      }
      solutionLines.push(line);
      continue;
    }

    // Check for Laufzettel section
    if (lower.includes('laufzettel') || lower.includes('stationspass')) {
      isRunningSheetArea = true;
      if (currentStation) {
        stations.push(currentStation);
        currentStation = null;
      }
      runningSheetLines.push(line);
      continue;
    }

    if (isSolutionArea) {
      solutionLines.push(line);
      continue;
    }

    if (isRunningSheetArea) {
      runningSheetLines.push(line);
      continue;
    }

    // Match Station headings (e.g. "### Station 1: ...", "Station 2 - ...", "**Station 3**")
    const stationMatch = line.match(/(?:#{1,4}\s*|\*{0,2})Station\s*([0-9]+)\s*[:\-–]?\s*(.*?)(?:\*{0,2})$/i);
    if (stationMatch) {
      if (currentStation) {
        stations.push(currentStation);
      }
      const num = parseInt(stationMatch[1], 10);
      const title = stationMatch[2]?.replace(/[#*]/g, '').trim() || `Station ${num}`;
      
      let type: StationBlock['type'] = 'Pflicht';
      if (lower.includes('wahl')) type = 'Wahl';
      if (lower.includes('zusatz') || lower.includes('knobel')) type = 'Zusatz';

      currentStation = {
        stationNumber: num,
        title,
        type,
        content: '',
      };
      continue;
    }

    if (currentStation) {
      currentStation.content += line + '\n';
    } else {
      introLines.push(line);
    }
  }

  if (currentStation) {
    stations.push(currentStation);
  }

  return {
    stations,
    generalIntro: introLines.join('\n').trim(),
    solutionSection: solutionLines.join('\n').trim(),
    runningSheetText: runningSheetLines.join('\n').trim()
  };
}

/**
 * Parst Hilfekarten (Tipp 1, 2, 3, 4)
 */
export interface HintCard {
  level: number; // 1, 2, 3, 4
  title: string;
  tag: string; // Denkanstoß, Struktur, Teillösung, Kontrolle
  color: 'emerald' | 'amber' | 'orange' | 'sky';
  content: string;
}

export function parseHintCards(text: string): { intro: string; cards: HintCard[] } {
  const lines = text.split('\n');
  const cards: HintCard[] = [];
  let currentCard: HintCard | null = null;
  const introLines: string[] = [];

  for (const line of lines) {
    // Match: Tipp 1, Tipp 2, Hilfekarte 1, etc.
    const match = line.match(/(?:#{1,4}\s*|\*{0,2})(?:Tipp|Hilfe|Hinweis|Karte)\s*([1-4])\s*[:\-–]?\s*(.*?)(?:\*{0,2})$/i);
    
    if (match) {
      if (currentCard) cards.push(currentCard);
      const level = parseInt(match[1], 10);
      const rawTitle = match[2]?.replace(/[#*]/g, '').trim() || `Tipp ${level}`;
      
      let tag = 'Denkanstoß';
      let color: HintCard['color'] = 'emerald';
      if (level === 2) {
        tag = 'Strukturierung';
        color = 'amber';
      } else if (level === 3) {
        tag = 'Teillösung';
        color = 'orange';
      } else if (level === 4) {
        tag = 'Lösungskontrolle';
        color = 'sky';
      }

      currentCard = {
        level,
        title: rawTitle,
        tag,
        color,
        content: ''
      };
      continue;
    }

    if (currentCard) {
      currentCard.content += line + '\n';
    } else {
      introLines.push(line);
    }
  }

  if (currentCard) cards.push(currentCard);

  return {
    intro: introLines.join('\n').trim(),
    cards
  };
}

/**
 * Parst 3-Stufen Differenzierung
 */
export interface TierBlock {
  tierName: 'Basis' | 'Standard' | 'Experte';
  badge: string;
  afb: string;
  color: 'emerald' | 'amber' | 'rose';
  content: string;
}

export function parseTieredDiff(text: string): { intro: string; tiers: TierBlock[]; tasksOrSolution: string } {
  const lines = text.split('\n');
  const tiers: TierBlock[] = [];
  let currentTier: TierBlock | null = null;
  const introLines: string[] = [];
  const endLines: string[] = [];
  let isEnd = false;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Check for Basis / Standard / Experte headings
    if (lower.includes('basis') || lower.includes('stufe 1') || lower.includes('grundlegend') || lower.includes('🟢')) {
      if (currentTier) tiers.push(currentTier);
      currentTier = {
        tierName: 'Basis',
        badge: '🟢 Stufe 1: Basisniveau',
        afb: 'AFB I (Wiedergeben & Beschreiben)',
        color: 'emerald',
        content: ''
      };
      continue;
    }

    if (lower.includes('standard') || lower.includes('stufe 2') || lower.includes('mittel') || lower.includes('🟡')) {
      if (currentTier) tiers.push(currentTier);
      currentTier = {
        tierName: 'Standard',
        badge: '🟡 Stufe 2: Regelstandard',
        afb: 'AFB II (Erklären & Anwenden)',
        color: 'amber',
        content: ''
      };
      continue;
    }

    if (lower.includes('experte') || lower.includes('stufe 3') || lower.includes('anspruchsvoll') || lower.includes('🔴')) {
      if (currentTier) tiers.push(currentTier);
      currentTier = {
        tierName: 'Experte',
        badge: '🔴 Stufe 3: Expertenniveau',
        afb: 'AFB III (Beurteilen & Reflektieren)',
        color: 'rose',
        content: ''
      };
      continue;
    }

    if (lower.includes('arbeitsaufträge') || lower.includes('aufgaben:') || lower.includes('lösungen:')) {
      isEnd = true;
    }

    if (isEnd) {
      endLines.push(line);
    } else if (currentTier) {
      currentTier.content += line + '\n';
    } else {
      introLines.push(line);
    }
  }

  if (currentTier) tiers.push(currentTier);

  return {
    intro: introLines.join('\n').trim(),
    tiers,
    tasksOrSolution: endLines.join('\n').trim()
  };
}

/**
 * Parst Elternbriefe in Hauptteil & Rückmeldeabriss
 */
export function parseParentLetter(text: string): { bodyText: string; returnSlipText: string } {
  const parts = text.split(/(?:✂️|---\s*✂️|Rückmeldeabschnitt|Einverständniserklärung|Bitte abtrennen)/i);

  if (parts.length > 1) {
    return {
      bodyText: parts[0].trim(),
      returnSlipText: parts.slice(1).join('\n').trim()
    };
  }

  return {
    bodyText: text.trim(),
    returnSlipText: ''
  };
}
