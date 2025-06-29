import { createClient } from '@libsql/client';

// Configurazione database con supporto import.meta.env per Vite
const DATABASE_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const AUTH_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;
const isDatabaseConfigured = DATABASE_URL && AUTH_TOKEN;

// Debug delle variabili d'ambiente
console.log('🔧 Debug Database Config:', {
  hasUrl: !!DATABASE_URL,
  hasToken: !!AUTH_TOKEN,
  urlStart: DATABASE_URL ? DATABASE_URL.substring(0, 20) + '...' : 'undefined',
  isDatabaseConfigured,
  importMetaEnv: !!import.meta.env,
  allImportMetaKeys: Object.keys(import.meta.env).filter(key => key.includes('TURSO'))
});

const client = isDatabaseConfigured ? createClient({
  url: DATABASE_URL,
  authToken: AUTH_TOKEN,
}) : null;

// Schema per la tabella properties
export const createPropertiesTable = async () => {
  if (!client) {
    console.log('Database non configurato - modalità demo');
    return;
  }
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        type TEXT NOT NULL, -- 'vendita' o 'affitto'
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        province TEXT DEFAULT 'MI',
        bedrooms INTEGER,
        bathrooms INTEGER,
        size INTEGER, -- metri quadrati
        floor INTEGER,
        total_floors INTEGER,
        year INTEGER,
        energy_class TEXT DEFAULT 'A',
        features TEXT, -- JSON array come stringa
        images TEXT, -- JSON array come stringa
        status TEXT DEFAULT 'available', -- 'available', 'sold', 'rented'
        featured BOOLEAN DEFAULT FALSE, -- Se mostrare in homepage
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabella properties creata con successo');
  } catch (error) {
    console.error('Errore creazione tabella:', error);
  }
};

// CRUD Operations
export const propertyService = {
  // Ottieni tutte le proprietà
  async getAll() {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      const result = await client.execute(`
        SELECT * FROM properties 
        ORDER BY created_at DESC
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        type: row.type,
        address: row.address,
        city: row.city,
        province: row.province,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        size: row.size,
        floor: row.floor,
        totalFloors: row.total_floors,
        year: row.year,
        energyClass: row.energy_class,
        features: row.features ? JSON.parse(row.features) : [],
        images: row.images ? JSON.parse(row.images) : [],
        status: row.status,
        featured: Boolean(row.featured),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Errore nel recupero proprietà:', error);
      return [];
    }
  },

  // Ottieni proprietà in evidenza per homepage
  async getFeatured() {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      const result = await client.execute(`
        SELECT * FROM properties 
        WHERE featured = 1 AND status = 'available'
        ORDER BY created_at DESC
        LIMIT 6
      `);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        type: row.type,
        address: row.address,
        city: row.city,
        province: row.province,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        size: row.size,
        floor: row.floor,
        totalFloors: row.total_floors,
        year: row.year,
        energyClass: row.energy_class,
        features: row.features ? JSON.parse(row.features) : [],
        images: row.images ? JSON.parse(row.images) : [],
        status: row.status,
        featured: !!row.featured,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Errore nel recupero proprietà in evidenza:', error);
      return [];
    }
  },

  // Ottieni proprietà per tipo
  async getByType(type) {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      const result = await client.execute({
        sql: `SELECT * FROM properties WHERE type = ? ORDER BY created_at DESC`,
        args: [type]
      });
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        type: row.type,
        address: row.address,
        city: row.city,
        province: row.province,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        size: row.size,
        floor: row.floor,
        totalFloors: row.total_floors,
        year: row.year,
        energyClass: row.energy_class,
        features: row.features ? JSON.parse(row.features) : [],
        images: row.images ? JSON.parse(row.images) : [],
        status: row.status,
        featured: !!row.featured,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Errore nel recupero proprietà per tipo:', error);
      return [];
    }
  },

  // Ottieni singola proprietà
  async getById(id) {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      const result = await client.execute({
        sql: `SELECT * FROM properties WHERE id = ?`,
        args: [id]
      });
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        type: row.type,
        address: row.address,
        city: row.city,
        province: row.province,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        size: row.size,
        floor: row.floor,
        totalFloors: row.total_floors,
        year: row.year,
        energyClass: row.energy_class,
        features: row.features ? JSON.parse(row.features) : [],
        images: row.images ? JSON.parse(row.images) : [],
        status: row.status,
        featured: !!row.featured,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('Errore nel recupero proprietà:', error);
      return null;
    }
  },

  // Aggiungi nuova proprietà
  async add(property) {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      const result = await client.execute({
        sql: `
          INSERT INTO properties (
            title, description, price, type, address, city, province,
            bedrooms, bathrooms, size, floor, total_floors, year,
            energy_class, features, images, status, featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          property.title,
          property.description,
          property.price,
          property.type,
          property.address,
          property.city,
          property.province || 'MI',
          property.bedrooms,
          property.bathrooms,
          property.size,
          property.floor,
          property.totalFloors,
          property.year,
          property.energyClass || 'A',
          JSON.stringify(property.features || []),
          JSON.stringify(property.images || []),
          'available',
          property.featured ? 1 : 0
        ]
      });
      
      return result.insertId;
    } catch (error) {
      console.error('Errore nell\'aggiunta proprietà:', error);
      throw error;
    }
  },

  // Aggiorna proprietà
  async update(id, property) {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      await client.execute({
        sql: `
          UPDATE properties SET
            title = ?, description = ?, price = ?, type = ?, address = ?,
            city = ?, province = ?, bedrooms = ?, bathrooms = ?, size = ?,
            floor = ?, total_floors = ?, year = ?, energy_class = ?,
            features = ?, images = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [
          property.title,
          property.description,
          property.price,
          property.type,
          property.address,
          property.city,
          property.province || 'MI',
          property.bedrooms,
          property.bathrooms,
          property.size,
          property.floor,
          property.totalFloors,
          property.year,
          property.energyClass || 'A',
          JSON.stringify(property.features || []),
          JSON.stringify(property.images || []),
          property.featured ? 1 : 0,
          id
        ]
      });
      
      return true;
    } catch (error) {
      console.error('Errore nell\'aggiornamento proprietà:', error);
      throw error;
    }
  },

  // Elimina proprietà
  async delete(id) {
    if (!client) {
      throw new Error('Database non configurato');
    }
    try {
      await client.execute({
        sql: `DELETE FROM properties WHERE id = ?`,
        args: [id]
      });
      
      return true;
    } catch (error) {
      console.error('Errore nell\'eliminazione proprietà:', error);
      throw error;
    }
  }
};

export default client; 