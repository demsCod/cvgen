import type { RenderResumeProps } from "./RenderResume";
import { Github, Home, Mail, Phone, Linkedin } from "lucide-react";

const DEFAULT_COLOR_PALETTE = [
  "#1F2937", // primary text
  "#4B5563", // secondary text
  "#6B7280", // muted
  "#E5E7EB", // divider
  "#F9FAFB", // background section
  "#3B82F6", // accent blue
  "#10B981", // accent green
  "#F59E0B", // accent yellow
];

const TemplateTwo = ({
  templateId,
  resumeData,
  colorPalette = DEFAULT_COLOR_PALETTE,
  fontFamily = "Inter",
}: RenderResumeProps) => {
  if (!resumeData) return null;

  const [textPrimary, textSecondary, textMuted, borderColor, sectionBg, accent] =
    colorPalette;

  return (
    <div
      className="relative mx-auto p-[20mm] bg-white shadow-sm leading-relaxed"
      style={{
        fontFamily,
        width: "210mm",
        minHeight: "297mm",
        color: textPrimary,
      }}
    >
      {/* === HEADER === */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-2 tracking-tight">
              {resumeData.fullName}
            </h1>
            {resumeData.title && (
              <h2 
                className="text-xl font-medium mb-4" 
                style={{ color: accent }}
              >
                {resumeData.title}
              </h2>
            )}
          </div>
        </div>

        {/* Contact Info Grid */}
        <div 
          className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pt-5 border-t-2"
          style={{ borderColor: accent }}
        >
          {resumeData.email && (
            <a
              href={`mailto:${resumeData.email}`}
              className="flex items-center gap-2 hover:opacity-70 transition"
              style={{ color: textSecondary }}
            >
              <Mail size={16} style={{ color: accent }} /> 
              <span>{resumeData.email}</span>
            </a>
          )}
          {resumeData.phone && (
            <span className="flex items-center gap-2" style={{ color: textSecondary }}>
              <Phone size={16} style={{ color: accent }} /> 
              <span>{resumeData.phone}</span>
            </span>
          )}
          {resumeData.location && (
            <span className="flex items-center gap-2" style={{ color: textSecondary }}>
              <Home size={16} style={{ color: accent }} /> 
              <span>{resumeData.location}</span>
            </span>
          )}
          {resumeData.linkedin && (
            <a
              href={resumeData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-70 transition"
              style={{ color: textSecondary }}
            >
              <Linkedin size={16} style={{ color: accent }} /> 
              <span>LinkedIn</span>
            </a>
          )}
          {resumeData.github && (
            <a
              href={resumeData.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-70 transition col-span-2"
              style={{ color: textSecondary }}
            >
              <Github size={16} style={{ color: accent }} /> 
              <span>{resumeData.github}</span>
            </a>
          )}
        </div>
      </header>

      {/* === BODY === */}
      <main className="grid grid-cols-3 gap-8">
        {/* === LEFT COLUMN === */}
        <div className="col-span-2 space-y-8">
          {/* Profile Summary */}
          {resumeData.summary && (
            <section>
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                À propos
              </h3>
              <p className="text-base leading-relaxed" style={{ color: textSecondary }}>
                {resumeData.summary}
              </p>
            </section>
          )}

          {/* Experiences */}
          {resumeData.experiences && resumeData.experiences.length > 0 && (
            <section>
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                Expériences professionnelles
              </h3>
              <div className="space-y-6">
                {resumeData.experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-bold text-lg" style={{ color: textPrimary }}>
                        {exp.position}
                      </h4>
                      <span 
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: accent }}
                      >
                        {exp.startDate} – {exp.endDate || "Présent"}
                      </span>
                    </div>
                    <div 
                      className="text-base font-medium mb-2"
                      style={{ color: accent }}
                    >
                      {exp.company}
                    </div>
                    {exp.description && (
                      <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <section>
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                Formation
              </h3>
              <div className="space-y-5">
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h4 className="font-bold text-base" style={{ color: textPrimary }}>
                        {edu.degree}
                      </h4>
                      <span 
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: accent }}
                      >
                        {edu.startDate} – {edu.endDate || "Présent"}
                      </span>
                    </div>
                    <div className="text-sm mb-2" style={{ color: textSecondary }}>
                      {edu.institution}
                    </div>
                    {edu.description && (
                      <p className="text-sm" style={{ color: textSecondary }}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <section>
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                Projets
              </h3>
              <div className="space-y-5">
                {resumeData.projects.map((project) => (
                  <div key={project.id}>
                    <h4 className="font-bold text-base mb-1" style={{ color: textPrimary }}>
                      {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-sm mb-2" style={{ color: textSecondary }}>
                        {project.description}
                      </p>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline"
                        style={{ color: accent }}
                      >
                        Voir le projet →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* === RIGHT COLUMN === */}
        <aside className="space-y-8">
          {/* Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                Compétences
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 text-sm rounded-lg font-medium"
                    style={{
                      backgroundColor: `${accent}10`,
                      color: accent,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="ml-1.5 opacity-70 text-xs">
                        • {skill.level}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-4 pb-2 border-b-2" 
                style={{ color: textPrimary, borderColor: borderColor }}
              >
                Langues
              </h3>
              <ul className="space-y-3">
                {resumeData.languages.map((lang) => (
                  <li key={lang.id} className="flex justify-between items-center">
                    <span className="font-semibold text-sm" style={{ color: textPrimary }}>
                      {lang.name}
                    </span>
                    {lang.proficiency && (
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: sectionBg,
                          color: textSecondary 
                        }}
                      >
                        {lang.proficiency}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
};

export default TemplateTwo;