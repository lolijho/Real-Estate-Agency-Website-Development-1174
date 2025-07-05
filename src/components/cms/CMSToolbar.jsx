import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit3, 
  FiEye, 
  FiSettings, 
  FiSave, 
  FiDownload, 
  FiUpload,
  FiX,
  FiCheck,
  FiDroplet,
  FiCode,
  FiDatabase,
  FiClock,
  FiCheckCircle,
  FiImage
} from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';
import { useAuth } from '../../context/AuthContext';
import HeroImageEditor from './HeroImageEditor';

const CMSToolbar = () => {
  const { isAdmin } = useAuth();
  const { 
    isEditMode, 
    setIsEditMode, 
    exportContent, 
    importContent,
    saveAllContent,
    createBackup,
    restoreFromBackup,
    siteSettings,
    getSectionColors,
    updateSectionColors,
    getSectionCustomCSS,
    updateSectionCustomCSS,
    isLoading,
    lastSaved
  } = useCMS();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showSectionCustomizer, setShowSectionCustomizer] = useState(false);
  const [showHeroImageEditor, setShowHeroImageEditor] = useState(false);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleExport = () => {
    const data = exportContent();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('Contenuti esportati con successo!', 'success');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const result = await importContent(data);
          showMessage(result.message, result.success ? 'success' : 'error');
        } catch (error) {
          showMessage('Errore nell\'importazione del file', 'error');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveAllContent();
      showMessage(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showMessage('Errore nel salvataggio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const result = await createBackup();
      showMessage(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      showMessage('Errore nella creazione del backup', 'error');
    }
  };

  const handleRestoreBackup = (event) => {
    const file = event.target.files[0];
    if (file) {
      restoreFromBackup(file).then(result => {
        showMessage(result.message, result.success ? 'success' : 'error');
      });
    }
    event.target.value = '';
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Mai salvato';
    const now = new Date();
    const diff = now - lastSaved;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Salvato ora';
    if (minutes === 1) return 'Salvato 1 minuto fa';
    if (minutes < 60) return `Salvato ${minutes} minuti fa`;
    
    return lastSaved.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Toolbar: visibile solo per admin */}
      {isAdmin && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">CMS Admin</span>
              {isLoading && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <SafeIcon icon={FiDatabase} className="w-4 h-4 animate-pulse" />
                  <span className="text-xs">Sincronizzazione...</span>
                </div>
              )}
              {lastSaved && !isLoading && (
                <div className="flex items-center space-x-1 text-green-600">
                  <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
                  <span className="text-xs">{formatLastSaved()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Pulsante Modifica/Visualizza */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleEdit}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditMode 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <SafeIcon icon={isEditMode ? FiEye : FiEdit3} className="w-4 h-4" />
                <span>{isEditMode ? 'Visualizza' : 'Modifica'}</span>
              </motion.button>

              {/* Pulsante Colori & CSS */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSectionCustomizer(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              >
                <SafeIcon icon={FiDroplet} className="w-4 h-4" />
                <span>Colori & CSS</span>
              </motion.button>

              {/* Pulsante Hero Image */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHeroImageEditor(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
              >
                <SafeIcon icon={FiImage} className="w-4 h-4" />
                <span>Hero Image</span>
              </motion.button>

              {/* Pulsante Esporta */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Esporta</span>
              </motion.button>

              {/* Pulsante Importa */}
              <label className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer">
                <SafeIcon icon={FiUpload} className="w-4 h-4" />
                <span>Importa</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Pulsante Salva */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <SafeIcon icon={isSaving ? FiClock : FiSave} className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Salvando...' : 'Salva'}</span>
              </motion.button>

              {/* Pulsante Backup */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateBackup}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
              >
                <SafeIcon icon={FiDatabase} className="w-4 h-4" />
                <span>Backup</span>
              </motion.button>

              {/* Pulsante Ripristina */}
              <label className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors cursor-pointer">
                <SafeIcon icon={FiUpload} className="w-4 h-4" />
                <span>Ripristina</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  className="hidden"
                />
              </label>

              {/* Pulsante Impostazioni */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <SafeIcon icon={FiSettings} className="w-4 h-4" />
                <span>Impostazioni</span>
              </motion.button>
            </div>
          </div>

          {/* Messaggio di stato */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`px-4 py-2 text-sm text-center ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal Impostazioni: sempre accessibile */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Impostazioni CMS</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Dati Aziendali */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Dati Aziendali</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Azienda
                      </label>
                      <input
                        type="text"
                        value={siteSettings.company?.name || ''}
                        onChange={(e) => updateSiteSettings('company', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={siteSettings.company?.email || ''}
                        onChange={(e) => updateSiteSettings('company', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefono
                      </label>
                      <input
                        type="tel"
                        value={siteSettings.company?.phone || ''}
                        onChange={(e) => updateSiteSettings('company', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sito Web
                      </label>
                      <input
                        type="url"
                        value={siteSettings.company?.website || ''}
                        onChange={(e) => updateSiteSettings('company', 'website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Indirizzo
                      </label>
                      <input
                        type="text"
                        value={siteSettings.company?.address || ''}
                        onChange={(e) => updateSiteSettings('company', 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={siteSettings.social?.facebook || ''}
                        onChange={(e) => updateSiteSettings('social', 'facebook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={siteSettings.social?.instagram || ''}
                        onChange={(e) => updateSiteSettings('social', 'instagram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={siteSettings.social?.linkedin || ''}
                        onChange={(e) => updateSiteSettings('social', 'linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Informazioni Sistema */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Informazioni Sistema</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Versione CMS:</span>
                        <span className="ml-2 text-gray-800">2.0 (Database)</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Ultimo salvataggio:</span>
                        <span className="ml-2 text-gray-800">{formatLastSaved()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Storage:</span>
                        <span className="ml-2 text-gray-800">Database Turso + Vercel Blob</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Auto-save:</span>
                        <span className="ml-2 text-green-600">Attivo (2s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    showMessage('Impostazioni salvate automaticamente!', 'success');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salva Impostazioni
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Personalizzazione Sezioni */}
      <AnimatePresence>
        {showSectionCustomizer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSectionCustomizer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personalizzazione Sezioni</h2>
                <button
                  onClick={() => setShowSectionCustomizer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Selettore Sezione */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleziona Sezione</h3>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hero">Hero Section</option>
                    <option value="about">Chi Siamo</option>
                    <option value="services">Servizi</option>
                    <option value="properties">Proprietà</option>
                    <option value="contact">Contatti</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                {/* CSS Personalizzato */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">CSS Personalizzato</h3>
                  <textarea
                    value={getSectionCustomCSS(selectedSection)}
                    onChange={(e) => updateSectionCustomCSS(selectedSection, e.target.value)}
                    placeholder="Inserisci CSS personalizzato per questa sezione..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSectionCustomizer(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Chiudi
                </button>
                <button
                  onClick={() => {
                    setShowSectionCustomizer(false);
                    showMessage('Personalizzazioni salvate!', 'success');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Applica Modifiche
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Image Editor */}
      <HeroImageEditor 
        isOpen={showHeroImageEditor} 
        onClose={() => setShowHeroImageEditor(false)} 
      />
    </>
  );
};

export default CMSToolbar;

