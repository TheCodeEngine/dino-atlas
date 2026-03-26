# Dino-Atlas - Umsetzungsplan

> Abhakliste fuer die Implementierung. Jede Phase baut auf der vorherigen auf.
> Status: [ ] offen, [~] in Arbeit, [x] fertig

---

## Phase 0: Projekt-Setup & Infrastruktur

Ziel: Alles laeuft lokal, leeres Geruest steht, `make dev` startet den Stack.

- [x] Monorepo initialisieren (pnpm Workspaces, `pnpm-workspace.yaml`)
- [x] Shared Configs (`tsconfig.base.json`)
- [x] Package-Stubs anlegen (leere `package.json` + `src/index.ts`):
  - [x] `packages/ui` (@dino-atlas/ui) — mit Button, Design Tokens
  - [x] `packages/types` (@dino-atlas/types) — alle Types definiert
  - [x] `packages/minigames` (@dino-atlas/minigames) — mit GameWrapper
  - [x] `apps/app` (@dino-atlas/app) — Vite + React + TanStack Query
  - [x] `apps/landing` (@dino-atlas/landing) — Stub
  - [x] `apps/storybook` (@dino-atlas/storybook) — Config + Preview
- [x] Rust Backend Projekt (`backend/`, Cargo.toml, Axum Health-Endpoint)
- [x] Generator Worker Projekt (`generator/`, Cargo.toml, Poll-Loop Stub)
- [x] TTS Service Stub (`tts-api/`, Express mit /tts/health, /tts/audio, /tts/timestamps)
- [x] PocketBase Setup (Image + Seed-Script Stub)
- [x] Docker Compose (alle 8 Services, Netzwerke, Volumes, Profiles)
- [x] Docker Compose Override (Dev Hot-Reload, Storybook)
- [x] Traefik Config (Rate Limiting, CORS, Security Headers)
- [x] Makefile (dev, dev-storybook, infra-up, seed, reset, build, test, tunnel, logs)
- [x] `.env.example` mit allen benoetigten Variablen
- [x] `.gitignore`
- [x] Dockerfiles (Production + Dev) fuer Backend, Generator, App, Landing, TTS, Storybook
- [ ] `pnpm install` laeuft fehlerfrei
- [ ] `make dev` startet den kompletten Stack fehlerfrei

---

## Phase 1: Datenbank & Seed-Pipeline

Ziel: PocketBase hat das Schema, Seed-Script befuellt Basis-Dinos, alles reproduzierbar.

- [ ] PocketBase Collections Schema definieren (JSON):
  - [ ] FAMILIES
  - [ ] USERS (Auth)
  - [ ] PLAYERS
  - [ ] DINO_SPECIES
  - [ ] EXPEDITIONS
  - [ ] MUSEUM_ENTRIES
  - [ ] STORIES
  - [ ] MINIGAME_SESSIONS
  - [ ] DAILY_BUDGETS
  - [ ] BUDGET_RESETS
  - [ ] AI_MODELS
  - [ ] AI_MODEL_ROUTING
  - [ ] AI_USAGE_LOG
- [ ] Schema-Import Script (`pocketbase/seed/import.sh`)
- [ ] Dino-Seed-Daten aufbauen (aus altem Prototyp + erweitert):
  - [ ] 15-20 Basis-Dinos mit vollstaendigen Fakten (deutsch + lateinisch)
  - [ ] Erdzeitalter, Ernaehrung, Groesse, Gewicht, Kontinent
  - [ ] Kindgerechte Texte (kid_summary, fun_fact, detail_text)
  - [ ] Groessenvergleiche ("So gross wie 2 Autos!")
  - [ ] Quiz-Fragen pro Dino (3-5 Stueck)
- [ ] Seed-Script fuer Dino-Daten (`pocketbase/seed/species.jsonl`)
- [ ] Seed-Script fuer AI_MODELS (Gemini Flash, Pro, Imagen mit Preisen)
- [ ] Seed-Script fuer AI_MODEL_ROUTING (Default-Zuordnungen)
- [ ] `make seed` befuellt die DB reproduzierbar
- [ ] `make reset` setzt DB zurueck + seed neu

---

## Phase 2: UI-Kit & Storybook

Ziel: Alle visuellen Bausteine stehen in Storybook, bevor Logik drankommt.

