// API di debug per identificare il problema dell'upload
export default async function handler(request, response) {
  console.log('=== DEBUG API UPLOAD ===');
  console.log('Method:', request.method);
  console.log('Headers:', request.headers);
  
  try {
    // Test 1: Verifica variabili d'ambiente
    const envCheck = {
      TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
      VITE_TURSO_DATABASE_URL: !!process.env.VITE_TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      VITE_TURSO_AUTH_TOKEN: !!process.env.VITE_TURSO_AUTH_TOKEN,
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Environment variables:', envCheck);
    
    // Test 2: Verifica import
    let handleUploadAvailable = false;
    try {
      const { handleUpload } = await import('@vercel/blob');
      handleUploadAvailable = !!handleUpload;
      console.log('handleUpload import successful:', handleUploadAvailable);
    } catch (importError) {
      console.error('handleUpload import failed:', importError);
    }
    
    // Test 3: Verifica database
    let databaseAvailable = false;
    try {
      const { createClient } = await import('@libsql/client');
      const DATABASE_URL = process.env.TURSO_DATABASE_URL || process.env.VITE_TURSO_DATABASE_URL;
      const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN;
      
      if (DATABASE_URL && AUTH_TOKEN) {
        const client = createClient({
          url: DATABASE_URL,
          authToken: AUTH_TOKEN,
        });
        
        // Test connessione
        await client.execute('SELECT 1');
        databaseAvailable = true;
        console.log('Database connection successful');
      }
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
    }
    
    // Risposta di debug
    const debugInfo = {
      timestamp: new Date().toISOString(),
      method: request.method,
      environment: envCheck,
      handleUploadAvailable,
      databaseAvailable,
      vercelRegion: process.env.VERCEL_REGION || 'unknown',
      nodeVersion: process.version
    };
    
    return response.status(200).json({
      success: true,
      message: 'Debug API funzionante',
      debug: debugInfo
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    
    return response.status(500).json({
      success: false,
      error: 'Debug API failed',
      message: error.message,
      stack: error.stack
    });
  }
}

