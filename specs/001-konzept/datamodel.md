# Dino-Atlas - Datenmodell

> Abgeleitet aus den tatsaechlich gebauten Screens und deren Datenbedarf.

## Uebersicht

```
FAMILIES ──< USERS (Auth)
           ──< PLAYERS ──< MUSEUM_ENTRIES
                         ──< EXPEDITIONS ──< EXPEDITION_STEPS
                         ──< MINIGAME_SESSIONS
                         ──< DAILY_BUDGETS
                         ──< BUDGET_RESETS

DINO_SPECIES (Stammdaten, generiert)
STORIES (pro Familie/Tag, generiert)
OFFLINE_TASKS (pro Expedition)

AI_MODELS ──< AI_MODEL_ROUTING
AI_USAGE_LOG
```

---

## 1. DINO_SPECIES (Stammdaten — generiert via Pipeline)

Pro Dino werden alle Daten und Bilder vorab generiert und in PocketBase gespeichert.

| Feld | Typ | Quelle | Gebraucht von |
|------|-----|--------|---------------|
| id | string | auto | alle |
| slug | string | seed | URL-Routing |
| display_name_de | string | seed | Discovery, Museum, Quiz |
| scientific_name | string | seed | Discovery ("Dreihorn-Gesicht") |
| period | select: Trias/Jura/Kreide | seed | Discovery, TimelineSort, TimeSlider |
| period_start_mya | number | seed | TimeSlider (68) |
| period_end_mya | number | seed | TimeSlider (66) |
| diet | select: Pflanzenfresser/Fleischfresser/Allesfresser | seed | FoodMatch, Discovery |
| length_m | number | seed | SizeSort, Discovery |
| weight_kg | number | seed | Discovery |
| continent | string | seed | Discovery Karten |
| continent_position | json: {left, top} | seed | Discovery Karten (Pin-Position) |
| rarity | select: common/uncommon/rare/epic/legendary | seed | Museum |
| kid_summary | text | Gemini | Discovery (Haupt-Story) |
| fun_fact | text | Gemini | Discovery (Wusstest du?) |
| size_comparison | string | Gemini | Discovery ("So gross wie 2 Autos") |
| **Bilder (PocketBase File-Felder):** | | |
| image_comic | file (PNG) | Imagen | ueberall (Sticker-Stil) |
| image_real | file (PNG) | Imagen | Discovery (Echt-Tab) |
| image_skeleton | file (PNG) | Imagen | Excavation, Puzzle, Discovery |
| image_shadow | file (PNG) | Imagen | ShadowGuess |
| **Audio (PocketBase File-Felder):** | | |
| audio_name | file (MP3) | Piper TTS | Discovery (Name vorlesen) |
| audio_steckbrief | file (MP3) | Piper TTS | Discovery (Story vorlesen) |
| **Fakten (JSON):** | | |
| facts | json | Gemini | Discovery Fakten-Karussell |
| quiz_questions | json | Gemini | Quiz |
| food_options | json | Gemini | InteractiveDino (Fuettern) |
| identify_hints | json | Gemini | Identify (Hinweise bei falsch) |

### facts JSON-Struktur:
```json
[
  {
    "icon": "calendar_month",
    "label": "Zeitalter",
    "value": "Kreidezeit",
    "sub": "68–66 Mio. Jahre",
    "story": "Der Triceratops lebte ganz am Ende...",
    "audio_url": "optional"
  }
]
```

### quiz_questions JSON-Struktur:
```json
[
  {
    "question": "Was hat der Triceratops gefressen?",
    "options": [
      { "label": "Pflanzen", "emoji": "🌿", "correct": true },
      { "label": "Fleisch", "emoji": "🥩", "correct": false }
    ],
    "explanation": "Richtig! Der Triceratops war..."
  }
]
```

### food_options JSON-Struktur:
```json
[
  { "id": "fern", "emoji": "🌿", "label": "Farn", "correct": true },
  { "id": "meat", "emoji": "🥩", "label": "Fleisch", "correct": false }
]
```

### identify_hints JSON-Struktur:
```json
{
  "trex": "Schau mal, der T-Rex hat kurze Arme...",
  "stegosaurus": "Der Stegosaurus hat Platten auf dem Rücken..."
}
```

