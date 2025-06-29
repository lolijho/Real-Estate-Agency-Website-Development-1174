import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from '../components/PropertyCard';
import { useProperty } from '../context/PropertyContext';
import EditableText from '../components/cms/EditableText';
import EditableImage from '../components/cms/EditableImage';

const { FiSearch, FiTrendingUp, FiShield, FiHeart, FiArrowRight } = FiIcons;

const Home = () => {
  const { featuredProperties, loading, dbError } = useProperty();

  // Fallback se non ci sono immobili in evidenza
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : [
    {
      id: 'demo-1',
      title: "Appartamento Moderno Centro Milano",
      description: "Splendido appartamento nel cuore di Milano",
      price: 350000,
      type: "vendita",
      address: "Via del Centro 15, Milano",
      bedrooms: 3,
      bathrooms: 2,
      size: 120,
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"]
    },
    {
      id: 'demo-2', 
      title: "Villa con Giardino",
      description: "Elegante villa con ampio giardino privato",
      price: 750000,
      type: "vendita", 
      address: "Via delle Ville 23, Monza",
      bedrooms: 4,
      bathrooms: 3,
      size: 250,
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"]
    },
    {
      id: 'demo-3',
      title: "Trilocale Zona Navigli", 
      description: "Caratteristico trilocale nei Navigli",
      price: 1800,
      type: "affitto",
      address: "Via Navigli 42, Milano", 
      bedrooms: 2,
      bathrooms: 2,
      size: 90,
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"]
    }
  ];

  const stats = [
    { label: 'Immobili Venduti', value: '500+', icon: FiTrendingUp },
    { label: 'Clienti Soddisfatti', value: '1200+', icon: FiHeart },
    { label: 'Anni di Esperienza', value: '25+', icon: FiShield },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative">
          {/* Background Image Editable */}
          <div className="absolute inset-0">
            <EditableImage
              sectionId="hero"
              field="backgroundImage"
              defaultValue="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
              className="w-full h-full object-cover"
              alt="Hero Background"
              placeholder="Carica immagine di sfondo"
            />
            <div className="absolute inset-0 bg-primary-900 bg-opacity-60"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <EditableText
                sectionId="hero"
                field="title"
                defaultValue="Trova la Casa dei Tuoi Sogni"
                tag="h1"
                className="text-5xl md:text-6xl font-bold mb-6"
                placeholder="Inserisci il titolo principale"
              />
              <EditableText
                sectionId="hero"
                field="subtitle"
                defaultValue="Con Affitti Urbi, il tuo nuovo inizio è a portata di mano"
                tag="p"
                className="text-xl md:text-2xl mb-8 text-gray-200"
                placeholder="Inserisci il sottotitolo"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/vendite"
                  className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSearch} className="h-5 w-5" />
                  <span>Esplora Vendite</span>
                </Link>
                <Link
                  to="/affitti"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiSearch} className="h-5 w-5" />
                  <span>Scopri Affitti</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={stat.icon} className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <EditableText
              sectionId="featured"
              field="title"
              defaultValue="Immobili in Evidenza"
              tag="h2"
              className="text-4xl font-bold text-gray-900 mb-4"
              placeholder="Titolo sezione immobili"
            />
            <EditableText
              sectionId="featured"
              field="subtitle"
              defaultValue="Scopri le nostre migliori proposte selezionate per te"
              tag="p"
              className="text-xl text-gray-600"
              placeholder="Sottotitolo sezione immobili"
            />
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-gray-600 mt-4">Caricamento immobili...</p>
            </div>
          ) : (
            <>
              {dbError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <SafeIcon icon={FiSearch} className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Modalità Demo
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>{dbError} Gli immobili mostrati sono solo di esempio.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              to="/vendite"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <span>Vedi Tutti gli Immobili</span>
              <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <EditableText
              sectionId="services"
              field="title"
              defaultValue="Perché Scegliere Affitti Urbi"
              tag="h2"
              className="text-4xl font-bold text-gray-900 mb-4"
              placeholder="Titolo sezione servizi"
            />
            <EditableText
              sectionId="services"
              field="subtitle"
              defaultValue="La nostra esperienza al tuo servizio"
              tag="p"
              className="text-xl text-gray-600"
              placeholder="Sottotitolo sezione servizi"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiShield} className="h-8 w-8 text-primary-600" />
              </div>
              <EditableText
                sectionId="services"
                field="service1_title"
                defaultValue="Affidabilità"
                tag="h3"
                className="text-xl font-semibold text-gray-900 mb-4"
                placeholder="Titolo servizio 1"
              />
              <EditableText
                sectionId="services"
                field="service1_description"
                defaultValue="25 anni di esperienza nel settore immobiliare milanese"
                tag="p"
                className="text-gray-600"
                placeholder="Descrizione servizio 1"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiHeart} className="h-8 w-8 text-primary-600" />
              </div>
              <EditableText
                sectionId="services"
                field="service2_title"
                defaultValue="Professionalità"
                tag="h3"
                className="text-xl font-semibold text-gray-900 mb-4"
                placeholder="Titolo servizio 2"
              />
              <EditableText
                sectionId="services"
                field="service2_description"
                defaultValue="Team qualificato per accompagnarti in ogni fase"
                tag="p"
                className="text-gray-600"
                placeholder="Descrizione servizio 2"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiTrendingUp} className="h-8 w-8 text-primary-600" />
              </div>
              <EditableText
                sectionId="services"
                field="service3_title"
                defaultValue="Risultati"
                tag="h3"
                className="text-xl font-semibold text-gray-900 mb-4"
                placeholder="Titolo servizio 3"
              />
              <EditableText
                sectionId="services"
                field="service3_description"
                defaultValue="Oltre 500 immobili venduti e 1200 clienti soddisfatti"
                tag="p"
                className="text-gray-600"
                placeholder="Descrizione servizio 3"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;