// Libreria per upload su Cloudinary
import { useCMS } from '../context/CMSContext';

// Configurazione Cloudinary
const CLOUDINARY_CONFIG = {
  cloudName: 'affitti-urbi', // Sostituire con il tuo cloud name
  uploadPreset: 'affitti_urbi_preset', // Sostituire con il tuo upload preset
  apiKey: '123456789012345', // Sostituire con la tua API key
  folder: 'affitti-urbi' // Cartella per organizzare le immagini
};

/**
 * Carica un'immagine su Cloudinary
 * @param {File} file - File immagine da caricare
 * @param {Object} options - Opzioni aggiuntive
 * @returns {Promise<string>} URL dell'immagine caricata
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    console.log('🔄 Iniziando upload su Cloudinary...');
    
    // Validazione file
    if (!file) {
      throw new Error('Nessun file selezionato');
    }
    
    if (!file.type.startsWith('image/')) {
      throw new Error('Il file deve essere un\'immagine');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('Il file è troppo grande (max 10MB)');
    }
    
    // Prepara FormData per Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);
    
    // Aggiungi opzioni aggiuntive
    if (options.transformation) {
      formData.append('transformation', options.transformation);
    }
    
    // Upload su Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Errore Cloudinary: ${errorData.error?.message || 'Upload fallito'}`);
    }
    
    const data = await response.json();
    console.log('✅ Upload Cloudinary completato:', data.secure_url);
    
    // Salva i metadati nel database
    await saveImageMetadata({
      url: data.secure_url,
      publicId: data.public_id,
      originalName: file.name,
      size: file.size,
      format: data.format,
      width: data.width,
      height: data.height,
      createdAt: new Date().toISOString()
    });
    
    return data.secure_url;
    
  } catch (error) {
    console.error('❌ Errore upload Cloudinary:', error);
    throw error;
  }
};

/**
 * Salva i metadati dell'immagine nel database
 * @param {Object} metadata - Metadati dell'immagine
 */
const saveImageMetadata = async (metadata) => {
  try {
    const response = await fetch('/api/save-image-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      console.warn('⚠️ Salvataggio metadati fallito, ma upload riuscito');
    }
  } catch (error) {
    console.warn('⚠️ Errore salvataggio metadati:', error.message);
  }
};

/**
 * Ottiene tutte le immagini dalla galleria
 * @returns {Promise<Array>} Lista delle immagini
 */
export const getGalleryImages = async () => {
  try {
    const response = await fetch('/api/get-gallery-images');
    if (!response.ok) {
      throw new Error('Errore caricamento galleria');
    }
    
    const images = await response.json();
    return images;
  } catch (error) {
    console.error('❌ Errore caricamento galleria:', error);
    return [];
  }
};

/**
 * Elimina un'immagine da Cloudinary
 * @param {string} publicId - ID pubblico dell'immagine su Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const response = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    
    if (!response.ok) {
      throw new Error('Errore eliminazione immagine');
    }
    
    console.log('✅ Immagine eliminata da Cloudinary');
  } catch (error) {
    console.error('❌ Errore eliminazione:', error);
    throw error;
  }
};

/**
 * Valida un file immagine
 * @param {File} file - File da validare
 */
export const validateImageFile = (file) => {
  if (!file) {
    throw new Error('Nessun file selezionato');
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato non supportato. Usa JPG, PNG o WebP');
  }
  
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File troppo grande. Massimo 10MB');
  }
  
  return true;
};

/**
 * Crea un'anteprima dell'immagine
 * @param {File} file - File immagine
 * @returns {Promise<string>} URL dell'anteprima
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default {
  uploadToCloudinary,
  getGalleryImages,
  deleteFromCloudinary,
  validateImageFile,
  createImagePreview
};

