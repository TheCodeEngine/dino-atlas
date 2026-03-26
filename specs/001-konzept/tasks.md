# Dino-Atlas - Umsetzungsplan

> Abhakliste fuer die Implementierung. Jede Phase baut auf der vorherigen auf.
> Status: [ ] offen, [~] in Arbeit, [x] fertig

---

## Phase 0: Projekt-Setup & Infrastruktur ✅

- [x] Monorepo (pnpm Workspaces), Shared Configs
- [x] Alle Packages (ui, types, minigames, app, landing, storybook)
- [x] Rust Backend Workspace (api + generator + core)
- [x] TTS Service (Piper), PocketBase, Docker Compose, Traefik, Makefile
- [x] Node 24 + Rust 1.94 + pnpm install + cargo check

---

## Phase 1: Datenbank & Seed-Pipeline

Ziel: PocketBase hat das Schema, Seed-Script befuellt Basis-Dinos.

- [ ] PocketBase Collections Schema (basierend auf Screen-Daten):
  - [ ] FAMILIES, USERS (Auth), PLAYERS
  - [ ] DINO_SPECIES (mit allen Feldern die Discovery Screen braucht)
  - [ ] EXPEDITIONS (Status-Flow: intro→excavation→puzzle→identify→discovery)
  - [ ] MUSEUM_ENTRIES (inkl. Artwork-Foto + KI-Feedback)
  - [ ] STORIES (Kombinations-Geschichte, Audio-Timestamps)
  - [ ] MINIGAME_SESSIONS (Quiz, SizeSort, Timeline, FoodMatch, ShadowGuess)
  - [ ] DAILY_BUDGETS, BUDGET_RESETS
  - [ ] AI_MODELS, AI_MODEL_ROUTING, AI_USAGE_LOG
  - [ ] OFFLINE_TASKS (Aufgabentyp, Dino-Referenz, Status)
- [ ] Schema-Import Script
- [ ] 15-20 Basis-Dinos mit Seed-Daten:
  - [ ] Fakten (deutsch + lateinisch), Erdzeitalter, Ernaehrung, Groesse
  - [ ] Kindgerechte Texte + Fun Facts
  - [ ] Quiz-Fragen pro Dino (3-5)
  - [ ] Futter-Info (fuer FoodMatch)
  - [ ] Zeitalter-Info (fuer Timeline)
  - [ ] Groessen-Info (fuer SizeSort)
- [ ] Bilder pro Dino generieren (Imagen 4 Ultra):
  - [ ] comic.png (Sticker-Stil, Magenta-BG-Removal)
  - [ ] real.png (Photorealistisch, National Geographic)
  - [ ] skeleton.png (Top-Down Fossil)
  - [ ] shadow.png (Schwarze Silhouette)
- [ ] AI_MODELS + AI_MODEL_ROUTING Seed
- [ ] `make seed` + `make reset`

---

## Phase 2: UI-Kit & Storybook ✅

### Design System
- [x] Sticker/Badge Design System (vom Designer uebernommen)
- [x] Material Design 3 Farben + Plus Jakarta Sans
- [x] Tailwind v4 @theme Konfiguration
- [x] Storybook mit Tailwind + Fonts + Static Assets

### Primitives (4)
- [x] Button (5 Varianten, 3 Groessen, Icon, FullWidth, Disabled)
- [x] TextInput (Label, Icon, Password)
- [x] Divider (Plain, mit Text)
- [x] TabBar (Multi-Tab Switcher)

### Components (17)
- [x] AudioPlayer (Karaoke-Text, Compact-Modus, Demo-Playback)
- [x] FormCard (Tabs, Footer)
- [x] PageHeader (Logo, Titel, Untertitel)
- [x] TopBar (Logo, Right-Slot)
- [x] ForscherSpeech (Sprechblase, TTS Play-Button, Equalizer)
- [x] PlayerCard (Avatar, Name, Alter, 3 States)
- [x] StatusBadge (6 Varianten, Icon)
- [x] ActionCard (4 Farbvarianten, Badge)
- [x] BottomNav (4 Tabs, Active State)
- [x] AppShell (TopBar + Content + BottomNav)
- [x] FullscreenHeader (Close + Title + Avatar, Light/Dark)
- [x] MinigameShell (Instruction + Game + Done-Screen)
- [x] PlayerSwitcher (Bottom-Sheet, Spring-Animation, Haptics)
- [x] TimeSlider (Erdzeitalter-Icons, Karten-Thumbnails)
- [x] ImageSwitcher (Echt/Comic/Skelett Tabs)
- [x] MuseumTransition + LandScene (Parallax Side-Scroller)
- [x] ExpeditionIntro + 4 BiomScenes (Wueste/Regenwald/Eis/Ozean)

