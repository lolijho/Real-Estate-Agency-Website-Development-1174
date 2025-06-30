import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const { FiHome, FiMenu, FiX, FiSettings, FiLogOut } = FiIcons;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  
  // Controlla se il CMS è disponibile (evita errori se non wrappato)
  let cmsToolbarVisible = false;
  try {
    const cms = useCMS();
    cmsToolbarVisible = isAdmin && cms; // CMS toolbar visibile solo se admin e CMS context disponibile
  } catch (error) {
    // CMS context non disponibile, usa solo isAdmin
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Accesso admin segreto con doppio click sul logo
  const handleLogoDoubleClick = () => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  };

  const publicNavItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Vendite', path: '/vendite' },
    { name: 'Affitti', path: '/affitti' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Contatti', path: '/contatti' }
  ];

  const adminNavItems = [
    { name: 'Gestione', path: '/gestione-annunci', icon: FiSettings }
  ];

  const navItems = isAdmin ? [...publicNavItems, ...adminNavItems] : publicNavItems;

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`bg-white shadow-lg sticky z-40 ${
        cmsToolbarVisible ? 'top-[72px]' : 'top-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <SafeIcon icon={FiHome} className="h-8 w-8 text-primary-600" />
              <span 
                className="text-2xl font-bold text-gray-900 select-none cursor-pointer"
                onDoubleClick={handleLogoDoubleClick}
                title={!isAdmin ? "Doppio click per accesso admin" : ""}
              >
                Affitti Urbi
              </span>
            </Link>
            {!isAdmin && (
              <Link 
                to="/admin/login"
                className="text-xs text-gray-400 hover:text-primary-600 transition-colors ml-2"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.icon && <SafeIcon icon={item.icon} className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Admin Logout Button */}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <SafeIcon icon={item.icon} className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Admin Logout Button */}
              {isAdmin && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                  <span>Logout Admin</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;