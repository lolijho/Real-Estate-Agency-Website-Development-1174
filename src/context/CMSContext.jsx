import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  settingsService, 
  createSettingsTable,
  cmsContentService,
  cmsImageService,
  initializeCMSTables
} from '../lib/database';

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
  const [isLoading, setIsLoading] = useState(true); // Inizia sempre con loading true
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(true); // Nuovo stato per il page loader
  const [lastSaved, setLastSaved] = useState(null);
  const [siteSettings, setSiteSettings] = useState({
    company: {
      name: 'Affitti Urbi',
      address: 'Via Milano 123, 20121 Milano MI',
      phone: '+39 02 1234567',
      email: 'info@affittiurbi.it',
      website: 'www.affittiurbi.it'
    },
    social: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Carica contenuti dal database Turso
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        
        // Inizializza tutte le tabelle necessarie
        await createSettingsTable();
        await initializeCMSTables();
        
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
            social: dbSettings.social || {
              facebook: '',
              instagram: '',
              linkedin: ''
            }
          };
          
          setSiteSettings(mergedSettings);
        } catch (error) {
          console.error('Errore caricamento impostazioni dal database:', error);
        }

        // Carica i contenuti CMS dal database
        try {
          const cmsContent = await cmsContentService.getAll();
          setEditingContent(cmsContent);
          console.log('Contenuti CMS caricati dal database:', Object.keys(cmsContent).length, 'sezioni');
        } catch (error) {
          console.error('Errore caricamento contenuti CMS dal database:', error);
          // Fallback al localStorage se il database non è disponibile
          if (typeof window !== 'undefined') {
            const savedContent = localStorage.getItem('cms-content');
            if (savedContent) {
              try {
                setEditingContent(JSON.parse(savedContent));
                console.log('Contenuti CMS caricati dal localStorage come fallback');
              } catch (error) {
                console.error('Errore caricamento contenuti CMS dal localStorage:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Errore inizializzazione CMS:', error);
      } finally {
        // Simula un caricamento minimo per mostrare il loader
        setTimeout(() => {
          setIsLoading(false);
          setIsInitialized(true);
          // Il PageLoader si nasconderà automaticamente quando isLoading diventa false
        }, 1500); // Minimo 1.5 secondi di caricamento
      }
    };
    
    loadContent();
  }, []);

  // Salva contenuti nel database con debounce
  const saveContentToDatabase = async (content) => {
    try {
      setIsLoading(true);
      
      // Salva ogni sezione nel database
      for (const [sectionId, sectionData] of Object.entries(content)) {
        if (sectionData && typeof sectionData === 'object') {
          await cmsContentService.setSection(sectionId, sectionData);
        }
      }
      
      setLastSaved(new Date());
      console.log('Contenuti salvati nel database con successo');
      
      // Mantieni anche il localStorage come backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms-content', JSON.stringify(content));
      }
      
      return true;
    } catch (error) {
      console.error('Errore salvataggio contenuti nel database:', error);
      
      // Fallback al localStorage se il database fallisce
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cms-content', JSON.stringify(content));
          console.log('Contenuti salvati nel localStorage come fallback');
        }
      } catch (localError) {
        console.error('Errore salvataggio contenuti CMS:', localError);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Salva impostazioni nel database
  const saveSettingsToDatabase = async (settings) => {
    try {
      // Salva nel database
      await settingsService.set('company', settings.company);
      await settingsService.set('social', settings.social);
      
      // Mantieni anche il localStorage come backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms-settings', JSON.stringify(settings));
      }
      
      console.log('Impostazioni salvate nel database con successo');
    } catch (error) {
      console.error('Errore salvataggio impostazioni nel database:', error);
      
      // Fallback al localStorage se il database non è disponibile
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cms-settings', JSON.stringify(settings));
          console.log('Impostazioni salvate nel localStorage come fallback');
        }
      } catch (localError) {
        console.error('Errore salvataggio impostazioni CMS:', localError);
      }
    }
  };

  // Aggiorna contenuto specifico con auto-save immediato
  const updateContent = async (sectionId, field, value) => {
    const newContent = {
      ...editingContent,
      [sectionId]: {
        ...editingContent[sectionId],
        [field]: value
      }
    };
    
    setEditingContent(newContent);
    
    // Salvataggio immediato nel database (senza timeout)
    try {
      console.log(`🔄 Salvando ${sectionId}.${field} nel database...`);
      await saveContentToDatabase(newContent);
      console.log(`✅ ${sectionId}.${field} salvato con successo!`);
    } catch (error) {
      console.warn('Salvataggio fallito:', error.message);
      
      // Fallback al localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cms-content', JSON.stringify(newContent));
          console.log('💾 Salvato nel localStorage come fallback');
        }
      } catch (localError) {
        console.error('Errore salvataggio locale:', localError);
      }
    }
  };

  // Salva manualmente tutti i contenuti
  const saveAllContent = async () => {
    try {
      await saveContentToDatabase(editingContent);
      return { success: true, message: 'Contenuti salvati con successo!' };
    } catch (error) {
      return { success: false, message: 'Errore nel salvataggio: ' + error.message };
    }
  };

  // Aggiorna colori di una sezione
  const updateSectionColors = async (sectionId, colors) => {
    await updateContent(sectionId, 'colors', colors);
  };

  // Ottieni colori di una sezione
  const getSectionColors = (sectionId, defaultColors = {}) => {
    return editingContent[sectionId]?.colors ?? defaultColors;
  };

  // Aggiorna CSS custom di una sezione
  const updateSectionCustomCSS = async (sectionId, css) => {
    await updateContent(sectionId, 'customCSS', css);
  };

  // Ottieni CSS custom di una sezione
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
    await saveSettingsToDatabase(newSettings);
  };

  // Esporta tutti i contenuti per backup
  const exportContent = () => {
    return {
      content: editingContent,
      settings: siteSettings,
      timestamp: new Date().toISOString(),
      version: '2.0' // Nuova versione con database
    };
  };

  // Importa contenuti da backup
  const importContent = async (data) => {
    try {
      if (data.content) {
        setEditingContent(data.content);
        await saveContentToDatabase(data.content);
      }
      if (data.settings) {
        setSiteSettings(data.settings);
        await saveSettingsToDatabase(data.settings);
      }
      return { success: true, message: 'Contenuti importati con successo!' };
    } catch (error) {
      return { success: false, message: 'Errore nell\'importazione: ' + error.message };
    }
  };

  // Crea backup completo
  const createBackup = async () => {
    try {
      const backup = {
        content: editingContent,
        settings: siteSettings,
        images: await cmsImageService.getAll(),
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cms-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Backup creato con successo!' };
    } catch (error) {
      return { success: false, message: 'Errore nella creazione del backup: ' + error.message };
    }
  };

  // Ripristina da backup
  const restoreFromBackup = async (file) => {
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      
      if (backup.content) {
        setEditingContent(backup.content);
        await saveContentToDatabase(backup.content);
      }
      
      if (backup.settings) {
        setSiteSettings(backup.settings);
        await saveSettingsToDatabase(backup.settings);
      }
      
      return { success: true, message: 'Backup ripristinato con successo!' };
    } catch (error) {
      return { success: false, message: 'Errore nel ripristino: ' + error.message };
    }
  };

  // Gestione immagini
  const uploadImage = async (file, sectionId, fieldName) => {
    try {
      // Qui implementeremo l'upload su Vercel Blob
      // Per ora usiamo un placeholder
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Errore nell\'upload dell\'immagine');
      }
      
      const result = await response.json();
      
      // Salva metadati nel database
      const imageData = {
        filename: result.filename,
        originalName: file.name,
        blobUrl: result.url,
        fileSize: file.size,
        mimeType: file.type,
        sectionId,
        fieldName
      };
      
      await cmsImageService.add(imageData);
      
      // Aggiorna il contenuto con l'URL dell'immagine
      await updateContent(sectionId, fieldName, result.url);
      
      return { success: true, url: result.url, message: 'Immagine caricata con successo!' };
    } catch (error) {
      return { success: false, message: 'Errore nel caricamento: ' + error.message };
    }
  };

  const value = {
    // Stato
    isEditMode,
    editingContent,
    siteSettings,
    lastSaved,
    
    // Controlli
    setIsEditMode: (mode) => setIsEditMode(isAdmin ? mode : false),
    
    // Gestione contenuti
    updateContent,
    getContent,
    saveAllContent,
    
    // Gestione colori e CSS
    updateSectionColors,
    getSectionColors,
    updateSectionCustomCSS,
    getSectionCustomCSS,
    
    // Gestione impostazioni
    updateSiteSettings,
    
    // Import/Export e Backup
    exportContent,
    importContent,
    createBackup,
    restoreFromBackup,
    
    // Gestione immagini
    uploadImage,
    
    // Utility
    canEdit: isAdmin && isEditMode,
    isInitialized, // Stato per prevenire flash
    isLoading, // Stato di caricamento per il PageLoader
    showPageLoader: isLoading // Mostra il PageLoader quando è in caricamento
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
};

export default CMSContext;

