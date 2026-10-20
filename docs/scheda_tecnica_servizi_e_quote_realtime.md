# Scheda Tecnica: Servizi Cloud, Limiti e Comportamento di Rete

Documento di riferimento tecnico per architetture frontend statiche (ospitate su GitHub Pages o equivalenti) che necessitano di comunicazione in tempo reale senza costi di infrastruttura.

---

## 1. Tabella Comparativa dei Piani Gratuiti

| Servizio | Modello di Misurazione | Limite Connessioni Simultanee | Limite Volume / Frequenza | Persistenza Dati |
| :--- | :--- | :--- | :--- | :--- |
| **Firebase Realtime DB** | **Volume Dati (GB)** scaricati | **100 client** contemporanei | **10 GB/mese** di download<br>1 GB di archiviazione su disco | **Sì** (database JSON permanente su disco) |
| **Playroom** | **Utenti Unici Giornalieri (DAU)** | N/D (gestito per stanza) | **10 utenti unici al giorno** (piano gratuito base) | **No** (stato volatile, azzerato a chiusura stanza) |
| **Ably** | **Numero Messaggi** transitati | **200 client** contemporanei | **6.000.000 di messaggi/mese**<br>(max 200 canali aperti insieme) | **No** (solo buffer di transito temporaneo di ~2 minuti) |
| **Pusher Channels** | **Numero Eventi** inviati | **100 client** contemporanei | **200.000 eventi/giorno** (~6M/mese) | **No** (solo transito) |
| **Supabase (Realtime)** | **Numero Messaggi** canale broadcast | **200 client** contemporanei | **2.000.000 di messaggi/mese** | **Opzionale** (solo se collegato a PostgreSQL) |

---

## 2. Analisi Dettagliata dei Servizi

### Firebase Realtime Database
* **Metrica primaria:** Non conta quanti messaggi vengono inviati, ma quanti **byte/gigabyte escono dai suoi server** (downlink).
* **Vantaggi operativi:**
  * Il limite di 100 connessioni è **istantaneo**: se gli utenti non giocano tutti nello stesso secondo, il servizio può supportare decine di migliaia di sessioni al giorno.
  * Meccanismo di presenza nativo (`onDisconnect`): rileva automaticamente la caduta della linea e pulisce i dati obsoleti.
* **Criticità:**
  * Ogni volta che un nodo del database viene aggiornato, il server invia l'intero sotto-albero a tutti i client in ascolto. Alberi dati troppo profondi o disordinati moltiplicano il download di banda.

### Playroom
* **Metrica primaria:** Licenza orientata al numero di persone che caricano l'app nelle 24 ore (**10 DAU**).
* **Vantaggi operativi:**
  * Progettato specificamente per la fisica e gli input dei giochi (ottimizzazione degli stati, riconnessione host, matchmaking con codice stanza a 4 cifre).
* **Criticità:**
  * Il tetto di 10 utenti al giorno è molto stringente: rende la piattaforma adatta a fasi di test e prototipi privati, ma inadatta a un rilascio pubblico a traffico incontrollato se non si passa a piani a pagamento.

### Ably
* **Metrica primaria:** Conteggio selettivo dei singoli messaggi.
  * *Esempio di conteggio:* 1 messaggio inviato in un canale con 10 ascoltatori = 10 messaggi consumati dalla quota.
* **Vantaggi operativi:**
  * Garanzia dell'ordine dei messaggi (message ordering), bassissima latenza WebSocket, gestione integrata degli utenti online/offline (*Presence API*).
* **Criticità:**
  * Se usato per sincronizzare movimenti continui (coordinate $X, Y$) a frequenza elevata, il tetto di 6 milioni di messaggi si esaurisce in pochissimo tempo.

---

## 3. Comportamento su Reti Dati Mobili (4G / 5G / CGNAT)

### Perché il WebRTC P2P Puro fallisce tra due cellulari
1. **Carrier-Grade NAT (CGNAT):** Gli operatori mobili non assegnano indirizzi IPv4 pubblici ai terminali. Migliaia di smartphone condividono lo stesso gateway pubblico.
2. **NAT Simmetrico:** I router degli operatori mobili modificano la mappatura delle porte per ogni destinazione differente.
3. **Impossibilità di Hole Punching:** Due dispositivi mobili entrambi sotto NAT simmetrico non possono connettersi direttamente via STUN. Senza un server TURN dedicato che faccia da ponte fisico (consumando banda a pagamento), il canale dati diretto non si apre.

### Perché i servizi WebSocket e Database Cloud funzionano sempre
* Sia Firebase che Ably e Playroom instaurano una connessione **in uscita** dal dispositivo verso un server pubblico centrale su porta standard HTTPS (`443`).
* Questo flusso viene trattato dal CGNAT dell'operatore come una normale sessione di navigazione web, garantendo la compatibilità totale indipendentemente dalla rete cellulare o dai cambi di cella radio.

---

## 4. Matematica del Traffico: Calcolo di Consumi e Frequenze

### Chat Testuale
* **Peso medio:** ~100–150 byte per messaggio (comprensivo di metadati come orario, mittente e identificatore avatar).
* **Impatto su Ably:** 10.000 messaggi al giorno corrispondono a 300.000 messaggi/mese (5% della quota mensile).
* **Impatto su Firebase:** 10.000 messaggi al giorno corrispondono a circa 45 MB di download mensile (0,45% dei 10 GB disponibili).

### Sincronizzazione Gioco Realtime
La trasmissione di coordinate continue richiede il controllo rigoroso della frequenza di invio:

| Frequenza di Invio | Messaggi per Giocatore al Secondo | Consumo Orario (Partita a 2) | Rischio Quota Mensile |
| :--- | :--- | :--- | :--- |
| **60 Hz** (Frame rate nativo) | 60 msg/s | 432.000 messaggi/ora | **Incompatibile** con quote a messaggio (Ably muore in ~14 ore). |
| **10 Hz** (Throttling a 100 ms) | 10 msg/s | 72.000 messaggi/ora | Gestibile su Firebase con carichi leggeri. |
| **Ad Evento** (Solo al click / cambio direzione) | 0.5–2 msg/s | ~7.200 messaggi/ora | **Ideale** sia per Firebase che per Ably. |

---

## 5. Gestione Risorse Multimediali a Traffico Zero

Per mantenere l'hosting statico e non consumare le quote dei database:

1. **Avatar Utente:**
   * Distribuire una serie di icone fisse all'interno della cartella dell'applicazione.
   * La rete scambia unicamente l'indice numerico o una stringa breve identificativa.
   * Il client ricevente carica l'icona locale corrispondente già presente nella cache del browser.

2. **GIF animate e Sticker:**
   * I file pesanti (spesso tra 1 MB e 4 MB ciascuno) **non devono transitare** nel database o nel canale WebSocket.
   * Il mittente seleziona la risorsa tramite librerie pubbliche (Giphy, Tenor).
   * Il messaggio di chat veicola unicamente la stringa URL (peso: ~50 byte).
   * Ciascun client visualizzatore scarica l'immagine direttamente dal Content Delivery Network (CDN) del provider terzo, senza incidere sui limiti dell'app.