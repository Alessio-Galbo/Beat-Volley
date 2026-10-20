# Changelog — Beat Volley

Tutte le modifiche tecniche documentate con file e prove.

## [Non rilasciato] — 2026-10-19

### Grafica, Rendering & Prospettiva
- Supporto a doppia prospettiva commutabile: **Vista Inclinata 85°** (`web/assets/court/arena_background_85deg.jpg` e `volleyball_net_85deg.png`) con maglie della rete visibili e seggiolone, e **Vista Laterale Ortogonale 90°** (`arena_background.jpg` e `volleyball_net_90deg.png`) perfettamente allineata alla mezzeria.
- Memorizzazione automatica della prospettiva preferita in `localStorage` (`beat_volley_view`).
- Risoluzione nativa Full HD 1920x1080 con supporto HiDPI, rimozione totale di sgranature a schermo intero tramite regole CSS `:fullscreen` con `object-fit: contain` (`web/css/canvas.css`).
- Pulizia totale del canale alfa e rimozione dello spill verde da tutti gli sprite (`female_ready.png`, `male_ready.png`, `volleyball_net_85deg.png`, `volleyball_net_90deg.png`).
- Aggiunta sprite d'azione in elevazione ad alta definizione: Schiacciata (`female_spike.png`) e Muro a rete (`male_block.png`).
- Creazione del modulo dedicato `web/js/athlete_renderer.js` per proporzioni native, ombra sul parquet che scala con l'elevazione e specchiatura orizzontale.
- Coerenza visiva al 100% tra gli avatar HUD (`web/assets/avatars/avatar_atleta1.png`, `avatar_atleta2.png`) e i volti degli atleti in campo.
- Generazione favicon per eliminare errori 404 in console (`web/favicon.ico`).
- Verifica visiva automatizzata headless Chrome CDP con 0 errori in console e 4 screenshot di prova.

## [Precedente] — 2026-10-14

### Documentazione & Architettura
- Creazione `docs/framework_web_games_serverless.md`: blueprint architetturale riutilizzabile per giochi serverless su GitHub Pages (NetworkAdapter, FSM, Zero-Cost Media, CGNAT resilience).
- Aggiornamento `docs/specifiche_tecniche_e_game_design_beat_volley.md`: GDD completo di Beat Volley (vista laterale aerea simmetrica con rete centrale, rally a Freeze-Frame con 1-2-3 tocchi, Blind Test audio con schermo censurato, Karaoke Prompter, ricerca dinamica iTunes e playlist locali, beat procedurale Web Audio API, multiplayer flessibile).
- Organizzazione repository secondo standard AI-hub: cartella `docs/`, `AGENTS.md`, `PROGRESS.md`, `CHANGELOG.md`, `NOVITA.md`, `.gitignore`, `README.md`.

### Grafica, Ambiente & Rendering
- Rimozione di qualsiasi nome o riferimento di cartoni animati in favore di identificatori neutri e personalizzabili (*Atleta 1, Atleta 2, ecc.*).
- Creazione dell'illustrazione completa dello stadio/palestra in stile anime sportivo anni '80 (`web/assets/court/arena_background.jpg`): parquet lucido, zona libera di sicurezza azzurra, spalti con pubblico, tabellone segnapunti e riflettori (eliminato il vuoto di sfondo).
- Creazione e isolamento in trasparenza dello sprite della rete da pallavolo professionale (`web/assets/court/volleyball_net.png`): pali imbottiti blu, seggiolone dell'arbitro, antenne regolamentari rosse e bianche, maglia a quadretti neri e nastro superiore.
- Integrazione sprite atletici a corpo intero in alta risoluzione con chroma-key trasparente (`web/assets/court/player_female_ready.png`, `web/assets/court/player_male_ready.png`).
- Riprogettazione del motore di rendering (`web/js/court_renderer.js`) per visuale laterale aerea simmetrica a 960x540 con atleti allineati sul piano di contatto e orientati verso la rete.
- Controlli per schermo intero del campo (`web/test_assets.html`).
