import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiLinkedin } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiHome} className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">Casa Bella</span>
            </div>
            <p className="text-gray-300 mb-4">
              La tua agenzia immobiliare di fiducia a Milano. Specializzati in vendite e affitti 
              di immobili di prestigio dal 1995.
            </p>
            <div className="flex space-x-4">
              <SafeIcon icon={FiFacebook} className="h-6 w-6 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
              <SafeIcon icon={FiInstagram} className="h-6 w-6 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
              <SafeIcon icon={FiLinkedin} className="h-6 w-6 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li><a href="#/vendite" className="text-gray-300 hover:text-primary-400 transition-colors">Vendite</a></li>
              <li><a href="#/affitti" className="text-gray-300 hover:text-primary-400 transition-colors">Affitti</a></li>
              <li><a href="#/chi-siamo" className="text-gray-300 hover:text-primary-400 transition-colors">Chi Siamo</a></li>
              <li><a href="#/contatti" className="text-gray-300 hover:text-primary-400 transition-colors">Contatti</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMapPin} className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Via Milano 123, 20121 Milano</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiPhone} className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+39 02 1234567</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">info@casabella.it</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Casa Bella. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;