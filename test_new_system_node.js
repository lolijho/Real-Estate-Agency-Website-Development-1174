import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Carica variabili d'ambiente
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.VITE_TURSO_DATABASE_URL;
const AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN;

const client = DATABASE_URL && AUTH_TOKEN ? createClient({
  url: DATABASE_URL,
  authToken: AUTH_TOKEN,
}) : null;

async function createCMSTables() {
  if (!client) return;
  
  // Tabella cms_content
  await client.execute(`
    CREATE TABLE IF NOT EXISTS cms_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      field_value TEXT,
      field_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(section_id, field_name)
    )
  `);
  
  // Tabella cms_images
  await client.execute(`
    CREATE TABLE IF NOT EXISTS cms_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT,
      blob_url TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      section_id TEXT,
      field_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function testNewSystem() {
  console.log('🧪 Test del nuovo sistema CMS...\n');
  
  if (!client) {
    console.error('❌ Database non configurato');
    return;
  }
  
  try {
    // 1. Crea tabelle
    console.log('1. Creazione tabelle CMS...');
    await createCMSTables();
    console.log('✅ Tabelle CMS create con successo\n');
    
    // 2. Test inserimento contenuto
    console.log('2. Test inserimento contenuto...');
    await client.execute({
      sql: `INSERT OR REPLACE INTO cms_content 
            (section_id, field_name, field_value, field_type) 
            VALUES (?, ?, ?, ?)`,
      args: ['hero', 'title', 'Benvenuti in Affitti Urbi', 'text']
    });
    
    await client.execute({
      sql: `INSERT OR REPLACE INTO cms_content 
            (section_id, field_name, field_value, field_type) 
            VALUES (?, ?, ?, ?)`,
      args: ['hero', 'subtitle', 'La tua casa ideale ti aspetta', 'text']
    });
    
    console.log('✅ Contenuti inseriti con successo\n');
    
    // 3. Test recupero contenuto
    console.log('3. Test recupero contenuto...');
    const result = await client.execute(`
      SELECT section_id, field_name, field_value 
      FROM cms_content 
      WHERE section_id = 'hero'
    `);
    
    console.log('✅ Contenuti recuperati:', result.rows);
    
    // 4. Test conteggio tabelle
    console.log('\n4. Verifica struttura database...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name LIKE 'cms_%'
    `);
    
    console.log('✅ Tabelle CMS create:', tables.rows.map(r => r.name));
    
    console.log('\n🎉 Tutti i test completati con successo!');
    console.log('📊 Database Turso configurato e funzionante');
    
  } catch (error) {
    console.error('❌ Errore nei test:', error);
  }
}

testNewSystem();
