# Dino-Atlas - Technische Spezifikation

> Technische Architektur fuer die Dino-Atlas Lern-App. Open Source, Self-Hosted, Multi-Family.

## 1. Architektur-Ueberblick

```
                          ┌─────────────────────────────────┐
                          │         Cloudflare Tunnel        │
                          └──────────────┬──────────────────┘
                                         │
                          ┌──────────────▼──────────────────┐
                          │       Traefik (Reverse Proxy)    │
                          │            :80 / :443            │
                          └──┬───────┬────────┬──────┬──────┘
                             │       │        │      │
               ┌─────────────▼─┐  ┌──▼────┐ ┌─▼────┐ │
               │   Frontend    │  │ Rust  │ │ TTS  │ │
               │  (Vite/React) │  │Backend│ │ API  │ │
               │    :5173      │  │ :3001 │ │:3100 │ │
               └───────────────┘  └──┬────┘ └──────┘ │
                                     │               │
                        ┌────────────┼───────────┐   │
                        │            │           │   │
                   ┌────▼─────┐ ┌───▼────┐ ┌────▼───▼────┐
                   │PocketBase│ │ Valkey │ │  Generator  │
                   │  :8090   │ │ :6379  │ │   Worker    │
                   │ (intern) │ │(intern)│ │  (intern)   │
                   └──────────┘ └────────┘ └─────────────┘
```

### Netzwerk-Isolation (wie Mathoria)
- **Frontend-Netzwerk:** Traefik + Frontend + Backend + TTS
- **Backend-Netzwerk (intern):** Backend + PocketBase + Valkey + Generator Worker
- PocketBase und Valkey sind **nie** direkt vom Frontend erreichbar

---

## 2. Backend - Rust (Axum)

### Hexagonale Architektur

```
backend/
├── src/
│   ├── main.rs                      # Server-Setup, Middleware, Router
│   ├── config.rs                    # ENV-Konfiguration
│   │
│   ├── domain/                      # === KERN (keine externen Dependencies) ===
│   │   ├── mod.rs
│   │   ├── models/                  # Reine Datenstrukturen
│   │   │   ├── player.rs            # Player, PlayerProfile, FamilyGroup
│   │   │   ├── dino.rs              # DinoSpecies, DinoFact, Rarity
│   │   │   ├── expedition.rs        # Expedition, ExcavationResult, PuzzleResult
│   │   │   ├── museum.rs            # MuseumEntry, ArtworkSubmission
│   │   │   ├── story.rs             # Story, StorySegment, StoryPrompt
│   │   │   ├── minigame.rs          # QuizQuestion, SortingChallenge, etc.
│   │   │   └── budget.rs            # DailyBudget, BudgetReset, ResetLog
│   │   ├── services/                # Business-Logik (pure functions, testbar)
│   │   │   ├── expedition_service.rs    # Dino-Zuweisung, Tages-Expedition
│   │   │   ├── difficulty_service.rs    # Adaptiver Schwierigkeitsgrad pro Kind
│   │   │   ├── budget_service.rs        # Bildschirmzeit-Budget, muede Dinos
│   │   │   ├── story_service.rs         # Kombinations-Geschichte bauen
│   │   │   ├── quiz_service.rs          # Quiz-Generierung, Auswertung
│   │   │   ├── museum_service.rs        # Sammlung verwalten
│   │   │   └── photo_eval_service.rs    # Foto-Bewertung (Prompt-Bau)
│   │   └── ports/                   # Interfaces (Traits)
│   │       ├── player_repo.rs       # trait PlayerRepository
│   │       ├── dino_repo.rs         # trait DinoRepository
│   │       ├── expedition_repo.rs   # trait ExpeditionRepository
│   │       ├── museum_repo.rs       # trait MuseumRepository
│   │       ├── ai_gateway.rs        # trait AiGateway (Gemini abstrahiert)
│   │       ├── tts_gateway.rs       # trait TtsGateway
│   │       └── job_queue.rs         # trait JobQueue
│   │
│   ├── adapters/                    # === ADAPTER (externe Welt) ===
│   │   ├── pocketbase/              # PocketBase REST-Client
│   │   │   ├── client.rs            # HTTP-Wrapper (reqwest)
│   │   │   ├── models.rs            # PB-spezifische Structs
│   │   │   ├── player_repo.rs       # impl PlayerRepository for PbPlayerRepo
│   │   │   ├── dino_repo.rs         # impl DinoRepository for PbDinoRepo
│   │   │   ├── expedition_repo.rs
│   │   │   └── museum_repo.rs
│   │   ├── gemini/                  # Google Gemini API Client
│   │   │   ├── client.rs
│   │   │   └── ai_gateway.rs        # impl AiGateway for GeminiGateway
│   │   ├── valkey/                  # Valkey (Redis) Job-Queue
│   │   │   ├── client.rs
│   │   │   └── job_queue.rs         # impl JobQueue for ValkeyJobQueue
│   │   └── tts/                     # TTS API Client
│   │       └── tts_gateway.rs       # impl TtsGateway for PiperTtsGateway
│   │
│   ├── routes/                      # === HTTP-HANDLER (duenn) ===
│   │   ├── mod.rs                   # Router-Setup
│   │   ├── auth.rs                  # POST /auth/register, /auth/login
│   │   ├── family.rs               # GET/POST /family, /family/players
│   │   ├── expedition.rs           # GET /expedition/today, POST /expedition/start
│   │   ├── excavation.rs           # POST /excavation/:id/complete
│   │   ├── puzzle.rs               # POST /puzzle/:id/complete
│   │   ├── quiz.rs                 # POST /quiz/:id/answer
│   │   ├── museum.rs               # GET /museum/:player_id, POST /museum/artwork
│   │   ├── story.rs                # GET /story/tonight
│   │   ├── minigames.rs            # GET /minigames/available, POST /minigame/:id/play
│   │   ├── budget.rs               # GET /budget/:player_id, POST /budget/reset
│   │   ├── jobs.rs                 # POST /jobs/generate (Admin), GET /jobs/status
│   │   └── admin.rs                # Admin-Endpunkte (Content-Management)
│   │
│   ├── middleware/
│   │   ├── auth.rs                  # JWT-Validierung, AuthUser-Extractor
│   │   └── mod.rs
│   │
│   └── error.rs                     # AppError Enum, HTTP-Mapping
│
├── tests/                           # Domain-Tests OHNE externe Dependencies
│   ├── expedition_service_test.rs
│   ├── difficulty_service_test.rs
│   ├── budget_service_test.rs
│   └── story_service_test.rs
│
├── Cargo.toml
└── Dockerfile
```

