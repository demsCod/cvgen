use serde_json::json;
use tauri::{command, AppHandle, State};

use crate::{
    models::{AdaptationResult, CandidateProfile, ExportPayload},
    python_bridge::call_python,
    state::{get_adaptation, try_get_profile, SharedState},
};

#[command]
pub async fn export_documents(
    profile_id: String,
    format: String,
    state: State<'_, SharedState>,
    app: AppHandle,
) -> Result<ExportPayload, String> {
    let profile: CandidateProfile = try_get_profile(&state, &profile_id)
        .ok_or_else(|| "Profil introuvable".to_string())?;
    let adaptation: AdaptationResult = get_adaptation(&state, &profile_id)
        .ok_or_else(|| "Aucune adaptation disponible pour export".to_string())?;

    let payload = json!({
        "profile": profile,
        "adaptation": adaptation,
        "format": format
    });
    let result: ExportPayload = call_python(&app, "export_documents", payload)
        .await
        .map_err(|error| error.to_string())?;

    Ok(result)
}
