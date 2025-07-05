// API di test per verificare la configurazione Vercel Blob
export default async function handler(request, response) {
  // Headers CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  console.log('=== Test Configurazione Blob ===');

  try {
    // Verifica configurazione
    const config = {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.length : 0,
      storeId: process.env.BLOB_STORE_ID || 'non configurato',
      baseUrl: process.env.BLOB_BASE_URL || 'non configurato',
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };

    console.log('Configurazione Blob:', config);

    // Test import @vercel/blob
    let blobImportTest = false;
    try {
      const { put } = await import('@vercel/blob');
      blobImportTest = !!put;
    } catch (importError) {
      console.error('Errore import @vercel/blob:', importError);
    }

    const result = {
      success: true,
      message: 'Test configurazione Vercel Blob',
      configuration: config,
      blobImportAvailable: blobImportTest,
      ready: config.hasToken && config.storeId !== 'non configurato' && blobImportTest,
      instructions: {
        nextStep: config.hasToken 
          ? 'Configurazione completa! Prova l\'upload.' 
          : 'Configura BLOB_READ_WRITE_TOKEN su Vercel',
        vercelUrl: 'https://vercel.com/dashboard → Settings → Environment Variables'
      }
    };

    return response.status(200).json(result);

  } catch (error) {
    console.error('Errore test configurazione:', error);
    
    return response.status(500).json({
      success: false,
      error: 'Errore test configurazione',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

