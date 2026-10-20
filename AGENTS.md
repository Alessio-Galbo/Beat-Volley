# Beat Volley — Web Game Serverless

Web application statica sportiva e musicale che unisce le meccaniche della pallavolo e del karaoke/cultura musicale, con campo isometrico 2.5D e architettura serverless su GitHub Pages.

## Struttura
| Percorso | Contenuto |
|---|---|
| `docs/` | Documentazione tecnica, specifiche di game design e framework serverless |
| `docs/maps/` | Mappe del codice e dell'architettura |
| `web/` | Web application statica (Canvas 2D isometrico, CSS, logica di gioco) |
| `PROGRESS.md` | Stato di avanzamento lavori (skill `progress-checklist`) |
| `CHANGELOG.md` | Registro tecnico delle modifiche |
| `NOVITA.md` | Novità e note di rilascio utente |

## Regole
- Testi dell'interfaccia: in file di lingua (`locales/it.json`), mai hardcoded nel codice.
- Niente CSS/JS inline, niente HTML nelle stringhe JS.
- File di codice ≤ 100 righe (refactor a 90); prima riga = commento docstring di scopo.
- Zero server proprietari: hosting 100% statico su GitHub Pages, API pubbliche (iTunes Search API) e Firebase RTDB (Spark free tier) per multiplayer opzionale.
- Nessuna menzione di tratti psicologici personali nei commit o nei documenti pubblici.
- Commit in inglese con percorsi espliciti (mai `git add .`).