---

## 2. FAMILIES

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | alle |
| name | string | Register ("Familie Stoldt") |
| created_at | datetime | - |

---

## 3. USERS (PocketBase Auth)

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | Auth |
| email | string | Login |
| password | hash | Login |
| family_id | relation → FAMILIES | Login → Family |

---

## 4. PLAYERS (Kinder-Profile, kein Login)

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | alle |
| family_id | relation → FAMILIES | Family-Zugehoerigkeit |
| name | string | PlayerSelect, Home, alle Screens |
| avatar_emoji | string | PlayerSelect, PlayerSwitcher, TopBar |
| birth_year | number | Register, Schwierigkeitsgrad |
| interests | json: string[] | Story-Personalisierung |
| level | number | Home (Lv.3), ParentDashboard |
| dinos_discovered | number | Home, Museum (4 Dinos) |
| minigames_remaining | number | Home, MinigameSelect (2 uebrig) |

---

## 5. EXPEDITIONS

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| player_id | relation → PLAYERS | pro Kind |
| dino_species_id | relation → DINO_SPECIES | welcher Dino |
| date | date | Tages-Expedition |
| biom | select: desert/jungle/ice/ocean | ExpeditionIntro |
| status | select: intro/excavation/puzzle/identify/discovery/offline/complete | Flow-Tracking |
| excavation_time_ms | number | Statistik |
| puzzle_time_ms | number | Statistik |
| identify_attempts | number | Statistik |
| offline_task_type | select: draw/build/measure/find | OfflineTask |
| offline_task_accepted | boolean | OfflineTask |

---

## 6. MUSEUM_ENTRIES

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| player_id | relation → PLAYERS | pro Kind |
| dino_species_id | relation → DINO_SPECIES | welcher Dino |
| discovered_at | datetime | Museum Detail |
| stars | number (0-3) | Museum Galerie (Sterne) |
| artwork_photo | file (PNG/JPG) | PhotoUpload, Museum Detail |
| artwork_ai_feedback | text | PhotoUpload (KI-Bewertung) |
| favorite | boolean | Museum Detail |

---

## 7. MINIGAME_SESSIONS

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| player_id | relation → PLAYERS | pro Kind |
| game_type | select: quiz/size_sort/timeline/food_match/shadow_guess | MinigameSelect |
| dino_species_ids | json: string[] | welche Dinos im Spiel |
| score | number | Ergebnis |
| stars_earned | number (0-3) | Museum (Sterne) |
| time_ms | number | Dauer |
| completed_at | datetime | - |

---

## 8. STORIES

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| family_id | relation → FAMILIES | pro Familie |
| date | date | Tages-Geschichte |
| player_dinos | json: [{player_id, dino_species_id}] | StoryTime (Wer hat welchen Dino) |
| title | string | StoryTime ("Die drei Freunde am See") |
| story_text | text | StoryTime (AudioPlayer Karaoke) |
| audio_url | file (MP3) | StoryTime (TTS) |
| timestamps | json: WordTimestamp[] | StoryTime (Karaoke-Sync) |

---

## 9. DAILY_BUDGETS

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| player_id | relation → PLAYERS | pro Kind |
| date | date | heute |
| expeditions_used | number | Home (1 Expedition) |
| expeditions_max | number | Config (default 1) |
| minigames_used | number | Home, MinigameSelect |
| minigames_max | number | Config (default 3) |
| evening_session_done | boolean | StoryTime |
| is_tired | boolean | SleepyDinos |

---

## 10. BUDGET_RESETS

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| player_id | relation → PLAYERS | welches Kind |
| date | date | - |
| reset_by_user_id | relation → USERS | welcher Erwachsene |
| math_question | string | ParentReset ("7 × 8") |
| math_answer_given | string | ParentReset |
| reset_at | datetime | ParentDashboard (Protokoll) |

---

## 11. OFFLINE_TASKS

