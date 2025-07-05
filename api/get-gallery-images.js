// API per ottenere le immagini della galleria dal database
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    console.log('📋 Caricando immagini dalla galleria...');

    // Ottieni tutte le immagini ordinate per data di creazione (più recenti prima)
    const result = await client.execute(`
      SELECT 
        id,
        url,
        public_id,
        original_name,
        size,
        format,
        width,
        height,
        created_at,
        updated_at
      FROM gallery_images 
      ORDER BY created_at DESC
    `);

    const images = result.rows.map(row => ({
      id: row.id,
      url: row.url,
      publicId: row.public_id,
      originalName: row.original_name,
      size: row.size,
      format: row.format,
      width: row.width,
      height: row.height,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    console.log(`✅ Caricate ${images.length} immagini dalla galleria`);

    res.status(200).json(images);

  } catch (error) {
    console.error('❌ Errore caricamento galleria:', error);
    
    // Se la tabella non esiste, restituisci array vuoto
    if (error.message.includes('no such table')) {
      console.log('📋 Tabella galleria non esiste ancora, restituisco array vuoto');
      return res.status(200).json([]);
    }
    
    res.status(500).json({ 
      error: 'Errore interno del server',
      details: error.message 
    });
  } finally {
    await client.close();
  }
}

