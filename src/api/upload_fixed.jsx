import React, { useState } from 'react';

// API Upload con gestione corretta delle immagini Vercel Blob

export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato file non supportato. Usa JPG, PNG, WebP o GIF.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File troppo grande. Massimo 5MB.');
  }
};

export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file) => {
  try {
    validateImageFile(file);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Errore upload: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Verifica che l'URL sia valido e accessibile
    if (!data.url) {
      throw new Error('URL immagine non ricevuto dal server');
    }
    
    // Restituisce l'URL pubblico dell'immagine
    return data.url;
    
  } catch (error) {
    console.error('Errore upload immagine:', error);
    throw error;
  }
};

// Funzione per ottenere URL pubblico da Vercel Blob
export const getPublicImageUrl = (blobUrl) => {
  if (!blobUrl) return '';
  
  // Se è già un URL pubblico, restituiscilo così com'è
  if (blobUrl.startsWith('http://') || blobUrl.startsWith('https://')) {
    return blobUrl;
  }
  
  // Se è un URL blob locale, prova a convertirlo
  if (blobUrl.startsWith('blob:')) {
    console.warn('URL blob locale rilevato:', blobUrl);
    return ''; // Restituisce stringa vuota per evitare errori
  }
  
  return blobUrl;
};

// Funzione per verificare se un'immagine è caricabile
export const checkImageUrl = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Errore verifica URL immagine:', error);
    return false;
  }
};

// Componente per immagini con fallback
export const SafeImage = ({ src, alt, className, fallback, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const publicUrl = getPublicImageUrl(src);
  
  const handleLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setImageError(true);
    console.error('Errore caricamento immagine:', publicUrl);
  };
  
  if (!publicUrl || imageError) {
    return fallback || (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} {...props}>
        <span className="text-gray-500 text-sm">Immagine non disponibile</span>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div className={`bg-gray-200 animate-pulse ${className}`} {...props}>
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-sm">Caricamento...</span>
          </div>
        </div>
      )}
      <img
        src={publicUrl}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
        {...props}
      />
    </>
  );
};

