use std::{env, path::PathBuf};

use anyhow::{anyhow, Context, Result};
use serde::de::DeserializeOwned;
use serde_json::Value;
use tauri::AppHandle;
use tokio::{fs, process::Command};
use uuid::Uuid;

pub async fn call_python<T>(app: &AppHandle, verb: &str, payload: Value) -> Result<T>
where
    T: DeserializeOwned,
{
    let python_cmd = env::var("PYTHON_CMD").unwrap_or_else(|_| "python3".to_string());
    let script_path = resolve_script(app)?;
    let input_path = write_payload(&payload).await?;

    let output = Command::new(python_cmd.clone())
        .arg(&script_path)
        .arg(verb)
        .arg("--input")
        .arg(&input_path)
        .output()
        .await
        .with_context(|| format!("Échec d'exécution de {python_cmd}"))?;

    fs::remove_file(&input_path).await.ok();

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!("Python a échoué: {stderr}"));
    }

    let stdout = String::from_utf8(output.stdout)?;
    let result: T = serde_json::from_str(&stdout)
        .with_context(|| format!("Réponse Python invalide : {stdout}"))?;

    Ok(result)
}

fn resolve_script(app: &AppHandle) -> Result<PathBuf> {
    app.path_resolver()
        .resolve_resource("python/main.py")
        .or_else(|| Some(PathBuf::from("python/main.py")))
        .context("Impossible de trouver le script python/main.py")
}

async fn write_payload(payload: &Value) -> Result<PathBuf> {
    let filename = format!("cvgen-{}.json", Uuid::new_v4());
    let path = std::env::temp_dir().join(filename);
    fs::write(&path, serde_json::to_vec(payload)?).await?;
    Ok(path)
}
