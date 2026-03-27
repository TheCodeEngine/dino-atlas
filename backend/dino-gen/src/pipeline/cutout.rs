use image::{RgbaImage, Rgba, ImageFormat};
use std::collections::VecDeque;
use std::io::Cursor;

/// Threshold for "white enough" to be considered background during flood-fill
const BG_THRESHOLD: u8 = 245;

/// Remove white background via flood-fill from corners + alpha matting for smooth edges.
/// Returns a transparent PNG.
pub fn remove_background(png_bytes: &[u8]) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(png_bytes)
        .map_err(|e| format!("Failed to decode image: {}", e))?
        .to_rgba8();

    let (w, h) = img.dimensions();
    let mut result = img.clone();

    // Step 1: Flood-fill from corners to find connected background
    let mut is_bg = vec![false; (w * h) as usize];
    let mut queue = VecDeque::new();

    // Seed from all 4 corners
    for &(sx, sy) in &[(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)] {
        let idx = (sy * w + sx) as usize;
        if !is_bg[idx] && is_white(&img, sx, sy) {
            is_bg[idx] = true;
            queue.push_back((sx, sy));
        }
    }

    // BFS flood-fill
    while let Some((x, y)) = queue.pop_front() {
        for (nx, ny) in neighbors(x, y, w, h) {
            let idx = (ny * w + nx) as usize;
            if !is_bg[idx] && is_white(&img, nx, ny) {
                is_bg[idx] = true;
                queue.push_back((nx, ny));
            }
        }
    }

    // Step 2: Find edge pixels (foreground pixels adjacent to background)
    let mut is_edge = vec![false; (w * h) as usize];
    for y in 0..h {
        for x in 0..w {
            let idx = (y * w + x) as usize;
            if !is_bg[idx] {
                // Check if any neighbor is background
                for (nx, ny) in neighbors(x, y, w, h) {
                    if is_bg[(ny * w + nx) as usize] {
                        is_edge[idx] = true;
                        break;
                    }
                }
            }
        }
    }

    // Dilate edge zone by 1 more pixel for smoother transition
    let edge_copy = is_edge.clone();
    for y in 0..h {
        for x in 0..w {
            let idx = (y * w + x) as usize;
            if !is_bg[idx] && !edge_copy[idx] {
                for (nx, ny) in neighbors(x, y, w, h) {
                    if edge_copy[(ny * w + nx) as usize] {
                        is_edge[idx] = true;
                        break;
                    }
                }
            }
        }
    }

    // Step 3: Set alpha values
    for y in 0..h {
        for x in 0..w {
            let idx = (y * w + x) as usize;
            let pixel = img.get_pixel(x, y);

            if is_bg[idx] {
                // Background: fully transparent
                result.put_pixel(x, y, Rgba([pixel[0], pixel[1], pixel[2], 0]));
            } else if is_edge[idx] {
                // Edge: alpha matting based on luminance
                let luminance = (0.299 * pixel[0] as f32
                    + 0.587 * pixel[1] as f32
                    + 0.114 * pixel[2] as f32) as u8;
                // Brighter (closer to white) → more transparent
                let alpha = 255u8.saturating_sub(luminance.saturating_sub(128).saturating_mul(2));
                result.put_pixel(x, y, Rgba([pixel[0], pixel[1], pixel[2], alpha]));
            }
            // Foreground: keep original (alpha = 255)
        }
    }

    encode_png(&result)
}

/// Generate a shadow silhouette from a transparent PNG.
/// All non-transparent pixels become black, alpha is preserved.
pub fn make_shadow(transparent_png: &[u8]) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(transparent_png)
        .map_err(|e| format!("Failed to decode image: {}", e))?
        .to_rgba8();

    let (w, h) = img.dimensions();
    let mut shadow = RgbaImage::new(w, h);

    for y in 0..h {
        for x in 0..w {
            let alpha = img.get_pixel(x, y)[3];
            if alpha > 0 {
                shadow.put_pixel(x, y, Rgba([0, 0, 0, alpha]));
            }
        }
    }

    encode_png(&shadow)
}

fn is_white(img: &RgbaImage, x: u32, y: u32) -> bool {
    let p = img.get_pixel(x, y);
    p[0] >= BG_THRESHOLD && p[1] >= BG_THRESHOLD && p[2] >= BG_THRESHOLD && p[3] > 200
}

fn neighbors(x: u32, y: u32, w: u32, h: u32) -> impl Iterator<Item = (u32, u32)> {
    let mut result = Vec::with_capacity(4);
    if x > 0 { result.push((x - 1, y)); }
    if x + 1 < w { result.push((x + 1, y)); }
    if y > 0 { result.push((x, y - 1)); }
    if y + 1 < h { result.push((x, y + 1)); }
    result.into_iter()
}

fn encode_png(img: &RgbaImage) -> Result<Vec<u8>, String> {
    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageFormat::Png)
        .map_err(|e| format!("PNG encode failed: {}", e))?;
    Ok(buf.into_inner())
}
