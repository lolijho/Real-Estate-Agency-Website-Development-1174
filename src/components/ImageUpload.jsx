import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { uploadImage, validateImageFile, createImagePreview } from '../api/upload';

const { FiUpload, FiX, FiImage, FiLoader } = FiIcons;

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    // Controllo numero massimo immagini
    if (images.length + fileArray.length > maxImages) {
      alert(`Puoi caricare massimo ${maxImages} immagini`);
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        try {
          // Valida il file
          validateImageFile(file);
          
          // Crea anteprima immediata
          const preview = await createImagePreview(file);
          const tempId = `temp-${Date.now()}-${i}`;
          
          // Aggiunge immagine temporanea con anteprima
          const tempImage = {
            id: tempId,
            url: preview,
            file: file,
            uploading: true
          };
          
          onImagesChange(prev => [...prev, tempImage]);
          
          // Upload del file
          setUploadProgress(prev => ({ ...prev, [tempId]: 0 }));
          
          // Simula progress (Vercel Blob non ha progress reale)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => ({
              ...prev,
              [tempId]: Math.min((prev[tempId] || 0) + 10, 90)
            }));
          }, 100);

          const uploadedUrl = await uploadImage(file);
          
          // Pulisce il progress e aggiorna con URL reale
          clearInterval(progressInterval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[tempId];
            return newProgress;
          });
          
          // Aggiorna l'immagine con l'URL finale
          onImagesChange(prev => prev.map(img => 
            img.id === tempId 
              ? { id: uploadedUrl, url: uploadedUrl, uploading: false }
              : img
          ));
          
        } catch (error) {
          console.error('Errore upload singolo file:', error);
          alert(`Errore caricamento ${file.name}: ${error.message}`);
          
          // Rimuove l'immagine fallita
          onImagesChange(prev => prev.filter(img => !img.file || img.file !== file));
        }
      }
    } catch (error) {
      console.error('Errore generale upload:', error);
      alert('Errore durante il caricamento delle immagini');
    } finally {
      setUploading(false);
    }
  }, [images.length, maxImages, onImagesChange]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    onImagesChange(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center space-y-2">
          <SafeIcon icon={FiUpload} className="h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Carica immagini
            </p>
            <p className="text-sm text-gray-500">
              Trascina qui le immagini o clicca per selezionare
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP - Max 10MB ciascuna • Salvate su Vercel Blob ({images.length}/{maxImages})
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
              >
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Loading Overlay */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <SafeIcon icon={FiLoader} className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm">
                        Vercel Blob: {uploadProgress[image.id] || 0}%
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Remove Button */}
                {!image.uploading && (
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <SafeIcon icon={FiX} className="h-4 w-4" />
                  </button>
                )}
                
                {/* Index Badge */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-primary-600"
        >
          <SafeIcon icon={FiLoader} className="h-4 w-4 animate-spin" />
          <span className="text-sm">Caricamento in corso...</span>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload; 