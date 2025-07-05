import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiImage, FiCheck, FiAlertCircle, FiFolder } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';
import { uploadImageToBlob } from '../../lib/blobUpload';
import MediaGallery from './MediaGallery';

const HeroImageEditor = ({ isOpen, onClose }) => {
  const { getContent, updateContent } = useCMS();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const fileInputRef = useRef(null);

  // Ottieni l'immagine hero attuale
  const currentImage = getContent('hero', 'backgroundImage');

  const handleImageFromGallery = async (imageUrl) => {
    try {
      // Aggiorna il contenuto con l'immagine selezionata
      await updateContent('hero', 'backgroundImage', imageUrl);
      setUploadSuccess(true);
      setShowMediaGallery(false);
      
      // Chiudi l'editor dopo 2 secondi
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Errore selezione immagine:', error);
      setUploadError('Errore durante la selezione dell\'immagine');
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      console.log('🔄 Uploading file via new blob library:', file.name);

      // Upload tramite la nuova libreria
      const result = await uploadImageToBlob(file, {
        filename: `hero-${Date.now()}-${file.name}`
      });

      console.log('✅ Upload result:', result);

      if (result.success && result.url) {
        // Aggiorna il contenuto con la nuova immagine
        await updateContent('hero', 'backgroundImage', result.url);
        setUploadSuccess(true);
        
        // Chiudi l'editor dopo 2 secondi
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('URL immagine non ricevuto dal server');
      }

    } catch (error) {
      console.error('Errore upload:', error);
      setUploadError(error.message || 'Errore durante l\'upload dell\'immagine');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiImage className="w-5 h-5 text-orange-600" />
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
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Immagine Attuale */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Immagine Attuale</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt="Immagine Hero Attuale"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Nessuna immagine</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Carica Nuova Immagine</h3>
              
              {/* Messaggi di stato */}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              )}

              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-sm">Immagine caricata con successo!</p>
                </div>
              )}

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              >
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Trascina un'immagine qui o clicca per selezionare</p>
                <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP - Max 10MB</p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Caricamento...' : 'Seleziona File'}
                  </button>
                  
                  <button
                    onClick={() => setShowMediaGallery(true)}
                    disabled={isUploading}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <FiFolder className="w-4 h-4" />
                    Galleria
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Media Gallery */}
      <MediaGallery
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        onSelectImage={handleImageFromGallery}
        allowUpload={true}
      />
    </AnimatePresence>
  );
};

export default HeroImageEditor;

