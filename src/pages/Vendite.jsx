import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/PropertyContext';

const { FiFilter, FiSearch } = FiIcons;

const Vendite = () => {
  const { getPropertiesByType } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');

  const venditeProperties = getPropertiesByType('vendita');

  const filteredProperties = venditeProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
      (priceRange === '0-300000' && property.price <= 300000) ||
      (priceRange === '300000-500000' && property.price > 300000 && property.price <= 500000) ||
      (priceRange === '500000+' && property.price > 500000);
    
    const matchesBedrooms = bedrooms === 'all' || property.bedrooms.toString() === bedrooms;

    return matchesSearch && matchesPrice && matchesBedrooms;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Immobili in Vendita
          </h1>
          <p className="text-xl text-gray-600">
            Trova la casa perfetta per te tra le nostre proposte esclusive
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiFilter} className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtra Risultati</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca per titolo o località..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tutte le fasce di prezzo</option>
              <option value="0-300000">Fino a €300.000</option>
              <option value="300000-500000">€300.000 - €500.000</option>
              <option value="500000+">Oltre €500.000</option>
            </select>

            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Qualsiasi numero di camere</option>
              <option value="1">1 camera</option>
              <option value="2">2 camere</option>
              <option value="3">3 camere</option>
              <option value="4">4+ camere</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredProperties.length} immobili trovati
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiSearch} className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nessun immobile trovato
            </h3>
            <p className="text-gray-600">
              Prova a modificare i filtri di ricerca per trovare più risultati
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Vendite;