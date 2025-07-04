# Affitti Urbi - Agenzia Immobiliare

Sito web per agenzia immobiliare con sistema CMS integrato.

## 🚀 Deploy su Vercel

### Problemi Risolti

Se il deploy su Vercel mostrava uno schermo bianco, i seguenti problemi sono stati risolti:

1. **Base Path**: Cambiato da `./` a `/` in `vite.config.js`
2. **Gestione Database**: Aggiunta gestione fallback quando le variabili d'ambiente non sono configurate
3. **LocalStorage**: Aggiunta protezione per SSR (Server Side Rendering)
4. **Build Ottimizzato**: Rimosso lint dal build principale per evitare errori di deploy

### Configurazione Vercel

1. **Variabili d'Ambiente (Opzionali)**:
   - `VITE_TURSO_DATABASE_URL`: URL del database Turso
   - `VITE_TURSO_AUTH_TOKEN`: Token di autenticazione Turso

   Se non configurate, l'app userà dati di esempio.

2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Scripts Disponibili

```bash
# Sviluppo locale
npm run dev

# Build per produzione
npm run build

# Build con controllo lint
npm run build:check

# Preview build locale
npm run preview

# Lint del codice
npm run lint
```

## 🔧 Funzionalità

- **Frontend**: React + Vite + Tailwind CSS
- **Routing**: React Router con HashRouter per compatibilità
- **Database**: Turso (opzionale, fallback a dati di esempio)
- **CMS**: Sistema di editing integrato per admin
- **Responsive**: Design ottimizzato per mobile e desktop

## 👤 Accesso Admin

- Email: `lorecucchini@gmail.com`
- Password: `Ylenia040590`

Oppure doppio click sul logo per accesso rapido.

## 🐛 Troubleshooting

### Schermo Bianco su Vercel

✅ **Risolto**: I problemi principali erano:
- Base path errato
- Errori di SSR con localStorage
- Gestione database non configurato

### Errori di Build

- Usa `npm run build` invece di `npm run build:check` se ci sono errori di lint
- Verifica che tutte le dipendenze siano installate

### Database Non Configurato

- L'app funziona anche senza database configurato
- Usa dati di esempio automaticamente
- Per configurare il database, aggiungi le variabili d'ambiente su Vercel

## 📁 Struttura Progetto

```
src/
├── components/     # Componenti React
├── context/        # Context providers
├── pages/          # Pagine dell'applicazione
├── lib/            # Utilities e database
└── common/         # Componenti comuni
```

## 🔄 Aggiornamenti

Per aggiornare il sito:
1. Modifica i file localmente
2. Commit e push su GitHub
3. Vercel rebuilderà automaticamente

Oppure usa il sistema CMS integrato per modifiche di contenuto.