| Feld | Typ | Gebraucht von |
|------|-----|---------------|
| id | string | - |
| expedition_id | relation → EXPEDITIONS | - |
| task_type | select: draw/build/measure/find | OfflineTask |
| dino_species_id | relation → DINO_SPECIES | Referenz-Dino |
| accepted_at | datetime | OfflineTask |
| photo_uploaded | boolean | PhotoUpload |
| photo | file (PNG/JPG) | PhotoUpload |
| ai_feedback | text | PhotoUpload |

---

## 12. AI_MODELS

| Feld | Typ |
|------|-----|
| id | string |
| provider | string (google) |
| model_id | string (gemini-2.0-flash, imagen-4.0-ultra) |
| display_name | string |
| capabilities | json: string[] |
| price_per_1m_input_tokens_usd | number |
| price_per_1m_output_tokens_usd | number |
| price_per_image_usd | number |
| is_active | boolean |

---

## 13. AI_MODEL_ROUTING

| Feld | Typ |
|------|-----|
| id | string |
| operation | string (generate_story, generate_image, evaluate_photo, etc.) |
| model_id | relation → AI_MODELS |
| priority | number |

---

## 14. AI_USAGE_LOG

| Feld | Typ |
|------|-----|
| id | string |
| job_id | string |
| triggered_by | select: admin/app/worker |
| trigger_context | string |
| model_id | string |
| operation | string |
| input_tokens | number |
| output_tokens | number |
| image_count | number |
| cost_estimate_usd | number |
| duration_ms | number |
| success | boolean |
| error_message | text |
| created_at | datetime |

---

## Bilder-Generierung pro Dino

Fuer jeden der 15-20 Dinos muessen folgende Bilder generiert werden:

| Bild | Model | Prompt-Typ | Aspect | Post-Processing |
|------|-------|-----------|--------|----------------|
| comic.png | Imagen 4 Ultra | Sticker-Stil, Magenta BG | 1:1 | Magenta-Removal |
| real.png | Imagen 4 Ultra | Photorealistisch, Habitat | 1:1 | keins |
| skeleton.png | Imagen 4 Ultra | Fossil Top-Down, dunkle Erde | 1:1 | keins |
| shadow.png | Imagen 4 Ultra | Schwarze Silhouette, weiss BG | 1:1 | Weiss-Removal |

Plus globale Assets:
- 4 Weltkarten (Trias, Jura, Kreide, Heute) — schon generiert
- Logo — schon generiert

**Geschaetzte Kosten pro Dino:** 4 Bilder × ~$0.06 = ~$0.24
**Fuer 20 Dinos:** ~$4.80

---

## API Endpoints (abgeleitet aus Screens)

```
# Auth
POST /api/v1/auth/register   → Family + User + Players anlegen
POST /api/v1/auth/login      → JWT Token

# Players
GET  /api/v1/players         → Alle Kinder der Familie
GET  /api/v1/players/:id     → Ein Kind mit Stats

# Expedition
GET  /api/v1/expedition/today/:playerId  → Heutige Expedition (oder neue starten)
POST /api/v1/expedition/:id/step         → Naechster Schritt (excavation→puzzle→identify...)
POST /api/v1/expedition/:id/complete     → Expedition abschliessen

# Museum
GET  /api/v1/museum/:playerId           → Alle entdeckten Dinos
GET  /api/v1/museum/:playerId/:dinoId   → Detail-Ansicht (= Discovery Screen Daten)
POST /api/v1/museum/:entryId/artwork    → Foto hochladen

# Dinos
GET  /api/v1/dinos                      → Alle Dino-Species (Katalog)
GET  /api/v1/dinos/:slug                → Ein Dino mit allen Daten + Bildern

# Mini-Games
GET  /api/v1/minigames/:playerId        → Verfuegbare Spiele + Budget
POST /api/v1/minigames/session          → Spiel starten
POST /api/v1/minigames/session/:id/complete → Ergebnis speichern

# Story
GET  /api/v1/story/tonight/:familyId    → Heutige Geschichte (generieren falls noetig)

# Budget
GET  /api/v1/budget/:playerId           → Tages-Budget Status
POST /api/v1/budget/reset               → Eltern-Reset (Rechenaufgabe validieren)

# Admin
GET  /api/v1/admin/ai-usage             → KI-Kosten Uebersicht
GET  /api/v1/admin/resets               → Reset-Protokoll
```