### Kern-Prinzip
- `domain/` hat **null** externe Crate-Dependencies (kein reqwest, kein serde fuer HTTP, etc.)
- Alle externen Zugriffe laufen ueber Traits in `domain/ports/`
- Tests mocken die Ports -> Game-Logik ist vollstaendig ohne DB/API testbar
- Routes sind duenn: Extrahieren, validieren, Service aufrufen, Response bauen

### API-Endpunkte (Ueberblick)

```
PUBLIC:
  POST   /api/auth/register              → AuthResponse
  POST   /api/auth/login                 → AuthResponse

PROTECTED (JWT):
  # Familie
  GET    /api/family                     → Family mit allen Playern
  POST   /api/family/players             → Neuen Forscher anlegen

  # Expedition (Kern-Loop)
  GET    /api/expedition/today           → TodayExpedition (pro Player)
  POST   /api/expedition/:id/start       → ExpeditionStarted
  POST   /api/excavation/:id/complete    → ExcavationResult
  POST   /api/puzzle/:id/complete        → PuzzleResult
  POST   /api/identify/:id/guess         → IdentifyResult

  # Museum
  GET    /api/museum/:player_id          → MuseumCollection
  POST   /api/museum/:entry_id/artwork   → ArtworkUploaded (Foto + KI-Bewertung)

  # Abend-Session
  GET    /api/story/tonight              → CombinedStory (fuer alle aktiven Kinder)
  GET    /api/quiz/today/:player_id      → DailyQuiz

  # Mini-Spiele
  GET    /api/minigames/:player_id       → AvailableMinigames + Budget
  POST   /api/minigame/:id/play          → MinigameSession
  POST   /api/minigame/:id/complete      → MinigameResult

  # Budget / Timer
  GET    /api/budget/:player_id          → BudgetStatus (muede oder wach?)
  POST   /api/budget/reset               → BudgetReset (Rechenaufgabe validieren)

  # Jobs (Admin + App)
  POST   /api/jobs/generate-dinos        → JobCreated
  POST   /api/jobs/generate-story        → JobCreated (App triggert fuer Abend)
  POST   /api/jobs/evaluate-photo        → JobCreated (App triggert bei Upload)
  GET    /api/jobs/:id/status            → JobStatus

ADMIN:
  GET    /api/admin/resets               → ResetLog (Protokoll)
  POST   /api/admin/generate-batch       → BatchJobCreated
  GET    /api/admin/stats                → Usage-Statistiken
```