### Design Foundation
- [ ] Design Tokens definieren (tokens.css):
  - [ ] Farbpalette (Dino-Theme: Erdtoene, Gruen, Sand, Akzentfarben)
  - [ ] Typografie (kindgerecht, gut lesbar)
  - [ ] Spacing, Radien, Schatten
- [ ] Tailwind Config mit Custom Theme
- [ ] Storybook Setup + laeuft mit `make dev-storybook`

### Primitive Komponenten
- [ ] Button (Primary, Secondary, Icon-Button, kindgerechte Groesse)
- [ ] Icon (Dino-Icons, UI-Icons)
- [ ] Badge (Sterne, Abzeichen)
- [ ] ProgressBar (Fortschrittsbalken, auch fuer Grabung)
- [ ] Panel / Card (Grundlayout-Element)

### Dino-Komponenten
- [ ] DinoCard (Bild + Name + Kurz-Fakten)
- [ ] PlayerAvatar (Forscher-Avatar mit Name)
- [ ] PlayerSelector ("Wer ist dabei?" - Avatar-Auswahl)
- [ ] ForscherSpeech (Sprechblase mit Text, TTS-Trigger-Button)
- [ ] KaraokeText (Text mit Satz-Highlighting, Audio-Sync)
- [ ] SleepyDino (Muede-Animation: Gaehnen, Hinlegen, Schlafen)
- [ ] Confetti (Jubel-Effekt bei Entdeckung)
- [ ] TimerBudget (Visuelles Budget: Mond/Sterne, Dino-Energie)
- [ ] PhotoCapture (Kamera-Aufnahme Komponente)

### Layouts
- [ ] GameLayout (Vollbild fuer Spiele, mit Exit-Button)
- [ ] MuseumLayout (Galerie/Scroll-Ansicht)
- [ ] AppShell (Navigation, aktive Spieler Anzeige)

### Alle Komponenten haben Storybook Stories

---

## Phase 3: Mini-Games (isoliert in Storybook)

Ziel: Jedes Spiel funktioniert standalone mit Mock-Daten in Storybook.

### Shared Game Infrastructure
- [ ] GameWrapper Komponente (einheitlicher Rahmen: Timer, Score, Exit)
- [ ] useGameState Hook (Shared State Pattern)
- [ ] useHaptics Hook (Vibration)
- [ ] useSound Hook (Sound-Effekte)
- [ ] MinigameProps Interface definieren (types Package)

### Kern-Spiele (Expedition-Flow)
- [ ] **ExcavationGame** - Ausbuddeln
  - [ ] Canvas-basierte Wisch-Mechanik (aus altem Prototyp adaptieren)
  - [ ] Verschiedene Boden-Texturen (Wueste, Eis, Dschungel, Unterwasser)
  - [ ] Haptik-Feedback bei Knochen-Freilegung
  - [ ] Fortschritts-Tracking (% freigelegt)
  - [ ] Jubel-Animation bei Abschluss
  - [ ] Storybook Story mit verschiedenen Dinos

- [ ] **PuzzleGame** - Skelett zusammensetzen
  - [ ] Drag & Drop Knochen-Teile
  - [ ] Adaptive Teile-Anzahl (Schwierigkeit)
  - [ ] Snap-to-Position wenn nah genug
  - [ ] Optionale Umriss-Hilfe
  - [ ] Skelett-erwacht-zum-Leben Animation
  - [ ] Storybook Story

- [ ] **IdentifyGame** - Dino erkennen
  - [ ] Skelett-Anzeige
  - [ ] Mehrere Dino-Bilder zur Auswahl
  - [ ] Hinweis-System bei falsch ("Schau mal, langer Hals...")
  - [ ] Konfetti + Dino-Ruf bei richtig
  - [ ] Storybook Story

### Zusatz-Spiele (Mini-Games via Museum)
- [ ] **QuizGame** - Dino-Quiz mit Bildern + Vorlesefunktion
- [ ] **SizeSortGame** - Dinos der Groesse nach sortieren
- [ ] **TimelineGame** - Erdzeitalter zuordnen (visuell)
- [ ] **FoodMatchGame** - Futter-Zuordnung
- [ ] **ShadowGuessGame** - Silhouette erkennen

---

## Phase 4: Rust Backend

Ziel: API steht, Domain-Logik getestet, Auth funktioniert.

