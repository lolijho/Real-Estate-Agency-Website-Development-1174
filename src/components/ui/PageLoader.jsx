import React, { useState, useEffect } from 'react';
import './PageLoader.css';

const PageLoader = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setShowLoader(true);
      
      // Simula il progresso di caricamento
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowLoader(false);
              onComplete && onComplete();
            }, 300);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      // Se non è in caricamento, completa immediatamente
      setProgress(100);
      setTimeout(() => {
        setShowLoader(false);
        onComplete && onComplete();
      }, 100);
    }
  }, [isLoading, onComplete]);

  if (!showLoader) return null;

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-center">
        {/* Casetta SVG */}
        <div className="house-container">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            className="house-svg"
          >
            {/* Sfondo nero che si riempie */}
            <defs>
              <clipPath id="houseClip">
                {/* Tetto */}
                <polygon points="60,20 20,50 100,50" />
                {/* Casa */}
                <rect x="25" y="50" width="70" height="50" />
                {/* Porta */}
                <rect x="50" y="70" width="20" height="30" />
                {/* Finestre */}
                <rect x="35" y="60" width="12" height="12" />
                <rect x="73" y="60" width="12" height="12" />
              </clipPath>
            </defs>
            {/* Contorno bianco della casa */}
            <g fill="none" stroke="white" strokeWidth="2">
              {/* Tetto */}
              <polygon points="60,20 20,50 100,50" />
              {/* Casa */}
              <rect x="25" y="50" width="70" height="50" />
              {/* Porta */}
              <rect x="50" y="70" width="20" height="30" />
              {/* Finestre */}
              <rect x="35" y="60" width="12" height="12" />
              <rect x="73" y="60" width="12" height="12" />
            </g>
            {/* Riempimento nero che cresce */}
            <rect 
              x="0" 
              y={120 - (progress * 1.2)} 
              width="120" 
              height={progress * 1.2}
              fill="white"
              clipPath="url(#houseClip)"
            />
          </svg>
        </div>
        {/* Testo di caricamento */}
        <h3>Affitti Urbi</h3>
        <p>Caricamento in corso...</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default PageLoader;

