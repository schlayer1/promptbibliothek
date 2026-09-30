# HBS Promptbibliothek

> **Pädagogische KI-Prompt-Zentrale für das Kollegium der Staatlichen Regelschule Heimbürgeschule Kahla**  
> Konzipiert für den flexiblen Einsatz mit jedem beliebigen KI-Modell (ChatGPT, Google Gemini, Claude, Microsoft Copilot, Fobizz).

---

## 🌟 Echter Mehrwert für den Schulalltag

1. **Dynamische Variablen-Formulare (Mad-Libs)**:
   - Platzhalter wie `[Fach]`, `[Klassenstufe]`, `[Thema]`, `[Niveau]` werden beim Anklicken automatisch zu intuitiven Dropdowns und Textfeldern.
   - Der finale Prompt wird in Echtzeit live zusammengesetzt – kein lästiges manuelles Suchen und Ersetzen von eckigen Klammern mehr.

2. **Integrierte Live-Testarea mit Google Gemini Kaskade**:
   - Prompts können direkt im Browser risikofrei mit der schuleigenen Gemini-Kaskade (`gemini-flash-lite-latest`, `gemini-3-flash-preview`) getestet werden.
   - Sofort einsatzbereit dank automatischem HBS-Schulschlüssel-Fallback oder optionalem persönlichen API-Key.
   - Mit Antwortzeit-Messung, Token-Schätzung und Regenerierungs-Funktion.

3. **DSGVO- & Schülerdaten-Scanner (Privacy Guard)**:
   - Erkennt vor dem Kopieren oder Ausführen automatisch Klarnamen von Schülern, Noten, sensible sonderpädagogische Diagnosen oder Kontaktdaten.
   - Warnt mit konkreten Anonymisierungs-Tipps (z. B. Pseudonyme wie *Schüler A* oder *Schülerin B* nutzen).

4. **1-Klick „KI-Prompt-Tuner“**:
   - Verwandelt rohe, unausgereifte Gedanken per Knopfdruck in didaktisch strukturierte Prompts nach KMK-Operatoren und Regelschul-Standards.

5. **Multi-KI Launcher & Export**:
   - Direkte 1-Klick-Buttons: *„In ChatGPT öffnen“*, *„In Claude öffnen“*, *„In Copilot öffnen“*.
   - Vollständiger Import und Export von Notion-Guides, Markdown-Dokumentationen und JSON-Backups.

6. **Zweistufiger Speicher- & Freigabe-Workflow**:
   - **Kollegiums-Bibliothek (`school`)**: Gemeinsamer Fundus an praxiserprobten Prompts für alle Kolleginnen und Kollegen.
   - **Mein persönlicher Bereich (`private`)**: Eigene Entwürfe und Anpassungen, gesichert über die 4-stellige HBS-Lehrer-PIN.
   - **1-Klick-Aktionen**: Prompts forken (*„In meinen Bereich kopieren“*) und freigeben (*„Mit Kollegium teilen“*).

7. **Kuratierter Manuel Flick Starter-Katalog**:
   - Enthält die didaktischen Top-Prompts aus dem bewährten *„ChatGPT-Guide für Lehrkräfte“* von Manuel Flick für Unterrichtsentwürfe, Differenzierung nach AFB I–III, Kriterienraster, Elternbriefe, Leichte Sprache und Zeugnisphrasen.

---

## 🚀 Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

---

## ☁️ Deployment auf Vercel

1. Repository auf GitHub mit Vercel verknüpfen: [schlayer1/promptbibliothek](https://github.com/schlayer1/promptbibliothek)
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. *(Optional)* Umgebungsvariable in den Vercel Project Settings hinterlegen:
   - `VITE_GEMINI_API_KEY`: Eigener Gemini API-Key (falls der integrierte Schulschlüssel ergänzt werden soll).

---

## 🏫 Design System & Philosophie

Basiert auf den Designvorgaben der **Heimbürgeschule Kahla** (`DESIGN.md`):
* Primärfarbe: HBS Cerulean (`#006185` / `#0b7ba7`)
* Sekundärfarbe: HBS Teal (`#006b5f` / `#00a896`)
* Akzentfarbe: Warm Marigold (`#854d00` / `#f39200`)
* Typografie: **Plus Jakarta Sans**
* 100% DSGVO-konform, offlinefähig mit lokalem Cache-Fallback.
