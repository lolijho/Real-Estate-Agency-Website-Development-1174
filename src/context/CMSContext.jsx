import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { settingsService, createSettingsTable } from '../lib/database';

const CMSContext = createContext();

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS deve essere usato all\'interno di CMSProvider');
  }
  return context;
};

export const CMSProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContent, setEditingContent] = useState({});
  const [siteSettings, setSiteSettings] = useState({
    company: {
      name: 'Affitti Urbi',
      address: 'Via Milano 123, 20121 Milano MI',
      phone: '+39 02 1234567',
      email: 'info@affittiurbi.it',
      website: 'www.affittiurbi.it'
    },
    github: {
      token: import.meta.env.VITE_GITHUB_TOKEN || '',
      repo: 'Real-Estate-Agency-Website-Development-1174',
      owner: 'lolijho',
      autoSave: false,
      branch: 'main'
    },
    social: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Funzione loadFromGitHub già definita sopra - rimuovo duplicato

  // Carica contenuti dal localStorage e database
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Inizializza la tabella settings se non esiste
        await createSettingsTable();
        
        if (typeof window !== 'undefined') {
          const savedContent = localStorage.getItem('cms-content');
          
          // Carica prima dal localStorage per i contenuti
          if (savedContent) {
            try {
              setEditingContent(JSON.parse(savedContent));
            } catch (error) {
              console.error('Errore caricamento contenuti CMS:', error);
            }
          }
          
          // Carica le impostazioni dal database
          try {
            const dbSettings = await settingsService.getAll();
            
            // Merge con le impostazioni di default
            const mergedSettings = {
              company: dbSettings.company || {
                name: 'Affitti Urbi',
                address: 'Via Milano 123, 20121 Milano MI',
                phone: '+39 02 1234567',
                email: 'info@affittiurbi.it',
                website: 'www.affittiurbi.it'
              },
              github: dbSettings.github || {
                token: import.meta.env.VITE_GITHUB_TOKEN || '',
                repo: 'Real-Estate-Agency-Website-Development-1174',
                owner: 'lolijho',
                autoSave: false,
                branch: 'main'
              },
              social: dbSettings.social || {
                facebook: '',
                instagram: '',
                linkedin: ''
              }
            };
            
            setSiteSettings(mergedSettings);
            
            // Se GitHub è configurato, prova a caricare da GitHub
            if (mergedSettings.github?.token && mergedSettings.github?.owner && mergedSettings.github?.repo) {
              try {
                await loadFromGitHub(mergedSettings.github);
              } catch (error) {
                console.warn('Caricamento da GitHub fallito, uso dati locali:', error.message);
              }
            }
          } catch (error) {
            console.error('Errore caricamento impostazioni dal database:', error);
            // Fallback al localStorage se il database non è disponibile
            const savedSettings = localStorage.getItem('cms-settings');
            if (savedSettings) {
              try {
                const settings = JSON.parse(savedSettings);
                setSiteSettings(settings);
              } catch (error) {
                console.error('Errore caricamento impostazioni CMS:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Errore accesso localStorage:', error);
      }
    };
    
    loadContent();
  }, []);

  // Salva contenuti nel localStorage
  const saveContentLocally = (content) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms-content', JSON.stringify(content));
      }
    } catch (error) {
      console.error('Errore salvataggio contenuti CMS:', error);
    }
  };

  const saveSettingsLocally = async (settings) => {
    try {
      // Salva nel database
      await settingsService.set('company', settings.company);
      await settingsService.set('github', settings.github);
      await settingsService.set('social', settings.social);
      
      // Mantieni anche il localStorage come backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms-settings', JSON.stringify(settings));
      }
    } catch (error) {
      console.error('Errore salvataggio impostazioni nel database:', error);
      // Fallback al localStorage se il database non è disponibile
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cms-settings', JSON.stringify(settings));
        }
      } catch (localError) {
        console.error('Errore salvataggio impostazioni CMS:', localError);
      }
    }
  };

  // Aggiorna contenuto specifico con auto-save su GitHub (opzionale)
  const updateContent = (sectionId, field, value) => {
    const newContent = {
      ...editingContent,
      [sectionId]: {
        ...editingContent[sectionId],
        [field]: value
      }
    };
    setEditingContent(newContent);
    saveContentLocally(newContent);
    
    // Auto-save su GitHub se configurato e abilitato
    if (siteSettings.github.token && siteSettings.github.autoSave) {
      // Debounce per evitare troppi commit
      clearTimeout(window.cmsAutoSaveTimeout);
      window.cmsAutoSaveTimeout = setTimeout(async () => {
        try {
          await commitToGitHub({
            message: `Auto-save: Updated ${sectionId}.${field}`
          });
        } catch (error) {
          console.warn('Auto-save GitHub fallito:', error.message);
        }
      }, 5000); // 5 secondi di debounce
    }
  };

  // --- NUOVO: Aggiorna colori di una sezione ---
  const updateSectionColors = (sectionId, colors) => {
    updateContent(sectionId, 'colors', colors);
  };

  // --- NUOVO: Ottieni colori di una sezione ---
  const getSectionColors = (sectionId, defaultColors = {}) => {
    return editingContent[sectionId]?.colors ?? defaultColors;
  };

  // --- NUOVO: Aggiorna CSS custom di una sezione ---
  const updateSectionCustomCSS = (sectionId, css) => {
    updateContent(sectionId, 'customCSS', css);
  };

  // --- NUOVO: Ottieni CSS custom di una sezione ---
  const getSectionCustomCSS = (sectionId) => {
    return editingContent[sectionId]?.customCSS ?? '';
  };

  // Ottieni contenuto con fallback ai valori default
  const getContent = (sectionId, field, defaultValue = '') => {
    return editingContent[sectionId]?.[field] ?? defaultValue;
  };

  // Aggiorna impostazioni sito
  const updateSiteSettings = async (category, field, value) => {
    const newSettings = {
      ...siteSettings,
      [category]: {
        ...siteSettings[category],
        [field]: value
      }
    };
    setSiteSettings(newSettings);
    await saveSettingsLocally(newSettings);
  };

  // Commit su GitHub con implementazione completa
  const commitToGitHub = async (changes) => {
    if (!siteSettings.github.token) {
      throw new Error('Token GitHub non configurato');
    }
    
    const { token, owner, repo } = siteSettings.github;
    
    try {
      // 1. Ottieni il SHA del branch main
      const branchResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!branchResponse.ok) {
        throw new Error(`Errore nel recupero del branch: ${branchResponse.statusText}`);
      }
      
      const branchData = await branchResponse.json();
      const latestCommitSha = branchData.object.sha;
      
      // 2. Crea il file JSON con i contenuti CMS (senza token sensibili)
      const safeSettings = {
        ...siteSettings,
        github: {
          ...siteSettings.github,
          token: '[HIDDEN]' // Non salvare il token nel repository
        }
      };
      
      const cmsData = {
        content: editingContent,
        settings: safeSettings,
        lastUpdate: new Date().toISOString(),
        version: '1.0'
      };
      
      const fileContent = btoa(JSON.stringify(cmsData, null, 2));
      
      // 3. Verifica se il file esiste già
      let existingFileSha = null;
      try {
        const fileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/cms-data.json`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          existingFileSha = fileData.sha;
        }
      } catch (error) {
        // File non esiste, continua senza SHA
      }
      
      // 4. Crea o aggiorna il file
      const commitData = {
        message: changes.message || `CMS Update: ${new Date().toLocaleString('it-IT')}`,
        content: fileContent,
        branch: 'main'
      };
      
      if (existingFileSha) {
        commitData.sha = existingFileSha;
      }
      
      const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/cms-data.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commitData)
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Errore nel commit: ${errorData.message || updateResponse.statusText}`);
      }
      
      const result = await updateResponse.json();
      
      return { 
        success: true, 
        message: 'Modifiche salvate su GitHub con successo!',
        commitSha: result.commit.sha,
        commitUrl: result.commit.html_url
      };
      
    } catch (error) {
      console.error('Errore GitHub commit:', error);
      throw new Error(`Errore nel salvataggio su GitHub: ${error.message}`);
    }
  };

  // Esporta tutti i contenuti per backup
  const exportContent = () => {
    return {
      content: editingContent,
      settings: siteSettings,
      timestamp: new Date().toISOString()
    };
  };

  // Carica contenuti da GitHub
  const loadFromGitHub = async (githubConfig) => {
    const { token, owner, repo } = githubConfig;
    
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/cms-data.json`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.ok) {
        const fileData = await response.json();
        const content = JSON.parse(atob(fileData.content));
        
        // Verifica che i dati siano validi
        if (content.content && content.settings) {
          setEditingContent(content.content);
          setSiteSettings(content.settings);
          saveContentLocally(content.content);
          saveSettingsLocally(content.settings);
          
          console.log('Contenuti caricati da GitHub con successo');
          return { success: true, message: 'Contenuti sincronizzati da GitHub' };
        }
      } else if (response.status === 404) {
        console.log('File cms-data.json non trovato su GitHub, uso dati locali');
        return { success: false, message: 'File non trovato su GitHub' };
      } else {
        throw new Error(`Errore HTTP: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Errore caricamento da GitHub:', error);
      throw new Error(`Impossibile caricare da GitHub: ${error.message}`);
    }
  };
  
  // Importa contenuti da backup
  const importContent = (data) => {
    if (data.content) {
      setEditingContent(data.content);
      saveContentLocally(data.content);
    }
    if (data.settings) {
      setSiteSettings(data.settings);
      saveSettingsLocally(data.settings);
    }
  };

  const value = {
    // Stato
    isEditMode,
    editingContent,
    siteSettings,
    
    // Controlli
    setIsEditMode: (mode) => setIsEditMode(isAdmin ? mode : false),
    
    // Gestione contenuti
    updateContent,
    getContent,
    // Nuovi metodi per colori e CSS custom
    updateSectionColors,
    getSectionColors,
    updateSectionCustomCSS,
    getSectionCustomCSS,
    
    // Gestione impostazioni
    updateSiteSettings,
    
    // GitHub integration
    commitToGitHub,
    loadFromGitHub,
    
    // Import/Export
    exportContent,
    importContent,
    
    // Utility
    canEdit: isAdmin && isEditMode
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;