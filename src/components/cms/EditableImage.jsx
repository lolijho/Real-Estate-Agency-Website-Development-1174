import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary, validateImageFile, createImagePreview } from '../../lib/cloudinaryUpload';
import MediaGallery from './MediaGallery';

const { FiImage, FiUpload, FiEdit2, FiCheck, FiX, FiLoader, FiFolder } = FiIcons;

const EditableImage = ({ 
  sectionId, 
  field, 
  defaultValue, 
  className = '', 
  alt = '',
  placeholder = 'Carica immagine',
  width = 'auto',
  height = 'auto'
}) => {
  const { canEdit, getContent, updateContent, isInitialized } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const fileInputRef = useRef(null);

  const imageUrl = getContent(sectionId, field, defaultValue);
  
  // Se non è ancora inizializzato, mostra il valore di default per prevenire flash
  const displayImageUrl = isInitialized ? imageUrl : defaultValue;
  
  // Debug logging
  console.log(`🖼️ EditableImage Debug - ${sectionId}.${field}:`, {
    imageUrl,
    defaultValue,
    displayImageUrl,
    isInitialized,
    canEdit
  });

  const handleStartEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
  };

  const handleImageFromGallery = (imageUrl) => {
    updateContent(sectionId, field, imageUrl);
    setShowMediaGallery(false);
    setIsEditing(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Valida il file
      validateImageFile(file);
      
      setIsUploading(true);
      
      // Crea anteprima immediata
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
      
      // Upload del file tramite Cloudinary
      const uploadedUrl = await uploadToCloudinary(file, {
        transformation: 'c_fill,w_800,h_600,q_auto' // Ottimizzazione generale
      });
      
      // Salva l'URL
      updateContent(sectionId, field, uploadedUrl);
      setPreviewUrl(null);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Errore upload immagine:', error);
      alert(`Errore: ${error.message}`);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (url) => {
    if (url.trim() && url !== imageUrl) {
      updateContent(sectionId, field, url.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    updateContent(sectionId, field, '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="border-2 border-dashed border-primary-500 rounded-lg p-4 bg-primary-50">
          {/* Preview dell'immagine caricata */}
          {(previewUrl || imageUrl) && (
            <div className="mb-4">
              <img
                src={previewUrl || imageUrl}
                alt="Preview"
                className="max-w-full max-h-48 object-contain mx-auto rounded-lg"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <SafeIcon icon={FiLoader} className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Caricamento su Cloudinary...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Upload area */}
          <div className="text-center">
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <SafeIcon icon={FiUpload} className="h-4 w-4" />
                  <span>Carica Nuova</span>
                </button>
                
                <button
                  onClick={() => setShowMediaGallery(true)}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <SafeIcon icon={FiFolder} className="h-4 w-4" />
                  <span>Galleria</span>
                </button>
              </div>
            </div>

            {/* URL Input */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Oppure inserisci URL:</p>
              <UrlInput 
                initialValue={imageUrl}
                onSubmit={handleUrlSubmit}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-2">
            {imageUrl && (
              <button
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Rimuovi
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <SafeIcon icon={FiX} className="h-3 w-3" />
              <span>Annulla</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <motion.div
      className={`relative cursor-pointer ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleStartEdit}
      whileHover={canEdit ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {displayImageUrl ? (
        <SafeImage
          src={displayImageUrl}
          alt={alt}
          className={`w-full h-full object-cover rounded-lg ${canEdit && isHovered ? 'opacity-80' : ''}`}
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <SafeIcon icon={FiImage} className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Immagine non disponibile</p>
              </div>
            </div>
          }
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${canEdit ? 'hover:border-primary-500 hover:bg-primary-50' : ''}`}>
          <div className="text-center text-gray-500">
            <SafeIcon icon={FiImage} className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">{placeholder}</p>
          </div>
        </div>
      )}
      
      {canEdit && isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-1 shadow-lg"
        >
          <SafeIcon icon={FiEdit2} className="h-3 w-3" />
        </motion.div>
      )}
      
      {canEdit && isHovered && displayImageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-center text-white">
            <SafeIcon icon={FiEdit2} className="h-6 w-6 mx-auto mb-1" />
            <p className="text-sm">Clicca per modificare</p>
          </div>
        </motion.div>
      )}
    </motion.div>
    
    {/* Media Gallery */}
    <MediaGallery
      isOpen={showMediaGallery}
      onClose={() => setShowMediaGallery(false)}
      onSelectImage={handleImageFromGallery}
      allowUpload={true}
    />
  </>
  );
};

// Componente helper per input URL
const UrlInput = ({ initialValue, onSubmit, disabled }) => {
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
        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <SafeIcon icon={FiCheck} className="h-3 w-3" />
        <span>OK</span>
      </button>
    </form>
  );
};

export default EditableImage; 