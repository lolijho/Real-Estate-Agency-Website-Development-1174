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
  FiCheck
} = FiIcons;

const CMSToolbar = () => {
  const { isAdmin } = useAuth();
  const { 
    isEditMode, 
    setIsEditMode, 
    exportContent, 
    importContent,
    commitToGitHub,
    siteSettings
  } = useCMS();
  
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-lg border-b border-gray-200"
        style={{ height: '72px' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
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

              {/* Save to GitHub */}
              <button
                onClick={handleSaveToGitHub}
                disabled={isSaving}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                title="Salva su GitHub"
              >
                <SafeIcon icon={isSaving ? FiSave : FiGithub} className={`h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Salvando...' : 'GitHub'}</span>
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

export default CMSToolbar; 