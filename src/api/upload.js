import { uploadToCloudinary } from '../lib/cloudinaryUpload';

// Upload utility per immagini con Cloudinary
export const uploadImage = async (file) => {
  try {
    // Upload a Cloudinary
    const imageUrl = await uploadToCloudinary(file);
    return imageUrl;
  } catch (error) {
    console.error('Errore upload Cloudinary:', error);
    throw error;
  }
};

// Utility per validare il file immagine
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB per Cloudinary

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