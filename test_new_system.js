import { 
  initializeCMSTables, 
  cmsContentService, 
  cmsImageService,
  settingsService 
} from './src/lib/database.js';

async function testNewSystem() {
  console.log('🧪 Test del nuovo sistema CMS...\n');
  
  try {
    // 1. Inizializza tabelle
    console.log('1. Inizializzazione tabelle...');
    await initializeCMSTables();
    console.log('✅ Tabelle CMS create con successo\n');
    
    // 2. Test contenuti CMS
    console.log('2. Test contenuti CMS...');
    await cmsContentService.setField('hero', 'title', 'Benvenuti in Affitti Urbi');
    await cmsContentService.setField('hero', 'subtitle', 'La tua casa ideale ti aspetta');
    
    const heroContent = await cmsContentService.getSection('hero');
    console.log('✅ Contenuti hero salvati:', heroContent);
    
    // 3. Test impostazioni
    console.log('\n3. Test impostazioni...');
    await settingsService.set('company', {
      name: 'Affitti Urbi',
      email: 'info@affittiurbi.it',
      phone: '+39 02 1234567'
    });
    
    const companySettings = await settingsService.get('company');
    console.log('✅ Impostazioni azienda salvate:', companySettings);
    
    // 4. Test recupero tutti i contenuti
    console.log('\n4. Test recupero contenuti...');
    const allContent = await cmsContentService.getAll();
    console.log('✅ Tutti i contenuti:', Object.keys(allContent));
    
    console.log('\n🎉 Tutti i test completati con successo!');
    
  } catch (error) {
    console.error('❌ Errore nei test:', error);
  }
}

testNewSystem();