### Domain Layer (keine externen Dependencies)
- [ ] Models definieren:
  - [ ] Player, Family
  - [ ] DinoSpecies, DinoFact
  - [ ] Expedition, ExcavationResult, PuzzleResult
  - [ ] Museum, ArtworkSubmission
  - [ ] Story, StorySegment
  - [ ] DailyBudget, BudgetReset
  - [ ] MinigameSession
- [ ] Ports (Traits) definieren:
  - [ ] PlayerRepository
  - [ ] DinoRepository
  - [ ] ExpeditionRepository
  - [ ] MuseumRepository
  - [ ] AiGateway
  - [ ] TtsGateway
  - [ ] JobQueue
- [ ] Services implementieren + testen:
  - [ ] ExpeditionService (Dino-Zuweisung, Tages-Expedition)
  - [ ] DifficultyService (adaptiver Schwierigkeitsgrad)
  - [ ] BudgetService (Bildschirmzeit, muede Dinos, Reset-Validierung)
  - [ ] StoryService (Kombinations-Geschichte Prompt bauen)
  - [ ] QuizService (Quiz generieren, auswerten)
  - [ ] MuseumService (Sammlung verwalten)
  - [ ] PhotoEvalService (Bewertungs-Prompt bauen)

### Adapter Layer
- [ ] PocketBase Client (reqwest Wrapper)
- [ ] PocketBase Repos (impl Traits fuer alle Repositories)
- [ ] Valkey Client (Job-Queue Adapter)
- [ ] Gemini Client (AI Gateway Adapter)
- [ ] TTS Client (TTS Gateway Adapter)

### HTTP Layer
- [ ] Axum Server Setup + Middleware
- [ ] JWT Auth Middleware (Login, Register, Token-Validierung)
- [ ] Routes implementieren:
  - [ ] Auth (register, login, me)
  - [ ] Family (CRUD, Player-Management)
  - [ ] Expedition (today, start, complete-Schritte)
  - [ ] Museum (Collection, Artwork-Upload)
  - [ ] Story (tonight)
  - [ ] Minigames (available, play, complete)
  - [ ] Budget (status, reset mit Rechenaufgabe)
  - [ ] Jobs (trigger, status)
  - [ ] Admin (AI-Usage, Models, Routing, Reset-Protokoll)

### Tests
- [ ] Domain-Service Unit-Tests (mit Mock-Ports)
- [ ] Integration-Tests (mit echtem PocketBase)

---

## Phase 5: App zusammenbauen

Ziel: Frontend App verbindet UI-Kit + Mini-Games + Backend zu einem spielbaren Flow.

### Grundgeruest
- [ ] React Router Setup (Pages, ProtectedRoute)
- [ ] API Client Layer (Fetch-Wrapper mit JWT)
- [ ] Zustand Stores (Auth, Session/aktive Kinder)
- [ ] AppShell mit Navigation

### Pages
- [ ] **LoginPage** - Familien-Login
- [ ] **SelectPlayersPage** - "Wer ist heute dabei?" (PlayerSelector)
- [ ] **ExpeditionPage** - Kompletter Flow:
  - [ ] Grabungsort-Intro (Forscher erklaert)
  - [ ] ExcavationGame einbinden
  - [ ] PuzzleGame einbinden
  - [ ] IdentifyGame einbinden
  - [ ] Entdeckung + Steckbrief (DinoCard + ForscherSpeech)
  - [ ] Offline-Auftrag anzeigen
- [ ] **MuseumPage** - Sammlung durchstoebern
  - [ ] Galerie aller entdeckten Dinos
  - [ ] Detail-Ansicht pro Dino (Vitrine)
  - [ ] Mini-Spiel Zugang
- [ ] **MinigamePage** - Spiel auswaehlen + spielen
  - [ ] Verfuegbare Spiele anzeigen (Budget beachten)
  - [ ] Lazy-Load des gewaehlten Spiels
- [ ] **StoryTimePage** - Abend-Session
  - [ ] Kombinations-Geschichte laden
  - [ ] KaraokeText mit TTS-Playback
  - [ ] Quiz nach der Geschichte
- [ ] **PhotoUploadPage** - Offline-Auftrag Foto hochladen
  - [ ] Kamera oeffnen
  - [ ] Foto an Backend senden
  - [ ] KI-Feedback anzeigen
