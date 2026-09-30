export type PromptCategory = 
  | 'unterricht'
  | 'differenzierung'
  | 'orga'
  | 'eltern'
  | 'bewertung'
  | 'sonderpaedagogik'
  | 'methoden';

export interface PromptVariable {
  key: string;            // z.B. "fach"
  label: string;          // z.B. "Schulfach"
  type: 'text' | 'select' | 'textarea' | 'number';
  options?: string[];     // Dropdown-Werte
  defaultValue?: string;
  placeholder?: string;
}

export interface ColleagueTip {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  tags: string[];
  subject?: string;
  gradeLevels?: string[]; // ["5", "6", "7", "8", "9", "10"]
  afbLevels?: ('AFB I' | 'AFB II' | 'AFB III')[];
  
  systemInstruction?: string;
  templateText: string;   // Enthält Platzhalter wie [Fach], [Klassenstufe], [Thema]
  variables: PromptVariable[];
  
  // Sichtbarkeit & Kollaboration
  visibility: 'school' | 'private';
  authorId: string;
  authorName: string;
  source?: string;        // z.B. "Manuel Flick ChatGPT-Guide" oder "Kollegium HBS"
  forkedFromId?: string;  // Wenn aus Kollegiums-Bibliothek abgeleitet
  
  recommendedModel?: string; // z.B. "ChatGPT / Gemini Flash / Claude"
  favoriteCount: number;
  colleagueTips?: ColleagueTip[];
  
  createdAt: number;
  updatedAt: number;
}

export interface FilterOptions {
  category: string;
  searchQuery: string;
  subject: string;
  grade: string;
  afb: string;
  tab: 'school' | 'my-prompts' | 'favorites' | 'testarea';
}
