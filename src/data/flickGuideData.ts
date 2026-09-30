// Generiert aus dem offiziellen Manuel Flick ChatGPT-Guide für Lehrkräfte
// Quelle: https://manuelflick.notion.site/Der-ChatGPT-Guide-f-r-Lehrkr-fte-f214379898ce405089ac05555f06ba04#106399fae7f243d5b081ad8062b5899b

export interface FlickSection {
  id: string;
  number: string;
  icon: string;
  title: string;
  category: string;
  didacticTip: string;
  prompts: string[];
  structuralTemplate?: string | null;
}

export const FLICK_CATEGORIES = [
  'Alle Bereiche',
  'I. Texterstellung & -bearbeitung',
  'II. Thematische Erarbeitung & Interpretation',
  'III. Unterrichtsplanung & -vorbereitung',
  'IV. Feedback & Bewertung',
  'V. Schul- & Elternkommunikation',
  'VI. Simulationen, Rollenspiele & Quizze',
  'VII. Fachspezifische Unterstützung'
] as const;

export type FlickCategory = typeof FLICK_CATEGORIES[number];

export const FLICK_SECTIONS: FlickSection[] = [
  {
    "id": "flick-sec-3-1",
    "number": "3.1",
    "icon": "📝",
    "title": "Erstellung von Texten",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "Praxiserprobter Einsatzbereich nach Manuel Flick für das tägliche Unterrichten und Vorbereiten.",
    "prompts": [
      "Schreibe einen Informationstext über das Thema Kaufverträge",
      "Schreibe eine Einleitung zu dem Thema Nachhaltigkeit",
      "Schreibe eine Liste mit 10 Tipps für ein Verkaufsgespräch",
      "Schreibe mir ein Angebot für die Bestellung eines Unternehmens",
      "Schreibe mir eine Anleitung zum Erstellen förmlicher E-Mails",
      "Schreibe mir einen Dialog zwischen Chef und Auszubildenden zum Thema Arbeitszeiten",
      "Schreibe mir eine Bestellbestätigung in Form einer E-Mail, die ich für eine berufliche Handlungssituation heranziehen kann"
    ],
    "structuralTemplate": "Aufgabe: Schreibe einen “deine Textart” zum Thema “dein Thema”\nInhalt: “hier deinen gewünschten Inhalt genauer beschreiben”\nRolle: Du bist “Person nennen”, z.B. Deutschlehrer, Historiker\nLänge: “hier Textlänge angeben”, z.B. ca. 500 Zeichen, bis 10 Sätze, 200-300 Wörter, 5 Absätze etc.\nZielgruppe: “hier Zielgruppe des Textes angeben”, z.B. Schüler:innen, Grundschüler:innen, Abiturient:innen,\nStruktur: “hier Angaben zur Struktur des Textes machen”, z.B. Überschrift, Untertitel, Einleitung, Hauptteil mit 5 Abschnitten, Zusammenfassung; als Liste o.ä.\nStil: “hier gewünschten Stil beschreiben”, z.B. sachlich, lustig, informell, sarkastisch, einfache Sprache, förmlich, unüblich, in Jugendsprache\nEmojis:  “hier Angaben zu Emojis machen”, z.B. nach jedem Satz, Emojis statt Wörtern, zu Beginn des Absatzes, einige, viele, etc.\nSprache:  “hier Angaben zur Sprache machen“, z.B. Deutsch, Englisch, Französisch und Spanisch etc.\nWeitere Hinweise: z.B. ohne Fachwörter, mit 5 Rechtschreibfehlern, in Stichpunkten"
  },
  {
    "id": "flick-sec-3-2",
    "number": "3.2",
    "icon": "🔍",
    "title": "Differenzierung von Texten",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "Texte lassen sich mit ChatGPT anhand der Länge, Schwierigkeit, Sprachniveau und vieler weiterer Kriterien differenzieren. Somit lassen sich den Schüler:innen im Handumdrehen individuelle Lernangebote machen.",
    "prompts": [
      "Schreibe den Text in einfacher Sprache  - “Text einfügen”",
      "Mache den Text kürzer (länger) - “Text einfügen”",
      "Schreibe diesen Text so, dass ihn eine Grundschülerin versteht - “Text einfügen”",
      "Verwende weniger Fachwörter - “Text einfügen”",
      "“Text einfügen” - Füge Erklärungen für alle Fachwörter ein",
      "“Text einfügen” - Schreibe den Text so, dass ihn jemand mit geringen Deutschkenntnissen versteht",
      "Gib den nachfolgenden Text auf einfachem und anspruchsvollem Sprachniveau aus “Text einfügen”"
    ],
    "structuralTemplate": "Länge: “hier Textlänge angeben, z.B. ca. 500 Wörter, 10 Sätze, 200-300 Wörter, 5 Absätze etc.”\nZielgruppe: “hier Zielgruppe des Textes angeben” z.B. Grundschüler:in, Berufsschüler:in etc.\nSprachniveau:* “hier Angaben zu Sprachniveau machen”*, z.B. einfache Sprache, Sprachanfänger, wenige Fachbegriffe etc.\nSprache:  “hier Angaben zur Sprache machen“, z.B. Deutsch, Englisch, Französisch und Spanisch etc.\nu.v.m."
  },
  {
    "id": "flick-sec-3-3",
    "number": "3.3",
    "icon": "🗂",
    "title": "️ Strukturierung von Texten",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "Mit ChatGPT lassen sich vorhandene Texte gliedern und strukturieren.",
    "prompts": [
      "Text einfügen” - Gliedere den Text und erstelle eine Überschrift und Unterüberschriften",
      "Text einfügen” - Erstelle eine sinnvolle Gliederung",
      "Text einfügen” - Füge Zwischenüberschriften ein",
      "Text einfügen” - Gliedere den Text in 5 Abschnitte"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-4",
    "number": "3.4",
    "icon": "😎",
    "title": "Ausformulierung von Texten",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "ChatGPT kann natürlich auch Stichpunkte und Notizen ausformulieren. Das kann im Schulalltag an vielen Stellen hilfreich sein.",
    "prompts": [
      "“Stichpunkte einfügen” - Bitte ausformulieren",
      "“Notizen einfügen” - Bitte ein kurzes Essay dazu erstellen",
      "“Stichpunkte einfügen” - Bitte in ganzen Sätzen"
    ],
    "structuralTemplate": "“Stichpunkte / Notizen einfügen”\n\nAufgabe: Bitte Stichpunkte ausformulieren\nHinweise: “hier weitere Angaben machen” z.B. Einleitung und Schluss hinzufügen, Überschrift finden, etc.\nStil: “hier gewünschten Stil beschreiben”, z.B. sachlich, strukturiert, lustig, informell, sarkastisch, einfache Sprache, ohne Fachwörter, förmlich, unüblich, in Jugendsprache et.\nEmojis:  “hier Angaben zu Emojis machen”, z.B. nach jedem Satz, Emojis statt Wörtern, zu Beginn des Absatzes, einige, viele, etc.\nLänge: “hier Textlänge angeben, z.b. ca. 500 Zeichen, bis 10 Sätze, 200-300 Wörter, 5 Absätze etc.”\nZielgruppe: “hier Zielgruppe des Textes angeben”, z.B. Schüler:innen, Grundschüler, Abiturient, Kunde\nStruktur: “hier Angaben zur Struktur des Textes machen”, z.B. Überschrift, Untertitel, Einleitung, Hauptteil mit 5 Abschnitten o.ä.\nSprache:  “hier Angaben zur Sprache machen“, z.B. Deutsch, Englisch, Französisch und Spanisch etc."
  },
  {
    "id": "flick-sec-3-5",
    "number": "3.5",
    "icon": "🏆",
    "title": "Verbesserung von Texten",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "Textprodukte (oder einzelne Abschnitte davon) lassen sich mithilfe von ChatGPT sprachlich verbessern. Hieraus ergeben sich wiederum Einsatzmöglichkeiten für den Unterricht.",
    "prompts": [
      "“Text einfügen” - Verbessere den Schreibstil",
      "“Text einfügen” - Korrigiere die Rechtschreibung und liste die Verbesserungen auf",
      "“Text einfügen” - Korrigiere die Grammatikfehler",
      "“Text einfügen” - Verwende weniger Nebensätze",
      "“Titel einfügen” - Nenne mir 10 alternative Titel",
      "Betrachte den nachfolgenden Sachtext. Bitte finde passende Beispiele zu den Argumenten und füge diese direkt in den Text ein.\n\n”Text einfügen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-6",
    "number": "3.6",
    "icon": "📝",
    "title": "Erstellung von Listen und Glossaren",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "Mit ChatGPT lassen sich im Handumdrehen Listen mit Fachbegriffen oder Glossare mit Erklärungen erstellen. Auch Listen mit Formulierungshilfen zur Sprachförderung und Sprachbildung sind denkbar.",
    "prompts": [
      "Erstelle eine Liste mit Fachbegriffen zu dem Thema Konjunktur",
      "“Text einfügen” - Notiere alle vorkommenden Fachbegriffe in einer Liste",
      "“Text einfügen” - Erstelle eine Tabelle aus Fachwörtern und Erklärungen",
      "Erstelle ein Glossar mit Fachbegriffen und Erklärungen zu dem Thema Angebot und Nachfrage",
      "Erstelle eine Liste mit Formulierungshilfen für ein Kundengespräch",
      "Erstelle eine Liste mit Formulierungshilfen für einen Geschäftsbrief",
      "Erstelle eine Liste mit den Bestandteilen eines Business-Letters in Tabellenform"
    ],
    "structuralTemplate": "Aufgabe: Erstelle eine Liste / Glossar zu dem Thema “dein Thema”\nInhalte: “hier Inhalt der Liste nennen”, z.B. Fachbegriffe, Fachbegriffe und Erklärungen\nZielgruppe: “hier Zielgruppe nennen”, z.B. Einzelhandelskaufleute, Abiturienten etc.\nLänge: “Länge der Liste angeben”, z.B. 10 Punkte, 15 Begriffe etc.\nForm: in Tabellenform (mehr dazu hier)"
  },
  {
    "id": "flick-sec-3-7",
    "number": "3.7",
    "icon": "📄",
    "title": "Erstellung von Zusammenfassungen",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "ChatGPT kann den Inhalt von Büchern, Filmen, Dokumentationen, sämtlichen Texten, Gedichten, Songs und vielem mehr zusammenfassen. Diese Einsatzmöglichkeit eignet sich  im Rahmen der Unterrichtsvorbereitung auf vielfältige Weise, zum Beispiel im Zuge der Materialerstellung, oder um sich einfach einen Überblick über längere Texte und umfangreiche Materialien zu verschaffen. Beachte, dass die KI aktuell nur auf Daten bis 2021 zurückgreift und neuere Titel noch nicht kennt.",
    "prompts": [
      "Fasse den Text in einem Absatz zusammen - “Text einfügen”",
      "Fasse die wichtigsten Inhalte zusammen - ”Text einfügen”",
      "Schreibe eine Zusammenfassung zu der Dokumentation “The Cleaners: Im Schatten der Netzwelt”",
      "Fasse “Effi Briest” in ca. 1000 Wörtern zusammen",
      "Fasse den Inhalt der Webseite zusammen - “URL einfügen”",
      "Fasse den Inhalt zusammen. Reduziere auf 10 Thesen!",
      "Fasse den Inhalt zusammen. Reduziere auf 10 Thesen!"
    ],
    "structuralTemplate": "Aufgabe: Fasse “dein Inhalt” zusammen\nInhalt: “hier deinen gewünschten Inhalt genauer beschreiben” z.B. die wichtigsten Thesen herausstellen, auf die Hauptfiguren eingehen etc.\nStil: “hier gewünschten Stil beschreiben”, z.B. sachlich, strukturiert, lustig, informell, sarkastisch, einfache Sprache, ohne Fachwörter, förmlich, unüblich, in Jugendsprache, in Stichpunkten etc.\nLänge: “hier Textlänge angeben, z.b. ca. 500 Zeichen, bis 10 Sätze, 200-300 Wörter, 5 Absätze etc.”\nZielgruppe: “hier Zielgruppe des Textes angeben”\nStruktur: “hier Angaben zur Struktur des Textes machen”, z.B. Überschrift, Untertitel, Einleitung, Hauptteil mit 5 Abschnitten, Zusammenfassung; als Aufzählung; als Liste, o.ä.\nSprache:  “hier Angaben zur Sprache machen“, z.B. Deutsch, Englisch, Französisch und Spanisch etc."
  },
  {
    "id": "flick-sec-3-8",
    "number": "3.8",
    "icon": "🪜",
    "title": "Unterstützung im Schreibprozesses (Scaffolding)",
    "category": "I. Texterstellung & -bearbeitung",
    "didacticTip": "ChatGPT kann im Unterricht als Hilfe im Schreibprozess genutzt werden. Die KI kann zum Beispiel Unterstützung bei Formulierungen oder der Strukturierung von Texten anbieten.",
    "prompts": [
      "Mache mir Vorschläge für eine gute Struktur eine Beschwerde-E-Mail",
      "Gib mir 10 Tipps zur Formulierung eines Anschreibens für eine Bewerbung",
      "Gib mir Anregungen für eine Einleitung für eine Erörterung",
      "Nenne mir 10 alternative Formulierungen für \n”Satz einfügen”",
      "Gib mir Hinweise zu Struktur und Inhalt eines Fazits",
      "Nenne mir 20 Synonyme für ”Wort einfügen”",
      "Gib mir 20 Formulierungen, um die eigene Meinung zu äußern",
      "Nenne mir 15 Formulierungen, die ich für ein Fazit verwenden kann",
      "Nenne mir 15 Formulierungen, die ich für ein Fazit verwenden kann"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-9",
    "number": "3.9",
    "icon": "🗒",
    "title": "️ Gliederung von Themen",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "Mit ChatGPT lassen sich nicht nur vorhandene Texte strukturieren, die KI kann auch Themen sinnvoll strukturieren und gliedern. Die Gliederung kann dann als Grundlage für die Erstellung einer Präsentation, Hausarbeit oder sonstiges herangezogen werden.",
    "prompts": [
      "Erstelle eine Gliederung zu dem Thema Nachhaltigkeit",
      "Erstelle eine Struktur für das Thema Unternehmensziele.",
      "Erstelle eine Gliederung zum Thema Gender Pay Gap für eine Präsentation",
      "Strukturiere das Thema Online-Vertriebskanäle für eine Hausarbeit"
    ],
    "structuralTemplate": "Aufgabe: Erstelle eine Gliederung zu dem Thema “Thema nennen”\nZiel: “hier nennen, wofür die Gliederung dient”, z.B. Präsentation, Facharbeit etc.\nUnterthemen: “hier Unterthemen nennen”\nUmfang: “hier Angaben zum Umfang machen, z.B. 5 Unterthemen, 10 Gliederungspunkte o.ä.\nZielgruppe: “hier Zielgruppe des Textes angeben” z.B. Grundschüler, Abiturienten etc.\nSprache:  “hier Angaben zur Sprache machen“, z.B. Deutsch, Englisch, Französisch\nHinweise:* “hier ggf. weitere Angaben machen”, *z.B. ausführliche Stichpunkte, Ausblick und Fazit einbauen o.ä."
  },
  {
    "id": "flick-sec-3-10",
    "number": "3.10",
    "icon": "💬",
    "title": "Erörterung von Themen",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "ChatGPT kann Erörterungen schreiben, Optionen anhand von Kriterien vergleichen sowie Pro und Contra abwägen.",
    "prompts": [
      "Schreibe einen Text mit 5 Pro-Argumenten und 5 Contra-Argumenten zu dem Thema autofreie Innenstädte.",
      "Erörtere das Thema Tempolimit auf Autobahnen.",
      "Wäge die beiden Optionen Studium oder Ausbildung ab.",
      "Schreibe 5 Absätze über die Vor- und Nachteile von Kreditkartenzahlung und Zahlung auf Rechnung."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-11",
    "number": "3.11",
    "icon": "💡",
    "title": "Finden von Beispielen und Analogien",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "ChatGPT kann beim Finden von passgenauen Beispielen unterstützen.",
    "prompts": [
      "Nenne mir 5 Beispiele, wie ein Ausbildungsbetrieb Energie sparen kann.",
      "Nenne mir ein Beispiel für einen Sachmangel aus der Lebenswelt von jungen Leuten",
      "Gib mir ein ausführliches Beispiel, wie sich ein Preis am Markt bildet",
      "Nenne mir 3 reale Beispiele für Oligopole in der Wirtschaft",
      "Nenne mir 3 reale Beispiele für Oligopole in der Wirtschaft",
      "Finde eine Analogie zur Konjunkturpolitik der Bundesregierung",
      "Erstelle 5 kurze Analogien zur Preisbildung durch Angebot und Nachfrage",
      "Finde eine Analogie für den Begriff \"Differenzierung\" in der Mathematik.",
      "Finde eine Analogie, die die Funktionsweise von Aktienmärkten veranschaulicht."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-12",
    "number": "3.12",
    "icon": "🔎",
    "title": "Analysieren von Inhalten",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "Mit ChatGPT lassen sich Text analysieren und in diesem Zuge bestimmte Aspekte herausarbeiten. Einige Beispiele:",
    "prompts": [
      "Betrachte diese Erörterung. Stelle Widersprüche in der Argumentation heraus.\n\n””“Text einfügen”””",
      "Betrachte den nachfolgenden Sachtext. Stelle die Argumente heraus und sortiere sie nach ihrer Stärke und Stichhaltigkeit. Begründe. \n\n””“Text einfügen”””",
      "Betrachte den nachfolgenden Sachtext. Analysiere die Argumentationsstruktur. \n\n””“Text einfügen”””",
      "Betrachte den nachfolgenden Text. Welche Funktion hat der Text und wie diese durch den Textinhalt und -stil erreicht?\n\n””“Text einfügen”””",
      "Untersuche den nachfolgenden Zeitungsartikel. Welche Nachricht oder Information soll vermittelt werden und wie wird dies durch den Schreibstil und die Strukturierung erreicht?\n\n””“Text einfügen”””",
      "Betrachte das nachfolgende Gedicht. Welche Emotionen werden durch den Inhalt und die verwendeten sprachlichen Mittel hervorgerufen?\n\n””“Text einfügen”””",
      "Betrachte das nachfolgende Drama. Welche Konflikte werden dargestellt und wie werden sie durch die Dialoge und Handlungen der Charaktere entwickelt?\n””“Text einfügen”””",
      "Lies den nachfolgenden Unfallbericht. Wie wird die Umgebung oder der Ort des Unfalls beschrieben und welche Rolle spielt dieser im Kontext des Geschehens?\n\n””“Text einfügen”””",
      "Analysiere diesen Text. Stufe ein, auf welchem Sprachniveau sich dieser Text befindet. Beziehe dich auf den europäischen Referenzrahmen (A1-C2)\n\n””“Text einfügen”””"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-13",
    "number": "3.13",
    "icon": "🪞",
    "title": "Vergleichen von Inhalten",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "Mit ChatGPT lassen sich sämtliche Inhalte vergleichen und dabei von der KI Unterschiede herausstellen. Dies kann natürlich in Rahmen der Unterrichtsvorbereitung und Materialerstellung spannend sein, aber es ergeben sich daraus auch Einsatzzwecke für den Unterricht selbst. Hier ein paar mögliche Szenarien:",
    "prompts": [
      "Vergleiche diese beiden Sachtexte. Welche Handlungsempfehlungen treten in beiden Texten auf?\n\nText 1: “Text einfügen”\nText 2 “Text einfügen”",
      "Vergleiche diese beiden Texte. Arbeite die inhaltlichen (stilistischen) Unterschiede heraus und stelle diese in einer Tabelle dar.\n\nText 1: “Text einfügen”\nText 2 “Text einfügen”",
      "Lies die beiden Textauszüge. Wie spiegeln sie die Kultur und Zeit wider, in der sie geschrieben wurden?\n\nText 1: “Text einfügen”\nText 2 “Text einfügen”",
      "Vergleiche diese beiden Texte. Welchen Genres gehören sie an und wie erfüllen sie die typischen Merkmale dieses Genres?\nText 1: “Text einfügen”\nText 2 “Text einfügen”",
      "Betrachte die beiden Dialoge. Wie unterscheiden sich die Charaktere in ihrer Sprache und Ausdrucksweise?\n\nText 1: “Text einfügen”\nText 2 “Text einfügen”",
      "Lies die beiden Kurzgeschichten. Wie unterscheiden sich die Erzähl-Perspektiven und welche Wirkung haben sie auf den Leser?\nText 1: “Text einfügen”\nText 2 “Text einfügen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-14",
    "number": "3.14",
    "icon": "💬",
    "title": "Erklärung von Sachverhalten & Zusammenhängen",
    "category": "II. Thematische Erarbeitung & Interpretation",
    "didacticTip": "ChatGPT lässt sich super einsetzen, um grundlegende Konzepten, Zusammenhänge und Sachverhalte zu erläutern. Hieraus ergeben sich grundsätzlich viele Einsatzzwecke für sämtliche Unterrichtsfächer.",
    "prompts": [
      "Erläutere den Zusammenhang zwischen Angebot und Nachfrage und wie er die Preisbildung beeinflusst.",
      "Was ist der Unterschied zwischen Brutto- und Nettoeinkommen? Wie werden sie berechnet?",
      "Erkläre das Konzept der Zinseszinsen und wie es in der Finanzwelt angewendet wird.",
      "Wie berechnet man den Flächeninhalt und den Umfang eines Quaders?",
      "Was sind Vektoren in der Mathematik? Wie werden sie dargestellt und welche Rechenoperationen kann man mit ihnen durchführen?",
      "Vergleiche Fotosynthese und Zellatmung. Wie unterscheiden sie sich in den beteiligten Organismen und Abläufen?",
      "Beschreibe den menschlichen Blutkreislauf und seine Hauptfunktionen im Körper.",
      "Erkläre den Wasserkreislauf und wie er das Klima und Wetterphänomene beeinflusst.",
      "Was versteht man unter Plattentektonik? Wie beeinflusst sie geologische Ereignisse auf der Erde?",
      "Beschreibe die Grundprinzipien der Elektrizität und wie sie in alltäglichen Anwendungen genutzt wird.",
      "Erkläre das Prinzip der Hebelgesetze und wie sie in der Mechanik angewendet werden."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-15",
    "number": "3.15",
    "icon": "📅",
    "title": "Planung von Unterrichtsreihen",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT kann Unterrichtsreihen planen. Je genauer du deine didaktischen und methodischen Vorstellungen beschreibst, desto treffsicherer sind natürlich auch hier die Ergebnisse.",
    "prompts": [
      "Plane eine Unterrichtsreihe über 5 Stunden zu dem Thema “Lagerorganisation”.",
      "Erstelle eine Projektplanung zum Thema “Vertriebskanäle” für den Unterricht.",
      "Erstelle eine Semesterplanung über 15 Termine zu den Themen “Soziale Sicherung” und Tarifverträge”"
    ],
    "structuralTemplate": "Aufgabe: Erstelle einen Reihenplanung zu dem Thema “dein Thema”\nInhalte: “hier Unterrichtsthemen nennen/ beschreiben”\nZielgruppe: “hier Zielgruppe nennen”, z.B. Einzelhandelskaufleute, Abiturienten, etc. \nLänge: “Länge der Reihe angeben”, z.B. 5 Wochen, 12 Termine, 8 Stunden etc.\nStruktur: “hier Struktur / Aufbau der Reihe näher beschreiben”, z.B. Einführung & Abschlussstunde, wiederholende Übungsphasen, inklusive Test und Klassenarbeit\nUnterrichtsmethoden: “hier Unterrichtsmethoden nennen”, z.B. Gruppenarbeit, Einzelarbeit, Gruppenpuzzle, Partnerarbeit,\nOperatoren:* “hier gewünschte Operatoren nennen”*, z.B. nennen, beschreiben, analysieren, erstellen, erklären, erläutern etc."
  },
  {
    "id": "flick-sec-3-16",
    "number": "3.16",
    "icon": "⏲",
    "title": "️ Planung von Unterrichtsstunden",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT kann ebenso Unterrichtsstunden planen. Je genauer du deine didaktischen und methodischen Vorstellungen beschreibst, desto treffsicherer sind natürlich auch hier die Ergebnisse.",
    "prompts": [
      "Erstelle eine Planung für eine Unterrichtsstunde zu dem Thema “Rechte und Pflichten in der Ausbildung”",
      "Plane mir eine Übungsstunde zu dem Thema “Besitz und Eigentum”",
      "Plane eine Einführungsstunde über 90 Minuten zum Thema “AGB”",
      "Plane eine Kennenlernstunde für den ersten Schultag über 45 Minuten.",
      "Plane eine Kennenlernstunde für den ersten Schultag über 45 Minuten.",
      "Die Ergebnisse können nach meiner Erfahrung ungenau werden, wenn man bei der Planung zu viele didaktische und methodische Angaben auf einmal macht. In diesem Fall würde ich in kleineren Schritten vorgehen und die Planung nach und nach verfeinern. Dazu empfehle ich den Abschnitt ‣"
    ],
    "structuralTemplate": "Aufgabe: Erstelle eine Unterrichtsstunde zu dem Thema “dein Thema”\nInhalte: “hier Stundeninhalte nennen/ genauer beschreiben”\nZielgruppe: “hier Zielgruppe nennen”, z.B. Einzelhandelskaufleute, Abiturienten, etc.\nLänge: “Länge der Stunde angeben”, z.B. 90 Minuten, 45 Minuten etc.\nAufbau: “hier Struktur / Aufbau der Reihe näher beschreiben”, z.B. problemorientierte/ betriebliche / handlungsorientierte Einstiegssituationen, Situation, Erarbeitungsphase, Sicherung\nUnterrichtsphasen: “hier Unterrichtsphase genauer beschreiben”Informieren, Planen, Entscheiden, Ausführen, Kontrollieren, Bewerten etc.\nUnterrichtsmethoden: “hier Unterrichtsmethoden nennen”, z.B. Gruppenarbeit, Einzelarbeit, Gruppenpuzzle, Partnerarbeit"
  },
  {
    "id": "flick-sec-3-17",
    "number": "3.17",
    "icon": "🎉",
    "title": "Einstiege, Aktivierung & Planungsunterstützung",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT kann auch bei weiterer Planung rund um Unterricht unterstützen. Hier ein paar Beispiele:",
    "prompts": [
      "Erstelle eine komplette Planung für den letzten Schultag (5 Stunden)",
      "Erstelle mir eine Planung für eine Exkursion zu einem Betrieb inkl. Aufgabenliste.",
      "Erstelle einen Lernplan zur Klausurvorbereitung über eine Woche zum Thema Marketing."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-18",
    "number": "3.18",
    "icon": "🎊",
    "title": "Unterrichtsspiele & Unterstützung bei der Ideenfindung",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT lässt sich großartig zur Ideenfindung einsetzen. Hieraus ergeben sich viele Einsatzszenerien für die Unterrichtsplanung und -erstellung. Genauso kann ChatGPT hierzu gemeinsam mit den Schüler:innen im Unterricht zur Ideenfindung eingesetzt werden.",
    "prompts": [
      "Nenne mir 15 gesellschaftlich relevante Themen für eine Präsentation im Fach Englisch",
      "Nenne mir 10 spannende Titel für eine Unterrichtsreihe zum Thema Verkaufskalkulation",
      "“Titel nennen” -  Nenne mir 20 alternative Titel",
      "Stelle mir 20 Fragen, die ich bei der Planung einer Unterrichtsstunde berücksichtigen sollte",
      "Nenne mir 15 Aspekte, die ich bei einer Gedichtinterpretation beachten muss",
      "Gib mir 10 Fragen, die man bei einer Feedback-Runde stellen kann",
      "Schlage 10 innovative Unterrichtsmethoden vor",
      "Nenne innovative Technologien oder Tools für den Unterricht",
      "Schlage Ideen für außerschulische Aktivitäten oder Exkursionen vor",
      "Schlage Maßnahmen zur Förderung von Inklusion und Diversität vor"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-19",
    "number": "3.19",
    "icon": "🎭",
    "title": "Erstellung von Handlungssituationen",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT kann auch betriebliche Handlungssituationen erstellen. Die Situationen sind alles andere als perfekt, können aber eine gute Grundlage für den weiteren Erstellungsprozess darstellen.",
    "prompts": [
      "Erstelle eine betriebliche Handlungssituation zu dem Thema Kaufverträge",
      "Erstelle eine problemorientierte Handlungssituation, in der ein Auszubildender aus dem E-Commerce sich zwischen verschiedenen Online-Vertriebskanälen zum Verkauf von Smartphones und Tablets mithilfe einer Nutzwertanalyse entscheiden soll. Der Chef bittet am Ende den Auszubildenden, eine Empfehlung abzugeben (in wörtlicher Rede)."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-20",
    "number": "3.20",
    "icon": "📋",
    "title": "Erstellung von Arbeitsaufträgen",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "Auch Arbeitsaufträge, zum Beispiel für Handlungssituationen, kann ChatGPT formulieren.",
    "prompts": [
      "Erstelle eine Arbeitsauftrag zum Thema “Das ökonomisches Prinzip”.",
      "Erstelle einen Arbeitsauftrag zu dem Thema ökonomisches Prinzip für 90 Minuten mit einer Informationsphase, Anwendungsphase und Übungsphase.",
      "“Handlungssituation einfügen” Erstelle hierzu einen Arbeitsauftrag.",
      "“Informationstext einfügen” Erstelle hierzu einen Arbeitsauftrag.",
      "Operatoren: z.B. nennen, beschreiben, erklären etc.\nUmfang: z.B. 5 Schritte, 3 Aufgaben \nPhasen: Informieren, Planen, Entscheiden etc. \nZeitangabe: z.B. 90 Minuten\nZiel: “Stundenziel nennen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-21",
    "number": "3.21",
    "icon": "🧮",
    "title": "Erstellung von Aufgaben, Quizze und Lückentexten",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "Mit ChatGPT kannst du sehr zuverlässig Aufgaben für den Unterricht erstellen. ChatGPT kann offene und geschlossene Aufgaben kreieren, kennt Operatoren und kann mit Begriffen wie SC-Aufgaben oder Wahr-/Falsch-Fragen umgehen. Auch Quizze oder Lückentexte lassen sich zuverlässig erstellen.",
    "prompts": [
      "Erstelle eine Aufgabe zu dem Thema Wirtschaftskreislauf",
      "Erstelle 5 Aufgaben zu dem Thema Betriebsrat mit Lösung",
      "Erstelle 3 Aufgaben zu dem Thema Produktionsfaktoren mit dem Operator “Erläutern”",
      "Erstelle 3 anspruchsvolle SC-Aufgaben zu dem Thema SWOT-Analyse mit Lösung",
      "Erstelle 10 Wahr-Falsch-Fragen zu dem Thema Sortimentsgestaltung im Einzelhandel",
      "Erstelle 10 Wahr-Falsch-Fragen zu diesem Text “Text einfügen”",
      "Erstelle 2 Szenario-Aufgaben zum Thema Sachmangel mit Lösung",
      "Erstelle einen Aufgabe, in der man Paare bilden muss! Thema: “Thema Nennen” Nutze folgendes Format: “Beispiel geben”",
      "Erstelle eine Aufgabe zum Thema “Verkaufsgespräche führen”, bei der die verschiedenen Schritte in die richtige Reihenfolge gebracht werden müssen",
      "Erstelle ein einfaches Quiz mit 10 Fragen zum Thema Annahmeverzug",
      "Erstelle ein Quiz mit 10 Fragen zu dem Thema Sozialversicherungen. Die Fragen sollen mit Ja oder Nein zu beantworten sein. (+Lösung)",
      "Erstelle ein Quiz zu dem nachfolgenden Text. Bitte 5 Fragen mit jeweils 4 Antwortmöglichkeiten.\n\n”Text einfügen”",
      "Erstelle einen Lückentext zu dem Thema Arbeitssicherheit mit 5 Lücken + Lösungen"
    ],
    "structuralTemplate": "Erstelle einen Lückentext in englischer Sprache. Die Lücken sollen auf Präpositionen beziehen. \nInhalt: Sustainability\nSonstiges: Liste die Lösungen auf.\n\nAufgabe: Erstelle eine (zwei, fünf, zehn…) Aufgabe(n) zu dem Thema “Thema nennen”\nInhalt: “hier Inhalte genauer beschreiben”\nTyp: “Aufgabentyp nennen”, z.B. SC-Aufgabe, MC-Aufgabe mit 5 Antwortmöglichkeiten, Lückentext, mit Operator nennen (beschreiben, erklären, erläutern), Wahr-Falsch-Fragen\nSonstiges: z.B. mit Lösung, mit Erläuterung, mit ausführlicher Antwort"
  },
  {
    "id": "flick-sec-3-22",
    "number": "3.22",
    "icon": "🎯",
    "title": "Erstellung von Erwartungshorizonten",
    "category": "III. Unterrichtsplanung & -vorbereitung",
    "didacticTip": "ChatGPT kann Erwartungshorizonte erstellen, die dann bei der Bewertung unterstützend herangezogen werden können.",
    "prompts": [
      "Erstelle einen Erwartungshorizont zu einer Beschwerde-E-Mail für den Englischunterricht",
      "Betrachte den nachfolgenden Kommentar. Welche Position wird vertreten und wie wird sie durch Argumente, Beispiele und den Schreibstil unterstützt? Erstelle dazu einen Erwartungshorizont",
      "Betrachte den nachfolgenden wissenschaftlichen Aufsatz und erstelle dazu einen Erwartungshorizont. Welche These oder Hypothese wird vorgestellt und wie wird sie durch Belege und Argumente gestützt?\n””“Text einfügen”””",
      "Untersuche den nachfolgenden Werbetext und erstelle dazu einen Erwartungshorizont. Welches Produkt oder welche Dienstleistung wird beworben und welche sprachlichen Mittel werden verwendet, um den Leser zu überzeugen?",
      "Erstelle einen Erwartungshorizont für eine Erörterung. Formuliere die Anforderungen für die Noten 1 - 5. Unterscheide zwischen inhaltlichen und sprachlichen Aspekten.\n\nThema: “Fragestellung formulieren”"
    ],
    "structuralTemplate": "Erstelle einen Erwartungshorizont zu folgender Aufgabe: Analysieren Sie die aktuelle konjunkturelle Lage anhand von Konjunkturindikatoren\n\nErstelle einen Erwartungshorizont zu folgender Aufgabe:\n”Wählen Sie im Rahmen der Nutzwertanalyse geeignete Kriterien aus, mit deren Hilfe die Angebote verglichen werden sollen (Grundlage z.B. Angaben der Unter­nehmens­leitung, Unter­nehmensprofil etc.).”\n\nErstelle einen Erwartungshorizont zu folgender Aufgabe:\n”Nennen Sie ökonomische, ökologische und gesellschaftliche Einflüsse, die Auswirkung auf ihre Planung haben.”\n\nBeziehe folgenden Kontext mit ein: “Kontext nennen, Handlungssituation, o.ä. einfügen”"
  },
  {
    "id": "flick-sec-3-23",
    "number": "3.23",
    "icon": "🎓",
    "title": "Feedback zu Texten einholen",
    "category": "IV. Feedback & Bewertung",
    "didacticTip": "KI kann Feedback zu selbst geschriebenen Texten geben. Im nächsten Schritt können die Texte dann auf Basis des Feedbacks überarbeitet werden.",
    "prompts": [
      "Gib Rückmeldung zu dem nachfolgenden Text. gehe auf folgende Kriterien ein.\n\n”Kriterien nennen”, z.B.\n- Inhalt\n- Sprache\n- Argumentation\n- Struktur\n- …\n\n”Text einfügen”",
      "Analysiere den nachfolgenden Text und gib Feedback zu\n\n”Kriterien nennen”, z.B.\n- Inhalt\n- Sprache\n- Argumentation\n- Struktur\n\n”Text einfügen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-24",
    "number": "3.24",
    "icon": "👍",
    "title": "Bewertung von Texten durch die KI",
    "category": "IV. Feedback & Bewertung",
    "didacticTip": "ChatGPT kann Texte ebenso potenziell bewerten.",
    "prompts": [
      "“Text einfügen” Bewerte den Text und begründe.",
      "“Text einfügen” Bewerte den Text mit einer Note von 1 bis 15 Punkte",
      "“Text einfügen” Bewerte den Text mit einer Skala von 100% und begründe.",
      "Beachte, dass ChatGPT Fehler macht und Ungenauigkeiten auftreten. KI-Ergebnisse müssen deshalb immer kritisch geprüft werden! Die Bewertungshoheit liegt weiterhin bei der Lehrkraft und kann nicht an KI ausgelagert werden."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-25",
    "number": "3.25",
    "icon": "📬",
    "title": "Erstellung von E-Mails",
    "category": "V. Schul- & Elternkommunikation",
    "didacticTip": "ChatGPT kann natürlich auch E-Mails verfassen. Die generierten E-Mails können nicht nur für den Unterricht (z.B. im Rahmen von beruflichen Handlungssituationen oder im Fremdsprachenbereich), sondern auch im Rahmen schulischer Kommunikation genutzt werden.",
    "prompts": [
      "Schreibe mir eine E-Mail, die folgende Aspekte berücksichtigt: “Aspekte nennen”",
      "Erstelle mir eine E-Mail, in der ich die Ausbildungsbetriebe über die Sportfahrt informiert werden. Gehe auf folgende Punkte ein: “Punkte nennen”",
      "Erstelle mir eine E-Mail in freundlichem Ton. Sage darin deine Teilnahme an der Fortbildung aus privaten Gründen ab. Beziehe dich auf folgenden E-Mail \n\n“E-Mail einfügen”",
      "Write an Enquiry. Consider the following aspects: “name aspects”"
    ],
    "structuralTemplate": "Aufgabe: Schreibe mir eine E-Mail zu dem Thema “Thema nennen”\nBetreff: “hier Betreff angeben”\nInhalt: “hier Inhalt der Mail genauer beschreiben”\n…"
  },
  {
    "id": "flick-sec-3-26",
    "number": "3.26",
    "icon": "🗂",
    "title": "️ Korrespondenz neben dem Unterricht",
    "category": "V. Schul- & Elternkommunikation",
    "didacticTip": "ChatGPT lässt sich auch großartig für Aufgaben abseits des Unterrichts verwenden. Dazu zählen unter anderem das Erstellen von Informationsschreiben an Eltern, Empfehlungsschreiben oder Anmeldelisten sowie zur Vorbereitung auf Exkursionen oder Elternabende.",
    "prompts": [
      "Erstelle ein Informationsschreiben für die Eltern meiner Schüler:innen zu dem Thema “Thema nennen”. Gehe auf folgende Punkte ein: “Aspekte stichpunktartig nennen”",
      "Erstelle ein Empfehlungsschreiben für “Thema nennen” Berücksichtige folgende Kenntnisse und Fähigkeiten:  “Kenntnisse und Fähigkeiten nennen”",
      "Erstelle eine Anmeldeliste für “Veranstaltung nennen” in Tabellenform. Bitte berücksichtige die Zeilen Name, Thema und Datum. Nummeriere 20 Zeilen. Die Tabelle soll noch nicht ausgefüllt sein.",
      "Erstelle einen Einleitungstext für eine Anmeldungsliste zu “Veranstaltung nennen” Gehe auf folgende Punkte ein: “Aspekte stichpunktartig nennen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-27",
    "number": "3.27",
    "icon": "🎙",
    "title": "️ Vorstellungs- und Prüfungsgespräche simulieren",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "ChatGPT kann als Gesprächspartner:in eingesetzt werden. Die KI nimmt dabei eine Rolle ein und stellt uns Fragen aus der Rolle heraus. Es lassen sich dadurch unter anderem Vorstellungs- und Prüfungsgespräche simulieren.",
    "prompts": [
      "Handle so, als ob du mit mir ein Vorstellungsgespräch führen würdest.\n\nIch bewerbe mich auf eine Stelle als “Stelle nennen”.  Ich bin der Bewerber.",
      "Handle so, als ob du mit mir die mündliche Abschlussprüfung für den Ausbildungsberuf “Kaufmann/-frau für E-Commerce” durchführen würdest. Du bist die Prüferin und heißt Frau Sieber. Ich werde geprüft."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-28",
    "number": "3.28",
    "icon": "🤖",
    "title": "KI interviewen und befragen",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "ChatGPT kann Rollen einnehmen und antwortet dann aus dieser Rolle heraus. In diesem Rahmen lassen sich Personen zu allen möglichen Themen befragen. Hieraus ergeben sich zahlreiche Möglichkeiten für den Unterricht in nahezu allen Fächern.",
    "prompts": [
      "Stelle dir vor du bist “Beruf nennen”. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist ein Arbeiter zu Zeiten der Industriellen Revolution in England. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist eine Historikerin, der sich auf das antike Rom spezialisiert hat. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist ein Spitzensportlerin im Fußball. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist ein professioneller Musiker und trittst in einer berühmten Band auf. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist eine Frauen- und Menschenrechtsaktivistin aus dem Iran. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du lebst in Nordkorea. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist Willy Brandt. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist ein Umweltschützer, der sich für den Schutz bedrohter Tierarten einsetzt. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus.",
      "Stelle dir vor du bist Expertin für Nachhaltigkeit. Ich stelle dir Fragen und du antwortest mir aus deiner Rolle heraus"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-29",
    "number": "3.29",
    "icon": "🎤",
    "title": "ChatGPT als Quizmaster einsetzen",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "Mit dem nachfolgenden Prompt kannst du ChatGPT ganz einfach die Rolle eines Quizmasters zuweisen. Die KI stellt dann nacheinander Fragen. Das Thema legst du fest. Oder du stellt dein Unterrichtsmaterial in ChatGPT bereit und lässt dazu ein Quiz erstellen! Eignet sich super für eine Wiederholung, Ergebnissicherung oder zur Klausurvorbereitung!",
    "prompts": [
      "Erstelle mir ein Quiz. Du bist der Quizmaster und stellst Fragen. Immer nur eine Frage! Warte immer meine Eingabe ab!"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-30",
    "number": "3.30",
    "icon": "🧮",
    "title": "Einsatz für Rechenoperationen und Erklärungen (Mathematik)",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "ChatGPT arbeitet grundsätzlich textbasiert, kann jedoch auch mathematische Berechnungen zuverlässig durchführen. Dabei greift ChatGPT mittlerweile auf ein integriertes Python-Skript zurück. So lassen sich beispielsweise Gleichungen lösen, komplexe Rechenvorgänge ausführen oder Funktionen grafisch darstellen. Darüber hinaus eignet sich ChatGPT auch zur verständlichen Erklärung mathematischer Konzepte und Zusammenhänge.",
    "prompts": [
      "Was ist 2+2?",
      "Was ist 123*(40+21)",
      "Löse die Gleichung nach x auf: x^2+3x-2",
      "Stelle die Funktion x^2 grafisch dar.",
      "Erkläre das Konzept von Brüchen und wie man sie addiert und subtrahiert",
      "Stelle dir vor du bist eine Mathelehrerin. Erkläre mir Schritt für Schritt wie man diese Gleichung löst “Gleichung einfügen”",
      "Stelle dir vor du bist eine Lehrkraft für Statistik. Erkläre mir ausführlich, wie wahrscheinlich die Augenzahl 7 auftritt, wenn ich mit 2 Würfeln würfle.",
      "Stelle dir vor du bist ein Mathelehrer. Erkläre mir wie man das Volumen eines Quaders berechnet."
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-31",
    "number": "3.31",
    "icon": "🗣",
    "title": "️ Übersetzung von Texten in verschiedene Sprachen  (Fremdsprache)",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "ChatGPT kann Texte in verschiedene Sprachen übersetzen. Dies lässt sich wiederum im Fremdsprachenbereich aber natürlich auch darüber hinaus im Rahmen der Unterrichtsvorbereitung einsetzen.",
    "prompts": [
      "Übersetze diesen Text in “Sprache einfügen” - “Text einfügen”",
      "Erstelle einen Text zu dem Thema “Thema nennen” in Deutsch und in Englisch",
      "Was heißt “Guten Morgen” auf Spanisch?",
      "Bitte diesen Absatz in Deutsch und Spanisch übersetzen - “Absatz einfügen”"
    ],
    "structuralTemplate": null
  },
  {
    "id": "flick-sec-3-32",
    "number": "3.32",
    "icon": "💬",
    "title": "Aufbau von Wortschatz (Fremdsprache)",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "Mit ChatGPT kannst du natürlich auch schnell und einfach Wort- und Vokabellisten erstellen. Genauso lassen sich Redewendungen auflisten. Dies eignet sich natürlich super für den Fremdsprachenunterricht oder zur Sprachbildung.",
    "prompts": [
      "Erstelle eine Vokabelliste zu dem Thema Telephoning (Deutsch - Englisch)",
      "“Text einfügen” - Erstelle hieraus eine Vokabelliste (Deutsch - Französisch)",
      "Erstelle eine Liste mit Satzanfängen für ein Diskussion in Deutsch und Englisch",
      "Erstelle eine Liste mit Redewendungen im Business-Kontext auf Englisch",
      "Angaben zum Sprachniveau auf Basis des Europäischen Referenzrahmens (Niveau A1, A2, B1, B2, C1, C2) versteht ChatGPT, die Ergebnisse sind aber nicht immer treffsicher. Bei der Angabe “Level A1” ist schon ein sprachlicher Unterschied zu “Level C2” zu erkennen. Leider kann man aber nicht davon ausgehen, dass ChatGPT immer zuverlässig das genaue Sprachniveau trifft."
    ],
    "structuralTemplate": "Aufgabe: Erstelle eine “Art der Liste” zu dem Thema “dein Thema”"
  },
  {
    "id": "flick-sec-3-33",
    "number": "3.33",
    "icon": "🎉",
    "title": "Unterstützung bei Grammatik (Fremdsprache)",
    "category": "VI. Simulationen, Rollenspiele & Quizze",
    "didacticTip": "ChatGPT lässt sich im Fremdsprachenunterricht auch als Assistenz für Grammatik heranziehen.",
    "prompts": [
      "Erkläre den Unterschied zwischen some und any",
      "Erstelle 10 Beispiel-Sätze im Present Perfect auf Englisch",
      "Erstelle eine Übung zu Simple Past auf Englisch (Level A1) + Lösung",
      "Erstelle eine Übung zu Präpositionen (Lückentext) auf Englisch",
      "“Text einfügen” Schreibe den Text ins Passive Voice",
      "Angaben zum Sprachniveau auf Basis des Europäischen Referenzrahmens (Niveau A1, A2, B1, B2, C1, C2) versteht ChatGPT, die Ergebnisse sind aber nicht immer treffsicher. Bei der Angabe “Level A1” ist beispielsweise schon ein deutlicher Unterschied zu “Level b2” zu erkennen. Man kann jedoch nicht davon ausgehen, dass ChatGPT immer zuverlässig das exakte Sprachniveau trifft."
    ],
    "structuralTemplate": null
  }
];