---

## 3. Frontend - React Monorepo

### Monorepo-Struktur

```
frontend/
├── packages/
│   ├── ui/                              # @dino-atlas/ui
│   │   ├── src/
│   │   │   ├── primitives/              # Atomare Bausteine
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Icon.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   └── Panel.tsx
│   │   │   ├── components/              # Zusammengesetzte Komponenten
│   │   │   │   ├── DinoCard.tsx         # Dino-Anzeige (Bild + Name + Fakten)
│   │   │   │   ├── PlayerAvatar.tsx     # Forscher-Avatar
│   │   │   │   ├── PlayerSelector.tsx   # "Wer ist dabei?"
│   │   │   │   ├── ForscherSpeech.tsx   # Sprechblase mit TTS-Trigger
│   │   │   │   ├── SleepyDino.tsx       # Muede-Animation
│   │   │   │   ├── Confetti.tsx         # Jubel-Effekt
│   │   │   │   ├── KaraokeText.tsx      # Text-Highlighting synchron zu TTS
│   │   │   │   ├── PhotoCapture.tsx     # Kamera-Aufnahme + Upload
│   │   │   │   └── TimerBudget.tsx      # Visuelles Budget (Mond/Sterne)
│   │   │   ├── layouts/                 # Seiten-Layouts
│   │   │   │   ├── GameLayout.tsx       # Vollbild fuer Spiele
│   │   │   │   └── MuseumLayout.tsx     # Galerie-Layout
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── tokens.css              # Design Tokens (Farben, Fonts, Spacing)
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── types/                           # @dino-atlas/types
│   │   ├── src/
│   │   │   ├── dino.ts                  # DinoSpecies, DinoFact, Rarity
│   │   │   ├── player.ts               # Player, Family, PlayerProfile
│   │   │   ├── expedition.ts           # Expedition, Excavation, Puzzle
│   │   │   ├── museum.ts               # MuseumEntry, Artwork
│   │   │   ├── story.ts                # Story, StorySegment
│   │   │   ├── minigame.ts             # Quiz, Sorting, etc.
│   │   │   ├── budget.ts               # Budget, ResetLog
│   │   │   ├── job.ts                  # Job, JobStatus
│   │   │   └── api.ts                  # Request/Response Types
│   │   └── package.json
│   │
│   └── minigames/                       # @dino-atlas/minigames
│       ├── src/
│       │   ├── excavation/              # Ausbuddeln (Wisch-Mechanik)
│       │   │   ├── ExcavationGame.tsx
│       │   │   ├── useExcavation.ts     # Game-State Hook
│       │   │   ├── ExcavationCanvas.tsx # Canvas-Rendering
│       │   │   └── index.ts
│       │   ├── puzzle/                  # Skelett-Puzzle
│       │   │   ├── PuzzleGame.tsx
│       │   │   ├── usePuzzle.ts
│       │   │   ├── PuzzleBoard.tsx
│       │   │   └── index.ts
│       │   ├── identify/                # Dino-Erkennung (Skelett -> Bild)
│       │   │   ├── IdentifyGame.tsx
│       │   │   └── index.ts
│       │   ├── quiz/                    # Dino-Quiz
│       │   │   ├── QuizGame.tsx
│       │   │   └── index.ts
│       │   ├── size-sort/               # Groessen-Sortieren
│       │   │   ├── SizeSortGame.tsx
│       │   │   └── index.ts
│       │   ├── timeline/                # Erdzeitalter-Zuordnung
│       │   │   ├── TimelineGame.tsx
│       │   │   └── index.ts
│       │   ├── food-match/              # Futter-Zuordnung
│       │   │   ├── FoodMatchGame.tsx
│       │   │   └── index.ts
│       │   ├── shadow-guess/            # Schatten-Raten
│       │   │   ├── ShadowGuessGame.tsx
│       │   │   └── index.ts
│       │   ├── shared/                  # Gemeinsame Mini-Game Utils
│       │   │   ├── GameWrapper.tsx      # Einheitlicher Rahmen (Timer, Score, Exit)
│       │   │   ├── useGameState.ts      # Shared State-Pattern
│       │   │   ├── useHaptics.ts        # Vibration
│       │   │   └── useSound.ts          # Sound-Effekte
│       │   └── index.ts                 # Barrel Export aller Games
│       ├── package.json
│       └── vite.config.ts
│
├── apps/
│   ├── app/                             # @dino-atlas/app (Haupt-App)
│   │   ├── src/
│   │   │   ├── pages/                   # Route-Level Pages (lazy-loaded)
│   │   │   │   ├── SelectPlayersPage.tsx    # "Wer ist dabei?"
│   │   │   │   ├── ExpeditionPage.tsx       # Tages-Expedition Flow
│   │   │   │   ├── MuseumPage.tsx           # Sammlung durchstoebern
│   │   │   │   ├── StoryTimePage.tsx        # Abend-Geschichte
│   │   │   │   ├── MinigamePage.tsx         # Mini-Spiel Auswahl + Spielen
│   │   │   │   ├── PhotoUploadPage.tsx      # Offline-Auftrag Foto
│   │   │   │   └── ParentDashboard.tsx      # Eltern: Protokoll, Einstellungen
│   │   │   ├── api/                     # API-Client Layer
│   │   │   │   ├── client.ts            # Fetch-Wrapper mit JWT
│   │   │   │   ├── expedition.ts
│   │   │   │   ├── museum.ts
│   │   │   │   ├── story.ts
│   │   │   │   ├── minigames.ts
│   │   │   │   └── budget.ts
│   │   │   ├── stores/                  # Zustand
│   │   │   │   ├── authStore.ts         # JWT + User
│   │   │   │   └── sessionStore.ts      # Aktive Kinder, Budget-Status
│   │   │   ├── router.tsx               # React Router
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── Dockerfile                   # Production (Nginx)
│   │   └── Dockerfile.dev               # Dev (Vite HMR)
│   │
│   ├── landing/                         # @dino-atlas/landing (Marketing-Page)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   └── LandingPage.tsx      # Hero, Features, Screenshots, CTA
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── storybook/                       # @dino-atlas/storybook
│       ├── .storybook/
│       │   ├── main.ts                  # Storybook-Config (alle Packages einbinden)
│       │   └── preview.ts
│       ├── stories/
│       │   ├── ui/                      # Stories fuer @dino-atlas/ui
│       │   └── minigames/              # Stories fuer @dino-atlas/minigames
│       └── package.json
│
├── pnpm-workspace.yaml
├── package.json                         # Root Scripts
├── vite.config.shared.ts                # Shared Vite Config (Vite 8)
└── tsconfig.base.json                   # Shared TS Config
```

