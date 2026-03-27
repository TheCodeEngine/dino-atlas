/// Image generation prompts
/// All images use Imagen 4. Before generating, we ask Gemini Flash to research
/// how the dinosaur actually looked based on fossil evidence, then embed that
/// description into structured Imagen prompts.

// ── Gemini Flash: research prompt ──

pub fn research_appearance(name: &str) -> String {
    format!(
        "Describe the physical appearance of {} in exactly ONE sentence for an artist. \
         Include: body type, limb types, distinctive features. \
         Example: 'A large quadrupedal herbivore with three facial horns, a bony neck frill, and a beak-like mouth.' \
         English only. Max 30 words.",
        name
    )
}

// ── Imagen 4 prompts (with Gemini research as appearance context) ──

pub fn real_prompt(name: &str, appearance: &str) -> String {
    format!(
        "Photorealistic scientific illustration of a {}: {}. \
         Museum-quality, anatomically accurate, detailed texture, natural coloring. \
         Full body side view, dynamic pose. \
         Pure solid white background. No water, no habitat, no ground. No text.",
        name, appearance
    )
}

pub fn comic_prompt(name: &str, appearance: &str) -> String {
    format!(
        "Cute cartoon of a {}: {}. \
         Correct anatomy, no extra limbs. \
         Bold black outlines, vibrant colors, big expressive eyes. Kid-friendly. \
         Full body, side view. White background. No sticker border, no text.",
        name, appearance
    )
}

pub fn skeleton_prompt(name: &str, appearance: &str) -> String {
    format!(
        "Fossilized skeleton of a {}: {}. Match those proportions as bones. \
         Museum fossil exhibit, side view, paleontology textbook quality. \
         Cream bones in dark brown earth/soil matrix, just excavated. \
         ONLY BONES, no soft tissue. No text, no labels.",
        name, appearance
    )
}

/// Prompt to discover new dinosaurs via AI
pub fn discover_prompt(existing_slugs: &[String], count: u32) -> String {
    let slugs_list = existing_slugs.join(", ");
    format!(
        r#"Du bist ein Palaentologie-Experte. Ich baue eine Dinosaurier-App fuer Kinder.

Folgende Dinosaurier sind bereits in der App:
{slugs_list}

Schlage {count} neue ECHTE Dinosaurier vor, die noch nicht in der Liste sind.
Waehle moeglichst unterschiedliche Arten (verschiedene Perioden, Kontinente, Diaetvarianten, Groessen).

Antworte NUR mit einem JSON-Array. Kein anderer Text!

[
  {{
    "slug": "name-mit-bindestrichen",
    "display_name_de": "Deutscher Anzeigename",
    "scientific_name": "Deutsche Uebersetzung des wissenschaftlichen Namens (z.B. 'Dornenechse' fuer Spinosaurus)",
    "period": "Trias|Jura|Kreide",
    "period_start_mya": 150,
    "period_end_mya": 145,
    "diet": "Pflanzenfresser|Fleischfresser|Allesfresser|Fischfresser",
    "length_m": 6.0,
    "weight_kg": 2000.0,
    "continent": "Europa|Nordamerika|Suedamerika|Afrika|Asien|Australien|Antarktika",
    "rarity": "common|uncommon|rare|epic|legendary",
    "habitat_description": "English description of the habitat for image generation, 1 sentence"
  }}
]

Wichtig:
- NUR echte, wissenschaftlich anerkannte Dinosaurier (oder prahistorische Reptilien)
- slug: Kleinbuchstaben, Bindestriche statt Leerzeichen
- period_start_mya > period_end_mya (Millionen Jahre vor heute)
- Realistische Masse und Gewichte basierend auf palaontologischer Forschung
- rarity-Verteilung: bevorzuge common/uncommon, legendary nur fuer wirklich besondere Arten
- habitat_description auf Englisch (wird fuer Bildgenerierung verwendet)"#,
    )
}