### Hooks (1)
- [x] useHaptics (tap, success, error, warning)

### Alle mit Storybook Stories

---

## Phase 3: Screens & Mini-Games ✅

### Expedition-Flow (6 Screens)
- [x] ExpeditionIntro (4 Biom-Varianten, Animationen)
- [x] Excavation (Canvas Dig-Game, Dirt-Layer, Progress)
- [x] Puzzle (3x3 Bild-Puzzle mit dnd-kit Drag&Drop)
- [x] Identify (4 echte Comic-Dinos, Hinweise, Konfetti)
- [x] Discovery (Dino-Buch: Bild-Switcher, AudioPlayer, Fakten-Karussell,
      Weltkarten, interaktiver Dino mit Fuettern, Museum-Animation)
- [x] Offline-Auftrag (4 Aufgabentypen, Goodbye-Animation)

### Navigation Screens (4)
- [x] Login + Register (2-Step, FormCard, TextInput)
- [x] Spieler-Auswahl (PlayerCard, Toggle)
- [x] Home/Camp (PlayerSwitcher, Expedition CTA, Quick-Tiles)
- [x] Museum Galerie (Grid, Rarity Badges, Sterne)

### Abend-Session (2)
- [x] Gute-Nacht-Geschichte (Nacht-Theme, 3 Kid-Avatare, AudioPlayer)
- [x] Quiz (3 Fragen, Richtig/Falsch, Sterne, Completion)

### Mini-Spiele (4)
- [x] Groessen-Sortieren (dnd-kit Sortable)
- [x] Zeitleiste (dnd-kit Drag to Drop-Zones)
- [x] Futter-Zuordnung (dnd-kit Drag Dinos to Food)
- [x] Schatten-Raten (Silhouette + Optionen)

### System-Screens (3) — scaffolded
- [x] Muede Dinos (Nacht-Theme, schlafender Dino)
- [~] Eltern-Reset (Rechenaufgabe) — Scaffold
- [~] Eltern-Dashboard (4 Tabs) — Scaffold
- [~] Foto-Upload (4-Phase Flow) — ausgearbeitet
- [~] Mini-Spiel Auswahl — Scaffold
- [~] Museum Detail — Scaffold (nutzt Discovery-Elemente)

### Assets generiert (Imagen 4 Ultra)
- [x] Triceratops: comic, real, skeleton, shadow
- [x] T-Rex: comic
- [x] Stegosaurus: comic
- [x] Brachiosaurus: comic
- [x] Logo (Triceratops Explorer)
- [x] 4 Weltkarten (Trias, Jura, Kreide, Heute)

---

## Phase 4: Datenstruktur & Backend ← NAECHSTER SCHRITT

Ziel: Schema das zu den Screens passt, API Endpoints, Domain-Logik.

### Datenstruktur (abgeleitet aus Screens)
- [ ] Welche Daten braucht jeder Screen?
- [ ] PocketBase Schema finalisieren
- [ ] TypeScript Types (@dino-atlas/types) updaten

### Rust Backend (Hexagonal)
- [ ] Domain Models (core/)
- [ ] Ports/Traits
- [ ] Services (Expedition, Budget, Quiz, Museum, Story)
- [ ] PocketBase Adapter
- [ ] API Endpoints (api/)
- [ ] Auth (JWT)

### Generator Worker
- [ ] Valkey Job-Queue
- [ ] Gemini Integration (Bilder, Texte, Stories)
- [ ] TTS Integration
- [ ] AI Cost Tracking

---

## Phase 5: App zusammenbauen

- [ ] React Router + Pages
- [ ] API Client Layer
- [ ] Zustand Stores
- [ ] Screens mit Backend verbinden
- [ ] Expedition-Flow als State Machine

---

## Phase 6: Content-Pipeline

- [ ] 15-20 Dinos komplett generieren (Bilder + Texte + Audio)
- [ ] Gute-Nacht-Geschichten Generator
- [ ] Quiz-Fragen Generator
- [ ] Foto-Bewertung (Gemini Vision)

---

## Phase 7: Landing + Polish + Deploy

- [ ] Landing Page
- [ ] Animationen optimieren
- [ ] iPad-Optimierung
- [ ] Cloudflare Tunnel
- [ ] README fuer Open Source
