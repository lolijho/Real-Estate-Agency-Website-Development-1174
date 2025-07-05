// API per salvare i metadati delle immagini nel database
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const {
      url,
      publicId,
      originalName,
      size,
      format,
      width,
      height,
      createdAt
    } = req.body;

    console.log('💾 Salvando metadati immagine:', { url, publicId, originalName });

    // Crea la tabella se non esiste
    await client.execute(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        public_id TEXT UNIQUE NOT NULL,
        original_name TEXT,
        size INTEGER,
        format TEXT,
        width INTEGER,
        height INTEGER,
        created_at TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserisci i metadati
    await client.execute({
      sql: `INSERT OR REPLACE INTO gallery_images 
            (url, public_id, original_name, size, format, width, height, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [url, publicId, originalName, size, format, width, height, createdAt]
    });

    console.log('✅ Metadati salvati con successo');

    res.status(200).json({ 
      success: true, 
      message: 'Metadati salvati con successo' 
    });

  } catch (error) {
    console.error('❌ Errore salvataggio metadati:', error);
    res.status(500).json({ 
      error: 'Errore interno del server',
      details: error.message 
    });
  } finally {
    await client.close();
  }
}

