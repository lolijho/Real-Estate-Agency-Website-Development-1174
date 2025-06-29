import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
      token: '',
      repo: 'Real-Estate-Agency-Website-Development-1174',
      owner: 'lolijho'
    },
    social: {
      facebook: '',
      instagram: '',
      linkedin: ''
    }
  });

  // Carica contenuti dal localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('cms-content');
    const savedSettings = localStorage.getItem('cms-settings');
    
    if (savedContent) {
      try {
        setEditingContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Errore caricamento contenuti CMS:', error);
      }
    }
    
    if (savedSettings) {
      try {
        setSiteSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Errore caricamento impostazioni CMS:', error);
      }
    }
  }, []);

  // Salva contenuti nel localStorage
  const saveContentLocally = (content) => {
    localStorage.setItem('cms-content', JSON.stringify(content));
  };

  const saveSettingsLocally = (settings) => {
    localStorage.setItem('cms-settings', JSON.stringify(settings));
  };

  // Aggiorna contenuto specifico
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
  };

  // Ottieni contenuto con fallback ai valori default
  const getContent = (sectionId, field, defaultValue = '') => {
    return editingContent[sectionId]?.[field] ?? defaultValue;
  };

  // Aggiorna impostazioni sito
  const updateSiteSettings = (category, field, value) => {
    const newSettings = {
      ...siteSettings,
      [category]: {
        ...siteSettings[category],
        [field]: value
      }
    };
    setSiteSettings(newSettings);
    saveSettingsLocally(newSettings);
  };

  // Commit su GitHub (da implementare)
  const commitToGitHub = async (changes) => {
    if (!siteSettings.github.token) {
      throw new Error('Token GitHub non configurato');
    }
    
    try {
      // TODO: Implementare GitHub API calls
      console.log('Committing to GitHub:', changes);
      return { success: true, message: 'Modifiche salvate su GitHub' };
    } catch (error) {
      console.error('Errore GitHub commit:', error);
      throw error;
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
    
    // Gestione impostazioni
    updateSiteSettings,
    
    // GitHub integration
    commitToGitHub,
    
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