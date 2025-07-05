import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiX, FiImage, FiCheck, FiAlertCircle, 
  FiTrash2, FiEye, FiDownload, FiGrid, FiList 
} from 'react-icons/fi';

const MediaGallery = ({ isOpen, onClose, onSelectImage, allowUpload = true }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const fileInputRef = useRef(null);

  // Carica immagini dalla galleria
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/upload-blob');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        console.error('Errore caricamento immagini:', response.status);
      }
    } catch (error) {
      console.error('Errore caricamento immagini:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validazione file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Formato file non supportato. Usa JPG, PNG, WebP o GIF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File troppo grande. Massimo 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Genera nome file unico
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;

      // Upload tramite API Blob
      const response = await fetch(`/api/upload-blob?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.url) {
        // Ricarica la galleria
        await loadImages();
        
        // Se è stata selezionata un'immagine, chiama il callback
        if (onSelectImage) {
          onSelectImage(result.url);
        }
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

  const handleImageSelect = (imageUrl) => {
    if (onSelectImage) {
      onSelectImage(imageUrl);
      onClose();
    }
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
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiImage className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Galleria Media</h2>
                <p className="text-sm text-gray-500">Seleziona o carica una nuova immagine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Upload Area */}
            {allowUpload && (
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Carica Nuova Immagine</h3>
                
                {/* Messaggi di stato */}
                {uploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{uploadError}</p>
                  </div>
                )}

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                >
                  <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Trascina un'immagine qui o clicca per selezionare</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG, WebP, GIF - Max 10MB</p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Caricamento...' : 'Seleziona File'}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Gallery */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Immagini ({images.length})
                </h3>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Caricamento...</span>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nessuna immagine nella galleria</p>
                  {allowUpload && (
                    <p className="text-sm text-gray-400 mt-2">Carica la prima immagine per iniziare</p>
                  )}
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  : "space-y-3"
                }>
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={viewMode === 'grid'
                        ? "group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        : "flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      }
                      onClick={() => handleImageSelect(image.blobUrl)}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <img
                            src={image.blobUrl}
                            alt={image.originalName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <FiCheck className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={image.blobUrl}
                            alt={image.originalName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{image.originalName}</p>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(image.fileSize)} • {new Date(image.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <FiCheck className="w-5 h-5 text-blue-600" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaGallery;