### Mini-Game Pattern

Jedes Mini-Spiel folgt dem gleichen Pattern:

```typescript
// Jedes Minigame exportiert:
export interface MinigameProps {
  player: Player;
  dinos: DinoSpecies[];          // Verfuegbare Dinos fuer dieses Spiel
  difficulty: DifficultyLevel;   // Vom Backend berechnet
  onComplete: (result: MinigameResult) => void;
  onExit: () => void;
}

// Jedes Minigame nutzt den shared GameWrapper:
export function ExcavationGame(props: MinigameProps) {
  return (
    <GameWrapper {...props}>
      <ExcavationCanvas ... />
    </GameWrapper>
  );
}
```

So kann jedes Spiel:
- Isoliert in Storybook entwickelt werden (mit Mock-Props)
- Lazy-loaded in die App eingebunden werden
- Unabhaengig getestet werden
- Spaeter neue Spiele hinzufuegen ohne die App anzufassen

### Karaoke-Text (TTS Sync)

```typescript
// KaraokeText Komponente
// - Bekommt Text + Audio-URL
// - Splittet Text in Saetze
// - Synchronisiert Audio-Playback mit Text-Highlighting
// - Aktueller Satz wird hervorgehoben + scrollt automatisch mit
// - Touch auf Satz: Springt zu der Stelle im Audio
```

---

## 4. Job-Queue System (Valkey + Worker)

