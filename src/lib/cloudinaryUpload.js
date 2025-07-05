// Libreria semplificata per upload su Cloudinary

// Configurazione Cloudinary (solo dati pubblici)
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dibgttpau',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'affitti_urbi_preset',
  folder: 'affitti-urbi'
};

/**
 * Carica un'immagine su Cloudinary
 * @param {File} file - File immagine da caricare
 * @returns {Promise<string>} URL dell'immagine caricata
 */
export const uploadToCloudinary = async (file) => {
  try {
    console.log('🔄 Upload su Cloudinary...');
    
    // Validazione semplice
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Seleziona un\'immagine valida');
    }
    
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Immagine troppo grande (max 10MB)');
    }
    
    // Prepara upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);
    
    // Upload
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Errore durante l\'upload');
    }
    
    const data = await response.json();
    console.log('✅ Upload completato:', data.secure_url);
    
    // Salva metadati nel database
    try {
      await fetch('/api/save-image-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: data.secure_url,
          publicId: data.public_id,
          originalName: file.name,
          size: file.size,
          format: data.format,
          createdAt: new Date().toISOString()
        }),
      });
    } catch (error) {
      console.warn('⚠️ Metadati non salvati, ma upload riuscito');
    }
    
    return data.secure_url;
    
  } catch (error) {
    console.error('❌ Errore upload:', error);
    throw error;
  }
};

/**
 * Valida un file immagine
 * @param {File} file - File da validare
 */
export const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Formato file non supportato. Usa JPG, PNG, WebP o GIF.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File troppo grande. Massimo 10MB.');
  }
};

/**
 * Crea anteprima di un file immagine
 * @param {File} file - File immagine
 * @returns {Promise<string>} Data URL per l'anteprima
 */
export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

/**
 * Ottiene le immagini dalla galleria
 */
export const getGalleryImages = async () => {
  try {
    const response = await fetch('/api/get-gallery-images');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('❌ Errore galleria:', error);
    return [];
  }
};

export default { uploadToCloudinary, validateImageFile, createImagePreview, getGalleryImages };

