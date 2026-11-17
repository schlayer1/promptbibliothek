export type DetectedPedagogicalFormat =
  | 'stationen'
  | 'tippkarten'
  | 'differenzierung'
  | 'rubrik'
  | 'elternbrief'
  | 'verlaufsplan'
  | 'arbeitsblatt';

function stripMarkdownDecorators(line: string): string {
  return line
    .replace(/^\s*#{1,6}\s*/, '')
    .replace(/^\s*[-*•]\s+/, '')
    .replace(/^\s*\d+\.\s+/, '')
    .replace(/[*_`]/g, '')
    .trim();
}

function isHeadingOrLabelLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^#{1,6}\s+/.test(trimmed)) return true;
  if (/^\*\*[^*]+\*\*\s*:?\s*$/.test(trimmed)) return true;
  if (/^__[^_]+__\s*:?\s*$/.test(trimmed)) return true;
  const plain = stripMarkdownDecorators(trimmed);
  if (plain.length <= 70 && /:$/.test(plain)) return true;
  if (plain.length <= 60 && !/[.!?]$/.test(plain) && !/^\s*[-*•]\s+/.test(trimmed)) return true;
  return false;
}

function isTopLevelSectionHeading(line: string, pattern: RegExp): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const isBullet = /^\s*[-*•]\s+/.test(trimmed);
  const isHeading = /^#{1,6}\s+/.test(trimmed);
  const isBoldOnlyLine = /^\*\*[^*]+\*\*\s*:?\s*$/.test(trimmed);
  const plain = stripMarkdownDecorators(trimmed);

  if (!pattern.test(plain)) return false;

  if (isHeading || isBoldOnlyLine) return true;
  if (!isBullet && plain.length <= 75 && (/:$/.test(plain) || !/[.!?]$/.test(plain))) {
    return true;
  }
  return false;
}

/**
 * Erkennt automatisch den didaktischen Typ des KI-Outputs
 */
export function detectPedagogicalFormat(text: string): DetectedPedagogicalFormat {
  const lower = text.toLowerCase();
  const lines = text.split('\n');

  // 1. Stationenlernen (Station 1 + weitere Stationen oder explizites Stationenlernen)
  const stationHeaderCount = lines.filter(
    (l) =>
      !l.trim().startsWith('|') &&
      /^\s*(?:#{1,6}\s*|[-*•]\s+|\d+\.\s+)?(?:[^\p{L}\p{N}\n]{0,4}\s*)?(?:\*{1,2})?Station\s+[0-9]+\b(?:\s*\([^)]*\)|\s*[:\-–—])/iu.test(
        l
      )
  ).length;
  if (
    stationHeaderCount >= 2 ||
    /^\s*(?:#{1,6}\s+|\*{2})?.*(?:stationenlernen|lernzirkel|stationsarbeit)/im.test(text) ||
    (lower.includes('stationenlernen') && (lower.includes('laufzettel') || /station\s+[1-9]/i.test(lower)))
  ) {
    return 'stationen';
  }

  // 2. Tipp-Karten / Hilfekarten
  const tippHeaderCount = lines.filter((l) =>
    /^\s*(?:#{1,6}\s*|[-*•]\s+|\d+\.\s+)?(?:[^\p{L}\p{N}\n]{0,4}\s*)?(?:\*{1,2})?(?:Tipp-?Karte|Hilfe-?Karte|Hinweis-?Karte|Lernhilfe|Tipp|Hilfe|Hinweis|Karte)\s+[1-9]\b/iu.test(
      l
    )
  ).length;
  if (
    tippHeaderCount >= 2 ||
    lower.includes('gestufte lernhilfen') ||
    lower.includes('tipp-karten') ||
    lower.includes('hilfekarten')
  ) {
    return 'tippkarten';
  }

  // 3. Verlaufsplan (vor Differenzierung prüfen, falls Tabelle eine Spalte "Differenzierung/Basis" enthält)
  if (
    lower.includes('verlaufsplan') ||
    lower.includes('stundenentwurf') ||
    lower.includes('unterrichtsverlauf') ||
    (lower.includes('einstieg') &&
      lower.includes('erarbeitung') &&
      lower.includes('sicherung') &&
      (lower.includes('minuten') || lower.includes('min.') || lower.includes('sozialform')))
  ) {
    return 'verlaufsplan';
  }

  // 4. Dreifach-Differenzierung
  const hasBasis =
    lower.includes('basisniveau') || lower.includes('stufe 1') || lower.includes('🟢');
  const hasStandard =
    lower.includes('regelstandard') ||
    lower.includes('standardniveau') ||
    lower.includes('stufe 2') ||
    lower.includes('🟡');
  const hasExperte =
    lower.includes('expertenniveau') ||
    lower.includes('stufe 3') ||
    lower.includes('🔴') ||
    (lower.includes('experte') && (hasBasis || hasStandard));
  if ([hasBasis, hasStandard, hasExperte].filter(Boolean).length >= 2) {
    return 'differenzierung';
  }

  // 5. Bewertungsrubrik / Notenraster
  if (
    (lower.includes('kriterien') ||
      lower.includes('bewertungsraster') ||
      lower.includes('bewertungsbogen') ||
      lower.includes('rubrik')) &&
    (lower.includes('note 1') ||
      lower.includes('sehr gut') ||
      lower.includes('hervorragend') ||
      lower.includes('leistungsstufe') ||
      lower.includes('punkte'))
  ) {
    return 'rubrik';
  }

  // 6. Elternbrief
  if (
    lower.includes('sehr geehrte eltern') ||
    lower.includes('liebe eltern') ||
    lower.includes('sehr geehrte erziehungsberechtigte') ||
    lower.includes('liebe erziehungsberechtigte') ||
    lower.includes('rückmeldeabschnitt') ||
    lower.includes('einverständniserklärung') ||
    ((lower.includes('wandertag') || lower.includes('ausflug') || lower.includes('klassenfahrt')) &&
      lower.includes('unterschrift'))
  ) {
    return 'elternbrief';
  }

  return 'arbeitsblatt';
}

/**
 * Trennt einen abschließenden Lösungsblock vom Aufgaben-/Inhaltsteil ab (zeilenbasiert, ohne Prosa zu zerschneiden).
 */
export function splitSolutionsSection(text: string): { mainContent: string; solutionContent: string } {
  const lines = text.split('\n');
  const solutionHeadingPattern =
    /^(?:lösungsstation|musterlösung(?:en)?|lösung(?:en)?|lösungsbogen|lösungshinweise|lösungsvorschlag|erwartungshorizont)(?:\s*\([^)]*\))?(?:\s*[:\-–].*)?$/i;

  for (let i = 0; i < lines.length; i++) {
    if (isTopLevelSectionHeading(lines[i], solutionHeadingPattern)) {
      return {
        mainContent: lines.slice(0, i).join('\n').trim(),
        solutionContent: lines.slice(i).join('\n').trim(),
      };
    }
  }

  return {
    mainContent: text.trim(),
    solutionContent: '',
  };
}

/**
 * Parst Abschnitte eines Stationenlernens
 */
export interface StationBlock {
  stationNumber: number;
  title: string;
  type: 'Pflicht' | 'Wahl' | 'Zusatz';
  content: string;
  material?: string;
  solution?: string;
}

const STATION_HEADER_REGEX =
  /^\s*(?:#{1,6}\s*|[-*•]\s+|\d+\.\s+)?(?:[^\p{L}\p{N}\n]{0,4}\s*)?(?:\*{1,2})?Station\s+([0-9]+)\b(?:\s*\(([^)]*)\))?\s*([:\-–—]?)\s*(.*)$/iu;

const GLOBAL_SOLUTION_HEADING_REGEX =
  /^(?:lösungsstation|musterlösung(?:en)?|lösung(?:en)?|lösungsbogen|erwartungshorizont)(?:\s+(?:für\s+alle\s+stationen|zur\s+selbstkontrolle|und\s+selbstkontrolle))?(?:\s*\([^)]*\))?\s*:?\s*$/i;

const INLINE_SOLUTION_START_REGEX =
  /^\s*(?:#{1,6}\s*|[-*•]\s+)?(?:\*{1,2})?(?:kurze\s+)?(?:musterlösung|lösung(?:shinweis|svorschlag)?)(?:\s*\([^)]*\))?(?:\*{1,2})?\s*:\s*(.*)$/i;

const GLOBAL_RUNNING_SHEET_HEADING_REGEX =
  /^(?:vorlage(?:\s+für\s+(?:einen|den))?\s+)?(?:schüler-?)?(?:laufzettel|stationspass)\b.*$/i;

function detectStationType(text: string): StationBlock['type'] {
  const lower = text.toLowerCase();
  if (lower.includes('wahl')) return 'Wahl';
  if (lower.includes('zusatz') || lower.includes('knobel') || lower.includes('experten')) return 'Zusatz';
  return 'Pflicht';
}

export function parseStations(text: string): {
  stations: StationBlock[];
  generalIntro: string;
  solutionSection: string;
  runningSheetText: string;
} {
  const lines = text.split('\n');
  const stations: StationBlock[] = [];
  let currentStation: StationBlock | null = null;
  let inStationSolution = false;
  const introLines: string[] = [];
  const solutionLines: string[] = [];
  const runningSheetLines: string[] = [];
  let mode: 'intro' | 'station' | 'solutions' | 'runningSheet' = 'intro';

  const flushCurrentStation = () => {
    if (currentStation) {
      currentStation.content = currentStation.content.trim();
      if (currentStation.solution) {
        currentStation.solution = currentStation.solution.trim();
      }
      stations.push(currentStation);
      currentStation = null;
      inStationSolution = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Prüfe auf neue Station-Überschrift (niemals Tabellenzeilen oder Wiederholungen im Lösungsblock als neue Station werten)
    const isTableLine = trimmed.startsWith('|');
    const stationMatch = !isTableLine ? line.match(STATION_HEADER_REGEX) : null;
    const hasHeadingMarkers = /^\s*(?:#{1,6}\s+|[-*•]\s+|\d+\.\s+|\*{2}|[^\p{L}\p{N}\s|])/u.test(line);
    const hasParenOrSep = Boolean(stationMatch && (stationMatch[2] || stationMatch[3]));
    const parsedNum = stationMatch ? parseInt(stationMatch[1], 10) : NaN;
    const isRepeatedInSolutions =
      mode === 'solutions' && stations.some((s) => s.stationNumber === parsedNum);

    if (stationMatch && (hasHeadingMarkers || hasParenOrSep) && !isRepeatedInSolutions && mode !== 'runningSheet') {
      flushCurrentStation();
      mode = 'station';

      const num = parsedNum;
      const parenType = (stationMatch[2] || '').trim();
      let rawTitle = (stationMatch[4] || '').replace(/^\*{1,2}|\*{1,2}$/g, '').replace(/^[:\-–—\s]+/, '').trim();
      if (parenType && !/pflicht|wahl|zusatz/i.test(parenType)) {
        rawTitle = rawTitle ? `${parenType}: ${rawTitle}` : parenType;
      }

      const type = detectStationType(`${parenType} ${rawTitle} ${trimmed}`);
      currentStation = {
        stationNumber: num,
        title: rawTitle || `Station ${num}`,
        type,
        content: '',
        solution: '',
      };
      continue;
    }

    // 2. Prüfe auf übergeordnete Lösungsstation / Musterlösungs-Sektion
    if (
      isTopLevelSectionHeading(line, GLOBAL_SOLUTION_HEADING_REGEX) &&
      (mode !== 'station' || stations.length > 0)
    ) {
      const seenNums = new Set(stations.map((s) => s.stationNumber));
      if (currentStation) seenNums.add(currentStation.stationNumber);

      const hasUnseenLaterStation = lines.slice(i + 1).some((nextLine) => {
        if (nextLine.trim().startsWith('|')) return false;
        const m = nextLine.match(STATION_HEADER_REGEX);
        const hm = /^\s*(?:#{1,6}\s+|[-*•]\s+|\d+\.\s+|\*{2}|[^\p{L}\p{N}\s|])/u.test(nextLine);
        if (!m || !(hm || m[2] || m[3])) return false;
        return !seenNums.has(parseInt(m[1], 10));
      });

      if (!hasUnseenLaterStation) {
        flushCurrentStation();
        mode = 'solutions';
        solutionLines.push(line);
        continue;
      }
    }

    // 3. Prüfe auf übergeordneten Laufzettel / Stationspass
    if (isTopLevelSectionHeading(line, GLOBAL_RUNNING_SHEET_HEADING_REGEX)) {
      flushCurrentStation();
      mode = 'runningSheet';
      runningSheetLines.push(line);
      continue;
    }

    if (mode === 'solutions') {
      solutionLines.push(line);
      continue;
    }

    if (mode === 'runningSheet') {
      runningSheetLines.push(line);
      continue;
    }

    if (mode === 'station' && currentStation) {
      // Falls innerhalb der Station eine Zeile "- **Typ:** Wahlstation" steht, übernehmen
      if (/^\s*[-*•]?\s*\*{0,2}(?:typ|art|kategorie)\*{0,2}\s*:\s*(.*)/i.test(trimmed)) {
        const typeMatch = trimmed.match(/:\s*(.*)/);
        if (typeMatch) {
          currentStation.type = detectStationType(typeMatch[1]);
        }
      }

      // Per-Station-Musterlösung sauber trennen, ohne Folgestationen zu verlieren
      const inlineSolMatch = line.match(INLINE_SOLUTION_START_REGEX);
      if (inlineSolMatch) {
        inStationSolution = true;
        const inlineRemainder = inlineSolMatch[1]?.trim();
        if (inlineRemainder) {
          currentStation.solution = (currentStation.solution || '') + inlineRemainder + '\n';
        }
        continue;
      }

      if (inStationSolution) {
        // Zurück zu normalem Stationsinhalt wechseln, wenn z.B. ein neues Stations-Unterfeld (Material, Arbeitsauftrag, Laufzettel) folgt
        if (/^\s*(?:#{1,6}\s+|[-*•]\s+)?\*{0,2}(?:arbeitsauftrag|aufgabe|material|benötigtes material|laufzettel|hinweis)\*{0,2}\s*:/i.test(trimmed)) {
          inStationSolution = false;
          currentStation.content += line + '\n';
        } else {
          currentStation.solution = (currentStation.solution || '') + line + '\n';
        }
      } else {
        currentStation.content += line + '\n';
      }
      continue;
    }

    introLines.push(line);
  }

  flushCurrentStation();

  return {
    stations,
    generalIntro: introLines.join('\n').trim(),
    solutionSection: solutionLines.join('\n').trim(),
    runningSheetText: runningSheetLines.join('\n').trim(),
  };
}

/**
 * Parst Hilfekarten (Tipp 1, 2, 3, 4+)
 */
export interface HintCard {
  level: number;
  title: string;
  tag: string;
  color: 'emerald' | 'amber' | 'orange' | 'sky';
  content: string;
}

const HINT_CARD_HEADER_REGEX =
  /^\s*(?:#{1,6}\s*|[-*•]\s+|\d+\.\s+)?(?:[^\p{L}\p{N}\n]{0,4}\s*)?(?:\*{1,2})?(?:Tipp-?Karte|Hilfe-?Karte|Hinweis-?Karte|Lernhilfe|Tipp|Hilfe|Hinweis|Karte)\s+([1-9][0-9]?)\b(?:\s*\(([^)]*)\))?(?:\*{1,2})?\s*([:\-–—]?)\s*(.*)$/iu;

export function parseHintCards(text: string): { intro: string; cards: HintCard[]; solutionSection: string } {
  const { mainContent, solutionContent } = splitSolutionsSection(text);
  const lines = mainContent.split('\n');
  const cards: HintCard[] = [];
  let currentCard: HintCard | null = null;
  const introLines: string[] = [];

  const getTagAndColor = (level: number): { tag: string; color: HintCard['color'] } => {
    const mod = ((level - 1) % 4) + 1;
    if (mod === 1) return { tag: 'Denkanstoß', color: 'emerald' };
    if (mod === 2) return { tag: 'Strukturierung', color: 'amber' };
    if (mod === 3) return { tag: 'Teillösung', color: 'orange' };
    return { tag: 'Lösungskontrolle', color: 'sky' };
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const match = !trimmed.startsWith('|') ? line.match(HINT_CARD_HEADER_REGEX) : null;
    const hasMarkers = /^\s*(?:#{1,6}\s+|[-*•]\s+|\d+\.\s+|\*{2}|[^\p{L}\p{N}\s|])/u.test(line);
    const hasParenOrSep = Boolean(match && (match[2] || match[3]));

    if (match && (hasMarkers || hasParenOrSep)) {
      if (currentCard) {
        currentCard.content = currentCard.content.trim();
        cards.push(currentCard);
      }
      const level = parseInt(match[1], 10);
      const parenLabel = (match[2] || '').replace(/[*_]/g, '').trim();
      let remainder = (match[4] || '').replace(/^\*{1,2}/, '').trim();

      let title = parenLabel || `Tipp ${level}`;
      let inlineBody = '';

      if (remainder) {
        // Falls remainder mit "Titel:** Text" oder kurzem Titel ohne Satzende beginnt
        const boldTitleSplit = remainder.match(/^([^*]+)\*{2}\s*[:\-–]?\s*(.*)$/);
        if (boldTitleSplit) {
          title = boldTitleSplit[1].trim() || title;
          inlineBody = boldTitleSplit[2]?.trim() || '';
        } else {
          const cleanRem = remainder.replace(/[*_`]/g, '').trim();
          if (cleanRem.length <= 45 && !/[.!?]$/.test(cleanRem)) {
            title = parenLabel ? `${parenLabel}: ${cleanRem}` : cleanRem;
          } else {
            inlineBody = remainder;
          }
        }
      }

      const { tag, color } = getTagAndColor(level);
      currentCard = {
        level,
        title,
        tag,
        color,
        content: inlineBody ? inlineBody + '\n' : '',
      };
      continue;
    }

    if (currentCard) {
      currentCard.content += line + '\n';
    } else {
      introLines.push(line);
    }
  }

  if (currentCard) {
    currentCard.content = currentCard.content.trim();
    cards.push(currentCard);
  }

  return {
    intro: introLines.join('\n').trim(),
    cards,
    solutionSection: solutionContent,
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

function matchTierHeader(line: string): 'Basis' | 'Standard' | 'Experte' | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const isMarkedHeader =
    /^#{1,6}\s+/.test(trimmed) ||
    /^\*{1,2}/.test(trimmed) ||
    /^(?:[-*•]\s+)?(?:🟢|🟡|🔴)/.test(trimmed) ||
    /^(?:Stufe|Niveau|Niveaustufe)\s*[1-3]\b/i.test(stripMarkdownDecorators(trimmed)) ||
    isHeadingOrLabelLine(trimmed);

  if (!isMarkedHeader) return null;

  const plain = stripMarkdownDecorators(trimmed).toLowerCase();
  // Verhindere Fehltreffer auf Übersichtszeilen wie "Inhalt in Basis, Standard und Experte:"
  const hitBasis = /(?:^|\b)(?:stufe\s*1|basis(?:niveau)?|grundlegend)(?:\b|$)/.test(plain) || trimmed.includes('🟢');
  const hitStandard = /(?:^|\b)(?:stufe\s*2|standard(?:niveau)?|regelstandard)(?:\b|$)/.test(plain) || trimmed.includes('🟡');
  const hitExperte = /(?:^|\b)(?:stufe\s*3|experte(?:nniveau)?)(?:\b|$)/.test(plain) || trimmed.includes('🔴');

  const count = [hitBasis, hitStandard, hitExperte].filter(Boolean).length;
  if (count !== 1) return null;

  if (hitBasis) return 'Basis';
  if (hitStandard) return 'Standard';
  if (hitExperte) return 'Experte';
  return null;
}

