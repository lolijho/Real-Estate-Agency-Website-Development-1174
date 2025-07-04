import { handleUpload } from '@vercel/blob/client';
import { createClient } from '@libsql/client';

// Configurazione database
const DATABASE_URL = process.env.VITE_TURSO_DATABASE_URL;
const AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;

const client = DATABASE_URL && AUTH_TOKEN ? createClient({
  url: DATABASE_URL,
  authToken: AUTH_TOKEN,
}) : null;

// Funzione per salvare metadati immagine nel database
async function saveImageMetadata(imageData) {
  if (!client) {
    console.warn('Database non configurato, skip salvataggio metadati');
    return;
  }
  
  try {
    await client.execute({
      sql: `
        INSERT INTO cms_images 
        (filename, original_name, blob_url, file_size, mime_type, section_id, field_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        imageData.filename,
        imageData.originalName,
        imageData.blobUrl,
        imageData.fileSize,
        imageData.mimeType,
        imageData.sectionId || null,
        imageData.fieldName || null
      ]
    });
    console.log('Metadati immagine salvati nel database:', imageData.filename);
  } catch (error) {
    console.error('Errore salvataggio metadati immagine:', error);
  }
}

export default async function handler(request, response) {
  // Gestisci richieste POST per upload
  if (request.method === 'POST') {
    try {
      const body = await request.json();

      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          // Validazione e autenticazione
          return {
            allowedContentTypes: [
              'image/jpeg', 
              'image/jpg', 
              'image/png', 
              'image/gif', 
              'image/webp',
              'image/svg+xml'
            ],
            maxFileSize: 10 * 1024 * 1024, // 10MB max
            tokenPayload: JSON.stringify({
              userId: clientPayload?.userId || 'cms-user',
              sectionId: clientPayload?.sectionId || null,
              fieldName: clientPayload?.fieldName || null,
              timestamp: new Date().toISOString()
            }),
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log('Upload completato:', blob.url);
          
          try {
            const payload = JSON.parse(tokenPayload);
            
            // Estrai informazioni dal blob URL
            const urlParts = blob.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            
            // Prepara dati per il database
            const imageData = {
              filename: filename,
              originalName: payload.originalName || filename,
              blobUrl: blob.url,
              fileSize: blob.size,
              mimeType: blob.contentType || 'image/jpeg',
              sectionId: payload.sectionId,
              fieldName: payload.fieldName
            };
            
            // Salva metadati nel database
            await saveImageMetadata(imageData);
            
          } catch (error) {
            console.error('Errore elaborazione upload:', error);
          }
        },
      });

      return response.status(200).json(jsonResponse);
    } catch (error) {
      console.error('Errore API upload:', error);
      return response.status(400).json({ error: error.message });
    }
  }
  
  // Gestisci richieste GET per elencare immagini
  else if (request.method === 'GET') {
    try {
      if (!client) {
        return response.status(500).json({ error: 'Database non configurato' });
      }
      
      const { sectionId } = request.query;
      
      let query = 'SELECT * FROM cms_images ORDER BY created_at DESC';
      let args = [];
      
      if (sectionId) {
        query = 'SELECT * FROM cms_images WHERE section_id = ? ORDER BY created_at DESC';
        args = [sectionId];
      }
      
      const result = await client.execute({ sql: query, args });
      
      const images = result.rows.map(row => ({
        id: row.id,
        filename: row.filename,
        originalName: row.original_name,
        blobUrl: row.blob_url,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        sectionId: row.section_id,
        fieldName: row.field_name,
        createdAt: row.created_at
      }));
      
      return response.status(200).json({ images });
    } catch (error) {
      console.error('Errore recupero immagini:', error);
      return response.status(500).json({ error: error.message });
    }
  }
  
  // Gestisci richieste DELETE per eliminare immagini
  else if (request.method === 'DELETE') {
    try {
      if (!client) {
        return response.status(500).json({ error: 'Database non configurato' });
      }
      
      const { imageId, blobUrl } = request.query;
      
      if (imageId) {
        // Elimina dal database
        await client.execute({
          sql: 'DELETE FROM cms_images WHERE id = ?',
          args: [imageId]
        });
        
        // TODO: Eliminare anche dal Vercel Blob se necessario
        // Questo richiede l'API di Vercel Blob per la cancellazione
        
        return response.status(200).json({ success: true, message: 'Immagine eliminata' });
      } else {
        return response.status(400).json({ error: 'ID immagine richiesto' });
      }
    } catch (error) {
      console.error('Errore eliminazione immagine:', error);
      return response.status(500).json({ error: error.message });
    }
  }
  
  else {
    return response.status(405).json({ error: 'Metodo non supportato' });
  }
}