### Architektur

```
┌──────────────┐     ┌─────────┐     ┌──────────────────┐
│  Rust Backend│────▶│ Valkey  │◀────│ Generator Worker │
│  (Producer)  │     │ (Queue) │     │   (Consumer)     │
└──────────────┘     └─────────┘     └──────────────────┘
                                             │
                                     ┌───────┼───────┐
                                     │       │       │
                                  Gemini   Piper  PocketBase
                                  (Bild)   (TTS)  (Speichern)
```

### Job-Typen

| Job-Typ | Trigger | Was passiert |
|---------|---------|-------------|
| `generate_dino` | Admin | Gemini generiert Bilder (real + comic + skelett), Fakten, Quiz-Fragen fuer einen Dino. Ergebnis in PocketBase. |
| `generate_story` | App (Abend) | Gemini generiert Kombinations-Geschichte basierend auf den Tages-Dinos der Kinder. |
| `generate_tts` | Nach Story/Dino | Piper TTS generiert Audio fuer Steckbrief, Geschichte, Quiz-Fragen. Cached. |
| `evaluate_photo` | App (Upload) | Gemini analysiert Kinder-Zeichnung, generiert kindgerechtes Feedback. |
| `generate_batch` | Admin | Batch: Mehrere Dinos auf einmal generieren (z.B. 10 neue Dinos). |

### Worker-Implementierung

```
generator/
├── src/
│   ├── main.rs                  # Worker-Loop: Poll Valkey, execute Jobs
│   ├── config.rs
│   ├── jobs/
│   │   ├── generate_dino.rs     # Dino-Content Pipeline
│   │   ├── generate_story.rs    # Kombinations-Geschichte
│   │   ├── generate_tts.rs      # TTS-Audio Erzeugung
│   │   ├── evaluate_photo.rs    # Foto-Bewertung
│   │   └── generate_batch.rs    # Batch-Verarbeitung
│   ├── gemini/
│   │   ├── client.rs            # Gemini API (Bilder + Text)
│   │   └── prompts.rs           # Prompt-Templates
│   ├── piper/
│   │   └── client.rs            # TTS API Client
│   └── pocketbase/
│       └── client.rs            # Ergebnisse speichern
├── Cargo.toml
└── Dockerfile
```

### Job-Lifecycle

```
PENDING → PROCESSING → COMPLETED
                    └→ FAILED (mit Retry-Count, max 3)
```

- Jobs haben eine TTL (z.B. Story-Jobs: 5 Min Timeout)
- Status abrufbar via `GET /api/jobs/:id/status`
- App kann pollen oder Websocket fuer Echtzeit-Updates
- Failed Jobs werden geloggt, Admin kann sie retrigern

### KI-Kosten-Tracking

Jeder Gemini API-Call wird in einer eigenen Tabelle protokolliert fuer vollstaendige Kostentransparenz.

```
AI_USAGE_LOG
  ├─ id
  ├─ job_id (Verknuepfung zum Job der es ausgeloest hat)
  ├─ triggered_by: "admin" | "app" | "worker"
  ├─ trigger_context (was hat es ausgeloest, z.B. "expedition:player_123", "story:family_456", "photo_eval:entry_789")
  ├─ model (z.B. "gemini-2.0-flash", "gemini-2.0-pro")
  ├─ operation: "generate_image" | "generate_text" | "evaluate_photo" | "generate_story"
  ├─ input_tokens (Prompt-Tokens)
  ├─ output_tokens (Completion-Tokens)
  ├─ image_count (Anzahl generierter Bilder, falls applicable)
  ├─ cost_estimate_usd (berechnet aus Tokens × Preis pro Model)
  ├─ duration_ms (Dauer des API-Calls)
  ├─ success (Boolean)
  ├─ error_message (falls fehlgeschlagen)
  └─ created_at
```

**Model-Routing im Worker:**
- Worker schaut bei jedem Job in `AI_MODEL_ROUTING`: Welches Model fuer diese Operation?
- Pro Operation konfigurierbar, z.B.:
  - `generate_story` → `gemini-2.0-flash` (schnell + guenstig, reicht fuer Text)
  - `generate_image_real` → `imagen-3` (beste Bildqualitaet)
  - `generate_image_comic` → `gemini-2.0-flash` (reicht fuer Comic-Stil)
  - `evaluate_photo` → `gemini-2.0-flash` (Vision-Analyse)
