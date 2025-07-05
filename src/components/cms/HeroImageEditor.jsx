import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiImage, FiTrash2, FiCheck, FiLoader } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';

const HeroImageEditor = ({ isOpen, onClose }) => {
  const { getContent, updateContent, uploadImage } = useCMS();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const currentImageUrl = getContent('hero.backgroundImage', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validazione file
    if (!file.type.startsWith('image/')) {
      showMessage('Seleziona un file immagine valido', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      showMessage('Il file è troppo grande. Massimo 10MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file, 'hero', 'backgroundImage');
      if (result.success) {
        showMessage('Immagine hero aggiornata con successo!', 'success');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        showMessage(result.message || 'Errore nel caricamento', 'error');
      }
    } catch (error) {
      console.error('Errore upload:', error);
      showMessage('Errore nell\'upload dell\'immagine', 'error');
    } finally {
      setIsUploading(false);
    }
    
    // Reset input
    event.target.value = '';
  };

  const handleRemoveImage = async () => {
    try {
      await updateContent('hero.backgroundImage', '');
      showMessage('Immagine hero rimossa', 'success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showMessage('Errore nella rimozione', 'error');
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiImage} className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Editor Immagine Hero</h2>
                <p className="text-sm text-gray-500">Modifica l'immagine di sfondo della sezione principale</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Anteprima Immagine Attuale */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Immagine Attuale</h3>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`absolute inset-0 flex items-center justify-center ${currentImageUrl ? 'hidden' : 'flex'}`}
                  style={{ display: currentImageUrl ? 'none' : 'flex' }}
                >
                  <div className="text-center">
                    <SafeIcon icon={FiImage} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Nessuna immagine</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Azioni */}
            <div className="space-y-4">
              {/* Upload Nuova Immagine */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Carica Nuova Immagine</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Trascina un'immagine qui o clicca per selezionare</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP - Max 10MB</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <SafeIcon icon={isUploading ? FiLoader : FiUpload} className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
                    <span>{isUploading ? 'Caricamento...' : 'Seleziona File'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Rimuovi Immagine */}
              {currentImageUrl && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Rimuovi Immagine</h3>
                  <button
                    onClick={handleRemoveImage}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    <span>Rimuovi Immagine Hero</span>
                  </button>
                </div>
              )}
            </div>

            {/* Messaggio di Stato */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <SafeIcon 
                    icon={message.type === 'success' ? FiCheck : FiImage} 
                    className="w-4 h-4" 
                  />
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HeroImageEditor;

