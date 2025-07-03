import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Qui puoi aggiungere logica di autenticazione
        // Per ora permettiamo tutti gli upload
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            userId: clientPayload?.userId || 'anonymous',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completato:', blob.url);
        
        // Qui puoi salvare i metadati dell'immagine nel database
        try {
          const payload = JSON.parse(tokenPayload);
          console.log('Token payload:', payload);
          
          // Esempio: salva nel database Turso
          // await saveImageMetadata(blob.url, blob.size, payload.userId);
        } catch (error) {
          console.error('Errore salvataggio metadati:', error);
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Errore API upload:', error);
    return response.status(400).json({ error: error.message });
  }
} 