# Progetto "Beat Volley" — Specifiche Tecniche e Game Design

Documento di riferimento per lo sviluppo del gioco web **Beat Volley**: un board game digitale e tattico che fonde le regole della **pallavolo** con la passione per il **karaoke** e la musica, fruibile gratuitamente via browser senza costi di infrastruttura.

---

## 1. Visione del Gioco e Filosofia di Design

* **Nome Progetto:** *Beat Volley*
* **Genere:** Sportivo / Musicale a turni tattici con vista isometrica.
* **Piattaforma:** Web Application statica responsive (ottimizzata per smartphone in verticale e desktop).
* **I Due Pilastri Fondamentali:**
  1. **La Pallavolo:** Le 6 zone di campo, la rotazione oraria al cambio palla (*side-out*), la costruzione dell'azione (1, 2 o 3 tocchi), la tensione dello scambio, il muro e la schiacciata.
  2. **Il Karaoke e la Musica:** La memoria dei testi, l'ascolto di estratti celebri, la continuazione di strofe memorabili, l'istinto irrefrenabile di canticchiare mentalmente o a voce.
* **Principi Guida di Accessibilità e Comfort:**
  * **Nessun microfono o riconoscimento vocale:** Si gioca tramite selezioni visive e tocchi a schermo; nessun rischio di imbarazzo o di problemi con rumori ambientali.
  * **Nessun riflesso al millisecondo obbligatorio:** Il ritmo dell'azione entra in "Pausa Tattica" (Freeze-Frame) a ogni tocco per consentire di ragionare e godersi il brano senza ansia.
  * **Autonomia e Flessibilità Totale:** Sempre giocabile da soli contro una CPU intelligente, in modalità Pass & Play sullo stesso dispositivo, in stanze private 1vs1 o in multiplayer cooperativo a ruoli.

---

## 2. Motore Grafico e Visuale del Campo (Isometrico 2.5D)

Il campo non è un piano bidimensionale statico né un 3D pesante: è reso tramite **Canvas 2D con proiezione assonometrica isometrica (2.5D)**:

```
                          [CAMPO SQUADRA B]
                        Zona 4   Zona 3   Zona 2
                        Zona 5   Zona 6   Zona 1
                ══════════════ [RETE 3D] ══════════════
                        Zona 2   Zona 3   Zona 4
                        Zona 1   Zona 6   Zona 5
                          [CAMPO SQUADRA A]
```

### Elementi Visivi e Spaziali

1. **Il Campo e la Rete:**
   - Campo rettangolare inclinato con le 6 zone regolamentari per metà campo.
   - Rete centrale rialzata dotata di spessore e fascia superiore (*nastro*).
2. **Fisica Visiva della Palla (Coppia Spaziale $X, Y$ e Quota $Z$):**
   - La palla viaggia su archi parabolici fluidi.
   - **Ombra Proiettata al Suolo:** un'ombra ellittica sul pavimento indica con precisione il punto di caduta ($X, Y$), mentre la distanza tra palla e ombra indica l'altezza di volo ($Z$).
3. **Le Pedine Giocatore:**
   - 6 pedine/token circolari per squadra posizionate nelle rispettive zone.
   - Quando una pedina deve intervenire (ricevitore, palleggiatore o attaccante), si evidenzia con un alone luminoso e compie un piccolo scatto verso la palla.

---

## 3. Il Game Loop: Rally con "Campo in Pausa" (Freeze-Frame)

Lo scambio di gioco procede per fasi discrete. La palla vola, raggiunge il culmine della parabola e il campo entra in **Pausa Tattica**, mostrando la scheda sfida a schermo:

```
[BATTUTA] ──> Traiettoria Palla ──> [PAUSA RICEZIONE] (Scelta: 1, 2 o 3 Tocchi)
                                            │
           ┌────────────────────────────────┼────────────────────────────────┐
           ▼                                ▼                                ▼
       1 TOCCO                           2 TOCCHI                        3 TOCCHI
   (Rimando Diretto)               (Seconda Intenzione)             (Costruzione Piena)
           │                                │                                │
      Quiz Rapido                      Due Passaggi                  Alzata ──> Schiacciata
           │                                │                                │
           ▼                                ▼                                ▼
  [Palla torna subito]             [Attacco a Sorpresa]            [Schiacciata vs Muro]
```

### Le Fasi del Rally

