# Avanzamento — Beat Volley (aggiornato: 2026-10-14)

## Domande per te
- **R1** (2026-10-14) Come sincronizzare iTunes preview ed LRCLIB? → Svincolato il gioco dallo streaming obbligatorio: Blind Test audio con schermo censurato (30s) + prompter karaoke per testi a mente.
- **R2** (2026-10-14) Come gestire la prospettiva e le modalità? → Vista laterale aerea simmetrica (rete al centro, Squadra A a sinistra / Squadra B a destra) in arena da pallavolo completa.
- **D1** (2026-10-14) Decisione presa: Grafica ad alta definizione in stile anime sportivo anni '80 (arena con parquet e spalti, rete professionale isolata, atleti illustrati orientati verso la rete) + audio Web Audio API.

## Ora
- [ ] Risoluzione HiDPI/Fullscreen nativa (1080p) e correzione angolatura rete a 85°-90° allineata alla mezzeria del campo — `web/` — IN LAVORAZIONE: Antigravity (Gemini) dal 2026-10-14 22:58

## Prossimi
- [ ] Implementazione modulo Blind Test audio e Karaoke Prompter
- [ ] Implementazione core loop a FSM del rally con Freeze-Frame a ogni tocco (1, 2, 3 tocchi)
- [ ] Scomposizione scheletrica dei keyframe d'azione (ricezione, schiacciata, muro) con teste intercambiabili
- [ ] Implementazione NetworkAdapter (Solo contro Bot, Pass & Play, Firebase RTDB 1vs1)

## Prove da fare
- [ ] 0.1 Aprire `http://127.0.0.1:8109/test_assets.html` nel browser → Verificare l'arena completa in stile anime 80s (parquet, spalti, riflettori), la rete professionale con seggiolone al centro, l'orientamento corretto degli atleti e la traiettoria della palla con ombra.

## Per il futuro

## Idee di sviluppo futuro
### Gameplay
- [ ] **R-001** `idea` Effetti visivi a particelle su Canvas per "Perfect Beat" su schiacciata e monster block
- [ ] **R-002** `idea` Editor e importatore/esportatore visuale di playlist locali personalizzate
