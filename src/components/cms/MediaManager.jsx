import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiTrash2, 
  FiCopy, 
  FiImage,
  FiX,
  FiCheck,
  FiEye
} from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';

const MediaManager = ({ isOpen, onClose, onSelectImage }) => {
  const { uploadImage } = useCMS();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState('');

  // Carica immagini all'apertura
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/get-gallery-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data || []);
      }
    } catch (error) {
      console.error('Errore caricamento immagini:', error);
      showMessage('Errore nel caricamento delle immagini', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      try {
        setUploadProgress(0);
        
        // Simula progresso upload
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);
        
        const result = await uploadImage(file, 'media', 'general');
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (result.success) {
          showMessage('Immagine caricata con successo!', 'success');
          await loadImages(); // Ricarica la lista
        } else {
          showMessage(result.message, 'error');
        }
        
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (error) {
        showMessage('Errore nel caricamento', 'error');
        setUploadProgress(0);
      }
    }
    
    event.target.value = '';
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Sei sicuro di voler eliminare questa immagine?')) return;
    
    try {
      // Per ora simuliamo l'eliminazione dal localStorage
      // In futuro, implementeremo l'eliminazione da Cloudinary
      showMessage('Eliminazione da Cloudinary non ancora implementata', 'info');
      console.log('TODO: Implementare eliminazione da Cloudinary per:', imageId);
    } catch (error) {
      showMessage('Errore nell\'eliminazione', 'error');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showMessage('URL copiato negli appunti!', 'success');
  };

  const handleSelectImage = (image) => {
    if (onSelectImage) {
      onSelectImage(image.blobUrl);
      onClose();
    } else {
      setSelectedImage(image);
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Gestione Media</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <SafeIcon icon={FiUpload} className="w-4 h-4" />
                  <span>Carica Immagini</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                
                {uploadProgress > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                {images.length} immagini totali
              </div>
            </div>
          </div>

          {/* Messaggio di stato */}
          {message && (
            <div className={`p-3 text-sm text-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : message.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Contenuto */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Caricamento immagini...</span>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <SafeIcon icon={FiImage} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna immagine</h3>
                <p className="text-gray-600 mb-4">Carica la tua prima immagine per iniziare</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                  >
                    {/* Immagine */}
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img
                        src={image.blobUrl}
                        alt={image.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      
                      {/* Overlay con azioni */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSelectImage(image)}
                            className="p-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors"
                            title={onSelectImage ? "Seleziona" : "Visualizza"}
                          >
                            <SafeIcon icon={onSelectImage ? FiCheck : FiEye} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyUrl(image.blobUrl)}
                            className="p-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors"
                            title="Copia URL"
                          >
                            <SafeIcon icon={FiCopy} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors"
                            title="Elimina"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-gray-900 truncate" title={image.originalName}>
                        {image.originalName}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(image.fileSize)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(image.createdAt).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Formati supportati: JPG, PNG, GIF, WebP, SVG
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaManager;