1. **Servizio (Battuta):**
   - Chi serve (pedina in Zona 1) affronta la sfida iniziale (es. Blind Test audio o verso di apertura).
   - Se riuscita, la palla sorvola la rete verso il campo opposto con traiettoria tesa.
2. **Ricezione (Pausa Tattica e Scelta dei Tocchi):**
   - La palla si ferma a mezz'aria nel campo ricevente. Il giocatore sceglie la strategia tra **1, 2 o 3 tocchi**.
3. **Sviluppo dell'Attacco:**
   - L'azione si risolve attraverso le sfide musicali corrispondenti.
4. **Esito dello Scambio:**
   - **Punto a Terra:** Palla cade nel campo avversario (+1, +2 o +3 punti in base ai tocchi).
   - **Errore:** Se si sbaglia la risposta, la palla cade nel proprio campo e il punto va all'avversario.
   - **Rotazione:** Chi vince il punto su servizio avversario (*side-out*) conquista la battuta e la sua squadra ruota di una posizione in senso orario ($1 \rightarrow 6 \rightarrow 5 \rightarrow 4 \rightarrow 3 \rightarrow 2 \rightarrow 1$).

---

## 4. La Meccanica dei Tocchi Flessibili (Rischio vs Ricompensa)

La squadra in ricezione decide liberamente la profondità della propria manovra:

### Opzione 1: Rimando Diretto (1 Tocco — "Free Ball")
* **Concetto:** Respingere la palla subito al di là della rete senza costruire.
* **Meccanica:** Una singola domanda rapida.
* **Rischio:** Minimo; probabilità bassissima di commettere errori.
* **Ricompensa:** **1 punto**. L'attacco è debole e l'avversario riceverà una domanda facile al turno successivo.

### Opzione 2: Seconda Intenzione (2 Tocchi)
* **Concetto:** Ricezione del difensore seguita dall'attacco immediato a sorpresa del palleggiatore.
* **Meccanica:** Due sfide collegate in rapida successione.
* **Rischio:** Medio; un errore sul secondo tocco fa cadere la palla nel proprio campo.
* **Ricompensa:** **2 punti**. Riduce il tempo di reazione della difesa avversaria.

### Opzione 3: Costruzione Completa (3 Tocchi — Ricezione $\rightarrow$ Alzata $\rightarrow$ Schiacciata)
* **Concetto:** La combinazione classica di vertice della pallavolo.
* **Meccanica:** Ricezione perfetta $\rightarrow$ Alzata verso la Zona d'attacco (Banda o Centro) $\rightarrow$ Schiacciata all'apice del ritornello.
* **Rischio:** Elevato; richiede di superare 3 passaggi consecutivi.
* **Ricompensa:** **3 punti**. Mette massima pressione sull'avversario.

### Azione Speciale: Il Monster Block (Muro Diretto)
* Quando l'attaccante esegue una Schiacciata a 3 tocchi, il difensore può dichiarare il **Muro**.
* Entrambi affrontano la sfida: se il difensore risponde correttamente prima dell'attaccante, mura la palla a terra direttamente nel campo avversario (**Punto Diretto a Muro**). Se fallisce, l'attaccante fa punto (*Mani-e-Fuori*).

---

## 5. Audio & Testi: La Gestione Intelligente delle Sfide

Per garantire che la musica sia protagonista senza mai svelare le risposte o soffrire di problemi di sincronizzazione:

### A. Sfide Audio: Blind Test (Schermo Censurato)
* **Quando si usano:** Per le domande di riconoscimento (*"Chi canta questo brano?"*, *"Qual è il titolo della canzone?"*).
* **Comportamento:**
  - Viene riprodotto lo spezzone audio ufficiale da 30 secondi via iTunes Search API.
  - **A schermo tutti i metadati sono rigorosamente oscurati** (nessun nome artista, titolo o copertina).
  - Vengono presentate 4 opzioni di risposta anonimizzate.
  - Al termine dello scambio, compare a bordo campo il tesserino informativo completo del brano con copertina e dettagli.

### B. Sfide Testuali: Il Karaoke Prompter (Canta nella Tua Mente)
* **Quando si usano:** Per le sfide sui testi (*Completamento del ritornello*, *Verso successivo*, *Rima baciata*).
* **Comportamento:**
  - L'audio del brano viene sfumato o silenziato per non suggerire la risposta.
  - Il testo scorre visivamente a schermo stile prompter karaoke.
  - Il giocatore canticchia la strofa nella propria mente; il prompter si arresta su una lacuna e compaiono le opzioni di completamento.

