// Upload utility per immagini (versione temporanea con Object URL)
export const uploadImage = async (file) => {
  try {
    // Per ora creiamo un URL temporaneo dal file
    // In futuro questo sarà sostituito con un vero upload a Vercel Blob
    
    // Simula un delay di upload
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Crea un Object URL che persisterà fino al refresh della pagina
    const objectUrl = URL.createObjectURL(file);
    
    // In futuro qui faremo il vero upload:
    /*
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Errore durante l\'upload');
    }
    
    const data = await response.json();
    return data.url;
    */
    
    return objectUrl;
  } catch (error) {
    console.error('Errore upload:', error);
    throw error;
  }
};

// Utility per validare il file immagine
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo file non supportato. Usa JPG, PNG o WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('File troppo grande. Massimo 5MB.');
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