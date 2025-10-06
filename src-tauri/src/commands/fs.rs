use serde_json::Value;
use std::{fs, path::{PathBuf}, io};
use chrono::Utc;

const APP_DIR_NAME: &str = "CVGen"; // Stored in ~/Documents/CVGen

fn documents_base_dir() -> Result<PathBuf, String> {
    let Some(home) = dirs::home_dir() else { return Err("Impossible de déterminer le répertoire home".into()); };
    let docs = home.join("Documents").join(APP_DIR_NAME);
    if !docs.exists() {
        fs::create_dir_all(&docs).map_err(|e| format!("Création dossier échouée: {e}"))?;
    }
    Ok(docs)
}

fn cv_file_path(id: &str) -> Result<PathBuf, String> {
    let base = documents_base_dir()?;
    // sanitize id (basic): keep alnum, dash, underscore
    let safe: String = id.chars().filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_').collect();
    if safe.is_empty() { return Err("ID CV invalide".into()); }
    Ok(base.join(format!("{safe}.json")))
}

fn manifest_path() -> Result<PathBuf, String> { Ok(documents_base_dir()?.join("manifest.json")) }

fn load_manifest() -> Result<Value, String> {
    let path = manifest_path()?;
    if !path.exists() { return Ok(Value::Object(serde_json::Map::new())); }
    let content = fs::read_to_string(path).map_err(|e| format!("Lecture manifest échouée: {e}"))?;
    serde_json::from_str(&content).map_err(|e| format!("Parse manifest échoué: {e}"))
}

fn save_manifest(manifest: &Value) -> Result<(), String> {
    let path = manifest_path()?;
    let pretty = serde_json::to_string_pretty(manifest).map_err(|e| format!("Sérialisation manifest échouée: {e}"))?;
    fs::write(path, pretty).map_err(|e| format!("Écriture manifest échouée: {e}"))
}

#[tauri::command]
pub fn save_cv(id: String, mut data: Value) -> Result<(), String> {
    let path = cv_file_path(&id)?;
    // inject / update updatedAt
    let now = Utc::now().to_rfc3339();
    if let Value::Object(map) = &mut data {
        map.insert("id".into(), Value::String(id.clone()));
        map.insert("updatedAt".into(), Value::String(now.clone()));
    }
    let pretty = serde_json::to_string_pretty(&data).map_err(|e| format!("Sérialisation JSON échouée: {e}"))?;
    fs::write(&path, pretty).map_err(|e| format!("Écriture fichier échouée: {e}"))?;

    // update manifest (structure: { "items": { id: { "updatedAt": ..., "title": ... }}})
    let mut manifest = load_manifest()?;
    let items = manifest.as_object_mut().unwrap();
    let entry = items.entry("items").or_insert_with(|| Value::Object(serde_json::Map::new()));
    if let Value::Object(obj) = entry {
        let mut meta = serde_json::Map::new();
        // title fallback
        let title = data.get("fullName").and_then(|v| v.as_str()).unwrap_or("CV");
        meta.insert("updatedAt".into(), Value::String(now));
        meta.insert("title".into(), Value::String(title.to_string()));
        obj.insert(id, Value::Object(meta));
    }
    save_manifest(&manifest)?;
    Ok(())
}

#[tauri::command]
pub fn load_cv(id: String) -> Result<Value, String> {
    let path = cv_file_path(&id)?;
    let content = fs::read_to_string(&path).map_err(|e| format!("Lecture fichier échouée: {e}"))?;
    let json: Value = serde_json::from_str(&content).map_err(|e| format!("Parse JSON échoué: {e}"))?;
    Ok(json)
}

#[tauri::command]
pub fn list_cvs() -> Result<Value, String> {
    let base = documents_base_dir()?;
    let mut ids = vec![];
    for entry in fs::read_dir(&base).map_err(|e| format!("Lecture répertoire échouée: {e}"))? {
        if let Ok(entry) = entry {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) == Some("json") {
                if let Some(stem) = path.file_stem().and_then(|s| s.to_str()) {
                    ids.push(stem.to_string());
                }
            }
        }
    }
    Ok(Value::Array(ids.into_iter().map(Value::String).collect()))
}

#[tauri::command]
pub fn list_cvs_meta() -> Result<Value, String> {
    let manifest = load_manifest()?;
    let mut list: Vec<(String, String, String)> = Vec::new(); // (id, updatedAt, title)
    if let Some(items) = manifest.get("items").and_then(|v| v.as_object()) {
        for (id, meta) in items.iter() {
            let updated = meta.get("updatedAt").and_then(|v| v.as_str()).unwrap_or("");
            let title = meta.get("title").and_then(|v| v.as_str()).unwrap_or("CV");
            list.push((id.clone(), updated.to_string(), title.to_string()));
        }
    }
    // sort by updated desc
    list.sort_by(|a,b| b.1.cmp(&a.1));
    let arr: Vec<Value> = list.into_iter().map(|(id, updatedAt, title)| {
        let mut m = serde_json::Map::new();
        m.insert("id".into(), Value::String(id));
        m.insert("updatedAt".into(), Value::String(updatedAt));
        m.insert("title".into(), Value::String(title));
        Value::Object(m)
    }).collect();
    Ok(Value::Array(arr))
}

#[tauri::command]
pub fn delete_cv(id: String) -> Result<(), String> {
    let path = cv_file_path(&id)?;
    match fs::remove_file(&path) {
        Ok(_) => Ok(()),
        Err(err) if err.kind() == io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(format!("Suppression échouée: {e}")),
    }
}