export function parseTieredDiff(text: string): {
  intro: string;
  tiers: TierBlock[];
  tasksOrSolution: string;
  solutionSection: string;
} {
  const { mainContent, solutionContent } = splitSolutionsSection(text);
  const lines = mainContent.split('\n');
  const tiers: TierBlock[] = [];
  let currentTier: TierBlock | null = null;
  const introLines: string[] = [];
  const trailingTaskLines: string[] = [];
  let inGlobalTrailingTasks = false;

  const makeTier = (tierName: TierBlock['tierName']): TierBlock => {
    if (tierName === 'Basis') {
      return {
        tierName: 'Basis',
        badge: '🟢 Stufe 1: Basisniveau',
        afb: 'AFB I (Wiedergeben & Beschreiben)',
        color: 'emerald',
        content: '',
      };
    }
    if (tierName === 'Standard') {
      return {
        tierName: 'Standard',
        badge: '🟡 Stufe 2: Regelstandard',
        afb: 'AFB II (Erklären & Anwenden)',
        color: 'amber',
        content: '',
      };
    }
    return {
      tierName: 'Experte',
      badge: '🔴 Stufe 3: Expertenniveau',
      afb: 'AFB III (Beurteilen & Reflektieren)',
      color: 'rose',
      content: '',
    };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const detectedTier = matchTierHeader(line);

    if (detectedTier) {
      if (currentTier) {
        currentTier.content = currentTier.content.trim();
        tiers.push(currentTier);
      }
      inGlobalTrailingTasks = false;
      currentTier = makeTier(detectedTier);
      continue;
    }

    // Globale Aufgaben-Sektion nur dann abtrennen, wenn danach keine Differenzierungsstufe mehr kommt
    // UND frühere Stufen nicht schon eigene Arbeitsaufträge hatten (sonst gehört sie zu dieser letzten Stufe!)
    if (
      isTopLevelSectionHeading(
        line,
        /^(?:arbeitsaufträge|aufgaben|differenzierungsaufgaben)(?:\s+(?:zu\s+allen\s+stufen|für\s+alle))?(?:\s*\([^)]*\))?\s*:?\s*$/i
      )
    ) {
      const hasLaterTier = lines.slice(i + 1).some((nextLine) => matchTierHeader(nextLine) !== null);
      const explicitGlobal = /für\s+alle|allen\s+stufen|differenzierungsaufgaben/i.test(line);
      const previousTiersHaveTasks = tiers.some((t) => /\b(?:arbeitsaufträge|aufgaben)\b/i.test(t.content));

      if (!hasLaterTier && tiers.length >= 2 && (explicitGlobal || !previousTiersHaveTasks)) {
        if (currentTier) {
          currentTier.content = currentTier.content.trim();
          tiers.push(currentTier);
          currentTier = null;
        }
        inGlobalTrailingTasks = true;
        trailingTaskLines.push(line);
        continue;
      }
    }

    if (inGlobalTrailingTasks) {
      trailingTaskLines.push(line);
    } else if (currentTier) {
      currentTier.content += line + '\n';
    } else {
      introLines.push(line);
    }
  }

  if (currentTier) {
    currentTier.content = currentTier.content.trim();
    tiers.push(currentTier);
  }

  return {
    intro: introLines.join('\n').trim(),
    tiers,
    tasksOrSolution: trailingTaskLines.join('\n').trim(),
    solutionSection: solutionContent,
  };
}

