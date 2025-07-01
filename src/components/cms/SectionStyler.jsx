import React, { useEffect } from 'react';
import { useCMS } from '../../context/CMSContext';

const SectionStyler = () => {
  const { getSectionColors, getSectionCustomCSS } = useCMS();

  useEffect(() => {
    // Rimuovi stili esistenti del CMS se presenti
    const existingStyle = document.getElementById('cms-dynamic-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Lista delle sezioni
    const sections = ['hero', 'properties', 'services', 'about', 'contact', 'footer'];
    
    let dynamicCSS = '';

    // Genera CSS per ogni sezione
    sections.forEach(sectionId => {
      const colors = getSectionColors(sectionId);
      const customCSS = getSectionCustomCSS(sectionId);

      // Se ha colori personalizzati, genera CSS
      if (Object.keys(colors).length > 0) {
        dynamicCSS += generateSectionCSS(sectionId, colors);
      }

      // Aggiungi CSS custom
      if (customCSS) {
        dynamicCSS += `\n/* CSS Custom per ${sectionId} */\n${customCSS}\n`;
      }
    });

    // Inietta CSS dinamico se presente
    if (dynamicCSS) {
      const styleElement = document.createElement('style');
      styleElement.id = 'cms-dynamic-styles';
      styleElement.type = 'text/css';
      styleElement.innerHTML = dynamicCSS;
      document.head.appendChild(styleElement);
    }
  }, [getSectionColors, getSectionCustomCSS]);

  // Funzione per generare CSS basato sui colori
  const generateSectionCSS = (sectionId, colors) => {
    let css = `\n/* Colori dinamici per ${sectionId} */\n`;

    switch (sectionId) {
      case 'hero':
        css += `
.hero-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.hero-section .hero-box {
  ${colors.boxBackground ? `background-color: ${colors.boxBackground} !important;` : ''}
}
.hero-section h1, .hero-section .hero-title {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.hero-section p, .hero-section .hero-subtitle {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.hero-section .hero-overlay {
  ${colors.overlay ? `background-color: ${colors.overlay} !important;` : ''}
}
.hero-section .btn-primary, .hero-section .hero-btn-primary {
  ${colors.buttonPrimary ? `background-color: ${colors.buttonPrimary} !important;` : ''}
  ${colors.buttonPrimary ? `border-color: ${colors.buttonPrimary} !important;` : ''}
}
.hero-section .btn-secondary, .hero-section .hero-btn-secondary {
  ${colors.buttonSecondary ? `border-color: ${colors.buttonSecondary} !important;` : ''}
  ${colors.buttonSecondary ? `color: ${colors.buttonSecondary} !important;` : ''}
}
.hero-section .btn-secondary:hover, .hero-section .hero-btn-secondary:hover {
  ${colors.buttonSecondary ? `background-color: ${colors.buttonSecondary} !important;` : ''}
}
`;
        break;

      case 'properties':
        css += `
.properties-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.properties-section h2, .properties-section .section-title {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.properties-section p, .properties-section .section-text {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.properties-section .property-card {
  ${colors.cardBackground ? `background-color: ${colors.cardBackground} !important;` : ''}
}
.properties-section .property-price {
  ${colors.price ? `color: ${colors.price} !important;` : ''}
}
.properties-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
        break;

      case 'services':
        css += `
.services-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.services-section h2, .services-section .section-title {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.services-section p, .services-section .section-text {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.services-section .service-card {
  ${colors.cardBackground ? `background-color: ${colors.cardBackground} !important;` : ''}
}
.services-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
        break;

      case 'about':
        css += `
.about-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.about-section h2, .about-section .section-title {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.about-section p, .about-section .section-text {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.about-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
        break;

      case 'contact':
        css += `
.contact-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.contact-section h2, .contact-section .section-title {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.contact-section p, .contact-section .section-text {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.contact-section .contact-form {
  ${colors.formBackground ? `background-color: ${colors.formBackground} !important;` : ''}
}
.contact-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
        break;

      case 'footer':
        css += `
.footer-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.footer-section, .footer-section h3, .footer-section p, .footer-section a {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.footer-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
        break;

      default:
        css += `
.${sectionId}-section {
  ${colors.background ? `background-color: ${colors.background} !important;` : ''}
}
.${sectionId}-section h1, .${sectionId}-section h2, .${sectionId}-section h3 {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.${sectionId}-section p {
  ${colors.text ? `color: ${colors.text} !important;` : ''}
}
.${sectionId}-section .accent-color {
  ${colors.accent ? `color: ${colors.accent} !important;` : ''}
}
`;
    }

    return css;
  };

  // Non renderizza nulla, è solo per side effects
  return null;
};

export default SectionStyler; 