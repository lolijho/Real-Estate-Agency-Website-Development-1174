// API Upload nuova per bypassare cache Vercel
export default async function handler(request, response) {
  // Aggiungi headers CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gestisci preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  console.log('=== API Upload-New chiamata ===');
  console.log('Method:', request.method);
  console.log('URL:', request.url);

  try {
    // Per ora, restituiamo un mock dell'upload per testare
    if (request.method === 'POST') {
      console.log('POST request ricevuta su upload-new');
      
      // Simula un upload riuscito con URL mock
      const mockResponse = {
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
        success: true,
        message: 'Upload simulato con successo (API nuova)',
        timestamp: new Date().toISOString(),
        api: 'upload-new'
      };
      
      console.log('Restituendo mock response da upload-new:', mockResponse);
      return response.status(200).json(mockResponse);
    }
    
    // Gestisci GET per elencare immagini
    else if (request.method === 'GET') {
      console.log('GET request ricevuta su upload-new');
      
      const mockImages = {
        images: [
          {
            id: 1,
            filename: 'hero-image.jpg',
            blobUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
            createdAt: new Date().toISOString()
          }
        ],
        api: 'upload-new'
      };
      
      return response.status(200).json(mockImages);
    }
    
    else {
      return response.status(405).json({ 
        error: 'Metodo non supportato',
        method: request.method,
        api: 'upload-new'
      });
    }
    
  } catch (error) {
    console.error('Errore API upload-new:', error);
    
    // Restituisci sempre JSON valido
    return response.status(500).json({
      error: 'Errore interno del server',
      message: error.message,
      timestamp: new Date().toISOString(),
      api: 'upload-new',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

