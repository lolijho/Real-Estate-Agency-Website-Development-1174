// API di test per verificare il routing Vercel
export default function handler(req, res) {
  console.log('API Test chiamata:', req.method, req.url);
  
  res.status(200).json({ 
    success: true,
    message: 'API Test funzionante su Vercel!',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
}

