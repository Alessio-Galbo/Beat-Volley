# Framework Architetturale per Web Games Serverless (GitHub Pages)

Documento di riferimento tecnico e architetturale standard per lo sviluppo di giochi web distribuiti gratuitamente tramite **GitHub Pages**, senza server proprietari, a costo zero permanente e resilienti alle reti mobili (4G/5G sotto CGNAT).

---

## 1. Principi Fondamentali dell'Architettura

L'obiettivo del framework è consentire a qualsiasi gioco di operare secondo un modello **100% Client-Side** con sincronizzazione opzionale, rispettando 4 pilastri:

1. **Zero Costi Fissi e Zero Manutenzione Server:**
   Nessun container Node.js, VPS, database gestito a pagamento o runtime serverless con fatturazione a tempo. Tutto il codice applicativo viene servito come file statici (HTML, CSS, JavaScript/TypeScript compilato) tramite CDN statica gratuita (GitHub Pages, Cloudflare Pages o Netlify).
2. **Disaccoppiamento Totale della Connettività (`NetworkAdapter`):**
   Il core logico del gioco (regole, punteggi, turni) non deve contenere riferimenti diretti a socket o database di rete. Comunica unicamente con un'interfaccia astratta di trasporto.
3. **Resilienza su Reti Mobili (CGNAT e NAT Simmetrico):**
   Scambio dati basato su protocollo HTTPS/WSS (porta 443) verso broker centralizzati con piani gratuiti ampi (Firebase Realtime DB, Ably). Viene scartato il WebRTC P2P puro non mediato da TURN per evitare il fallimento delle connessioni tra smartphone sotto carrier mobile.
4. **Zero Dipendenze da Risorse Pesanti:**
   Grafica vettoriale (SVG/Canvas), suoni sintetizzati tramite Web Audio API a 0 KB o streaming di preview legali esterne con CORS abilitato nativamente.

---

## 2. Diagramma Architetturale del Framework

```
┌──────────────────────────────────────────────────────────────────┐
│                   INTERFACCIA UTENTE & INPUT                    │
│             (Canvas 2D / DOM Reattivo / Web Audio API)           │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                   CORE GAME ENGINE DETERMINISTICO                │
│             • Macchina a Stati Finiti (FSM)                      │
│             • Regole di Gioco & Validazione Azioni              │
│             • Generatore Numeri Pseudo-Casuali con Seed (PRNG)   │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                   NETWORK ADAPTER (Interfaccia)                  │
├───────────────────┬──────────────────────────┬───────────────────┤
│   SoloAdapter     │    PassAndPlayAdapter    │  FirebaseAdapter  │
│ (Partita vs CPU)  │  (Stesso Schermo/Tavolo) │ (1vs1 / Stanza)   │
└───────────────────┴──────────────────────────┴───────────────────┘
```

---

## 3. Il Pattern `NetworkAdapter`

Ogni gioco implementa la seguente interfaccia unificata di rete:

```typescript
export interface GameAction<T = any> {
  type: string;
  senderId: string;
  payload: T;
  timestamp: number;
}

export interface NetworkAdapter {
  // Ciclo di vita della sessione
  init(roomId?: string): Promise<string>; // Restituisce il roomId attivo
  leave(): Promise<void>;

  // Scambio messaggi e azioni
  dispatch(action: GameAction): Promise<void>;
  onAction(callback: (action: GameAction) => void): void;

  // Stato di connessione e presenza
  onPlayerStatusChange(callback: (players: PlayerStatus[]) => void): void;
  getLatency(): number;
}
```

### Le 3 Implementazioni Standard

1. **`SoloAdapter` (Giocatore Singolo contro Bot/CPU):**
   - Non apre alcuna connessione di rete.
   - Le azioni del giocatore vengono elaborate localmente.
   - Quando il turno passa alla CPU, un modulo AI locale calcola la mossa dopo un ritardo simulato naturale (500–1200 ms) e invia l'azione di risposta all'engine.
   - Funziona al 100% offline (supporto PWA / Service Worker).

