import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Firestore,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { PortalUser } from '../types/user';
import { PromptTemplate, ColleagueTip } from '../types/prompt';
import { FLICK_STARTER_PROMPTS } from '../data/flickStarterPrompts';

// Offizielle Firebase Konfiguration des HBS App-Portals (terminkalender-7f269)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAr8Q3RslUSuaJbIIGiINGV24nm26jYoLQ",
  authDomain: "terminkalender-7f269.firebaseapp.com",
  projectId: "terminkalender-7f269",
  storageBucket: "terminkalender-7f269.firebasestorage.app",
  messagingSenderId: "919163141331",
  appId: "1:919163141331:web:12c659f5c2946e7c7e2826"
};

export const MASTER_ADMIN_PIN = "Year2003?!%";
export const PROMPTS_COLLECTION = "hbs_prompt_library";
export const AUTH_USER_KEY = 'hbs_current_portal_user_v1';
export const LOCAL_PROMPTS_KEY = 'hbs_prompt_library_local_cache_v1';
export const FAVORITES_KEY = 'hbs_prompt_user_favorites_v1';

// Initial seed teachers matching official Heimbürgeschule Kollegiumsliste
export const INITIAL_SEED_TEACHERS: PortalUser[] = [
  { id: "t-allerdt", name: "Allerdt", pin: "6300", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-dengler", name: "Dengler", pin: "8991", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-funk", name: "Funk", pin: "1091", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-graefe", name: "Gräfe", pin: "6169", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-gruchmann", name: "Gruchmann", pin: "4444", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-haase", name: "Haase", pin: "8511", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-halm", name: "Halm", pin: "1350", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-herold", name: "Herold", pin: "2116", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-illessy", name: "Illessy", pin: "2479", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-keim", name: "Keim", pin: "9672", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-keller", name: "Keller", pin: "6079", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-kleinfeld", name: "Kleinfeld", pin: "5901", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koenig", name: "König", pin: "2699", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koenitzern", name: "Könitzer N", pin: "2535", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-koentizert", name: "Könitzer T", pin: "7909", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-mange", name: "Mange", pin: "3518", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-meier", name: "Meier", pin: "8652", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-nn", name: "nn", pin: "1266", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-nowak", name: "Nowak", pin: "6652", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-ottma", name: "Ottma", pin: "7710", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-petzold", name: "Petzold", pin: "6244", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-piel", name: "Piel", pin: "8814", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schirmer", name: "Schirmer", pin: "8386", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schmidt", name: "Schmidt", pin: "6403", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-schwappach", name: "Schwappach", pin: "7673", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-seifert", name: "Seifert", pin: "3314", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-surowy", name: "Surowy", pin: "9330", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-teubert", name: "Teubert", pin: "5812", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-thum", name: "Thum", pin: "2012", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-vogel", name: "Vogel", pin: "1027", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-voigt", name: "Voigt", pin: "5067", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-wagner", name: "Wagner", pin: "7734", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-weber", name: "Weber", pin: "2540", role: "teacher", active: true, createdAt: Date.now() },
  { id: "t-wesely", name: "Wesely", pin: "7484", role: "teacher", active: true, createdAt: Date.now() }
];

export let db: Firestore | null = null;

try {
  const app = getApps().length === 0 ? initializeApp(DEFAULT_FIREBASE_CONFIG) : getApp();
  db = getFirestore(app);
} catch (err) {
  console.warn("[Firebase] Init-Warnung (Offline Cache aktiv):", err);
}

// --- AUTHENTIFIZIERUNG ---

export function getCachedCurrentUser(): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginWithPin(userId: string, pin: string): { success: boolean; user?: PortalUser; error?: string } {
  // 1. Admin Master-PIN
  if (pin === MASTER_ADMIN_PIN) {
    const target = INITIAL_SEED_TEACHERS.find(t => t.id === userId) || {
      id: "admin-master",
      name: "Schulleitung / Admin",
      pin: MASTER_ADMIN_PIN,
      role: "admin" as const,
      active: true,
      createdAt: Date.now()
    };
    const adminUser: PortalUser = { ...target, role: "admin" };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
    return { success: true, user: adminUser };
  }

  // 2. Lehrer-PIN prüfen
  const teacher = INITIAL_SEED_TEACHERS.find(t => t.id === userId);
  if (!teacher) {
    return { success: false, error: "Lehrkraft nicht gefunden." };
  }

  if (teacher.pin !== pin.trim()) {
    return { success: false, error: "Ungültige 4-stellige PIN." };
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(teacher));
  return { success: true, user: teacher };
}

