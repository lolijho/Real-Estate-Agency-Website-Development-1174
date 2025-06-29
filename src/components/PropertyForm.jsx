import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSave, FiX, FiPlus } = FiIcons;

const PropertyForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [imageUrls, setImageUrls] = useState(initialData?.images || ['']);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      type: 'vendita',
      energyClass: 'A'
    }
  });

  useEffect(() => {
    if (initialData) {
      // Converti features da array a stringa per l'input
      const featuresString = Array.isArray(initialData.features) 
        ? initialData.features.join(', ') 
        : initialData.features || '';
      
      reset({
        ...initialData,
        province: initialData.province || 'MI',
        features: featuresString
      });
      setImageUrls(initialData.images || ['']);
    } else {
      reset({
        type: 'vendita',
        energyClass: 'A',
        province: 'MI'
      });
      setImageUrls(['']);
    }
  }, [initialData, reset]);

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const onFormSubmit = (data) => {
    console.log('Form submitted with data:', data);
    
    const validImageUrls = imageUrls.filter(url => url.trim() !== '');
    
    // Gestisci features con controlli extra di sicurezza
    let processedFeatures = [];
    console.log('Processing features:', { type: typeof data.features, value: data.features });
    
    if (data.features !== null && data.features !== undefined) {
      if (Array.isArray(data.features)) {
        // Se è già un array, usalo direttamente
        console.log('Features is array, using directly');
        processedFeatures = data.features;
      } else if (typeof data.features === 'string' && data.features.trim() !== '') {
        // Se è una stringa non vuota, splittala
        console.log('Features is string, splitting');
        processedFeatures = data.features.split(',').map(f => f.trim()).filter(f => f.length > 0);
      } else {
        console.log('Features is neither string nor array, using empty array');
        processedFeatures = [];
      }
    } else {
      console.log('Features is null/undefined, using empty array');
      processedFeatures = [];
    }
    
    const formattedData = {
      ...data,
      images: validImageUrls.length > 0 ? validImageUrls : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
      price: parseFloat(data.price),
      bedrooms: parseInt(data.bedrooms),
      bathrooms: parseInt(data.bathrooms),
      size: parseInt(data.size),
      year: data.year ? parseInt(data.year) : null,
      floor: data.floor ? parseInt(data.floor) : null,
      totalFloors: data.totalFloors ? parseInt(data.totalFloors) : null,
      features: processedFeatures
    };
    
    console.log('Formatted data:', formattedData);
    
    try {
      onSubmit(formattedData);
    } catch (error) {
      console.error('Errore nel submit del form:', error);
      alert('Errore nell\'invio del form. Controlla la console per maggiori dettagli.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Modifica Immobile' : 'Aggiungi Nuovo Immobile'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titolo *
              </label>
              <input
                {...register('title', { required: 'Il titolo è obbligatorio' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Es: Appartamento Moderno Centro Storico"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                {...register('type', { required: 'Il tipo è obbligatorio' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo (€) *
              </label>
              <input
                type="number"
                {...register('price', { required: 'Il prezzo è obbligatorio', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="350000"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indirizzo *
              </label>
              <input
                {...register('address', { required: 'L\'indirizzo è obbligatorio' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Via Roma 123"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Città *
              </label>
              <input
                {...register('city', { required: 'La città è obbligatoria' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Milano"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provincia
              </label>
              <input
                {...register('province')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="MI"
                maxLength={2}
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camere *
              </label>
              <input
                type="number"
                {...register('bedrooms', { required: 'Il numero di camere è obbligatorio', min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bagni *
              </label>
              <input
                type="number"
                {...register('bathrooms', { required: 'Il numero di bagni è obbligatorio', min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (m²) *
              </label>
              <input
                type="number"
                {...register('size', { required: 'La superficie è obbligatoria', min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe Energetica
              </label>
              <select
                {...register('energyClass')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anno di Costruzione
              </label>
              <input
                type="number"
                {...register('year', { min: 1800, max: new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Piano
              </label>
              <input
                type="number"
                {...register('floor', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Piani Totali
              </label>
              <input
                type="number"
                {...register('totalFloors', { min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="5"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione *
            </label>
            <textarea
              {...register('description', { required: 'La descrizione è obbligatoria' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descrivi l'immobile in dettaglio..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caratteristiche (separate da virgola)
            </label>
            <input
              {...register('features')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Balcone, Aria condizionata, Parquet, Ascensore"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Immagini
            </label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4" />
              <span>Aggiungi Immagine</span>
            </button>
          </div>

          {/* Featured Checkbox */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                🌟 Mostra in Homepage (Immobile in Evidenza)
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Seleziona questa opzione per far apparire l'immobile nella sezione "Immobili in Evidenza" della homepage
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 col-span-1 md:col-span-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiSave} className="h-4 w-4" />
              <span>{initialData ? 'Aggiorna' : 'Salva'}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PropertyForm;