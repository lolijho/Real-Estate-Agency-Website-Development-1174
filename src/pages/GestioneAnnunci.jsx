import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyForm from '../components/PropertyForm';
import { useProperty } from '../context/PropertyContext';

const { FiPlus, FiEdit, FiTrash2, FiEye, FiSettings } = FiIcons;

const GestioneAnnunci = () => {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperty();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(prop => prop.type === filter);

  const handleAddProperty = (propertyData) => {
    addProperty(propertyData);
    setShowForm(false);
  };

  const handleEditProperty = (propertyData) => {
    updateProperty(editingProperty.id, propertyData);
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo immobile?')) {
      deleteProperty(id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestione Annunci
            </h1>
            <p className="text-xl text-gray-600">
              Gestisci i tuoi immobili in modo semplice e veloce
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProperty(null);
              setShowForm(true);
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="h-5 w-5" />
            <span>Aggiungi Immobile</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <SafeIcon icon={FiSettings} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Totale Immobili</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiSettings} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Vendita</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.type === 'vendita').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <SafeIcon icon={FiSettings} className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Affitto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.type === 'affitto').length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Filtra per:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'Tutti' },
                { value: 'vendita', label: 'Vendita' },
                { value: 'affitto', label: 'Affitto' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Properties Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {filteredProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Immobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prezzo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Località
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dettagli
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {property.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.type === 'vendita'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.type === 'vendita' ? 'Vendita' : 'Affitto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(property.price)}
                        {property.type === 'affitto' && '/mese'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.bedrooms} cam • {property.bathrooms} bagni • {property.size} m²
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`#/immobile/${property.id}`}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Visualizza"
                          >
                            <SafeIcon icon={FiEye} className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => {
                              setEditingProperty(property);
                              setShowForm(true);
                            }}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Modifica"
                          >
                            <SafeIcon icon={FiEdit} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Elimina"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiSettings} className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nessun immobile trovato
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Non hai ancora aggiunto nessun immobile'
                  : `Nessun immobile in ${filter} trovato`
                }
              </p>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowForm(true);
                }}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Aggiungi Primo Immobile
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          onSubmit={editingProperty ? handleEditProperty : handleAddProperty}
          onCancel={() => {
            setShowForm(false);
            setEditingProperty(null);
          }}
          initialData={editingProperty}
        />
      )}
    </div>
  );
};

export default GestioneAnnunci;