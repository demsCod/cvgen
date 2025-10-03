#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ai_engine;
mod exporter;
mod file_import;
mod models;
mod python_bridge;
mod state;

use std::fs;

use ai_engine::{adapt_documents, analyze_offer};
use exporter::export_documents;
use file_import::{import_cv, register_offer};
use parking_lot::Mutex;
use state::{AppMemory, PersistedData, SharedState};
use tauri::{AppHandle, Manager, RunEvent};

fn main() {
    let app = tauri::Builder::default()
        .manage(SharedState(Mutex::new(AppMemory::default())))
        .setup(|app| {
            if let Err(error) = load_state(&app.handle()) {
                eprintln!("Impossible de charger l'état: {error:?}");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            import_cv,
            register_offer,
            analyze_offer,
            adapt_documents,
            export_documents
        ])
        .build(tauri::generate_context!())
        .expect("Échec de l'initialisation Tauri");

    app.run(|app_handle, event| {
        if matches!(event, RunEvent::ExitRequested { .. } | RunEvent::Exit) {
            if let Err(error) = save_state(app_handle) {
                eprintln!("Impossible de sauvegarder l'état: {error:?}");
            }
        }
    });
}

fn load_state(app_handle: &AppHandle) -> anyhow::Result<()> {
    let storage_path = storage_file_path(app_handle)?;
    if !storage_path.exists() {
        return Ok(());
    }

    let content = fs::read_to_string(storage_path)?;
    let data: PersistedData = serde_json::from_str(&content)?;
    let state = app_handle.state::<SharedState>();
    let mut guard = state.0.lock();
    *guard = data.into();
    Ok(())
}

fn save_state(app_handle: &tauri::AppHandle) -> anyhow::Result<()> {
    let storage_path = storage_file_path(app_handle)?;
    if let Some(parent) = storage_path.parent() {
        fs::create_dir_all(parent)?;
    }

    let state = app_handle.state::<SharedState>();
    let snapshot = state.0.lock().clone();
    let data: PersistedData = snapshot.into();
    fs::write(storage_path, serde_json::to_string_pretty(&data)?)?;
    Ok(())
}

fn storage_file_path(app_handle: &tauri::AppHandle) -> anyhow::Result<std::path::PathBuf> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or_else(|| anyhow::anyhow!("Impossible de déterminer le répertoire des données"))?;
    Ok(app_dir.join("storage.json"))
}
