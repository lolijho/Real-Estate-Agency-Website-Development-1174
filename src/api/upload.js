import { put } from '@vercel/blob';

// Upload utility per immagini con Vercel Blob
export const uploadImage = async (file) => {
  try {
    // Upload a Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload'
    });
    
    return blob.url;
  } catch (error) {
    console.error('Errore upload Vercel Blob:', error);
    
    // Fallback temporaneo se Vercel Blob non è configurato
    console.warn('Fallback a Object URL temporaneo');
    const objectUrl = URL.createObjectURL(file);
    
    // Simula un delay di upload
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return objectUrl;
  }
};

// Utility per validare il file immagine
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB per Vercel Blob

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo file non supportato. Usa JPG, PNG o WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('File troppo grande. Massimo 10MB.');
  }

  return true;
};

// Utility per creare anteprima
export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}; 