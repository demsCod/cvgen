use std::{collections::HashMap, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle};
use tokio::fs;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemplateSectionConstraint {
    pub required: Option<Vec<String>>,
    pub optional: Option<Vec<String>>,
    pub max_items: Option<u32>,
    pub layout: Option<String>,
    pub grouping: Option<String>,
    pub display: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemplateStyleTokens {
    pub primary_color: String,
    pub accent_color: String,
    pub font_family: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemplateDefinition {
    pub id: String,
    pub name: String,
    pub description: String,
    pub preview_image: String,
    pub style_tokens: TemplateStyleTokens,
    pub sections: HashMap<String, TemplateSectionConstraint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TemplateManifest {
    pub schema_version: u32,
    pub templates: Vec<TemplateDefinition>,
}

#[command]
pub async fn list_templates(app: AppHandle) -> Result<TemplateManifest, String> {
    let manifest_path = locate_manifest(&app)?;

    let data = fs::read_to_string(&manifest_path)
        .await
        .map_err(|error| format!("Erreur lecture manifest: {error}"))?;

    let mut manifest: TemplateManifest =
        serde_json::from_str(&data).map_err(|error| format!("Manifest JSON invalide: {error}"))?;

    if let Some(base_dir) = manifest_path.parent() {
        for template in &mut manifest.templates {
            let preview_path = base_dir.join(&template.preview_image);
            if preview_path.exists() {
                if let Some(value) = preview_path.to_str() {
                    template.preview_image = value.to_string();
                }
            }
        }
    }

    Ok(manifest)
}

fn locate_manifest(app: &AppHandle) -> Result<PathBuf, String> {
    if let Some(resource) = app
        .path_resolver()
        .resolve_resource("templates/manifest.json")
    {
        if resource.exists() {
            return Ok(resource);
        }
    }

    let candidates = [
        PathBuf::from("templates/manifest.json"),
        PathBuf::from("../templates/manifest.json"),
        PathBuf::from("../../templates/manifest.json"),
    ];

    for candidate in candidates {
        if candidate.exists() {
            return Ok(candidate);
        }
    }

    Err("Impossible de trouver templates/manifest.json".to_string())
}
