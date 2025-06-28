import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProperty } from '../context/PropertyContext';

const { FiArrowLeft, FiBed, FiHome, FiMaximize, FiMapPin, FiCalendar, FiLayers, FiCheck, FiPhone, FiMail, FiChevronLeft, FiChevronRight } = FiIcons;

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = useProperty();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const property = getPropertyById(id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Immobile non trovato</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="h-5 w-5" />
            <span>Torna indietro</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mb-8"
            >
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    >
                      <SafeIcon icon={FiChevronLeft} className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    >
                      <SafeIcon icon={FiChevronRight} className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>

                {/* Property type badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.type === 'vendita' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.type === 'vendita' ? 'Vendita' : 'Affitto'}
                  </span>
                </div>
              </div>

              {/* Thumbnail gallery */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              
              <div className="flex items-center space-x-1 text-gray-600 mb-6">
                <SafeIcon icon={FiMapPin} className="h-5 w-5" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiBed} className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-sm text-gray-600">Camere</div>
                  <div className="text-xl font-semibold text-gray-900">{property.bedrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiHome} className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-sm text-gray-600">Bagni</div>
                  <div className="text-xl font-semibold text-gray-900">{property.bathrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiMaximize} className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-sm text-gray-600">Superficie</div>
                  <div className="text-xl font-semibold text-gray-900">{property.size} m²</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiLayers} className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-sm text-gray-600">Classe</div>
                  <div className="text-xl font-semibold text-gray-900">{property.energyClass}</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Descrizione</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dettagli Aggiuntivi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiCalendar} className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Anno di costruzione</span>
                  </div>
                  <div className="text-lg font-medium text-gray-900">{property.year || 'Non specificato'}</div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiLayers} className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Piano</span>
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {property.floor !== undefined ? `${property.floor}° piano` : 'Non specificato'}
                    {property.totalFloors && ` di ${property.totalFloors}`}
                  </div>
                </div>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Caratteristiche</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price and Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(property.price)}
                  {property.type === 'affitto' && <span className="text-lg text-gray-600">/mese</span>}
                </div>
                <div className="text-gray-600">
                  {property.type === 'vendita' ? 'Prezzo di vendita' : 'Canone mensile'}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiMail} className="h-5 w-5" />
                  <span>Richiedi Informazioni</span>
                </button>
                
                <a
                  href="tel:+390212345678"
                  className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiPhone} className="h-5 w-5" />
                  <span>Chiama Ora</span>
                </a>
              </div>

              {showContactForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t"
                >
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Il tuo nome"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="email"
                      placeholder="La tua email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="tel"
                      placeholder="Il tuo telefono"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <textarea
                      placeholder="Messaggio (opzionale)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Invia Richiesta
                    </button>
                  </form>
                </motion.div>
              )}
            </motion.div>

            {/* Agency Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Affitti Urbi</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMapPin} className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Via Milano 123, Milano</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPhone} className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">+39 02 1234567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">info@affittiurbi.it</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;