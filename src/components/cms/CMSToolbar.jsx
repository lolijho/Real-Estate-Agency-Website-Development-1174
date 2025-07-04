import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';

const { 
  FiEdit3, 
  FiEye, 
  FiSettings, 
  FiSave, 
  FiDownload, 
  FiUpload,
  FiGithub,
  FiX,
  FiCheck,
  FiPalette,
  FiCode,
  FiRefreshCw
} = FiIcons;

const CMSToolbar = () => {
  const { isAdmin } = useAuth();
  const { 
    isEditMode, 
    setIsEditMode, 
    exportContent, 
    importContent,
    commitToGitHub,
    loadFromGitHub,
    siteSettings,
    getSectionColors,
    updateSectionColors,
    getSectionCustomCSS,
    updateSectionCustomCSS
  } = useCMS();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showSectionCustomizer, setShowSectionCustomizer] = useState(false);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) return null;

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleExport = () => {
    const data = exportContent();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
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
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        importContent(data);
        alert('Contenuti importati con successo!');
      } catch (error) {
        alert('Errore nel file di importazione');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToGitHub = async () => {
    if (!siteSettings.github.token) {
      alert('Configura il token GitHub nelle impostazioni');
      setShowSettings(true);
      return;
    }

    setIsSaving(true);
    try {
      await commitToGitHub({
        content: exportContent(),
        message: `CMS Update: ${new Date().toISOString()}`
      });
      alert('Modifiche salvate su GitHub!');
    } catch (error) {
      alert('Errore nel salvataggio: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLoadFromGitHub = async () => {
    if (!siteSettings.github.token) {
      alert('Configura il token GitHub nelle impostazioni');
      setShowSettings(true);
      return;
    }

    if (!confirm('Questo sovrascriverà i contenuti locali con quelli da GitHub. Continuare?')) {
      return;
    }

    setIsLoading(true);
    try {
      await loadFromGitHub(siteSettings.github);
      alert('Contenuti caricati da GitHub con successo!');
      // Ricarica la pagina per applicare i nuovi contenuti
      window.location.reload();
    } catch (error) {
      alert('Errore nel caricamento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-lg border-b border-gray-200"
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">CMS Admin</span>
              <div className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>

            <div className="flex items-center space-x-2">
              {/* Toggle Edit Mode */}
              <button
                onClick={handleToggleEdit}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isEditMode
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <SafeIcon icon={isEditMode ? FiEye : FiEdit3} className="h-4 w-4" />
                <span>{isEditMode ? 'Anteprima' : 'Modifica'}</span>
              </button>

              {/* Section Customizer */}
              <button
                onClick={() => setShowSectionCustomizer(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                title="Personalizza Sezioni"
              >
                <SafeIcon icon={FiPalette} className="h-4 w-4" />
                <span>Colori & CSS</span>
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                title="Esporta contenuti"
              >
                <SafeIcon icon={FiDownload} className="h-4 w-4" />
                <span>Esporta</span>
              </button>

              {/* Import */}
              <label className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition-colors cursor-pointer">
                <SafeIcon icon={FiUpload} className="h-4 w-4" />
                <span>Importa</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Load from GitHub */}
              <button
                onClick={handleLoadFromGitHub}
                disabled={isLoading || !siteSettings.github.token}
                className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                title="Carica da GitHub"
              >
                <SafeIcon icon={isLoading ? FiRefreshCw : FiDownload} className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Caricando...' : 'Sync'}</span>
              </button>
              
              {/* Save to GitHub */}
              <button
                onClick={handleSaveToGitHub}
                disabled={isSaving || !siteSettings.github.token}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                title="Salva su GitHub"
              >
                <SafeIcon icon={isSaving ? FiSave : FiGithub} className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Salvando...' : 'Push'}</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                title="Impostazioni"
              >
                <SafeIcon icon={FiSettings} className="h-4 w-4" />
                <span>Impostazioni</span>
              </button>
            </div>
          </div>

          {/* Edit Mode Notice */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  Modalità editing attiva - Clicca su testi e immagini per modificarli
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Settings Modal */}
      <CMSSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Section Customizer Modal */}
      <SectionCustomizer
        isOpen={showSectionCustomizer}
        onClose={() => setShowSectionCustomizer(false)}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      {/* Spacer when toolbar is visible */}
      <div className="h-[72px]" />
    </>
  );
};

// Componente Settings Modal
const CMSSettings = ({ isOpen, onClose }) => {
  const { siteSettings, updateSiteSettings } = useCMS();
  const [formData, setFormData] = useState(siteSettings);

  const handleSave = () => {
    // Aggiorna tutte le categorie
    Object.keys(formData).forEach(category => {
      Object.keys(formData[category]).forEach(field => {
        updateSiteSettings(category, field, formData[category][field]);
      });
    });
    onClose();
  };

  const handleChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Impostazioni CMS</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Dati Aziendali */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dati Aziendali</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Azienda</label>
                      <input
                        type="text"
                        value={formData.company.name}
                        onChange={(e) => handleChange('company', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.company.email}
                        onChange={(e) => handleChange('company', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                      <input
                        type="tel"
                        value={formData.company.phone}
                        onChange={(e) => handleChange('company', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sito Web</label>
                      <input
                        type="url"
                        value={formData.company.website}
                        onChange={(e) => handleChange('company', 'website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
                      <input
                        type="text"
                        value={formData.company.address}
                        onChange={(e) => handleChange('company', 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* GitHub Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Configurazione GitHub</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Token GitHub</label>
                      <input
                        type="password"
                        value={formData.github.token}
                        onChange={(e) => handleChange('github', 'token', e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Token per commit automatici. Richiede permessi di scrittura al repository.
                        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          Crea token →
                        </a>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                        <input
                          type="text"
                          value={formData.github.owner}
                          onChange={(e) => handleChange('github', 'owner', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repository</label>
                        <input
                          type="text"
                          value={formData.github.repo}
                          onChange={(e) => handleChange('github', 'repo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <input
                          type="text"
                          value={formData.github.branch}
                          onChange={(e) => handleChange('github', 'branch', e.target.value)}
                          placeholder="main"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.github.autoSave}
                            onChange={(e) => handleChange('github', 'autoSave', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Auto-save</span>
                        </label>
                        <div className="ml-2 group relative">
                          <SafeIcon icon={FiSettings} className="h-4 w-4 text-gray-400" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Salva automaticamente ogni modifica su GitHub (5s delay)
                          </div>
                        </div>
                      </div>
                    </div>
                    {formData.github.token && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-800">GitHub configurato correttamente</span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Repository: {formData.github.owner}/{formData.github.repo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Salva Impostazioni
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente Section Customizer Modal
const SectionCustomizer = ({ isOpen, onClose, selectedSection, setSelectedSection }) => {
  const { 
    getSectionColors, 
    updateSectionColors, 
    getSectionCustomCSS, 
    updateSectionCustomCSS,
    getContent,
    updateContent
  } = useCMS();

  const [currentColors, setCurrentColors] = useState({});
  const [currentCSS, setCurrentCSS] = useState('');

  // Sezioni disponibili
  const sections = [
    { id: 'hero', name: 'Hero', description: 'Sezione principale in cima' },
    { id: 'properties', name: 'Immobili', description: 'Sezione immobili in evidenza' },
    { id: 'services', name: 'Servizi', description: 'Sezione servizi offerti' },
    { id: 'about', name: 'Chi Siamo', description: 'Sezione informazioni azienda' },
    { id: 'contact', name: 'Contatti', description: 'Sezione contatti e form' },
    { id: 'footer', name: 'Footer', description: 'Piè di pagina' }
  ];

  // Colori di default per ogni sezione
  const getDefaultColors = (sectionId) => {
    const defaults = {
      hero: {
        background: '#ffffff',
        text: '#1f2937',
        accent: '#3b82f6',
        overlay: '#000000',
        boxBackground: '#ffffff',
        buttonPrimary: '#3b82f6',
        buttonSecondary: '#6b7280'
      },
      properties: {
        background: '#f9fafb',
        text: '#1f2937',
        accent: '#3b82f6',
        cardBackground: '#ffffff',
        price: '#059669'
      },
      services: {
        background: '#ffffff',
        text: '#1f2937',
        accent: '#3b82f6',
        cardBackground: '#f9fafb'
      },
      about: {
        background: '#f9fafb',
        text: '#1f2937',
        accent: '#3b82f6'
      },
      contact: {
        background: '#ffffff',
        text: '#1f2937',
        accent: '#3b82f6',
        formBackground: '#f9fafb'
      },
      footer: {
        background: '#1f2937',
        text: '#ffffff',
        accent: '#3b82f6'
      }
    };
    return defaults[sectionId] || {};
  };

  // Carica colori e CSS quando cambia sezione
  React.useEffect(() => {
    if (selectedSection) {
      const colors = getSectionColors(selectedSection, getDefaultColors(selectedSection));
      const css = getSectionCustomCSS(selectedSection);
      setCurrentColors(colors);
      setCurrentCSS(css);
    }
  }, [selectedSection, getSectionColors, getSectionCustomCSS]);

  const handleColorChange = (colorKey, value) => {
    const newColors = { ...currentColors, [colorKey]: value };
    setCurrentColors(newColors);
    updateSectionColors(selectedSection, newColors);
  };

  const handleCSSChange = (value) => {
    setCurrentCSS(value);
    updateSectionCustomCSS(selectedSection, value);
  };

  const handleResetColors = () => {
    const defaultColors = getDefaultColors(selectedSection);
    setCurrentColors(defaultColors);
    updateSectionColors(selectedSection, defaultColors);
  };

  const handleResetCSS = () => {
    setCurrentCSS('');
    updateSectionCustomCSS(selectedSection, '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full">
              {/* Sidebar - Lista Sezioni */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Sezioni</h3>
                  <p className="text-sm text-gray-600">Seleziona una sezione da personalizzare</p>
                </div>
                <div className="p-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                        selectedSection === section.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{section.name}</div>
                      <div className={`text-sm ${
                        selectedSection === section.id ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {section.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content - Personalizzazione */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personalizza: {sections.find(s => s.id === selectedSection)?.name}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                      <SafeIcon icon={FiX} className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Colori</h3>
                      <button
                        onClick={handleResetColors}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        <SafeIcon icon={FiRefreshCw} className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(currentColors).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Background Image Section for Hero */}
                  {selectedSection === 'hero' && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Immagine di Sfondo</h3>
                      </div>
                      <BackgroundImageEditor sectionId="hero" />
                    </div>
                  )}

                  {/* CSS Custom */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">CSS Personalizzato</h3>
                      <button
                        onClick={handleResetCSS}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        <SafeIcon icon={FiRefreshCw} className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <textarea
                        value={currentCSS}
                        onChange={(e) => handleCSSChange(e.target.value)}
                        placeholder={`/* CSS per la sezione ${selectedSection} */\n.${selectedSection}-section {\n  /* Le tue regole CSS qui */\n}`}
                        className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500">
                        Il CSS inserito verrà applicato solo a questa sezione. Usa <code>!important</code> per sovrascrivere stili esistenti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Componente per modificare l'immagine di sfondo
const BackgroundImageEditor = ({ sectionId }) => {
  const { getContent, updateContent } = useCMS();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = React.useRef(null);

  const currentImageUrl = getContent(sectionId, 'backgroundImage', '');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Importa le utility di upload
      const { uploadImage, validateImageFile, createImagePreview } = await import('../../api/upload');
      
      // Valida il file
      validateImageFile(file);
      
      setIsUploading(true);
      
      // Crea anteprima immediata
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
      
      // Upload su Vercel Blob
      const uploadedUrl = await uploadImage(file);
      
      // Salva l'URL permanente
      updateContent(sectionId, 'backgroundImage', uploadedUrl);
      
      setPreviewUrl(null);
      setIsUploading(false);
      
    } catch (error) {
      console.error('Errore upload immagine:', error);
      alert(`Errore: ${error.message}`);
      setPreviewUrl(null);
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (url) => {
    if (url.trim() && url !== currentImageUrl) {
      updateContent(sectionId, 'backgroundImage', url.trim());
    }
  };

  const handleRemoveImage = () => {
    updateContent(sectionId, 'backgroundImage', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Anteprima immagine corrente */}
      {(previewUrl || currentImageUrl) && (
        <div className="relative">
          <img
            src={previewUrl || currentImageUrl}
            alt="Anteprima sfondo"
            className="w-full h-32 object-cover rounded-lg border border-gray-300"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <SafeIcon icon={FiUpload} className="h-6 w-6 animate-pulse mx-auto mb-1" />
                <p className="text-sm">Caricamento su Vercel Blob...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 mx-auto"
        >
          <SafeIcon icon={FiUpload} className="h-4 w-4" />
          <span>Carica Nuova Immagine</span>
        </button>
        <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP - Max 10MB (salvato su Vercel Blob)</p>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Oppure inserisci URL:</label>
        <UrlImageInput 
          initialValue={currentImageUrl}
          onSubmit={handleUrlSubmit}
          disabled={isUploading}
        />
      </div>

      {/* Remove button */}
      {currentImageUrl && (
        <button
          onClick={handleRemoveImage}
          disabled={isUploading}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Rimuovi Immagine
        </button>
      )}
    </div>
  );
};

// Componente helper per input URL immagine
const UrlImageInput = ({ initialValue, onSubmit, disabled }) => {
  const [url, setUrl] = useState(initialValue || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://esempio.com/immagine.jpg"
        disabled={disabled}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <SafeIcon icon={FiCheck} className="h-3 w-3" />
        <span>Applica</span>
      </button>
    </form>
  );
};

export default CMSToolbar;