#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ai_engine;
mod exporter;
mod file_import;
mod models;
mod python_bridge;
mod state;
mod commands { pub mod fs; }

use std::fs;

use ai_engine::{adapt_documents, analyze_offer};
use exporter::export_documents;
use file_import::{import_cv, register_offer};
use parking_lot::Mutex;
use state::{AppMemory, PersistedData, SharedState};
use tauri::{App, AppHandle, Manager, RunEvent};

fn main() {
    let app = tauri::Builder::default()
        .manage(SharedState(Mutex::new(AppMemory::default())))
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                if let Err(error) = init_dev_autoreload(app) {
                    eprintln!("Impossible d'initialiser l'autoreload: {error:?}");
                }
            }
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
            export_documents,
            commands::fs::save_cv,
            commands::fs::load_cv,
            commands::fs::list_cvs,
            commands::fs::list_cvs_meta,
            commands::fs::delete_cv
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

#[cfg(debug_assertions)]
fn init_dev_autoreload(app: &App) -> anyhow::Result<()> {
    use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
    use std::path::PathBuf;
    use std::sync::mpsc::channel;
    use std::time::{Duration, Instant};

    let app_handle = app.handle();
    let workspace_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .map(|path| path.to_path_buf())
        .unwrap_or_else(|| PathBuf::from(".."));

    let watch_paths: Vec<PathBuf> = [
    workspace_dir.join("src"),
    workspace_dir.join("src-tauri").join("src"),
    workspace_dir.join("python"),
    ]
    .into_iter()
    .collect();

    let (startup_tx, startup_rx) = std::sync::mpsc::channel::<anyhow::Result<()>>();

    std::thread::spawn(move || {
        let (event_tx, event_rx) = channel();

        let mut watcher = match RecommendedWatcher::new(
            event_tx,
            Config::default().with_poll_interval(Duration::from_millis(300)),
        ) {
            Ok(watcher) => watcher,
            Err(error) => {
                let _ = startup_tx.send(Err(anyhow::Error::new(error)));
                return;
            }
        };

        for path in watch_paths {
            if path.exists() {
                if let Err(error) = watcher.watch(&path, RecursiveMode::Recursive) {
                    eprintln!(
                        "Watcher: impossible de suivre {}: {error:?}",
                        path.display()
                    );
                }
            }
        }

        let _ = startup_tx.send(Ok(()));

        let mut last_reload = Instant::now();

        loop {
            match event_rx.recv() {
                Ok(Ok(event)) => {
                    if matches!(
                        event.kind,
                        EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_)
                    ) {
                        if last_reload.elapsed() < Duration::from_millis(250) {
                            continue;
                        }
                        last_reload = Instant::now();
                        if let Some(window) = app_handle.get_window("main") {
                            if let Err(error) = window.eval("window.location.reload()") {
                                eprintln!("Watcher: rechargement échoué: {error:?}");
                            }
                        }
                    }
                }
                Ok(Err(error)) => {
                    eprintln!("Watcher: événement invalide: {error:?}");
                }
                Err(_) => break,
            }
        }
    });

    startup_rx
        .recv()
        .unwrap_or_else(|_| Err(anyhow::anyhow!("Watcher thread non démarré")))
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