2. **`PassAndPlayAdapter` (Locale da Tavolo):**
   - Due o più giocatori utilizzano lo stesso dispositivo (smartphone, tablet o PC).
   - L'adapter gestisce semplicemente il cambio di turno visivo a schermo, memorizzando lo stato in memoria volatile o `sessionStorage`.

3. **`FirebaseRealtimeAdapter` (Multiplayer Remoto):**
   - Utilizza **Firebase Realtime Database** nel piano gratuito Spark:
     - 100 connessioni simultanee.
     - **10 GB/mese di downlink** (consente oltre 500.000 partite/mese se i pacchetti sono contenuti entro 1–2 KB).
   - **Protocollo ad Evento (Delta-Sync):** la rete trasmette solo le azioni discrete (`SERVE`, `TOUCH`, `SCORE`), mai coordinate continue a 60 Hz.
   - **Meccanismo di Presenza e Reconnect:**
     - Monitoraggio di `.info/connected` per rilevare cambi di cella 4G/Wi-Fi.
     - Attivazione di `onDisconnect()` per segnalare la caduta della connessione.
     - Finestra di tolleranza di 30 secondi prima di considerare abbandonata la partita.

---

## 4. Macchina a Stati Finiti (FSM) e Seme Condiviso (PRNG)

Per mantenere perfettamente sincronizzati due client senza un server autoritativo pesante:

1. **Stato Puro e Determinismo:**
   L'engine di gioco è una funzione pura:
   $$\text{Stato}_{t+1} = f(\text{Stato}_t, \text{Azione})$$
   A parità di stato iniziale e sequenza di azioni, due client calcolano lo stesso identico risultato.

2. **Seme Casuale Condiviso (PRNG):**
   All'avvio della stanza, l'host genera un intero a 32 bit (`seed`) e lo scrive nei metadati della partita.
   Tutti i client inizializzano un generatore di numeri pseudo-casuali (es. algoritmo *Mulberry32* o *xoshiro128**):
   - L'ordine dei brani, le domande estratte e le traiettorie casuali risulteranno identiche su tutti i dispositivi senza dover trasmettere elenchi completi via rete.

---

## 5. Pipeline Risorse a Traffico Zero (Zero-Cost Media)

Per garantire che l'app rimanga gratuita per sempre senza violare quote o dipendere da storage cloud:

| Risorsa | Soluzione Tecnica | Consumo Dati |
| :--- | :--- | :--- |
| **Effetti Sonori & Beat** | Sintesi procedurale tramite **Web Audio API** (oscillatori, filtri, noise generator locali). | **0 KB** (codice puro) |
| **Audio Preview Brani** | Chiamate dirette via HTTPS all'endpoint pubblico ufficiale di **Apple iTunes Search API** (CORS aperto). | Scaricato direttamente dal CDN Apple dal singolo client |
| **Grafica e Sprite** | Vettori **SVG inline** e rendering procedurale su **Canvas 2D**. | Pochi KB inclusi nel bundle iniziale |
| **Playlist e Preferenze** | Salvataggio nel browser dell'utente tramite `localStorage` / `IndexedDB`. | **0 KB** su server |

---

## 6. Sicurezza e Accesso Utente

1. **Zero Login / Zero Dati Personali:**
   Nessuna profilazione o raccolta email. L'utente sceglie un nickname temporaneo e un avatar locale predefinito.
2. **Accesso Istantaneo alle Stanze:**
   Codice stanza breve (es. 4 caratteri: `VOLY`) o link diretto (`https://sito.github.io/gioco/?room=VOLY`).
3. **Regole di Sicurezza Firebase (Spark Free Tier):**
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": true,
           ".write": "data.child('meta/status').val() !== 'FINISHED' || !data.exists()",
           "actions": {
             ".indexOn": "timestamp"
           }
         }
       }
     }
   }
   ```
