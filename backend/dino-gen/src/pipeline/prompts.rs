/// Image generation prompts for Imagen 4 Ultra

pub fn comic_prompt(name: &str, scientific: &str) -> String {
    format!(
        "Cute friendly cartoon illustration of a {} ({}) dinosaur for a children educational app. \
         Standing proudly. Comic sticker style with bold thick black outlines, vibrant colors. \
         Big expressive eyes. Kid-friendly sticker art style. \
         Solid bright magenta #FF00FF background. No text no watermark. Square canvas.",
        name, scientific
    )
}

pub fn real_prompt(name: &str, scientific: &str, habitat: &str) -> String {
    format!(
        "Photorealistic scientific illustration of a {} ({}) dinosaur in its natural habitat. \
         {} Dramatic natural lighting, golden hour. Detailed textured skin. \
         Museum quality paleoart, National Geographic style. No text no watermark. Square canvas.",
        name, scientific, habitat
    )
}

pub fn skeleton_prompt(name: &str, scientific: &str) -> String {
    format!(
        "Fossilized dinosaur skeleton of a {} ({}), viewed from directly above as a top-down bird eye view, \
         partially embedded in dark brown earthy soil. Style: scientific museum illustration, \
         detailed bone anatomy. Color: cream-white and beige bones, dark soil earth background #2C1A0E. \
         No text no labels. Square canvas. High detail.",
        name, scientific
    )
}

pub fn shadow_prompt(name: &str) -> String {
    format!(
        "Pure black silhouette of a {} dinosaur in side view profile. \
         Completely filled solid black shape on pure white background. \
         Clean sharp edges. No details inside, just outline filled with solid black. \
         Simple clean vector style. No text. Square canvas.",
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
  "fun_fact": "1-2 Saetze, ueberraschender Fakt mit Vergleich",
  "size_comparison": "Vergleich mit etwas das Kinder kennen (z.B. 'So gross wie 2 Autos')",
  "facts": [
    {{ "icon": "calendar_month", "label": "Zeitalter", "value": "{}", "sub": "X Mio. Jahre", "story": "3 Saetze kindgerecht" }},
    {{ "icon": "restaurant", "label": "Nahrung", "value": "{}", "story": "3 Saetze" }},
    {{ "icon": "straighten", "label": "Laenge", "value": "{} Meter", "story": "3 Saetze mit Vergleich" }},
    {{ "icon": "scale", "label": "Gewicht", "value": "X Tonnen", "story": "3 Saetze mit Vergleich" }},
    {{ "icon": "public", "label": "Lebensraum", "value": "{}", "story": "3 Saetze" }},
    {{ "icon": "group", "label": "Verhalten", "value": "Herdentier/Einzelgaenger", "story": "3 Saetze" }},
    {{ "icon": "lightbulb", "label": "Wusstest du?", "value": "Kurzer Fakt", "story": "3 Saetze" }}
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

Wichtig: Kindgerecht, spannend, mit Vergleichen die 4-6 Jaehrige verstehen."#,
        name, scientific, period, continent, diet, length_m, weight_kg,
        period, diet, length_m, continent, name
    )
}
