use crate::pipeline::seed_data;
use crate::providers::pocketbase::PocketBaseClient;

pub async fn run(pb_url: &str, pb_email: &Option<String>, pb_password: &Option<String>) {
    let email = pb_email.as_deref().expect("POCKETBASE_ADMIN_EMAIL required");
    let password = pb_password.as_deref().expect("POCKETBASE_ADMIN_PASSWORD required");

    let mut pb = PocketBaseClient::new(pb_url);
    pb.auth(email, password).await.expect("PocketBase auth failed");

    let records = pb.list_records("dino_species", None).await.unwrap_or_default();
    let all_seeds = seed_data::all_dinos();

    println!("\n{:<20} {:>3} {:>5} {:>5} {:>5} {:>5} {:>5} {:>6} {:>6}",
        "Slug", "DB", "Text", "Comic", "Real", "Skel", "Shad", "AName", "AStck");
    println!("{}", "-".repeat(80));

    let mut total_text = 0;
    let mut total_comic = 0;
    let mut total_real = 0;
    let mut total_skeleton = 0;
    let mut total_shadow = 0;
    let mut total_audio_name = 0;
    let mut total_audio_steck = 0;

    for seed in &all_seeds {
        let record = records.iter().find(|r| r["slug"].as_str() == Some(&seed.slug));

        let (in_db, has_text, has_comic, has_real, has_skel, has_shad, has_aname, has_astck) = match record {
            Some(r) => {
                let t = !r["kid_summary"].as_str().unwrap_or("").is_empty();
                let c = !r["image_comic"].as_str().unwrap_or("").is_empty();
                let re = !r["image_real"].as_str().unwrap_or("").is_empty();
                let s = !r["image_skeleton"].as_str().unwrap_or("").is_empty();
                let sh = !r["image_shadow"].as_str().unwrap_or("").is_empty();
                let an = !r["audio_name"].as_str().unwrap_or("").is_empty();
                let as_ = !r["audio_steckbrief"].as_str().unwrap_or("").is_empty();
                if t { total_text += 1; }
                if c { total_comic += 1; }
                if re { total_real += 1; }
                if s { total_skeleton += 1; }
                if sh { total_shadow += 1; }
                if an { total_audio_name += 1; }
                if as_ { total_audio_steck += 1; }
                (true, t, c, re, s, sh, an, as_)
            }
            None => (false, false, false, false, false, false, false, false),
        };

        let check = |b: bool| if b { "  ✓" } else { "  ✗" };
        println!("{:<20} {:>3} {:>5} {:>5} {:>5} {:>5} {:>5} {:>6} {:>6}",
            seed.slug,
            if in_db { " ✓" } else { " ✗" },
            check(has_text), check(has_comic), check(has_real),
            check(has_skel), check(has_shad), check(has_aname), check(has_astck));
    }

    let total = all_seeds.len();
    let in_db = records.len();
    println!("{}", "-".repeat(80));
    println!("{:<20} {:>2}/{} {:>3}/{} {:>3}/{} {:>3}/{} {:>3}/{} {:>3}/{} {:>4}/{} {:>4}/{}",
        "TOTAL",
        in_db, total,
        total_text, total,
        total_comic, total,
        total_real, total,
        total_skeleton, total,
        total_shadow, total,
        total_audio_name, total,
        total_audio_steck, total);

    let complete = records.iter().filter(|r| {
        !r["kid_summary"].as_str().unwrap_or("").is_empty()
            && !r["image_comic"].as_str().unwrap_or("").is_empty()
            && !r["audio_name"].as_str().unwrap_or("").is_empty()
    }).count();

    println!("\n{}/{} dinos fully generated (text + comic + audio)", complete, total);
}
