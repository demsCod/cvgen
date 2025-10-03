use std::{
    env,
    path::{Path, PathBuf},
};

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
    let script_path = resolve_script(app)?;
    let python_cmd = resolve_python_cmd(&script_path);
    let input_path = write_payload(&payload).await?;

    println!(
        "[python_bridge] invoking {:?} {:?} --input {:?}",
        python_cmd, script_path, input_path
    );
    println!(
        "[python_bridge] payload fragment: {}",
        truncate_payload(&payload)
    );

    let output = Command::new(&python_cmd)
        .arg(&script_path)
        .arg(verb)
        .arg(&input_path)
        .output()
        .await
        .with_context(|| format!("Échec d'exécution de {:?}", python_cmd))?;

    fs::remove_file(&input_path).await.ok();

    println!(
        "[python_bridge] status: {}",
        output
            .status
            .code()
            .map_or_else(|| "signal".to_string(), |c| c.to_string())
    );
    if !output.stdout.is_empty() {
        println!("[python_bridge] stdout: {}", truncate_bytes(&output.stdout));
    }
    if !output.stderr.is_empty() {
        println!("[python_bridge] stderr: {}", truncate_bytes(&output.stderr));
    }

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!("Python a échoué: {stderr}"));
    }

    let stdout = String::from_utf8(output.stdout)?;
    let result: T = serde_json::from_str(&stdout)
        .with_context(|| format!("Réponse Python invalide : {stdout}"))?;

    Ok(result)
}

fn resolve_python_cmd(script_path: &Path) -> PathBuf {
    if let Ok(cmd) = env::var("PYTHON_CMD") {
        if !cmd.is_empty() {
            if let Some(path) = resolve_env_python_cmd(&cmd, script_path) {
                return path;
            } else {
                println!(
                    "[python_bridge] PYTHON_CMD {:?} introuvable, tentative de détection automatique",
                    cmd
                );
            }
        }
    }

    if let Some(found) = find_python_near(script_path) {
        return found;
    }

    if let Ok(cwd) = env::current_dir() {
        if let Some(found) = find_python_near(&cwd) {
            return found;
        }
    }

    if cfg!(windows) {
        PathBuf::from("python.exe")
    } else {
        PathBuf::from("python3")
    }
}

fn find_python_near(root: &Path) -> Option<PathBuf> {
    let mut current = if root.is_dir() {
        Some(to_absolute(root))
    } else {
        root.parent().map(to_absolute)
    };

    while let Some(dir) = current.clone() {
        let unix_path = dir.join(".venv/bin/python");
        if unix_path.exists() {
            return Some(normalize_python_path(unix_path));
        }

        let windows_path = dir.join(".venv").join("Scripts/python.exe");
        if windows_path.exists() {
            return Some(normalize_python_path(windows_path));
        }

        current = dir.parent().map(|p| p.to_path_buf());
    }

    None
}

fn to_absolute(path: &Path) -> PathBuf {
    if path.is_absolute() {
        return path.to_path_buf();
    }

    env::current_dir()
        .map(|cwd| cwd.join(path))
        .unwrap_or_else(|_| path.to_path_buf())
}

fn normalize_python_path(path: PathBuf) -> PathBuf {
    if path.is_absolute() {
        path
    } else {
        to_absolute(&path)
    }
}

fn resolve_env_python_cmd(cmd: &str, script_path: &Path) -> Option<PathBuf> {
    let candidate = Path::new(cmd);
    if candidate.is_absolute() && candidate.exists() {
        return Some(normalize_python_path(candidate.to_path_buf()));
    }

    let mut attempts = Vec::new();

    if let Ok(cwd) = env::current_dir() {
        attempts.push(cwd.join(candidate));
    }

    if let Some(script_dir) = script_path.parent() {
        let mut current = Some(script_dir.to_path_buf());
        while let Some(dir) = current {
            attempts.push(dir.join(candidate));
            current = dir.parent().map(|p| p.to_path_buf());
        }
    }

    for path in attempts {
        if path.exists() {
            return Some(normalize_python_path(path));
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::resolve_python_cmd;
    use std::path::{Path, PathBuf};

    fn project_venv_python() -> Option<PathBuf> {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        if let Some(root) = manifest_dir.parent() {
            let candidate = root.join(".venv/bin/python");
            if candidate.exists() {
                return Some(candidate);
            }
        }
        None
    }

    #[test]
    fn resolve_python_cmd_prefers_existing_interpreter() {
        let expected = match project_venv_python() {
            Some(path) => path,
            None => return,
        };

        // Fallback detection without PYTHON_CMD.
        std::env::remove_var("PYTHON_CMD");
        let detected = resolve_python_cmd(Path::new("python/main.py"));
        assert!(detected.is_absolute());
        assert_eq!(detected, expected);

        // Relative PYTHON_CMD should resolve to the same interpreter.
        std::env::set_var("PYTHON_CMD", ".venv/bin/python");
        let env_resolved = resolve_python_cmd(Path::new("python/main.py"));
        std::env::remove_var("PYTHON_CMD");
        assert!(env_resolved.is_absolute());
        assert_eq!(env_resolved, expected);
    }
}

fn truncate_bytes(bytes: &[u8]) -> String {
    let text = String::from_utf8_lossy(bytes);
    truncate_str(&text)
}

fn truncate_payload(payload: &Value) -> String {
    truncate_str(&payload.to_string())
}

fn truncate_str(text: &str) -> String {
    const LIMIT: usize = 400;
    if text.len() <= LIMIT {
        return text.to_string();
    }

    let mut end = LIMIT;
    while !text.is_char_boundary(end) {
        end -= 1;
    }

    format!("{}…", &text[..end])
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
