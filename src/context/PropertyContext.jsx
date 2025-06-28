import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Dati di esempio per lo sviluppo
  useEffect(() => {
    const sampleProperties = [
      {
        id: 1,
        title: "Appartamento Moderno Centro Storico",
        type: "vendita",
        price: 350000,
        location: "Milano Centro",
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
        totalFloors: 5
      },
      {
        id: 2,
        title: "Villa con Giardino",
        type: "vendita",
        price: 750000,
        location: "Monza Brianza",
        bedrooms: 4,
        bathrooms: 3,
        size: 250,
        description: "Elegante villa indipendente con ampio giardino privato. Ideale per famiglie.",
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
        ],
        features: ["Giardino", "Garage", "Camino", "Terrazza"],
        energyClass: "B",
        year: 2015,
        floor: 0,
        totalFloors: 2
      },
      {
        id: 3,
        title: "Bilocale Luminoso",
        type: "affitto",
        price: 1200,
        location: "Porta Garibaldi",
        bedrooms: 1,
        bathrooms: 1,
        size: 65,
        description: "Moderno bilocale in zona Porta Garibaldi, completamente arredato e di recente ristrutturazione.",
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
        ],
        features: ["Arredato", "Balcone", "Aria condizionata"],
        energyClass: "A",
        year: 2018,
        floor: 2,
        totalFloors: 6
      },
      {
        id: 4,
        title: "Trilocale Zona Navigli",
        type: "affitto",
        price: 1800,
        location: "Navigli",
        bedrooms: 2,
        bathrooms: 2,
        size: 90,
        description: "Caratteristico trilocale nella vivace zona dei Navigli, perfetto per giovani professionisti.",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
        ],
        features: ["Balcone", "Parquet", "Cantina"],
        energyClass: "C",
        year: 2010,
        floor: 1,
        totalFloors: 4
      }
    ];
    setProperties(sampleProperties);
  }, []);

  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: Date.now(),
      images: property.images || ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
    };
    setProperties(prev => [...prev, newProperty]);
  };

  const updateProperty = (id, updatedProperty) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, ...updatedProperty } : prop
    ));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(prop => prop.id !== id));
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