import { PromptTemplate } from '../types/prompt';

export const FLICK_STARTER_PROMPTS: PromptTemplate[] = [
  // --- UNTERRICHT & STUNDENPLANUNG ---
  {
    id: "flick-01-stundenentwurf",
    title: "Vollständiger 45-Minuten-Stundenentwurf",
    description: "Generiert einen didaktisch strukturierten Verlaufsplan nach dem 3-Phasen-Modell (Einstieg, Erarbeitung, Sicherung) mit Zeitangaben und Sozialformen.",
    category: "unterricht",
    tags: ["Unterricht", "Stundenentwurf", "Didaktik", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    afbLevels: ["AFB I", "AFB II", "AFB III"],
    systemInstruction: "Du bist ein erfahrener Fachleiter und Didaktiker für die Regelschule. Erstelle praxisnahe, methodisch abwechslungsreiche Unterrichtsverläufe mit klarem Kompetenzbezug.",
    templateText: `Du bist eine erfahrene Lehrkraft für das Fach [Fach] an einer Regelschule.
Plane eine 45-minütige Unterrichtsstunde für eine [Klassenstufe] zum Thema "[Thema]".

Lernziel der Stunde: [Lernziel]
Vorwissen der Schüler: [Vorwissen]

Erstelle einen tabellarischen Verlaufsplan mit folgenden Spalten:
1. Phase (Einstieg, Erarbeitung, Sicherung, Puffer)
2. Geplante Zeit (Minuten)
3. Geplantes Unterrichtsgeschehen (Lehrerhandeln & Schüleraktivität)
4. Sozialform (Plenum, Einzel-, Partner- oder Gruppenarbeit)
5. Benötigte Medien & Materialien

Füge am Ende 2 konkrete Impulsfragen für den Einstieg und eine Idee für eine kurze Hausaufgabe oder formative Lernzielkontrolle bei.`,
    variables: [
      { key: "Fach", label: "Schulfach", type: "select", options: ["Mathematik", "Deutsch", "Englisch", "Biologie", "Physik", "Chemie", "Geschichte", "Geografie", "WRT", "Ethik"], defaultValue: "Biologie" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 8" },
      { key: "Thema", label: "Unterrichtsthema", type: "text", defaultValue: "Die Zellatmung im Vergleich zur Fotosynthese", placeholder: "z.B. Satz des Pythagoras" },
      { key: "Lernziel", label: "Kern-Lernziel", type: "text", defaultValue: "Schüler können den Ablauf und die Bedeutung der Fotosynthese in eigenen Worten erklären", placeholder: "Was können die Schüler am Ende?" },
      { key: "Vorwissen", label: "Vorwissen der Klasse", type: "text", defaultValue: "Aufbau einer Pflanzenzelle und Chloroplasten sind bekannt", placeholder: "Grundbegriffe vorhanden..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Gemini Flash / Claude 3.5",
    favoriteCount: 18,
    colleagueTips: [
      { id: "tip-1", authorId: "t-keller", authorName: "Keller", text: "Für den Einstieg klappt der stumme Impuls mit einem Bild an der digitalen Tafel besonders gut!", createdAt: Date.now() - 86400000 * 2 }
    ],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10
  },

  {
    id: "flick-02-kreative-einstiege",
    title: "5 kreative & aktivierende Unterrichtseinstiege",
    description: "Liefert 5 überraschende Einstiegsmethoden (Rätsel, Dilemma, stummer Impuls, Schätzfrage, Storytelling) für maximales Schülerinteresse.",
    category: "unterricht",
    tags: ["Einstieg", "Motivation", "Aktivierung", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    systemInstruction: "Du bist ein Experte für aktivierende Lernmethoden. Deine Ideen wecken sofortige Neugier und erzeugen ein kognitives Ungleichgewicht.",
    templateText: `Ich plane eine Unterrichtsstunde im Fach [Fach] in einer [Klassenstufe] zum Thema "[Thema]".

Entwickle 5 grundverschiedene, hochgradig aktivierende Einstiege (Dauer jeweils maximal 5-7 Minuten):
1. Ein kognitives Rätsel oder visuelles Mysterium (z.B. für die digitale Tafel).
2. Ein moralisches oder alltägliches Dilemma, das zur spontanen Positionierung anregt.
3. Eine schockierende oder kuriose Schätzfrage (Headline-Methode).
4. Ein kurzer Storytelling-Impuls aus der Lebenswelt der Jugendlichen.
5. Ein stummer Impuls mit einer gezielten Fragestellung zum Einstieg.

Gib für jede Methode kurz an:
- Benötigtes Material
- Genaue Lehrer-Instruktion (wörtliche Rede)
- Erwartete Schülerreaktion`,
    variables: [
      { key: "Fach", label: "Schulfach", type: "select", options: ["Mathematik", "Deutsch", "Englisch", "Biologie", "Physik", "Geschichte", "Sozialkunde", "Ethik"], defaultValue: "Geschichte" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 7" },
      { key: "Thema", label: "Thema", type: "text", defaultValue: "Alltag im Mittelalter: Ritterburg vs. Bauernhütte", placeholder: "Thema eingeben..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini Flash",
    favoriteCount: 24,
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now() - 86400000 * 9
  },

  // --- DIFFERENZIERUNG & AFB I-III ---
  {
    id: "flick-03-3-stufen-differenzierung",
    title: "Dreifach differenzierter Fachtext mit Aufgaben (AFB I-III)",
    description: "Erstellt einen Sachtext auf drei Niveaustufen (Basis, Standard, Experte) mit passenden KMK-Operatoren-Aufgaben.",
    category: "differenzierung",
    tags: ["Differenzierung", "AFB I-III", "Fachtext", "Regelschule", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    afbLevels: ["AFB I", "AFB II", "AFB III"],
    systemInstruction: "Du bist Experte für Binnendifferenzierung an Thüringer Regelschulen. Achte strikt auf die KMK-Anforderungsbereiche I, II und III.",
    templateText: `Erstelle für das Fach [Fach] in [Klassenstufe] einen verständlichen Fachtext zum Thema "[Thema]".

Der Text soll in drei Differenzierungsstufen vorliegen:
- Stufe 🟢 Basis (leicht): Kurze Sätze, Fachbegriffe in Klammern erklärt, Zwischenüberschriften, ca. 120-150 Wörter.
- Stufe 🟡 Standard (mittel): Standard-Schulbuchniveau, ca. 200-250 Wörter.
- Stufe 🔴 Experte (anspruchsvoll): Vertiefende Zusammenhänge, Transferfragen, ca. 250-300 Wörter.

Erstelle zu jeder Stufe genau 3 Arbeitsaufträge:
1. Aufgabe zu Anforderungsbereich I (Nennen, Beschreiben, Wiedergeben)
2. Aufgabe zu Anforderungsbereich II (Erklären, Vergleichen, Veranschaulichen)
3. Aufgabe zu Anforderungsbereich III (Beurteilen, Diskutieren, Eigene Stellungnahme)

Formuliere alle Aufgaben mit echten KMK-Operatoren.`,
    variables: [
      { key: "Fach", label: "Schulfach", type: "select", options: ["Geografie", "Biologie", "Physik", "Geschichte", "Wirtschaft-Recht-Technik", "Deutsch"], defaultValue: "Geografie" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 8" },
      { key: "Thema", label: "Thema", type: "text", defaultValue: "Tropischer Regenwald: Stockwerkbau und Bedrohung", placeholder: "Thema eingeben..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude 3.5 / Gemini",
    favoriteCount: 31,
    colleagueTips: [
      { id: "tip-2", authorId: "t-schmidt", authorName: "Schmidt", text: "Die Basis-Version eignet sich hervorragend als Zusatzmaterial für DaZ-Schüler!", createdAt: Date.now() - 86400000 * 4 }
    ],
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 8
  },

  {
    id: "flick-04-gestufte-lernhilfen",
    title: "Gestufte Lernhilfen (Tipp-Karten) zu einer kniffligen Aufgabe",
    description: "Formuliert 4 aufeinander aufbauende Hinweis-Karten für Schüler, die selbstständig nicht weiterkommen (vom Denkanstoß bis zur Musterlösung).",
    category: "differenzierung",
    tags: ["Lernhilfen", "Tipp-Karten", "Selbstständiges Lernen", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Für das Fach [Fach] in [Klassenstufe] haben die Schüler folgende schwierige Aufgabe zu lösen:
"[Aufgabenstellung]"

Erstelle 4 gestufte Tipp-Karten (Lernhilfen) im Kärtchenformat:
- 💡 Tipp 1 (Erinnerung / Orientierung): Welches Vorwissen oder welche Formel/Regel wird hier gebraucht?
- 🔍 Tipp 2 (Strukturierung): Wie lautet der erste konkrete Rechen- oder Denkschritt?
- 🧩 Tipp 3 (Teillösung): Ein konkretes Zwischenergebnis oder eine Beispielfrage zur Selbstkontrolle.
- 🎯 Tipp 4 (Fast fertig / Kontrolltipp): Der letzte Lösungsschritt kurz vor der endgültigen Antwort.

Schreibe die Tipps motivierend und so, dass sie zum Weiterdenken anregen und nicht vorzeitig alles verraten.`,
    variables: [
      { key: "Fach", label: "Schulfach", type: "select", options: ["Mathematik", "Physik", "Chemie", "Deutsch", "Englisch"], defaultValue: "Mathematik" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 9" },
      { key: "Aufgabenstellung", label: "Aufgabenstellung", type: "textarea", defaultValue: "Berechne die Höhe eines Kirchturms, wenn der Schatten um 14 Uhr 18 Meter lang ist und ein 1 Meter langer Stab zur gleichen Zeit einen 1,5 Meter langen Schatten wirft.", placeholder: "Aufgabe hier einfügen..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Gemini Flash",
    favoriteCount: 15,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7
  },

  // --- LEISTUNGSBEWERTUNG & RASTER ---
  {
    id: "flick-05-bewertungsraster",
    title: "Transparente Bewertungsrubrik (Kriterienraster)",
    description: "Erstellt ein transparentes Kriterienraster mit 4 Leistungsstufen (Sehr gut bis Mangelhaft) für Referate, Plakate oder Aufsätze.",
    category: "bewertung",
    tags: ["Noten", "Bewertungsraster", "Rubrik", "Transparenz", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Erstelle für eine [Klassenstufe] ein transparentes, schülergerechtes Bewertungsraster für folgende Leistung:
Leistungsart: [Leistungsart]
Fach: [Fach]
Thema: [Thema]

Das Raster soll 4 Kriterien erfassen:
1. Inhaltliche Richtigkeit & Tiefe
2. Struktur & Aufbau
3. Fachsprache & Ausdruck
4. Präsentation / Gestaltung / Medieneinsatz

Stelle jedes Kriterium in einer Tabelle mit 4 deskriptiven Leistungsstufen dar:
- Stufe 1: Hervorragend / Vollständig erfüllt (Note 1)
- Stufe 2: Gut / Weitgehend erfüllt (Note 2)
- Stufe 3: Teilweise erfüllt / Mit Lücken (Note 3-4)
- Stufe 4: Noch nicht erfüllt / Erhebliche Mängel (Note 5)

Verwende beobachtbare Indikatoren ("Der Schüler zeigt...", "Die Schülerin nutzt...") statt vager Wertungen.`,
    variables: [
      { key: "Leistungsart", label: "Art der Leistung", type: "select", options: ["Kurzvortrag / Referat", "Plakat / Lernplakat", "Erörterung / Aufsatz", "Portfolio / Hefterführung", "Experimentprotokoll", "Modellbau / Werkstück"], defaultValue: "Kurzvortrag / Referat" },
      { key: "Fach", label: "Fach", type: "select", options: ["Deutsch", "Geschichte", "Biologie", "Geografie", "WRT", "Englisch"], defaultValue: "Deutsch" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 7" },
      { key: "Thema", label: "Thema der Leistung", type: "text", defaultValue: "Buchvorstellung meines Lieblingsjugendbuchs", placeholder: "z.B. Die Französische Revolution" }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude 3.5 / Gemini",
    favoriteCount: 29,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6
  },

  {
    id: "flick-06-feedback-sandwich",
    title: "Konstruktives Schüler-Feedback (Sandwich-Methode)",
    description: "Formuliert ein wertschätzendes, motivierendes Feedback zu einer Schülerleistung nach dem Sandwich-Prinzip (Lob - konkrete Verbesserung - Ermutigung).",
    category: "bewertung",
    tags: ["Feedback", "Motivation", "Sandwich-Methode", "Schülerkommunikation", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Formuliere einen kurzen, motivierenden Feedback-Text für einen Schüler / eine Schülerin der [Klassenstufe] zu folgender Arbeit:
Fach: [Fach]
Aufgabe: [Aufgabe]

Stärken der Arbeit: [Staerken]
Schwächen / Entwicklungsbedarf: [Schwaechen]

Wende die pädagogische Sandwich-Methode an:
1. Echtes, ehrliches Lob für gelungene Aspekte (Stärken hervorheben).
2. Konkreter, umsetzbarer Praxistipp für das nächste Mal (max. 1-2 Hebel).
3. Positiver Abschluss mit persönlicher Ermutigung.

Tonfall: Freundlich, zugewandt, auf Augenhöhe einer Regelschullehrkraft.`,
    variables: [
      { key: "Fach", label: "Fach", type: "select", options: ["Deutsch", "Englisch", "Geschichte", "Mathematik", "Biologie"], defaultValue: "Englisch" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 8" },
      { key: "Aufgabe", label: "Aufgabe / Textsorte", type: "text", defaultValue: "Schreiben einer Email über die letzten Ferien", placeholder: "z.B. Charakterisierung..." },
      { key: "Staerken", label: "Was war gut?", type: "textarea", defaultValue: "Sehr kreative Geschichte, guter roter Faden, mutige Wortwahl", placeholder: "Stärken notieren..." },
      { key: "Schwaechen", label: "Was muss besser werden?", type: "textarea", defaultValue: "Häufige Verwechslung von Simple Past und Past Progressive, Satzbau oft eingedeutscht", placeholder: "Kritikpunkte..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini",
    favoriteCount: 20,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5
  },

  // --- ELTERNARBEIT & BERATUNG ---
  {
    id: "flick-07-elternbrief-wandertag",
    title: "Offizieller Elternbrief für Ausflug oder Wandertag",
    description: "Verfasst ein druckfertiges, rechtssicheres Elternschreiben inklusive Rückmeldeabschnitt, Notfallkontakten und Einverständniserklärung.",
    category: "eltern",
    tags: ["Elternbrief", "Wandertag", "Exkursion", "Orga", "Manuel Flick Guide"],
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Verfasse einen offiziellen Elternbrief der Staatlichen Regelschule Heimbürgeschule Kahla für einen Ausflug.

Details:
Klasse: [Klassenstufe]
Ziel / Aktivität: [Ausflugsziel]
Datum: [Datum]
Treffpunkt & Uhrzeit: [Treffpunkt]
Rückkehr: [Rueckkehr]
Kosten pro Schüler: [Kosten]
Mitzubringen: [Mitzubringen]

Der Brief soll enthalten:
- Herzliche, verbindliche Anrede
- Kurze Erklärung des pädagogischen Zwecks des Ausflugs
- Alle organisatorischen Eckdaten übersichtlich gegliedert
- Hinweis auf witterungsgerechte Kleidung und eventuelle Fahrkarten
- Klaren, perforierbaren Rückmeldeabschnitt (Einverständnis, Notfalltelefonnummer der Eltern, Allergien/Krankheiten, Unterschrift)`,
    variables: [
      { key: "Klassenstufe", label: "Klasse", type: "select", options: ["Klasse 5a", "Klasse 6b", "Klasse 7", "Klasse 8a", "Klasse 9b", "Klasse 10"], defaultValue: "Klasse 7" },
      { key: "Ausflugsziel", label: "Ausflugsziel / Aktivität", type: "text", defaultValue: "Exkursion ins Zeiss-Planetarium nach Jena", placeholder: "z.B. Wandertag Leuchtenburg" },
      { key: "Datum", label: "Datum", type: "text", defaultValue: "Dienstag, 24. Oktober", placeholder: "Datum eintragen..." },
      { key: "Treffpunkt", label: "Treffpunkt & Abfahrt", type: "text", defaultValue: "08:15 Uhr Bahnhof Kahla (Gleis 1)", placeholder: "Treffpunkt..." },
      { key: "Rueckkehr", label: "Geplante Rückkehr", type: "text", defaultValue: "ca. 13:45 Uhr Bahnhof Kahla", placeholder: "Uhrzeit..." },
      { key: "Kosten", label: "Kosten pro Schüler", type: "text", defaultValue: "7,50 € (bitte bis Freitag passend bar mitgeben)", placeholder: "Kosten..." },
      { key: "Mitzubringen", label: "Mitzubringen", type: "text", defaultValue: "Rucksack mit kleiner Brotzeit, Getränkeflasche, Schülerausweis", placeholder: "Dinge..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini",
    favoriteCount: 27,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4
  },

  {
    id: "flick-08-elternsprechtag-leitfaden",
    title: "Leitfaden für ein schwieriges Elterngespräch",
    description: "Bereitet ein strukturiertes Gespräch vor mit lösungsorientierter Gesprächsführung, Deeskalation und Zielvereinbarung.",
    category: "eltern",
    tags: ["Elterngespräch", "Beratung", "Konfliktlösung", "Manuel Flick Guide"],
    templateText: `Ich muss als Klassenlehrkraft ein anspruchsvolles Elterngespräch in einer [Klassenstufe] führen.
Thema des Gesprächs: [Gespraechsanlass]
Beobachtungen der Lehrkräfte: [Beobachtungen]

Erstelle mir einen professionellen Gesprächsleitfaden (Dauer: ca. 20 Minuten):
1. Warm-up & Wertschätzender Einstieg (Eine positive Facette des Schülers benennen).
2. Sachliche Schilderung der Fakten ohne Vorwürfe (Ich-Botschaften).
3. Offene Fragen an die Eltern, um deren Perspektive zu erfahren.
4. Mögliche Einwände oder Abwehrhaltungen der Eltern und deeskalierende Reaktionen.
5. Vereinbarung von 2 konkreten, überprüfbaren Zielen (SMART-Prinzip) für die nächsten 4 Wochen.
6. Positiver Abschluss.`,
    variables: [
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 8" },
      { key: "Gespraechsanlass", label: "Gesprächsanlass", type: "text", defaultValue: "Wiederholtes Stören des Unterrichts und fehlende Hausaufgaben", placeholder: "Grund des Gesprächs..." },
      { key: "Beobachtungen", label: "Konkrete Fakten / Notizen", type: "textarea", defaultValue: "In 3 Fächern Hausaufgaben vergessen, lenkt Nachbarn ab, reagiert bei Ermahnungen oft patzig, zeigt aber in Gruppenarbeiten gute soziale Stärken", placeholder: "Fakten eingeben..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini",
    favoriteCount: 22,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3
  },

  // --- SONDERPAEDAGOGIK & INKLUSION ---
  {
    id: "flick-09-leichte-sprache",
    title: "Fachtext in 'Leichte Sprache' & DaZ-Niveau übersetzen",
    description: "Formt komplexe Arbeitsanweisungen oder Sachtexte in barrierearme Leichte Sprache (kurze Sätze, Worttrennungen, Begriffserklärungen).",
    category: "sonderpaedagogik",
    tags: ["Inklusion", "Leichte Sprache", "DaZ", "Förderung", "Manuel Flick Guide"],
    subject: "Allgemein",
    templateText: `Übersetze den folgenden Text für Schüler mit Förderbedarf (Lernen/Sprache) oder DaZ-Schüler (A2-Niveau) in 'Leichte Sprache':

Originaltext:
"[Originaltext]"

Beachte folgende Regeln für Leichte Sprache:
- Jeder Satz enthält nur EINE Information.
- Keine Fremdwörter oder abstrakten Schachtelsätze.
- Schwere zusammengesetzte Wörter mit Bindestrich trennen (z.B. Bundes-Tag, Sauer-Stoff-Kreislauf).
- Fachbegriffe sofort mit einem einfachen Alltagsbeispiel erklären.
- Verwende aktive Verben statt Passivkonstruktionen.
- Füge am Ende 3 einfache Verständnisfragen hinzu.`,
    variables: [
      { key: "Originaltext", label: "Ausgangstext", type: "textarea", defaultValue: "Die Französische Revolution markiert eine epochale Zäsur in der europäischen Geschichte, in deren Verlauf das absolutistische Ancien Régime durch das Aufbegehren des Dritten Standes und die Erklärung der Menschen- und Bürgerrechte überwunden wurde.", placeholder: "Komplexen Text hier einfügen..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini Flash",
    favoriteCount: 35,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2
  },

  // --- KOOPERATIVE METHODEN & SPIELE ---
  {
    id: "flick-10-stationenlernen",
    title: "Stationenlernen / Lernzirkel mit 5 Stationen konzipieren",
    description: "Erstellt ein abwechslungsreiches Stationenlernen mit Pflicht- und Wahlstationen, Lösungsstation und Laufzettel.",
    category: "methoden",
    tags: ["Stationenlernen", "Kooperatives Lernen", "Laufzettel", "Selbstständigkeit", "Manuel Flick Guide"],
    subject: "Allgemein",
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Konzipiere für das Fach [Fach] in einer [Klassenstufe] ein Stationenlernen zum Thema "[Thema]".
Zeitrahmen: [Dauer]

Plane genau 5 Stationen (3 Pflichtstationen, 2 Wahlstationen):
- Station 1 (Pflicht - Erarbeitung): Textarbeit mit gezielter Markierung
- Station 2 (Pflicht - Visualisierung): Schaubild, Skizze oder Tabelle vervollständigen
- Station 3 (Pflicht - Anwendung/Rechnen): Konkrete Übungsaufgaben (AFB II)
- Station 4 (Wahl - Kreativ/Haptisch): Ein kurzes Rollenspiel, Quiz oder Modell
- Station 5 (Wahl - Vertiefung/Knobelaufgabe): Transferaufgabe für schnelle Schüler

Gib für jede Station an:
- Titel der Station
- Arbeitsauftrag in schülergerechter Sprache
- Benötigtes Material
- Kurze Musterlösung für die Selbstkontrolle (Lösungsstation)
- Vorlage für einen kompakten Laufzettel für das Schülerheft`,
    variables: [
      { key: "Fach", label: "Fach", type: "select", options: ["Biologie", "Physik", "Geschichte", "Mathematik", "Geografie", "Deutsch"], defaultValue: "Physik" },
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 8" },
      { key: "Thema", label: "Thema", type: "text", defaultValue: "Einfache Stromkreise: Reihen- und Parallelschaltung", placeholder: "Thema..." },
      { key: "Dauer", label: "Geplanter Zeitrahmen", type: "select", options: ["1 Unterrichtsstunde (45 Min)", "Doppelstunde (90 Min)", "Projekttag (3-4 Stunden)"], defaultValue: "Doppelstunde (90 Min)" }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude 3.5 / Gemini",
    favoriteCount: 26,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1
  },

  // --- ORGANISATION & ENTLASSTUNG ---
  {
    id: "flick-11-zeugnisbemerkung",
    title: "Individuelle & wohlwollende Zeugnisbemerkung verfassen",
    description: "Generiert aus Stichworten eine formulierungssichere, empathische Zeugnisbemerkung zum Arbeits- und Sozialverhalten nach Schulgesetz.",
    category: "orga",
    tags: ["Zeugnis", "Beurteilung", "Sozialverhalten", "Arbeitsverhalten", "Manuel Flick Guide"],
    gradeLevels: ["5", "6", "7", "8", "9", "10"],
    templateText: `Verfasse für einen Schüler / eine Schülerin der [Klassenstufe] an einer Thüringer Regelschule eine wohlwollende, aber differenzierte Zeugnisbemerkung für das Schuljahresende.

Stichworte zum Arbeitsverhalten: [Arbeitsverhalten]
Stichworte zum Sozialverhalten: [Sozialverhalten]
Besondere Stärken oder Interessen: [Staerken]

Vorgaben:
- Umfang: 3 bis 5 gut lesbare Sätze.
- Keine Floskeln, sondern ein klares, wertschätzendes Bild der Persönlichkeit.
- Konstruktiver Ausblick auf das kommende Schuljahr.
- Formuliere 2 unterschiedliche Varianten (eine Variante etwas förmlicher, eine Variante etwas persönlicher).`,
    variables: [
      { key: "Klassenstufe", label: "Klassenstufe", type: "select", options: ["Klasse 5", "Klasse 6", "Klasse 7", "Klasse 8", "Klasse 9", "Klasse 10"], defaultValue: "Klasse 6" },
      { key: "Arbeitsverhalten", label: "Arbeitsverhalten (Stichworte)", type: "textarea", defaultValue: "Sehr fleißig, meldet sich regelmäßig, lässt sich bei Stillarbeit manchmal noch leicht von Sitznachbarn ablenken, führt Hefter sehr ordentlich", placeholder: "Stichworte eingeben..." },
      { key: "Sozialverhalten", label: "Sozialverhalten (Stichworte)", type: "textarea", defaultValue: "Sehr hilfsbereit, schlichtet gerne Streit, bei Mitschülern beliebt, übernimmt verlässlich Klassendienste", placeholder: "Stichworte eingeben..." },
      { key: "Staerken", label: "Besondere Stärken", type: "text", defaultValue: "Großes Interesse an Naturwissenschaften und Tierwelt", placeholder: "Hobbys, Stärken..." }
    ],
    visibility: "school",
    authorId: "manuel-flick",
    authorName: "Manuel Flick (ChatGPT-Guide)",
    source: "Manuel Flick ChatGPT-Guide für Lehrkräfte",
    recommendedModel: "ChatGPT-4o / Claude / Gemini",
    favoriteCount: 38,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1
  }
];
