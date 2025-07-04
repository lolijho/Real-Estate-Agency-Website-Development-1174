import React, { createContext, useContext, useState, useEffect } from 'react';
import { propertyService, createPropertiesTable } from '../lib/database';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Inizializza database e carica proprietà
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Verifica se le variabili d'ambiente sono configurate
        const isDatabaseConfigured = import.meta.env.VITE_TURSO_DATABASE_URL && import.meta.env.VITE_TURSO_AUTH_TOKEN;
        
        if (!isDatabaseConfigured) {
          console.log('Database non configurato, usando dati di esempio');
          setDbError('Database non configurato. Usando dati di esempio.');
          const sampleData = getSampleProperties();
          setProperties(sampleData);
          setFeaturedProperties(sampleData.filter(p => p.featured));
          return;
        }

        // Crea tabella se non esiste
        await createPropertiesTable();
        
        // Carica proprietà esistenti
        const existingProperties = await propertyService.getAll();
        const featuredProps = await propertyService.getFeatured();
        
        // Se non ci sono proprietà, aggiungi dati di esempio
        if (existingProperties.length === 0) {
          await seedSampleData();
          const updatedProperties = await propertyService.getAll();
          const updatedFeatured = await propertyService.getFeatured();
          setProperties(updatedProperties);
          setFeaturedProperties(updatedFeatured);
        } else {
          setProperties(existingProperties);
          setFeaturedProperties(featuredProps);
        }
      } catch (error) {
        console.error('Errore inizializzazione database:', error);
        setDbError('Database non configurato. Usando dati di esempio.');
        // Fallback ai dati di esempio in caso di errore
        const sampleData = getSampleProperties();
        setProperties(sampleData);
        setFeaturedProperties(sampleData.filter(p => p.featured));
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  // Dati di esempio da inserire al primo avvio
  const seedSampleData = async () => {
    const sampleProperties = [
      {
        title: "Appartamento Moderno Centro Storico",
        description: "Splendido appartamento completamente ristrutturato nel cuore di Milano. Finiture di pregio e vista panoramica.",
        price: 350000,
        type: "vendita",
        address: "Via del Centro 15",
        city: "Milano",
        province: "MI",
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        floor: 3,
        totalFloors: 5,
        year: 2020,
        energyClass: "A",
        features: ["Balcone", "Aria condizionata", "Parquet", "Ascensore"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
        ],
        featured: true
      },
      {
        title: "Villa con Giardino",
        description: "Elegante villa indipendente con ampio giardino privato. Ideale per famiglie.",
        price: 750000,
        type: "vendita",
        address: "Via delle Ville 23",
        city: "Monza",
        province: "MB",
        bedrooms: 4,
        bathrooms: 3,
        size: 250,
        floor: 0,
        totalFloors: 2,
        year: 2015,
        energyClass: "B",
        features: ["Giardino", "Garage", "Camino", "Terrazza"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
        ],
        featured: true
      },
      {
        title: "Bilocale Luminoso",
        description: "Moderno bilocale in zona Porta Garibaldi, completamente arredato e di recente ristrutturazione.",
        price: 1200,
        type: "affitto",
        address: "Via Porta Garibaldi 8",
        city: "Milano",
        province: "MI",
        bedrooms: 1,
        bathrooms: 1,
        size: 65,
        floor: 2,
        totalFloors: 6,
        year: 2018,
        energyClass: "A",
        features: ["Arredato", "Balcone", "Aria condizionata"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
        ],
        featured: false
      },
      {
        title: "Trilocale Zona Navigli",
        description: "Caratteristico trilocale nella vivace zona dei Navigli, perfetto per giovani professionisti.",
        price: 1800,
        type: "affitto",
        address: "Via Navigli 42",
        city: "Milano",
        province: "MI",
        bedrooms: 2,
        bathrooms: 2,
        size: 90,
        floor: 1,
        totalFloors: 4,
        year: 2010,
        energyClass: "C",
        features: ["Balcone", "Parquet", "Cantina"],
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
        ],
        featured: true
      }
    ];

    for (const property of sampleProperties) {
      await propertyService.add(property);
    }
  };

  // Fallback per dati di esempio in caso di errore database
  const getSampleProperties = () => [
    {
      id: 1,
      title: "Appartamento Moderno Centro Storico",
      type: "vendita",
      price: 350000,
      location: "Milano Centro",
      address: "Via del Centro 15",
      city: "Milano",
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      description: "Splendido appartamento completamente ristrutturato nel cuore di Milano. Finiture di pregio e vista panoramica.",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80"
      ],
      features: ["Balcone", "Aria condizionata", "Parquet", "Ascensore"],
      energyClass: "A",
      year: 2020,
      floor: 3,
      totalFloors: 5,
      featured: true
    }
  ];

  const addProperty = async (propertyData) => {
    try {
      const id = await propertyService.add(propertyData);
      const newProperty = await propertyService.getById(id);
      setProperties(prev => [newProperty, ...prev]);
      
      // Aggiorna anche featuredProperties se è featured
      if (newProperty.featured) {
        const updatedFeatured = await propertyService.getFeatured();
        setFeaturedProperties(updatedFeatured);
      }
    } catch (error) {
      console.error('Errore aggiunta proprietà:', error);
      // Fallback locale
      const newProperty = {
        ...propertyData,
        id: Date.now(),
        images: propertyData.images || ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
      };
      setProperties(prev => [...prev, newProperty]);
    }
  };

  const updateProperty = async (id, updatedProperty) => {
    console.log('PropertyContext updateProperty called with:', { id, updatedProperty });
    try {
      console.log('Calling propertyService.update...');
      await propertyService.update(id, updatedProperty);
      console.log('propertyService.update completed, fetching updated property...');
      
      const updated = await propertyService.getById(id);
      console.log('Updated property fetched:', updated);
      
      setProperties(prev => prev.map(prop => 
        prop.id === id ? updated : prop
      ));
      
      // Aggiorna featuredProperties
      console.log('Updating featured properties...');
      const updatedFeatured = await propertyService.getFeatured();
      setFeaturedProperties(updatedFeatured);
      console.log('Featured properties updated successfully');
    } catch (error) {
      console.error('Errore aggiornamento proprietà:', error);
      // Fallback locale
      console.log('Using fallback local update');
      setProperties(prev => prev.map(prop => 
        prop.id === id ? { ...prop, ...updatedProperty, id } : prop
      ));
      throw error; // Re-throw per far gestire l'errore al chiamante
    }
  };

  const deleteProperty = async (id) => {
    try {
      await propertyService.delete(id);
      setProperties(prev => prev.filter(prop => prop.id !== id));
      setFeaturedProperties(prev => prev.filter(prop => prop.id !== id));
    } catch (error) {
      console.error('Errore eliminazione proprietà:', error);
      // Fallback locale
      setProperties(prev => prev.filter(prop => prop.id !== id));
      setFeaturedProperties(prev => prev.filter(prop => prop.id !== id));
    }
  };

  const getPropertyById = (id) => {
    return properties.find(prop => prop.id === parseInt(id));
  };

  const getPropertiesByType = (type) => {
    return properties.filter(prop => prop.type === type);
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      featuredProperties,
      loading,
      dbError,
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertyById,
      getPropertiesByType
    }}>
      {children}
    </PropertyContext.Provider>
  );
};