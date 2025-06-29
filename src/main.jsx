import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CMSProvider>
        <PropertyProvider>
          <App />
        </PropertyProvider>
      </CMSProvider>
    </AuthProvider>
  </StrictMode>
);