import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CMSToolbar from './components/cms/CMSToolbar';
import SectionStyler from './components/cms/SectionStyler';
import PageLoader from './components/ui/PageLoader';
import { useCMS } from './context/CMSContext';
import Home from './pages/Home';
import Vendite from './pages/Vendite';
import Affitti from './pages/Affitti';
import ChiSiamo from './pages/ChiSiamo';
import Contatti from './pages/Contatti';
import GestioneAnnunci from './pages/GestioneAnnunci';
import PropertyDetail from './pages/PropertyDetail';
import AdminLogin from './pages/AdminLogin';
import MediaLibrary from './pages/MediaLibrary';

function App() {
  const { showPageLoader } = useCMS();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* PageLoader - mostra durante il caricamento */}
        <PageLoader isLoading={showPageLoader} />
        
        {/* Contenuto principale - nascosto durante il caricamento */}
        <div style={{ opacity: showPageLoader ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          <CMSToolbar />
          <SectionStyler />
          <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vendite" element={<Vendite />} />
            <Route path="/affitti" element={<Affitti />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/gestione-annunci" 
              element={
                <ProtectedRoute>
                  <GestioneAnnunci />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/media-library" 
              element={
                <ProtectedRoute>
                  <MediaLibrary />
                </ProtectedRoute>
              } 
            />
            <Route path="/immobile/:id" element={<PropertyDetail />} />
          </Routes>
        </motion.main>
        <Footer />
        </div> {/* Chiusura div contenuto principale */}
      </div>
    </Router>
  );
}

export default App;