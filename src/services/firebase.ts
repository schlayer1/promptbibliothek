import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query, 
  orderBy, 
  Firestore,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { formatTeacherName, PortalUser, TeacherGender } from '../types/user';
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

export const STATISTIK_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCnleowgQT4XoMK5P5b_t1uWYGsWoYxT80",
  authDomain: "statistik-91f25.firebaseapp.com",
  projectId: "statistik-91f25",
  storageBucket: "statistik-91f25.firebasestorage.app",
  messagingSenderId: "277742289737",
  appId: "1:277742289737:web:b87043732524cc283d5098"
};

const TEACHERS_CACHE_KEY = 'hbs_promptbibliothek_teachers_cache_v1';

export let db: Firestore | null = null;
export let statistikDb: Firestore | null = null;

try {
  const app = getApps().length === 0 ? initializeApp(DEFAULT_FIREBASE_CONFIG) : getApp();
  db = getFirestore(app);
} catch (err) {
  console.warn("[Firebase] Init-Warnung (Offline Cache aktiv):", err);
}

try {
  const existingStat = getApps().find(a => a.name === 'hbs-statistik-source');
  const statApp = existingStat || initializeApp(STATISTIK_FIREBASE_CONFIG, 'hbs-statistik-source');
  statistikDb = getFirestore(statApp);
} catch (err) {
  console.warn("[Firebase] Statistik-Init-Warnung:", err);
}

interface StatistikTeacherRaw {
  id?: string;
  name?: string;
  pin?: string;
  gender?: string;
  active?: boolean;
}

const normalizeGender = (val: unknown): TeacherGender => {
  if (val === 'f' || val === 'm' || val === 'd') return val;
  return '';
};

export function getCachedTeachers(): PortalUser[] {
  if (typeof window === 'undefined') return INITIAL_SEED_TEACHERS;
  try {
    const raw = localStorage.getItem(TEACHERS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_SEED_TEACHERS;
}

function setCachedTeachers(teachers: PortalUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHERS_CACHE_KEY, JSON.stringify(teachers));
  } catch {}
}

function mergeTeachers(baseUsers: PortalUser[], statistikList: StatistikTeacherRaw[]): PortalUser[] {
  const merged = baseUsers.map(u => ({ ...u }));
  statistikList.forEach(st => {
    const rawName = (st?.name || '').trim();
    if (!rawName || rawName.toLowerCase().includes('schulleitung')) return;

    const stId = st.id ? String(st.id).trim() : '';
    const cleanLower = rawName.toLowerCase();
    const idx = merged.findIndex(
      u =>
        (stId && (u.sourceTeacherId === stId || u.id === `t-${stId}` || u.id === stId)) ||
        u.name.trim().toLowerCase() === cleanLower
    );

    const rawPin = st.pin !== undefined && st.pin !== null ? String(st.pin).trim() : '';
    const validPin = /^\d{4,}$/.test(rawPin) ? rawPin : '';
    const hasGenderField = st.gender !== undefined && st.gender !== null;
    const incomingGender = normalizeGender(st.gender);
    const incomingActive = st.active !== false;

    if (idx >= 0) {
      const target = merged[idx];
      if (validPin) target.pin = validPin;
      if (hasGenderField) target.gender = incomingGender;
      target.name = rawName;
      target.active = incomingActive;
      if (stId) target.sourceTeacherId = stId;
    } else if (validPin) {
      merged.push({
        id: stId ? `t-${stId}` : `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceTeacherId: stId || undefined,
        name: rawName,
        gender: incomingGender,
        pin: validPin,
        role: 'teacher',
        active: incomingActive,
        createdAt: Date.now()
      });
    }
  });
  return merged;
}

async function fetchStatistikViaRest(): Promise<StatistikTeacherRaw[]> {
  try {
    const res = await fetch(
      'https://firestore.googleapis.com/v1/projects/statistik-91f25/databases/(default)/documents/schools/HBS'
    );
    if (!res.ok) return [];
    const docJson = await res.json();
    const values = docJson?.fields?.teachers?.arrayValue?.values;
    if (!Array.isArray(values)) return [];
    return values.map((v: any) => {
      const f = v?.mapValue?.fields || {};
      return {
        id: f.id?.stringValue ?? '',
        name: f.name?.stringValue ?? '',
        pin: f.pin?.stringValue ?? '',
        gender: f.gender?.stringValue ?? '',
        active: f.active?.booleanValue !== undefined ? Boolean(f.active.booleanValue) : true
      };
    });
  } catch {
    return [];
  }
}

export function subscribeToSyncedTeachers(callback: (teachers: PortalUser[]) => void): {
  refresh: () => Promise<void>;
  unsubscribe: () => void;
} {
  let latestBase: PortalUser[] = getCachedTeachers();
  let latestStatistik: StatistikTeacherRaw[] = [];
  let unsubPortal: (() => void) | null = null;
  let unsubStatistik: (() => void) | null = null;

  const emitMerged = () => {
    const next = mergeTeachers(latestBase, latestStatistik);
    setCachedTeachers(next);
    callback(next);
  };

  const refresh = async () => {
    const statList = await fetchStatistikViaRest();
    if (statList.length > 0) {
      latestStatistik = statList;
      emitMerged();
    }
  };

  if (db) {
    try {
      const portalRef = doc(db, "hbs_appportal", "portal_data");
      unsubPortal = onSnapshot(portalRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.users) && data.users.length > 0) {
            latestBase = data.users;
            emitMerged();
          }
        }
      }, () => {});
    } catch {}
  }

  if (statistikDb) {
    try {
      const statRef = doc(statistikDb, "schools", "HBS");
      unsubStatistik = onSnapshot(statRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.teachers)) {
            latestStatistik = data.teachers;
            emitMerged();
          }
        }
      }, () => {
        refresh();
      });
    } catch {
      refresh();
    }
  } else {
    refresh();
  }

  return {
    refresh,
    unsubscribe: () => {
      if (unsubPortal) unsubPortal();
      if (unsubStatistik) unsubStatistik();
    }
  };
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

export function loginWithPin(
  userId: string,
  pin: string,
  availableTeachers?: PortalUser[]
): { success: boolean; user?: PortalUser; error?: string } {
  const list = availableTeachers && availableTeachers.length > 0 ? availableTeachers : getCachedTeachers();

  // 1. Admin Master-PIN
  if (pin === MASTER_ADMIN_PIN) {
    const target = list.find(t => t.id === userId) || {
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
  const teacher = list.find(t => t.id === userId && t.active !== false);
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
    authorName: formatTeacherName(user),
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
    authorName: formatTeacherName(user),
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