- Fallback-Model wenn primaeres nicht verfuegbar (`priority` Feld)
- Model-Wechsel ohne Code-Aenderung, nur DB-Update
- Neue Provider (OpenAI, Anthropic) spaeter einfach hinzufuegbar

**Automatisches Kosten-Logging:**
- Jeder API-Call wird automatisch geloggt (Adapter-Layer, nicht manuell)
- Token-Counts kommen aus der API Response (`usage_metadata`)
- Kosten berechnet aus `AI_MODELS` Preistabelle × tatsaechliche Tokens
- Job-Verknuepfung zeigt: "Diese Story hat 3 API-Calls gebraucht, insgesamt $0.002"

**Admin-Dashboard:**
- `GET /api/admin/ai-usage` → Kosten-Uebersicht (pro Tag, pro Monat, pro Operation)
- `GET /api/admin/ai-usage?group_by=model` → Aufschluesselung nach Model
- `GET /api/admin/ai-usage?group_by=operation` → Was kostet am meisten?
- `GET /api/admin/ai-models` → Alle Models mit Preisen + Routing
- `PUT /api/admin/ai-models/:id` → Preise aktualisieren
- `PUT /api/admin/ai-routing/:id` → Model fuer Operation aendern
- Alerts wenn Tages/Monats-Budget ueberschritten wird (konfigurierbar)

---

## 5. TTS Service

### Setup (wie alter Prototyp, verbessert)

```
tts-api/
├── src/
│   ├── server.ts                # Express Server
│   ├── piper.ts                 # Piper TTS Wrapper
│   ├── cache.ts                 # Audio-Caching (Datei-basiert)
│   ├── timestamps.ts            # Wort/Satz-Timestamps fuer Karaoke
│   └── auth.ts                  # JWT-Validierung
├── models/                      # Piper Voice Models (deutsch)
├── cache/                       # Generierte Audio-Dateien
├── Dockerfile
└── package.json
```

### Endpunkte

```
GET  /tts/audio?text=...&voice=forscher    → Audio-Datei (WAV/MP3)
GET  /tts/timestamps?text=...              → JSON mit Wort-Timestamps
DELETE /tts/cache                           → Cache leeren (Admin)
```

### Karaoke-Feature
- `/tts/timestamps` gibt zurueck: `[{word: "Der", start: 0.0, end: 0.2}, {word: "Triceratops", start: 0.2, end: 0.8}, ...]`
- Frontend nutzt diese Timestamps fuer synchrones Text-Highlighting
- Timestamps werden zusammen mit dem Audio gecached

---

## 6. PocketBase - Datenmodell

### Collections

