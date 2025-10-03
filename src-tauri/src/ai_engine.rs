use serde_json::json;
use tauri::{command, AppHandle, State};

use crate::{
    models::{AdaptationResult, JobOffer},
    python_bridge::call_python,
    state::{
        get_adaptation, store_adaptation, store_offer, try_get_offer, try_get_profile, SharedState,
    },
};

#[command]
pub async fn analyze_offer(
    offer: JobOffer,
    state: State<'_, SharedState>,
    app: AppHandle,
) -> Result<JobOffer, String> {
    let payload = json!({ "offer": offer });
    let enriched: JobOffer = call_python(&app, "analyze_offer", payload)
        .await
        .map_err(|error| error.to_string())?;

    store_offer(&state, enriched.clone());
    Ok(enriched)
}

#[command]
pub async fn adapt_documents(
    profile_id: String,
    offer_id: String,
    state: State<'_, SharedState>,
    app: AppHandle,
) -> Result<AdaptationResult, String> {
    if let Some(existing) = get_adaptation(&state, &profile_id) {
        return Ok(existing);
    }

    let profile = try_get_profile(&state, &profile_id)
        .ok_or_else(|| format!("Profil {profile_id} introuvable"))?;
    let offer =
        try_get_offer(&state, &offer_id).ok_or_else(|| format!("Offre {offer_id} introuvable"))?;

    let payload = json!({ "profile": profile, "offer": offer });
    let result: AdaptationResult = call_python(&app, "adapt_documents", payload)
        .await
        .map_err(|error| error.to_string())?;

    store_adaptation(&state, &profile_id, result.clone());
    Ok(result)
}