### C. Il Beat Procedurale (Bonus "Perfect Beat")
* Durante il momento della risposta, il browser genera tramite **Web Audio API** un leggero battito ritmico (cassa/charleston sintetizzati a 0 KB, es. 110-120 BPM).
* Se il giocatore seleziona la risposta corretta e la preme **esattamente sul battere musicale (sul beat)**:
  - Scatta l'effetto visivo **"PERFECT BEAT!"**.
  - La palla schizza via con traiettoria più rapida o assegna un bonus di punteggio.
* Rispondere fuori tempo ma con la risposta giusta è comunque valido al 100% (il beat è solo un moltiplicatore di soddisfazione, mai una punizione).

---

## 6. Motore Playlist e Ricerca Dinamica iTunes

Il gioco non è confinato a una lista rigida di brani:

1. **Ricerca Dinamica tramite iTunes Search API pubblica:**
   - Ricerca libera o combinata con filtri (es. *Genere = "Pop Italiano"*, *Decennio = "Anni 90"*, filtri logici AND/OR su parole chiave).
   - Generazione di un catalogo casuale effettivo per ogni partita.
   - **Seed Deterministico:** All'avvio del match viene condiviso tra i dispositivi un numero di seed a 4 cifre: entrambi i client estraggono la stessa identica sequenza di brani.
2. **Gestione Playlist Locali:**
   - Possibilità per l'utente di comporre e salvare le proprie playlist tematiche in `localStorage` (*"I Miei Preferiti"*, *"Serata Karaoke"*, *"Sanremo Story"*).
   - In multiplayer, l'host sincronizza la playlist con la stanza inviando solo l'elenco degli identificatori brano (pochi byte di banda).

---

## 7. Modalità di Gioco e Flessibilità Partecipanti

Il gioco garantisce comfort totale sia in solitaria che in compagnia:

| Modalità | Giocatori | Dispositivi | Descrizione |
| :--- | :--- | :--- | :--- |
| **Solo Play (vs CPU)** | 1 Giocatore | 1 | Controllo dell'intera squadra contro una CPU con diversi stili di gioco (tattico, aggressivo, equilibrato). Nessuna attesa di terzi. |
| **Pass & Play** | 2 Giocatori | 1 | Stesso smartphone o tablet appoggiato sul tavolo. A ogni tocco il gioco passa il controllo all'altro contendente. |
| **1 contro 1 Online** | 2 Giocatori | 2 | Partita remota tramite codice stanza privato a 4 lettere su Firebase Realtime DB. Zero chat invasiva, solo reazioni grafiche. |
| **Multiplayer a Ruoli** | Da 2 a 12 | Più dispositivi | I partecipanti nella stanza si dividono le pedine in campo (es. un giocatore manovra il Palleggiatore, un altro gli Schiacciatori). Quando la palla vola in una zona, risponde il titolare di quel ruolo. |

---

## 8. Modello Dati JSON della Partita (Firebase Realtime DB)

Lo stato del match è memorizzato in un unico nodo `/rooms/{roomId}`:

```json
{
  "meta": {
    "status": "WAITING | PLAYING | FINISHED",
    "seed": 94821,
    "scoreTarget": 25,
    "currentSong": {
      "trackId": 1440783617,
      "audioPreviewUrl": "https://audio-ssl.itunes.apple.com/.../preview.m4a",
      "challengeType": "BLIND_ARTIST | BLIND_TITLE | LYRIC_CLOZE | RHYME_CHAIN"
    }
  },
  "score": {
    "teamA": 14,
    "teamB": 11,
    "serving": "teamA"
  },
  "court": {
    "phase": "SERVE | RECEIVE | SET | SPIKE | BLOCK",
    "activeZone": 4,
    "touchChoice": 3,
    "currentTouch": 2,
    "ballPosition": { "x": 120, "y": 80, "z": 45 },
    "isPaused": true
  },
  "teams": {
    "teamA": {
      "rotation": [1, 6, 5, 4, 3, 2],
      "playersAssigned": { "p1": [1, 6], "p2": [5, 4, 3, 2] }
    },
    "teamB": {
      "rotation": [1, 6, 5, 4, 3, 2],
      "playersAssigned": { "p3": [1, 2, 3, 4, 5, 6] }
    }
  }
}
```