import { put } from '@vercel/blob';
import { createClient } from '@libsql/client';

// Configurazione database
const DATABASE_URL = process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL;
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN;

const client = DATABASE_URL && AUTH_TOKEN ? createClient({
  url: DATABASE_URL,
  authToken: AUTH_TOKEN,
}) : null;

export default async function handler(request, response) {
  // Headers CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  console.log('=== API Upload Blob ===');
  console.log('Method:', request.method);
  console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    if (request.method === 'POST') {
      // Verifica token Blob
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return response.status(500).json({
          error: 'BLOB_READ_WRITE_TOKEN non configurato',
          message: 'Configurare il token Vercel Blob nelle variabili d\'ambiente'
        });
      }

      // Ottieni il file dal form data
      const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
      const filename = searchParams.get('filename') || 'upload.jpg';
      
      console.log('Uploading file:', filename);

      // Upload su Vercel Blob con Store ID
      const blob = await put(filename, request.body, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        ...(process.env.BLOB_STORE_ID && { storeId: process.env.BLOB_STORE_ID }),
      });

      console.log('Blob uploaded:', blob.url);

      // Salva metadati nel database se disponibile
      if (client) {
        try {
          await client.execute({
            sql: `
              INSERT INTO cms_images 
              (filename, original_name, blob_url, file_size, mime_type, section_id, field_name)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            args: [
              filename,
              filename,
              blob.url,
              blob.size || 0,
              'image/jpeg',
              searchParams.get('sectionId') || null,
              searchParams.get('fieldName') || null
            ]
          });
          console.log('Metadati salvati nel database');
        } catch (dbError) {
          console.error('Errore salvataggio metadati:', dbError);
          // Non bloccare l'upload se il database fallisce
        }
      }

      return response.status(200).json({
        success: true,
        url: blob.url,
        filename: filename,
        size: blob.size,
        message: 'Upload completato con successo'
      });
    }

    // GET - Lista immagini
    else if (request.method === 'GET') {
      if (!client) {
        return response.status(500).json({ error: 'Database non configurato' });
      }

      const result = await client.execute({
        sql: 'SELECT * FROM cms_images ORDER BY created_at DESC LIMIT 50'
      });

      const images = result.rows.map(row => ({
        id: row.id,
        filename: row.filename,
        originalName: row.original_name,
        blobUrl: row.blob_url,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        createdAt: row.created_at
      }));

      return response.status(200).json({ images });
    }

    else {
      return response.status(405).json({ error: 'Metodo non supportato' });
    }

  } catch (error) {
    console.error('Errore API upload-blob:', error);
    
    return response.status(500).json({
      error: 'Errore interno del server',
      message: error.message,
      details: error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

