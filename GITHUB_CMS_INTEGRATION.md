# 🔗 Integrazione GitHub CMS

## Panoramica

Il sistema CMS è completamente integrato con GitHub per permettere il salvataggio automatico e manuale delle modifiche direttamente nel repository. Questo consente di:

- ✅ **Salvataggio automatico** delle modifiche su GitHub
- ✅ **Sincronizzazione bidirezionale** tra locale e GitHub
- ✅ **Backup automatico** di tutti i contenuti
- ✅ **Versioning** completo delle modifiche
- ✅ **Collaborazione** multi-utente

## 🚀 Configurazione Iniziale

### 1. Creare un Personal Access Token

1. Vai su [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Clicca "Generate new token (classic)"
3. Assegna un nome descrittivo (es. "CMS Real Estate")
4. Seleziona i seguenti permessi:
   - ✅ `repo` (accesso completo ai repository)
   - ✅ `workflow` (se usi GitHub Actions)

5. Copia il token generato (inizia con `ghp_`)

### 2. Configurare il CMS

1. Accedi come admin al sito
2. Clicca su "Impostazioni" nella toolbar CMS
3. Nella sezione "Configurazione GitHub":
   - **Token GitHub**: Incolla il token creato
   - **Owner**: Il tuo username GitHub (es. `lolijho`)
   - **Repository**: Nome del repository (es. `Real-Estate-Agency-Website-Development-1174`)
   - **Branch**: `main` (o il branch principale)
   - **Auto-save**: Abilita per salvataggio automatico

4. Clicca "Salva Impostazioni"

## 📝 Funzionalità Disponibili

### Salvataggio Automatico

Quando abilitato, ogni modifica viene automaticamente salvata su GitHub dopo 5 secondi di inattività:

```javascript
// Esempio di modifica che attiva l'auto-save
updateContent('hero', 'title', 'Nuovo Titolo');
// → Auto-save su GitHub dopo 5 secondi
```

### Salvataggio Manuale

Usa il pulsante "Push" nella toolbar per salvare immediatamente:
- Crea un commit con timestamp
- Salva tutti i contenuti e impostazioni
- Mostra conferma di successo

### Sincronizzazione

Usa il pulsante "Sync" per caricare contenuti da GitHub:
- Scarica l'ultima versione da GitHub
- Sovrascrive i contenuti locali
- Ricarica automaticamente la pagina

## 📁 Struttura File GitHub

Il CMS crea un file `cms-data.json` nel repository con questa struttura:

```json
{
  "content": {
    "hero": {
      "title": "Benvenuti in Affitti Urbi",
      "subtitle": "La vostra agenzia di fiducia",
      "colors": {
        "background": "#ffffff",
        "text": "#1f2937"
      }
    },
    "properties": {
      // contenuti sezione immobili
    }
  },
  "settings": {
    "company": {
      "name": "Affitti Urbi",
      "email": "info@affittiurbi.it"
    },
    "github": {
      "autoSave": true,
      "branch": "main"
    }
  },
  "lastUpdate": "2024-01-15T10:30:00.000Z",
  "version": "1.0"
}
```

## 🔄 Workflow Tipico

### Modifica Contenuti

1. **Attiva modalità editing**: Clicca "Modifica" nella toolbar
2. **Modifica contenuti**: Clicca su testi/immagini per modificarli
3. **Auto-save**: Le modifiche vengono salvate automaticamente
4. **Verifica**: Controlla i commit su GitHub

### Collaborazione

1. **Sviluppatore A** modifica contenuti via CMS
2. **Auto-save** salva su GitHub
3. **Sviluppatore B** clicca "Sync" per aggiornare
4. **Contenuti sincronizzati** tra tutti gli utenti

## 🛠️ Risoluzione Problemi

### Token Non Valido

```
Errore: Token GitHub non configurato
```

**Soluzione**: Verifica che il token sia corretto e abbia i permessi `repo`

### Repository Non Trovato

```
Errore: Errore nel recupero del branch: Not Found
```

**Soluzione**: Controlla che owner/repository siano corretti

### Conflitti di Merge

```
Errore: Errore nel commit: conflict
```

**Soluzione**: 
1. Fai backup dei contenuti locali (Esporta)
2. Sincronizza da GitHub (Sync)
3. Riapplica le modifiche necessarie

### Auto-save Non Funziona

**Verifica**:
- ✅ Token configurato correttamente
- ✅ Auto-save abilitato nelle impostazioni
- ✅ Connessione internet attiva
- ✅ Console browser per errori

## 🔒 Sicurezza

### Best Practices

1. **Token Sicuro**: Non condividere mai il token GitHub
2. **Permessi Minimi**: Usa solo i permessi necessari
3. **Rotazione Token**: Rigenera periodicamente il token
4. **Backup**: Esporta regolarmente i contenuti

### Variabili d'Ambiente

Per maggiore sicurezza, puoi configurare il token come variabile d'ambiente:

```bash
# .env.local
VITE_GITHUB_TOKEN=ghp_your_token_here
```

## 📊 Monitoraggio

### Log Console

Il CMS logga tutte le operazioni GitHub:

```javascript
// Successo
console.log('Contenuti caricati da GitHub con successo');

// Warning
console.warn('Auto-save GitHub fallito:', error.message);

// Errore
console.error('Errore GitHub commit:', error);
```

### GitHub Actions (Opzionale)

Puoi configurare GitHub Actions per deploy automatico:

```yaml
# .github/workflows/deploy.yml
name: Deploy on CMS Update
on:
  push:
    paths:
      - 'cms-data.json'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
```

## 🎯 Funzionalità Avanzate

### Branching

Puoi configurare branch diversi per ambienti diversi:

- `main`: Produzione
- `staging`: Test
- `development`: Sviluppo

### Webhook

Configura webhook GitHub per notifiche in tempo reale delle modifiche.

### API Integration

Il sistema può essere esteso per integrazioni con altri servizi:

```javascript
// Esempio: notifica Slack dopo commit
const notifySlack = async (commitData) => {
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `CMS aggiornato: ${commitData.message}`
    })
  });
};
```

---

## 📞 Supporto

Per problemi o domande sull'integrazione GitHub:

1. Controlla i log della console browser
2. Verifica la configurazione GitHub
3. Testa con un repository di prova
4. Consulta la [documentazione GitHub API](https://docs.github.com/en/rest)

**Credenziali Admin**: `lorecucchini@gmail.com` / `Ylenia040590`