```
FAMILIES
  ├─ id, name, created_at
  └─ owner_id (User der die Familie angelegt hat)

USERS (PocketBase Auth)
  ├─ id, email, password, name
  └─ family_id

PLAYERS (Kinder-Profile, kein Login)
  ├─ id, family_id, name, avatar_emoji, birth_year
  ├─ difficulty_level (adaptiv, pro Spieltyp)
  ├─ interests (JSON: ["Fleischfresser", "fliegende Dinos"])
  └─ created_at

DINO_SPECIES
  ├─ id, slug, scientific_name, display_name_de
  ├─ period, diet, length_m, weight_kg, continent
  ├─ rarity: common | uncommon | rare | epic | legendary
  ├─ kid_summary, fun_fact, detail_text
  ├─ size_comparison (z.B. "So gross wie 2 Autos!")
  ├─ image_real (File), image_comic (File), image_skeleton (File)
  ├─ audio_steckbrief (File), audio_name (File)
  └─ quiz_questions (JSON)

EXPEDITIONS
  ├─ id, player_id, dino_species_id
  ├─ date, status: pending | excavating | puzzling | identifying | completed
  ├─ excavation_time_ms, puzzle_time_ms, identify_attempts
  ├─ difficulty_used (JSON: welche Parameter)
  └─ offline_task (Text: "Male deinen T-Rex!")

MUSEUM_ENTRIES
  ├─ id, player_id, dino_species_id
  ├─ discovered_at
  ├─ artwork_photo (File)
  ├─ artwork_ai_feedback (Text)
  └─ favorite (Boolean)

STORIES
  ├─ id, family_id, date
  ├─ player_dinos (JSON: [{player_id, dino_species_id}])
  ├─ story_text (generierter Text)
  ├─ audio_url (File)
  ├─ timestamps (JSON: Wort-Timestamps fuer Karaoke)
  └─ created_at

MINIGAME_SESSIONS
  ├─ id, player_id, game_type, dino_species_id
  ├─ score, time_ms, difficulty_used
  ├─ completed_at
  └─ stars_earned (1-3)

DAILY_BUDGETS
  ├─ id, player_id, date
  ├─ expeditions_used, expeditions_max
  ├─ minigames_used, minigames_max
  ├─ evening_session_done (Boolean)
  └─ is_tired (Boolean)

BUDGET_RESETS
  ├─ id, player_id, date
  ├─ reset_by_user_id (welcher Erwachsene)
  ├─ math_question, math_answer_given
  └─ reset_at (Timestamp)

AI_USAGE_LOG
  ├─ id, job_id
  ├─ triggered_by: admin | app | worker
  ├─ trigger_context (z.B. "expedition:player_123")
  ├─ model (z.B. "gemini-2.0-flash")
  ├─ operation: generate_image | generate_text | evaluate_photo | generate_story
  ├─ input_tokens, output_tokens, image_count
  ├─ cost_estimate_usd
  ├─ duration_ms, success, error_message
  └─ created_at

AI_MODELS
  ├─ id, provider (google, openai, anthropic, ...)
  ├─ model_id (z.B. "gemini-2.0-flash", "gemini-2.0-pro", "imagen-3")
  ├─ display_name
  ├─ capabilities (JSON: ["text", "image_generation", "image_analysis", "vision"])
  ├─ price_per_1m_input_tokens_usd
  ├─ price_per_1m_output_tokens_usd
  ├─ price_per_image_usd
  ├─ is_active (Boolean - abschaltbar ohne Code-Aenderung)
  └─ updated_at

AI_MODEL_ROUTING
  ├─ id, operation (generate_story, generate_image_real, generate_image_comic,
  │                  generate_skeleton, evaluate_photo, generate_quiz, generate_facts)
  ├─ model_id (FK → AI_MODELS)
  ├─ priority (1 = bevorzugt, 2 = Fallback)
  ├─ prompt_template (optional: operation-spezifischer Prompt)
  └─ updated_at
```

---

## 7. Docker Compose

```yaml
# docker-compose.yml (Konzept)
services:

  # === Frontend ===
  app:
    build: ./frontend/apps/app
    ports: ["5173:5173"]
    networks: [frontend]

  landing:
    build: ./frontend/apps/landing
    ports: ["5174:5174"]
    networks: [frontend]

  storybook:
    build: ./frontend/apps/storybook
    ports: ["6006:6006"]
    networks: [frontend]
    profiles: [dev]                      # Nur in Dev

  # === Backend ===
  backend:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      - POCKETBASE_URL=http://pocketbase:8090
      - VALKEY_URL=redis://valkey:6379
      - TTS_URL=http://tts-api:3100
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    networks: [frontend, backend]
    depends_on: [pocketbase, valkey]

  # === Generator Worker ===
  generator:
    build: ./generator
    environment:
      - POCKETBASE_URL=http://pocketbase:8090
      - VALKEY_URL=redis://valkey:6379
      - TTS_URL=http://tts-api:3100
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    networks: [backend]
    depends_on: [pocketbase, valkey, tts-api]

  # === TTS ===
  tts-api:
    build: ./tts-api
    ports: ["3100:3100"]
    volumes:
      - tts-cache:/app/cache
      - tts-models:/app/models
    networks: [frontend, backend]

  # === Datenbank ===
  pocketbase:
    build: ./pocketbase
    ports: ["8090:8090"]                 # Admin-UI nur in Dev exponiert
    volumes:
      - pb-data:/pb/pb_data
    networks: [backend]

  # === Job Queue ===
  valkey:
    image: valkey/valkey:8-alpine
    volumes:
      - valkey-data:/data
    networks: [backend]

  # === Reverse Proxy ===
  traefik:
    image: traefik:v3
    ports: ["80:80", "443:443"]
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik:/etc/traefik
    networks: [frontend]

  # === Tunnel (Optional) ===
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel run --token ${CLOUDFLARE_TUNNEL_TOKEN}
    networks: [frontend]
    profiles: [tunnel]

networks:
  frontend:
  backend:
    internal: true

volumes:
  pb-data:
  valkey-data:
  tts-cache:
  tts-models:
```

