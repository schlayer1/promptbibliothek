import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptGrid } from './components/library/PromptGrid';
import { PromptDetailModal } from './components/library/PromptDetailModal';
import { PromptEditorModal } from './components/library/PromptEditorModal';
import { ImportExportModal } from './components/library/ImportExportModal';
import { LiveTestarea } from './components/playground/LiveTestarea';
import { PromptOptimizerModal } from './components/playground/PromptOptimizerModal';
import { FlickGuideBrowser } from './components/flick/FlickGuideBrowser';
import { FlickModularBuilderModal } from './components/flick/FlickModularBuilderModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PinLoginModal } from './components/auth/PinLoginModal';
import { Toast, ToastProps } from './components/common/Toast';
import { useAuth } from './context/AuthContext';
import { 
  PromptTemplate, 
  FilterOptions 
} from './types/prompt';
import { 
  loadPromptsFromCloud, 
  savePromptToCloud, 
  deletePromptFromCloud, 
  togglePromptVisibility, 
  forkPromptToUser, 
  addColleagueTipToPrompt, 
  getUserFavorites, 
  toggleUserFavorite 
} from './services/firebase';

export const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, openLoginModal } = useAuth();

  // State für alle Prompts
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => getUserFavorites());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Navigation
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    searchQuery: '',
    subject: 'all',
    grade: 'all',
    afb: 'all',
    tab: 'school'
  });

  // Testarea State
  const [testareaText, setTestareaText] = useState<string>('');
  const [testareaTitle, setTestareaTitle] = useState<string>('');

  // Modals
  const [selectedDetailPrompt, setSelectedDetailPrompt] = useState<PromptTemplate | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState<boolean>(false);
  const [isModularBuilderOpen, setIsModularBuilderOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ title: string; message?: string; type?: ToastProps['type'] } | null>(null);

  const showToast = useCallback((title: string, message?: string, type?: ToastProps['type']) => {
    setToast({ title, message, type });
  }, []);

  // Prompts laden
  const refreshPrompts = useCallback(async () => {
    setIsLoading(true);
    const data = await loadPromptsFromCloud();
    setPrompts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshPrompts();
  }, [refreshPrompts]);

  // Tab Counts
  const counts = useMemo(() => {
    const schoolCount = prompts.filter(p => p.visibility === 'school').length;
    const myCount = prompts.filter(p => currentUser ? p.authorId === currentUser.id : p.visibility === 'private').length;
    const favCount = prompts.filter(p => favorites.includes(p.id)).length;
    return {
      school: schoolCount,
      myPrompts: myCount,
      favorites: favCount
    };
  }, [prompts, currentUser, favorites]);

  // Gefilterte Prompts für das Grid
  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      // 1. Tab Filter
      if (filterOptions.tab === 'school') {
        if (p.visibility !== 'school') return false;
      } else if (filterOptions.tab === 'my-prompts') {
        if (currentUser) {
          if (p.authorId !== currentUser.id && p.visibility !== 'private') return false;
        } else {
          if (p.visibility !== 'private') return false;
        }
      } else if (filterOptions.tab === 'favorites') {
        if (!favorites.includes(p.id)) return false;
      }

      // 2. Kategorie Filter
      if (filterOptions.category !== 'all' && p.category !== filterOptions.category) {
        return false;
      }

      // 3. Fach Filter
      if (filterOptions.subject !== 'all' && p.subject !== filterOptions.subject) {
        return false;
      }

      // 4. Klassenstufe Filter
      if (filterOptions.grade !== 'all') {
        if (!p.gradeLevels || !p.gradeLevels.includes(filterOptions.grade)) {
          return false;
        }
      }

      // 5. AFB Filter
      if (filterOptions.afb !== 'all') {
        if (!p.afbLevels || !p.afbLevels.includes(filterOptions.afb as any)) {
          return false;
        }
      }

      // 6. Volltextsuche
      if (filterOptions.searchQuery.trim()) {
        const q = filterOptions.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesText = p.templateText.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesSubject = p.subject?.toLowerCase().includes(q) || false;
        const matchesAuthor = p.authorName.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesText && !matchesTags && !matchesSubject && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [prompts, filterOptions, currentUser, favorites]);

  // Favoriten Toggle
  const handleToggleFavorite = (id: string) => {
    const updated = toggleUserFavorite(id);
    setFavorites(updated);
    showToast('Favoriten aktualisiert', undefined, 'info');
  };

  // Freigabe umschalten (Sharing-Workflow)
  const handleToggleShare = async (id: string, newVisibility: 'school' | 'private') => {
    await togglePromptVisibility(id, newVisibility);
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, visibility: newVisibility } : p));
    showToast(
      newVisibility === 'school' ? 'Für Kollegium freigegeben!' : 'Zurückgezogen',
      newVisibility === 'school' 
        ? 'Dieser Prompt ist jetzt für alle Lehrkräfte in der Kollegiumsbibliothek sichtbar.'
        : 'Der Prompt ist nun wieder nur in deinem privaten Bereich abgelegt.',
      'success'
    );
  };

  // Prompt forken (in eigenen Bereich kopieren)
  const handleFork = async (prompt: PromptTemplate) => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    const forked = await forkPromptToUser(prompt, currentUser);
    setPrompts(prev => [forked, ...prev]);
    showToast('Kopie erstellt!', `"${prompt.title}" liegt nun als bearbeitbare Vorlage in deinem Bereich.`, 'success');
  };

  // Prompt speichern (Editor)
  const handleSavePrompt = async (saved: PromptTemplate) => {
    const res = await savePromptToCloud(saved);
    setPrompts(prev => {
      const exists = prev.some(p => p.id === res.id);
      if (exists) {
        return prev.map(p => p.id === res.id ? res : p);
      }
      return [res, ...prev];
    });
  };

  // Prompt löschen
  const handleDeletePrompt = async (id: string) => {
    if (confirm('Möchtest du diesen Prompt wirklich löschen?')) {
      await deletePromptFromCloud(id);
      setPrompts(prev => prev.filter(p => p.id !== id));
      showToast('Gelöscht', 'Prompt wurde entfernt.', 'info');
    }
  };

  // Praxistipp hinzufügen
  const handleAddTip = async (promptId: string, text: string) => {
    if (!currentUser) return;
    const newTip = await addColleagueTipToPrompt(promptId, text, currentUser);
    setPrompts(prev => prev.map(p => {
      if (p.id === promptId) {
        return {
          ...p,
          colleagueTips: p.colleagueTips ? [...p.colleagueTips, newTip] : [newTip]
        };
      }
      return p;
    }));
    // Auch im Detail-Modal aktualisieren
    if (selectedDetailPrompt && selectedDetailPrompt.id === promptId) {
      setSelectedDetailPrompt(prev => prev ? {
        ...prev,
        colleagueTips: prev.colleagueTips ? [...prev.colleagueTips, newTip] : [newTip]
      } : null);
    }
  };

  // Aus Detail in Testarea übertragen
  const handleRunInTestarea = (filledPromptText: string, title: string) => {
    setTestareaText(filledPromptText);
    setTestareaTitle(title);
    setFilterOptions(prev => ({ ...prev, tab: 'testarea' }));
    showToast('In Testarea geladen', 'Du kannst den Prompt jetzt direkt live ausführen.', 'info');
  };

  // Neuer Prompt erstellen
  const handleOpenNewPrompt = () => {
    setEditingPrompt(null);
    setIsEditorOpen(true);
  };

  // Aus Testarea als Prompt anlegen
  const handleSaveFromTestarea = (text: string, title?: string) => {
    setEditingPrompt({
      id: '',
      title: title || 'Neuer getesteter Prompt',
      description: 'Aus der Testarea generierter Prompt.',
      category: 'unterricht',
      tags: ['Testarea'],
      templateText: text,
      variables: [],
      visibility: 'private',
      authorId: currentUser?.id || 'gast',
      authorName: currentUser?.name || 'Lehrkraft',
      favoriteCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    setIsEditorOpen(true);
  };

  // Import von Notion Prompts
  const handleImportPrompts = async (newPrompts: PromptTemplate[]) => {
    for (const p of newPrompts) {
      await savePromptToCloud(p);
    }
    await refreshPrompts();
  };

  return (
    <div className="min-h-screen bg-school-surface text-school-textMain flex flex-col">
      {/* HEADER */}
      <Header
        currentTab={filterOptions.tab}
        onTabChange={(tab) => setFilterOptions(prev => ({ ...prev, tab }))}
        onOpenNewPrompt={handleOpenNewPrompt}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
        onOpenModularBuilder={() => setIsModularBuilderOpen(true)}
        promptCount={counts}
      />

      {/* MAIN VIEW */}
      <main className="flex-1 pb-20">
        {filterOptions.tab === 'testarea' ? (
          <LiveTestarea
            initialPromptText={testareaText}
            initialPromptTitle={testareaTitle}
            promptsList={prompts}
            onSaveAsPrompt={handleSaveFromTestarea}
            onShowToast={showToast}
          />
        ) : filterOptions.tab === 'flickGuide' ? (
          <FlickGuideBrowser
            onRunInTestarea={handleRunInTestarea}
            onAdoptAsTemplate={(text, title) => handleSaveFromTestarea(text, title)}
            onOpenModularBuilder={() => setIsModularBuilderOpen(true)}
          />
        ) : (
          <PromptGrid
            prompts={filteredPrompts}
            userFavorites={favorites}
            filterOptions={filterOptions}
            onFilterChange={(newOpts) => setFilterOptions(prev => ({ ...prev, ...newOpts }))}
            onToggleFavorite={handleToggleFavorite}
            onOpenDetail={(p) => setSelectedDetailPrompt(p)}
            onOpenTestarea={(p) => handleRunInTestarea(p.templateText, p.title)}
            onEdit={(p) => {
              setEditingPrompt(p);
              setIsEditorOpen(true);
            }}
            onDelete={handleDeletePrompt}
            onToggleShare={handleToggleShare}
            onFork={handleFork}
            onOpenNewPrompt={handleOpenNewPrompt}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Staatliche Regelschule Heimbürgeschule Kahla &bull; KI-Promptbibliothek für das Kollegium
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span>Stand: Version 1.0</span>
            <span>&bull;</span>
            <span>100% DSGVO-konform</span>
            <span>&bull;</span>
            <span>Google Gemini Flash & ChatGPT Standard</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <PromptDetailModal
        prompt={selectedDetailPrompt}
        isOpen={Boolean(selectedDetailPrompt)}
        onClose={() => setSelectedDetailPrompt(null)}
        onRunInTestarea={handleRunInTestarea}
        onAddTip={handleAddTip}
        onShowToast={showToast}
      />

      <PromptEditorModal
        initialPrompt={editingPrompt}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
        onShowToast={showToast}
      />

      <PromptOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        onTakeToEditor={(title, text) => {
          setEditingPrompt({
            id: '',
            title,
            description: 'Didaktisch optimierter Prompt.',
            category: 'unterricht',
            tags: ['Prompt-Tuner'],
            templateText: text,
            variables: [],
            visibility: 'private',
            authorId: currentUser?.id || 'gast',
            authorName: currentUser?.name || 'Lehrkraft',
            favoriteCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          setIsEditorOpen(true);
        }}
        onTakeToTestarea={(text, title) => {
          handleRunInTestarea(text, title);
        }}
        onShowToast={showToast}
      />

      <FlickModularBuilderModal
        isOpen={isModularBuilderOpen}
        onClose={() => setIsModularBuilderOpen(false)}
        onRunInTestarea={handleRunInTestarea}
        onSaveAsTemplate={(text, title) => handleSaveFromTestarea(text, title)}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        prompts={prompts}
        onImportPrompts={handleImportPrompts}
        onShowToast={showToast}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onShowToast={showToast}
      />

      <PinLoginModal
        onShowToast={showToast}
      />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
