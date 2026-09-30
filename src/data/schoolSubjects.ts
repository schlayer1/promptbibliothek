export const THUERINGEN_SUBJECTS = [
  "Mathematik",
  "Deutsch",
  "Englisch",
  "Biologie",
  "Physik",
  "Chemie",
  "Geschichte",
  "Geografie",
  "Sozialkunde",
  "Wirtschaft-Recht-Technik (WRT)",
  "Werken / Technik",
  "Kunst",
  "Musik",
  "Sport",
  "Ethik",
  "Evangelische Religion",
  "Katholische Religion",
  "Französisch",
  "Russisch",
  "Informatik / Medienbildung",
  "DaZ (Deutsch als Zweitsprache)",
  "Förderunterricht / LRS"
];

export const GRADE_LEVELS = [
  "Klasse 5",
  "Klasse 6",
  "Klasse 7",
  "Klasse 8",
  "Klasse 9",
  "Klasse 10"
];

export const CATEGORY_LABELS: Record<string, { label: string; description: string; icon: string }> = {
  all: { label: "Alle Prompts", description: "Vollständige Sammlung", icon: "Layers" },
  unterricht: { label: "Unterricht & Stundenplanung", description: "Einstiege, Phasen, Erarbeitungen", icon: "BookOpen" },
  differenzierung: { label: "Differenzierung & AFB I-III", description: "Niveaustufen, Fördern & Fordern", icon: "Sliders" },
  bewertung: { label: "Leistungsbewertung & Raster", description: "Erwartungshorizonte, Rubriken, Feedback", icon: "CheckSquare" },
  eltern: { label: "Elternarbeit & Beratung", description: "Briefe, Entwicklungsgespräche, Vorlagen", icon: "Mail" },
  orga: { label: "Organisation & Entlastung", description: "Wandertage, Konferenzen, Zeugnisphrasen", icon: "Calendar" },
  sonderpaedagogik: { label: "Förderung & Inklusion", description: "DaZ, LRS, Leichte Sprache, Förderpläne", icon: "HeartHandshake" },
  methoden: { label: "Kooperative Methoden", description: "Think-Pair-Share, Stationenlernen, Placemat", icon: "Users" }
};
