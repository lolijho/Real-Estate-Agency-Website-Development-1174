import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiUsers, FiTrendingUp, FiHeart, FiShield, FiStar } = FiIcons;

const ChiSiamo = () => {
  const teamMembers = [
    {
      name: "Marco Rossi",
      role: "Fondatore & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      description: "25 anni di esperienza nel settore immobiliare milanese"
    },
    {
      name: "Laura Bianchi",
      role: "Direttore Vendite",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&q=80",
      description: "Specialista in immobili di lusso e investimenti"
    },
    {
      name: "Andrea Verdi",
      role: "Responsabile Affitti",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
      description: "Esperto in locazioni commerciali e residenziali"
    }
  ];

  const values = [
    {
      icon: FiShield,
      title: "Affidabilità",
      description: "Trasparenza e onestà in ogni transazione"
    },
    {
      icon: FiHeart,
      title: "Passione",
      description: "Amiamo quello che facciamo e lo facciamo con dedizione"
    },
    {
      icon: FiStar,
      title: "Eccellenza",
      description: "Puntiamo sempre al massimo della qualità"
    },
    {
      icon: FiUsers,
      title: "Relazioni",
      description: "Costruiamo rapporti duraturi con i nostri clienti"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Chi Siamo</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Da oltre 25 anni, Casa Bella è il punto di riferimento per il mercato immobiliare a Milano, 
              con un team di professionisti dedicati al successo dei nostri clienti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">La Nostra Storia</h2>
              <p className="text-lg text-gray-600 mb-6">
                Fondata nel 1995 da Marco Rossi, Casa Bella nasce dalla passione per l'immobiliare 
                e dalla volontà di offrire un servizio di eccellenza nel mercato milanese.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nel corso degli anni, abbiamo costruito una reputazione solida basata su fiducia, 
                competenza e risultati concreti. Ogni cliente è unico per noi, e ogni progetto 
                immobiliare viene seguito con la massima attenzione ai dettagli.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                  <div className="text-gray-600">Immobili Venduti</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">1200+</div>
                  <div className="text-gray-600">Clienti Soddisfatti</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80"
                alt="Ufficio Casa Bella"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Valori</h2>
            <p className="text-xl text-gray-600">
              Principi che guidano ogni nostra azione
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={value.icon} className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Il Nostro Team</h2>
            <p className="text-xl text-gray-600">
              Professionisti esperti al tuo servizio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Pronto a Iniziare?</h2>
            <p className="text-xl mb-8 text-gray-200">
              Contattaci oggi stesso per una consulenza gratuita
            </p>
            <a
              href="#/contatti"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>Contattaci Ora</span>
              <SafeIcon icon={FiTrendingUp} className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;