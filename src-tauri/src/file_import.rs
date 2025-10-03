use serde_json::json;
use tauri::{command, AppHandle, State};

use crate::{
    models::{ExtractionPayload, JobOffer},
    python_bridge::call_python,
    state::{store_offer, store_profile, SharedState},
};

#[command]
pub async fn import_cv(
    file_path: String,
    state: State<'_, SharedState>,
    app: AppHandle,
) -> Result<ExtractionPayload, String> {
    println!("[file_import] import_cv called with {file_path}");
    let payload = json!({ "file_path": file_path });
    let result: ExtractionPayload = call_python(&app, "import_cv", payload)
        .await
        .map_err(|error| error.to_string())?;

    store_profile(&state, result.profile.clone());
    Ok(result)
}

#[command]
pub async fn register_offer(
    offer: JobOffer,
    state: State<'_, SharedState>,
) -> Result<JobOffer, String> {
    store_offer(&state, offer.clone());
    Ok(offer)
}
