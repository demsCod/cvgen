use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Experience {
    pub id: String,
    pub company: String,
    pub role: String,
    pub start_date: String,
    pub end_date: Option<String>,
    pub achievements: Vec<String>,
    pub technologies: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Education {
    pub id: String,
    pub school: String,
    pub degree: String,
    pub start_date: String,
    pub end_date: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    pub url: Option<String>,
    pub impact: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CandidateProfile {
    pub id: String,
    pub full_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub summary: Option<String>,
    pub experiences: Vec<Experience>,
    pub skills: Vec<String>,
    pub education: Vec<Education>,
    pub projects: Vec<Project>,
    pub languages: Vec<LanguageLevel>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguageLevel {
    pub label: String,
    pub level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JobOffer {
    pub id: String,
    pub title: String,
    pub company: Option<String>,
    pub description: String,
    pub location: Option<String>,
    pub keywords: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighlightSpan {
    pub id: String,
    #[serde(rename = "type")]
    pub highlight_type: HighlightType,
    pub start: usize,
    pub end: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum HighlightType {
    Addition,
    Removal,
    Emphasis,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdaptationResult {
    pub adapted_resume: String,
    pub adapted_cover_letter: String,
    pub highlights: Vec<HighlightSpan>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtractionPayload {
    pub profile: CandidateProfile,
    pub raw_text: String,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportPayload {
    pub resume_path: String,
    pub cover_letter_path: String,
}