---

## 8. Entwicklungs-Workflow

### Reihenfolge (UI-Kit First)

```
Phase 0: Infrastruktur
  └─ Docker Compose, PocketBase Schema, Traefik, Makefile

Phase 1: UI-Kit + Storybook
  ├─ Design Tokens (Farben, Fonts, Dino-Theme)
  ├─ Primitive Komponenten (Button, Icon, Panel, Badge)
  ├─ Dino-spezifische Komponenten (DinoCard, ForscherSpeech, SleepyDino)
  ├─ KaraokeText Komponente
  └─ Alles in Storybook sichtbar und reviewbar

Phase 2: Mini-Games (isoliert in Storybook)
  ├─ ExcavationGame (Wischen - aus altem Prototyp adaptieren)
  ├─ PuzzleGame (Drag & Drop Knochen)
  ├─ IdentifyGame (Skelett -> Bild Auswahl)
  └─ QuizGame
  → Alle mit Mock-Daten in Storybook spielbar

Phase 3: Backend + API
  ├─ Rust Domain-Layer (Services + Tests)
  ├─ PocketBase Adapter
  ├─ API Endpunkte
  └─ Auth (JWT)

Phase 4: App zusammenbauen
  ├─ Router + Pages
  ├─ API-Client anbinden
  ├─ Expedition-Flow (Page fuer Page)
  └─ Museum

Phase 5: Content-Pipeline
  ├─ Generator Worker
  ├─ Valkey Job-Queue
  ├─ Gemini Integration (Bilder, Stories, Foto-Bewertung)
  └─ TTS Integration + Karaoke

Phase 6: Landing Page + Polish
  ├─ Marketing-Page
  ├─ Animationen & Sounds
  └─ iPad-Optimierung
```

### Makefile (Auszug)

```makefile
# Entwicklung
dev:              docker compose up
dev-storybook:    docker compose --profile dev up storybook
dev-backend:      cd backend && cargo watch -x run

# Infrastruktur
infra-up:         docker compose up -d pocketbase valkey traefik
seed:             cd pocketbase && ./seed/import.sh

# Content-Generierung
generate:         docker compose run generator generate-batch --count 10
generate-story:   docker compose run generator generate-story --family-id ...

# Tunnel
tunnel:           docker compose --profile tunnel up -d cloudflared

# Testing
test-domain:      cd backend && cargo test
test-frontend:    cd frontend && pnpm test

# Build
build:            docker compose build
```

---

## 9. Tooling & Versionen

| Tool | Version | Warum |
|------|---------|-------|
| **Vite** | 8.x | Schnelles HMR, native ESM |
| **React** | 19.x | Aktuell, Server Components falls noetig |
| **TypeScript** | 5.x | Strict Mode |
| **Tailwind** | 4.x | Utility-First CSS |
| **Storybook** | 8.x | Komponenten-Entwicklung + Doku |
| **Zustand** | 5.x | Leichtgewichtiger State |
| **React Router** | 7.x | Client-Side Routing |
| **pnpm** | 9.x | Schnelles Package Management, Workspaces |
| **Rust** | stable | Axum 0.8+, Tokio |
| **PocketBase** | 0.25+ | SQLite-basiert, einfach |
| **Valkey** | 8.x | Redis-kompatibler Job-Store |
| **Piper TTS** | latest | Lokale deutsche Sprachausgabe |
| **Docker** | 27+ | Container Runtime |
| **Traefik** | v3 | Reverse Proxy + Auto-Discovery |

---

## 10. Offene technische Entscheidungen

- [ ] Piper TTS: Reichen die Timestamps fuer Karaoke oder brauchen wir Whisper fuer Alignment?
- [ ] WebSocket fuer Job-Status oder Polling reicht?
- [ ] Generator Worker: Auch in Rust oder Node.js (wegen Gemini SDK)?
- [ ] Offline-Cache Strategie: Service Worker oder native Loesung?
- [ ] Bild-Storage: PocketBase File-Felder oder separater S3/MinIO?
- [ ] CI/CD: GitHub Actions fuer Tests + Docker Build?
