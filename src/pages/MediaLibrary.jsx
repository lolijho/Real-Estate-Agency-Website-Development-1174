import React, { useState, useEffect } from 'react';
import { uploadToCloudinary, validateImageFile } from '../lib/cloudinaryUpload';
import SafeIcon from '../common/SafeIcon';

const MediaLibrary = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Carica immagini salvate dal localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('mediaLibrary');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Salva immagini nel localStorage
  const saveToStorage = (newImages) => {
    localStorage.setItem('mediaLibrary', JSON.stringify(newImages));
    setImages(newImages);
  };

  // Upload nuove immagini
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Valida il file
        validateImageFile(file);
        
        // Simula progresso
        setUploadProgress(Math.round((i / files.length) * 50));
        
        // Upload su Cloudinary
        const url = await uploadToCloudinary(file, {
          transformation: 'c_fill,w_800,h_600,q_auto' // Ottimizzazione per media library
        });
        
        const imageData = {
          id: Date.now() + i,
          url: url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          alt: file.name.replace(/\.[^/.]+$/, "")
        };
        
        newImages.push(imageData);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Salva nel localStorage
      const updatedImages = [...images, ...newImages];
      saveToStorage(updatedImages);
      
    } catch (error) {
      console.error('Errore upload:', error);
      alert('Errore durante l\'upload: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input
      e.target.value = '';
    }
  };

  // Elimina immagine
  const deleteImage = (imageId) => {
    if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      saveToStorage(updatedImages);
    }
  };

  // Copia URL negli appunti
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copiato negli appunti!');
  };

  // Filtra immagini per ricerca
  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatta dimensione file
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              📸 Media Library
            </h1>
            <div className="text-sm text-gray-500">
              {images.length} immagini totali
            </div>
          </div>
          
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
            >
                             <SafeIcon 
                 name="Upload" 
                 className="mx-auto h-12 w-12 text-gray-400 mb-4"
               />
              
              {isUploading ? (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Caricamento su Cloudinary...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{uploadProgress}%</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Trascina file qui o clicca per caricare
                  </p>
                  <p className="text-sm text-gray-600">
                    JPG, PNG, WebP - Max 10MB ciascuna
                  </p>
                </div>
              )}
            </label>
          </div>
          
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <SafeIcon name="Search" className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca immagini..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
                             <SafeIcon name="Image" className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nessuna immagine trovata' : 'Nessuna immagine caricata'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Immagine */}
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate" title={image.name}>
                      {image.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatFileSize(image.size)}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(image.url)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Copia URL
                      </button>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                                                 <SafeIcon name="Trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal dettaglio immagine */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedImage.name}
                </h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                                     <SafeIcon name="X" className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-96 object-contain bg-gray-50 rounded"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Dimensione:</strong> {formatFileSize(selectedImage.size)}</p>
                  <p><strong>Tipo:</strong> {selectedImage.type}</p>
                  <p><strong>Caricato:</strong> {new Date(selectedImage.uploadDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>URL:</strong></p>
                  <input
                    type="text"
                    value={selectedImage.url}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded text-xs bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => copyToClipboard(selectedImage.url)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Copia URL
                </button>
                <button
                  onClick={() => {
                    deleteImage(selectedImage.id);
                    setSelectedImage(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary; 