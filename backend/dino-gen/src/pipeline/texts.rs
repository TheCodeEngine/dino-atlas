use crate::providers::gemini::GeminiClient;
use crate::providers::pocketbase::PocketBaseClient;
use crate::pipeline::prompts;
use crate::pipeline::seed_data::DinoSeed;
use crate::pipeline::costs;

/// Generate all text content for a dino via Gemini Flash
pub async fn generate(
    pb: &PocketBaseClient,
    gemini: &GeminiClient,
    dino: &DinoSeed,
    record_id: &str,
) -> Result<(), String> {
    let prompt = prompts::dino_content_prompt(
        &dino.display_name_de,
        &dino.scientific_name,
        &dino.period,
        &dino.diet,
        dino.length_m,
        dino.weight_kg,
        &dino.continent,
    );

    tracing::info!("  Calling Gemini Flash for texts...");
    let start = std::time::Instant::now();
    let raw = gemini.generate_text(&prompt).await?;
    let duration = start.elapsed();

    // Parse JSON from response (may have markdown fences)
    let json_str = extract_json(&raw)?;
    let content: serde_json::Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("JSON parse error: {} — raw: {}", e, &raw[..raw.len().min(200)]))?;

    // Normalize IPA brackets in all TTS fields (Gemini sometimes uses single brackets)
    let kid_summary_tts = normalize_tts_field(&content, "kid_summary_tts");
    let fun_fact_tts = normalize_tts_field(&content, "fun_fact_tts");

    // Normalize story_tts in facts array
    let facts = if let Some(facts_arr) = content["facts"].as_array() {
        let normalized: Vec<serde_json::Value> = facts_arr.iter().map(|f| {
            let mut fact = f.clone();
            if let Some(story_tts) = f["story_tts"].as_str() {
                fact["story_tts"] = serde_json::Value::String(normalize_ipa_brackets(story_tts));
            }
            fact
        }).collect();
        serde_json::Value::Array(normalized)
    } else {
        content["facts"].clone()
    };

    // Update dino_species record with text fields (including TTS variants)
    let update = serde_json::json!({
        "kid_summary": content["kid_summary"].as_str().unwrap_or(""),
        "kid_summary_tts": kid_summary_tts,
        "fun_fact": content["fun_fact"].as_str().unwrap_or(""),
        "fun_fact_tts": fun_fact_tts,
        "size_comparison": content["size_comparison"].as_str().unwrap_or(""),
        "name_ipa": content["name_ipa"].as_str().unwrap_or(""),
        "facts": facts,
        "quiz_questions": content["quiz_questions"],
        "food_options": content["food_options"],
        "identify_hints": content["identify_hints"],
    });

    pb.update_record("dino_species", record_id, &update).await?;

    // Log cost
    let cost = costs::CostEntry {
        operation: "generate_texts".into(),
        model: "gemini-2.5-flash".into(),
        dino_slug: dino.slug.clone(),
        duration_ms: duration.as_millis() as u64,
        estimated_cost_usd: 0.001, // ~1000 tokens in, ~2000 out ≈ $0.001
    };
    costs::log_cost(pb, &cost).await;

    tracing::info!("  Texts saved for {} ({:.1}s)", dino.slug, duration.as_secs_f32());
    Ok(())
}

/// Normalize single-bracket IPA `[phoneme]` to double-bracket `[[phoneme]]`.
/// Gemini sometimes generates single brackets despite the prompt.
fn normalize_ipa_brackets(text: &str) -> String {
    // Already double-bracketed [[...]] → leave alone
    // Single-bracketed [IPA] → convert to [[IPA]]
    // Strategy: first protect existing [[...]], then convert remaining [...], then restore
    let mut result = text.to_string();
    // Replace [[ with a placeholder
    result = result.replace("[[", "\x00OPEN\x00");
    result = result.replace("]]", "\x00CLOSE\x00");
    // Now remaining [ ] are single brackets — convert to double
    result = result.replace('[', "[[");
    result = result.replace(']', "]]");
    // Restore original double brackets (they became [[[ → fix)
    result = result.replace("\x00OPEN\x00", "[[");
    result = result.replace("\x00CLOSE\x00", "]]");
    result
}

fn normalize_tts_field(content: &serde_json::Value, field: &str) -> String {
    let text = content[field].as_str().unwrap_or("");
    normalize_ipa_brackets(text)
}

/// Extract JSON from a response that may be wrapped in ```json ... ```
fn extract_json(raw: &str) -> Result<String, String> {
    let trimmed = raw.trim();
    if trimmed.starts_with("```") {
        // Strip markdown fences
        let start = trimmed.find('{').ok_or("No JSON object in fenced response")?;
        let end = trimmed.rfind('}').ok_or("No closing brace in response")? + 1;
        Ok(trimmed[start..end].to_string())
    } else if trimmed.starts_with('{') {
        Ok(trimmed.to_string())
    } else {
        // Try to find JSON anywhere in the response
        let start = trimmed.find('{').ok_or("No JSON object in response")?;
        let end = trimmed.rfind('}').ok_or("No closing brace in response")? + 1;
        Ok(trimmed[start..end].to_string())
    }
}