- [ ] **ParentDashboard** - Eltern-Bereich
  - [ ] Reset-Protokoll einsehen
  - [ ] AI-Kosten Uebersicht
  - [ ] Kinder-Profile verwalten

### Budget-Integration
- [ ] SleepyDino Overlay wenn Budget aufgebraucht
- [ ] Eltern-Reset Flow (Rechenaufgabe)
- [ ] Budget-Status in der Navigation sichtbar

---

## Phase 6: Content-Pipeline & Generator

Ziel: Dino-Content automatisch generierbar, Stories on-demand, Foto-Bewertung funktioniert.

### Generator Worker
- [ ] Worker-Loop (Valkey pollen, Jobs ausfuehren)
- [ ] Job-Handler:
  - [ ] `generate_dino` (Bilder + Fakten + Quiz via Gemini)
  - [ ] `generate_story` (Kombinations-Geschichte)
  - [ ] `generate_tts` (Audio via Piper)
  - [ ] `evaluate_photo` (Foto-Bewertung via Gemini)
  - [ ] `generate_batch` (Mehrere Dinos auf einmal)
- [ ] Model-Routing: Operation → Model aus AI_MODEL_ROUTING lesen
- [ ] Automatisches AI_USAGE_LOG Tracking bei jedem API-Call
- [ ] Retry-Logik (max 3 Versuche, exponential Backoff)
- [ ] Ergebnisse in PocketBase speichern (Bilder, Texte, Audio)

### Gemini Integration
- [ ] Prompt-Templates fuer:
  - [ ] Realistisches Dino-Bild
  - [ ] Comic-Stil Dino-Bild (kindgerecht)
  - [ ] Skelett-Bild
  - [ ] Kindgerechte Fakten + Quiz-Fragen
  - [ ] Kombinations-Geschichte (mehrere Dinos, Kinder-Interessen)
  - [ ] Foto-Bewertung (positiv, lehrreich, kindgerecht)
- [ ] Token-Count Extraktion aus Response
- [ ] Kosten-Berechnung via AI_MODELS Preise

### TTS Integration
- [ ] Piper TTS Setup (deutsche Stimme, Forscher-Charakter)
- [ ] Audio-Generierung fuer Steckbriefe
- [ ] Audio-Generierung fuer Geschichten
- [ ] Wort-Timestamps Generierung fuer Karaoke
- [ ] Caching (gleicher Text = gleiches Audio)

### Admin-Tools
- [ ] `make generate-dinos COUNT=10` (Batch-Generierung)
- [ ] `make generate-story FAMILY=...` (Test-Story)
- [ ] Admin-API fuer AI-Kosten Dashboard

---

## Phase 7: Landing Page & Polish

Ziel: Oeffentlich zeigbar, iPad-optimiert, performant.

### Landing Page
- [ ] Hero Section (Dino-Theme, Kinder-Illustrationen)
- [ ] Feature-Uebersicht (Ausbuddeln, Museum, Geschichten)
- [ ] Screenshots / Demo-Video
- [ ] CTA: Self-Hosting Anleitung oder gehostete Version
- [ ] Open Source Link (GitHub)

### Polish
- [ ] Animationen verfeinern (Skeleton-to-Dino, Confetti, SleepyDino)
- [ ] Sound-Design (Kratzen, Jubel, Dino-Rufe, Schlaf-Sounds)
- [ ] iPad-Optimierung (Layout, Touch-Targets)
- [ ] Performance-Optimierung (Lazy Loading, Bild-Kompression)
- [ ] Offline-Cache Strategie (Service Worker fuer gecachte Dinos)

### Deployment
- [ ] Cloudflare Tunnel Setup
- [ ] Production Docker Compose (mit Nginx statt Vite Dev Server)
- [ ] README.md (Setup-Anleitung fuer Self-Hosting)
- [ ] GitHub Repo aufsetzen (License, Contributing, etc.)

---

## Notizen

- Phasen 2 + 3 (UI-Kit + Mini-Games) koennen teilweise parallel zu Phase 1 (Seed) laufen
- Phase 4 (Backend) kann beginnen sobald Schema (Phase 1) steht
- Phase 6 (Generator) ist unabhaengig von Phase 5 (App) und kann parallel laufen
- Alte Prototypen als Referenz: `/Users/konstantinstoldt/Downloads/dino-atlas-original`
- Mathoria als Architektur-Vorbild: `/Users/konstantinstoldt/Documents/GitHub/mathoria`