export function loginAsGuest(): PortalUser {
  const guestUser: PortalUser = {
    id: "guest-" + Math.random().toString(36).substring(2, 7),
    name: "Gast (Kollegium)",
    pin: "",
    role: "guest",
    active: true,
    createdAt: Date.now()
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(guestUser));
  return guestUser;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

// --- PROMPTS LADEN & SPEICHERN ---

export async function loadPromptsFromCloud(): Promise<PromptTemplate[]> {
  const localList = getLocalPrompts();

  if (!db) {
    return localList.length > 0 ? localList : FLICK_STARTER_PROMPTS;
  }

  try {
    const colRef = collection(db, PROMPTS_COLLECTION);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const cloudPrompts: PromptTemplate[] = [];
    snapshot.forEach(docSnap => {
      cloudPrompts.push(docSnap.data() as PromptTemplate);
    });

    if (cloudPrompts.length > 0) {
      // Zusammenführen mit lokalen Prompts (z.B. Offline-Entwürfe)
      const mergedMap = new Map<string, PromptTemplate>();
      cloudPrompts.forEach(p => mergedMap.set(p.id, p));
      localList.forEach(p => {
        if (!mergedMap.has(p.id)) {
          mergedMap.set(p.id, p);
        }
      });
      const combined = Array.from(mergedMap.values());
      localStorage.setItem(LOCAL_PROMPTS_KEY, JSON.stringify(combined));
      return combined;
    } else {
      // Wenn Firestore-Kollektion noch leer ist, Seed-Prompts initial hochladen
      for (const p of FLICK_STARTER_PROMPTS) {
        savePromptToCloud(p).catch(() => {});
      }
      return FLICK_STARTER_PROMPTS;
    }
  } catch (err) {
    console.warn("[Firebase] Fehler beim Laden aus Firestore, greife auf Cache zurück:", err);
  }

  return localList.length > 0 ? localList : FLICK_STARTER_PROMPTS;
}

export async function savePromptToCloud(prompt: PromptTemplate): Promise<PromptTemplate> {
  const now = Date.now();
  const updatedPrompt: PromptTemplate = {
    ...prompt,
    updatedAt: now,
    createdAt: prompt.createdAt || now
  };

  // 1. In lokalem Backup speichern
  try {
    const local = getLocalPrompts();
    const updated = [updatedPrompt, ...local.filter(p => p.id !== updatedPrompt.id)];
    localStorage.setItem(LOCAL_PROMPTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("[LocalCache] Speicher-Warnung:", e);
  }

  // 2. In Firebase Firestore speichern
  if (db) {
    try {
      const docRef = doc(db, PROMPTS_COLLECTION, updatedPrompt.id);
      await setDoc(docRef, updatedPrompt, { merge: true });
      console.log(`[Firebase] Prompt "${updatedPrompt.title}" erfolgreich gespeichert.`);
    } catch (err) {
      console.warn("[Firebase] Konnte nicht in Firestore schreiben (nutze lokalen Cache):", err);
    }
  }

  return updatedPrompt;
}

export async function deletePromptFromCloud(id: string): Promise<boolean> {
  // 1. Aus lokalem Cache entfernen
  try {
    const local = getLocalPrompts().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_PROMPTS_KEY, JSON.stringify(local));
  } catch {}

  // 2. Aus Firestore löschen
  if (db) {
    try {
      const docRef = doc(db, PROMPTS_COLLECTION, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn("[Firebase] Fehler beim Löschen aus Firestore:", err);
    }
  }
  return true;
}

// --- FREIGABE-WORKFLOW ---

export async function togglePromptVisibility(promptId: string, targetVisibility: 'school' | 'private'): Promise<void> {
  const local = getLocalPrompts();
  const p = local.find(x => x.id === promptId);
  if (p) {
    p.visibility = targetVisibility;
    p.updatedAt = Date.now();
    await savePromptToCloud(p);
  }
}

export async function forkPromptToUser(prompt: PromptTemplate, user: PortalUser): Promise<PromptTemplate> {
  const newId = `fork_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const forked: PromptTemplate = {
    ...prompt,
    id: newId,
    title: `${prompt.title} (Meine Version)`,
    authorId: user.id,
    authorName: user.name,
    visibility: 'private',
    forkedFromId: prompt.id,
    favoriteCount: 0,
    colleagueTips: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  return await savePromptToCloud(forked);
}

export async function addColleagueTipToPrompt(promptId: string, tipText: string, user: PortalUser): Promise<ColleagueTip> {
  const newTip: ColleagueTip = {
    id: `tip_${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    text: tipText.trim(),
    createdAt: Date.now()
  };

  // Lokal aktualisieren
  const local = getLocalPrompts();
  const target = local.find(p => p.id === promptId);
  if (target) {
    target.colleagueTips = target.colleagueTips ? [...target.colleagueTips, newTip] : [newTip];
    savePromptToCloud(target).catch(() => {});
  }

  // Cloud aktualisieren
  if (db) {
    try {
      const docRef = doc(db, PROMPTS_COLLECTION, promptId);
      await updateDoc(docRef, {
        colleagueTips: arrayUnion(newTip)
      });
    } catch (err) {
      console.warn("[Firebase] Konnte Tipp nicht in Cloud speichern:", err);
    }
  }

  return newTip;
}

export function getUserFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleUserFavorite(promptId: string): string[] {
  const current = getUserFavorites();
  let updated: string[];
  if (current.includes(promptId)) {
    updated = current.filter(id => id !== promptId);
  } else {
    updated = [...current, promptId];
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

function getLocalPrompts(): PromptTemplate[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
