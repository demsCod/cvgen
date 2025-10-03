use std::collections::HashMap;

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::models::{AdaptationResult, CandidateProfile, JobOffer};

#[derive(Default, Clone)]
pub struct AppMemory {
    pub profiles: HashMap<String, CandidateProfile>,
    pub offers: HashMap<String, JobOffer>,
    pub adaptations: HashMap<String, AdaptationResult>,
}

pub struct SharedState(pub Mutex<AppMemory>);

#[derive(Debug, Serialize, Deserialize)]
pub struct PersistedData {
    pub profiles: HashMap<String, CandidateProfile>,
    pub offers: HashMap<String, JobOffer>,
    pub adaptations: HashMap<String, AdaptationResult>,
}

impl From<AppMemory> for PersistedData {
    fn from(value: AppMemory) -> Self {
        Self {
            profiles: value.profiles,
            offers: value.offers,
            adaptations: value.adaptations,
        }
    }
}

impl From<PersistedData> for AppMemory {
    fn from(value: PersistedData) -> Self {
        Self {
            profiles: value.profiles,
            offers: value.offers,
            adaptations: value.adaptations,
        }
    }
}

pub fn try_get_profile<'a>(state: &'a State<SharedState>, id: &str) -> Option<CandidateProfile> {
    let guard = state.0.lock();
    guard.profiles.get(id).cloned()
}

pub fn try_get_offer<'a>(state: &'a State<SharedState>, id: &str) -> Option<JobOffer> {
    let guard = state.0.lock();
    guard.offers.get(id).cloned()
}

pub fn store_profile(state: &State<SharedState>, profile: CandidateProfile) {
    let mut guard = state.0.lock();
    guard.profiles.insert(profile.id.clone(), profile);
}

pub fn store_offer(state: &State<SharedState>, offer: JobOffer) {
    let mut guard = state.0.lock();
    guard.offers.insert(offer.id.clone(), offer);
}

pub fn store_adaptation(state: &State<SharedState>, profile_id: &str, adaptation: AdaptationResult) {
    let mut guard = state.0.lock();
    guard.adaptations.insert(profile_id.to_string(), adaptation);
}

pub fn get_adaptation(state: &State<SharedState>, profile_id: &str) -> Option<AdaptationResult> {
    let guard = state.0.lock();
    guard.adaptations.get(profile_id).cloned()
}