/// Text generation prompt for kid-friendly dino content
pub fn dino_content_prompt(name: &str, scientific: &str, period: &str, diet: &str, length_m: f32, weight_kg: f32, continent: &str) -> String {
    format!(
        r#"Generiere kindgerechte Inhalte fuer den Dinosaurier "{}" ({}) auf Deutsch.
Er lebte in der {} auf dem Kontinent {}.
Er war ein {}, {} Meter lang und wog {} kg.

Antworte als JSON mit folgender Struktur:
{{
  "kid_summary": "5-6 Saetze voller ECHTE Fakten fuer 4-6 Jaehrige. Jeder Satz MUSS einen konkreten Fakt enthalten: Zeitperiode, Gewicht, Laenge, Ernaehrung oder Lebensraum. Jeden Fakt mit einem kindgerechten Vergleich erklaeren (Gewicht in Elefanten oder Autos, Laenge in Schulbussen oder Betten, Zeit als 'lange bevor es Menschen gab'). Beispielton: 'Der Triceratops lebte in der Kreidezeit, vor 68 Millionen Jahren — das ist sooo lange her! Er war 9 Meter lang, so lang wie ein Schulbus! Und er wog 12 Tonnen, so viel wie 2 grosse Elefanten zusammen!' KEINE Geschichten, KEINE Fantasie, NUR echte Fakten mit Vergleichen.",
  "kid_summary_tts": "Gleicher Text wie kid_summary, aber mit IPA-Aussprachehilfen. Der Name bleibt IMMER im Text, IPA kommt direkt NACH dem Wort: 'Der Triceratops [[tʁiˈt͡seːʁatɔps]] war gross.' Nutze deutsche IPA-Phonetik.",
  "fun_fact": "1-2 Saetze, ueberraschender Fakt mit Vergleich",
  "fun_fact_tts": "Gleicher Text mit Name + [[IPA]] dahinter",
  "size_comparison": "Vergleich mit etwas das Kinder kennen (z.B. 'So gross wie 2 Autos')",
  "name_ipa": "IPA-Aussprache des Dino-Namens, z.B. tʁiˈt͡seːʁatɔps",
  "facts": [
    {{ "icon": "calendar_month", "label": "Zeitalter", "value": "{}", "sub": "X Mio. Jahre", "story": "3 Saetze kindgerecht", "story_tts": "Gleicher Text mit Name + [[IPA]]" }},
    {{ "icon": "restaurant", "label": "Nahrung", "value": "{}", "story": "3 Saetze", "story_tts": "..." }},
    {{ "icon": "straighten", "label": "Laenge", "value": "{} Meter", "story": "3 Saetze mit Vergleich", "story_tts": "..." }},
    {{ "icon": "scale", "label": "Gewicht", "value": "X Tonnen", "story": "3 Saetze mit Vergleich", "story_tts": "..." }},
    {{ "icon": "public", "label": "Lebensraum", "value": "{}", "story": "3 Saetze", "story_tts": "..." }},
    {{ "icon": "group", "label": "Verhalten", "value": "Herdentier/Einzelgaenger", "story": "3 Saetze", "story_tts": "..." }},
    {{ "icon": "lightbulb", "label": "Wusstest du?", "value": "Kurzer Fakt", "story": "3 Saetze", "story_tts": "..." }}
  ],
  "quiz_questions": [
    {{ "question": "Was hat der {} gefressen?", "options": [{{"label":"...","emoji":"...","correct":true/false}}], "explanation": "..." }},
    {{ "question": "...", "options": [...], "explanation": "..." }},
    {{ "question": "...", "options": [...], "explanation": "..." }}
  ],
  "food_options": [
    {{ "id": "...", "emoji": "...", "label": "...", "correct": true/false }}
  ],
  "identify_hints": {{
    "other_dino_slug": "Hinweis warum es NICHT dieser Dino ist"
  }}
}}

WICHTIG zur TTS-Aussprache:
- Der Name bleibt IMMER im Text stehen, [[IPA]] kommt direkt NACH dem Wort
- Beispiel: "Der Triceratops [[tʁiˈt͡seːʁatɔps]] war gross." (NICHT "Der [[tʁiˈt͡seːʁatɔps]] war gross.")
- Nutze DEUTSCHE IPA-Phonetik (nicht englisch!)
- Nur Dino-Namen und echte Fachbegriffe bekommen [[IPA]], NICHT normale deutsche Woerter

Wichtig: Kindgerecht, spannend, mit Vergleichen die 4-6 Jaehrige verstehen."#,
        name, scientific, period, continent, diet, length_m, weight_kg,
        period, diet, length_m, continent, name
    )
}
