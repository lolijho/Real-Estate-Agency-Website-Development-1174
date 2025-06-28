import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBed, FiHome, FiMapPin, FiMaximize } = FiIcons;

const PropertyCard = ({ property, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/immobile/${property.id}`}>
        <div className="relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.type === 'vendita' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.type === 'vendita' ? 'Vendita' : 'Affitto'}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
              {formatPrice(property.price)}{property.type === 'affitto' ? '/mese' : ''}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center space-x-1 text-gray-600 mb-3">
            <SafeIcon icon={FiMapPin} className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiBed} className="h-4 w-4" />
              <span>{property.bedrooms} camere</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiHome} className="h-4 w-4" />
              <span>{property.bathrooms} bagni</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiMaximize} className="h-4 w-4" />
              <span>{property.size} m²</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">
            {property.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;