/**
 * Parst Elternbriefe in Hauptteil & Rückmeldeabriss (trennt nur an echten Trennlinien/Überschriften)
 */
export function parseParentLetter(text: string): { bodyText: string; returnSlipText: string } {
  const lines = text.split('\n');
  let splitIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const plain = stripMarkdownDecorators(trimmed).toLowerCase();

    if (trimmed.includes('✂️')) {
      splitIndex = i;
      break;
    }

    if (
      isTopLevelSectionHeading(
        lines[i],
        /^(?:rückmeldeabschnitt|rücklaufzettel|einverständniserklärung|bitte\s+abtrennen)(?:\s*[&+].*)?(?:\s*\([^)]*\))?\s*:?\s*$/i
      )
    ) {
      // Falls direkt davor eine Trennlinie (---) steht, ab dieser trennen
      splitIndex = i > 0 && /^[-*_]{3,}$/.test(lines[i - 1].trim()) ? i - 1 : i;
    } else if (/^bitte\s+hier\s+abtrennen/i.test(plain)) {
      splitIndex = i;
    }
  }

  if (splitIndex > 0) {
    const bodyText = lines.slice(0, splitIndex).join('\n').replace(/[-*_]{3,}\s*$/, '').trim();
    const returnSlipText = lines
      .slice(splitIndex)
      .join('\n')
      .replace(/^[-*_]{3,}\s*/m, '')
      .replace(/✂️/g, '')
      .trim();

    return { bodyText, returnSlipText };
  }

  return {
    bodyText: text.trim(),
    returnSlipText: '',
  };
}
