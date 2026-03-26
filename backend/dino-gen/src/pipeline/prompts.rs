/// Image generation prompts for Imagen 4

pub fn comic_prompt(name: &str, scientific: &str) -> String {
    format!(
        "Cute friendly cartoon illustration of a {} ({}) dinosaur for a children's app. \
         Full body, side view, standing proudly. Comic sticker style with bold thick black outlines, \
         vibrant saturated colors, big expressive eyes. Kid-friendly sticker art. \
         Solid plain white background. No text, no watermark, no frame.",
        name, scientific
    )
}

pub fn real_prompt(name: &str, _scientific: &str, _habitat: &str) -> String {
    format!(
        "Photorealistic scientific illustration of a {} dinosaur. \
         Style: museum-quality natural history illustration, detailed skin texture, anatomically accurate. \
         Natural realistic coloring with detailed shading and lighting. \
         Full body side or three-quarter view, dynamic pose. \
         IMPORTANT: Pure solid white background (#FFFFFF). No habitat, no environment, no ground, no other animals. \
         No text, no watermark, no labels. Square canvas. Ultra detailed, professional scientific illustration.",
        name
    )
}

pub fn skeleton_prompt(name: &str, scientific: &str) -> String {
    format!(
        "Fossilized dinosaur skeleton of a {} ({}), viewed from the side. \
         Style: scientific museum illustration, detailed bone anatomy, paleontology textbook quality. \
         Color: cream-white and beige bones with subtle warm brown shadows, \
         embedded in dark brown earthy soil/rock matrix. \
         The skeleton should look like it has just been excavated — partially revealed from surrounding dark dirt. \
         Full skeleton visible: skull, spine, ribs, limbs, tail. Anatomically accurate proportions. \
         IMPORTANT: Dark soil/earth background (#2C1A0E), no other animals, no text, no labels, no watermark. \
         Square canvas. High detail, dramatic lighting from above as if being unearthed.",
        name, scientific
    )
}

pub fn shadow_prompt(name: &str) -> String {
    format!(
        "Pure black silhouette of a {} dinosaur in side view profile. \
         Completely filled solid black shape on pure white background. \
         Clean sharp edges. No details inside, just outline filled with solid black. \
         Simple clean vector style. No text, no frame.",
        name
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
  "kid_summary": "5 Saetze Geschichte fuer 4-6 Jaehrige, spannend und lehrreich",
  "kid_summary_tts": "Gleicher Text wie kid_summary, aber mit IPA-Aussprachehilfen fuer lateinische/wissenschaftliche Begriffe im Format [[IPA]]. Beispiel: 'Das ist der [[tʁiˈt͡seːʁatɔps]]! Er war ein riesiger Pflanzenfresser.' Nur Dino-Namen und Fachbegriffe bekommen [[IPA]], nicht deutsche Woerter. Nutze deutsche IPA-Phonetik.",
  "fun_fact": "1-2 Saetze, ueberraschender Fakt mit Vergleich",
  "fun_fact_tts": "Gleicher Text mit [[IPA]] fuer Fachbegriffe",
  "size_comparison": "Vergleich mit etwas das Kinder kennen (z.B. 'So gross wie 2 Autos')",
  "name_ipa": "IPA-Aussprache des Dino-Namens, z.B. tʁiˈt͡seːʁatɔps",
  "facts": [
    {{ "icon": "calendar_month", "label": "Zeitalter", "value": "{}", "sub": "X Mio. Jahre", "story": "3 Saetze kindgerecht", "story_tts": "Gleicher Text mit [[IPA]] fuer Fachbegriffe" }},
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
- Alle *_tts Felder enthalten den gleichen deutschen Text wie das Originalfeld
- Lateinische/wissenschaftliche Namen werden in [[IPA]] eingebettet: [[tʁiˈt͡seːʁatɔps]]
- Nutze DEUTSCHE IPA-Phonetik (nicht englisch!)
- Nur Dino-Namen und echte Fachbegriffe bekommen [[IPA]], NICHT normale deutsche Woerter
- Die [[IPA]] Tags ersetzen das Wort komplett: "Der [[tʁiˈt͡seːʁatɔps]] war gross."
- Beispiele: Triceratops→[[tʁiˈt͡seːʁatɔps]], Tyrannosaurus→[[tyˈʁanːozaʊ̯ʁʊs]], Stegosaurus→[[ˈʃteːɡozaʊ̯ʁʊs]], Kreidezeit→Kreidezeit (normales Deutsch, kein IPA)

Wichtig: Kindgerecht, spannend, mit Vergleichen die 4-6 Jaehrige verstehen."#,
        name, scientific, period, continent, diet, length_m, weight_kg,
        period, diet, length_m, continent, name
    )
}
