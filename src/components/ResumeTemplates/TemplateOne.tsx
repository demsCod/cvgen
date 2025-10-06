import type { RenderResumeProps } from "./RenderResume";
import { Github, Home, Mail, Phone, Linkedin, ExternalLink } from "lucide-react";

const DEFAULT_COLOR_PALETTE = [
  "#000000", // primary text (noir pur)
  "#333333", // secondary text
  "#666666", // muted
  "#000000", // divider (noir)
  "#F9FAFB", // background section
  "#000000", // accent (noir pour le style minimaliste)
  "#10B981", // accent green
  "#F59E0B", // accent yellow
];

const TemplateOne = ({
  templateId,
  resumeData,
  colorPalette = DEFAULT_COLOR_PALETTE,
  fontFamily = "Arial, sans-serif",
}: RenderResumeProps) => {
  if (!resumeData) return null;

  const [textPrimary, textSecondary, textMuted, borderColor, sectionBg, accent] =
    colorPalette;

  return (
    <div
      className="relative mx-auto p-[15mm] bg-white leading-normal"
      style={{
        fontFamily,
        width: "210mm",
        minHeight: "297mm",
        color: textPrimary,
        fontSize: "10pt",
      }}
    >
      {/* === HEADER === */}
      <header className="mb-6">
        {/* Nom en majuscules */}
        <h1 
          className="text-3xl font-bold tracking-wide mb-1"
          style={{ 
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: textPrimary 
          }}
        >
          {resumeData.fullName}
        </h1>
        
        {/* Titre du poste en minuscule */}
        {resumeData.title && (
          <h2 className="text-sm mb-3" style={{ color: textSecondary }}>
            {resumeData.title.toLowerCase()}
          </h2>
        )}

        {/* Contact Info - Style compact horizontal */}
        <div className="flex flex-wrap items-center text-xs gap-x-4 gap-y-1" style={{ color: textSecondary }}>
          {resumeData.phone && (
            <span>{resumeData.phone}</span>
          )}
          {resumeData.email && (
            <a
              href={`mailto:${resumeData.email}`}
              className="hover:underline"
            >
              {resumeData.email}
            </a>
          )}
          {resumeData.location && (
            <span>{resumeData.location}</span>
          )}
          {resumeData.linkedin && (
            <a
              href={resumeData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}
          {resumeData.github && (
            <a
              href={resumeData.github}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* === BODY === */}
      <main className="space-y-5">
        {/* Profile Summary */}
        {resumeData.summary && (
          <section>
            <h3 
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Professional Summary
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
              {resumeData.summary}
            </p>
          </section>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <section>
            <h3 
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Education
            </h3>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold" style={{ color: textPrimary }}>
                      {edu.institution}
                    </h4>
                    <span className="text-xs italic" style={{ color: textSecondary }}>
                      {edu.startDate} {edu.endDate && `- ${edu.endDate}`}
                    </span>
                  </div>
                  <div className="text-xs mb-1" style={{ color: textSecondary }}>
                    {edu.degree}
                  </div>
                  {edu.description && (
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section>
            <h3 
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Skills
            </h3>
            <div className="text-xs leading-relaxed" style={{ color: textSecondary }}>
              <span className="font-bold" style={{ color: textPrimary }}>
                General Skills:{" "}
              </span>
              {resumeData.skills.map((skill, index) => (
                <span key={skill.id}>
                  {skill.name}
                  {skill.level && ` (${skill.level})`}
                  {index < resumeData.skills.length - 1 && ", "}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <section>
            <h3 
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Languages
            </h3>
            <div className="text-xs" style={{ color: textSecondary }}>
              <span className="font-bold" style={{ color: textPrimary }}>
                LANGUAGES:{" "}
              </span>
              {resumeData.languages.map((lang, index) => (
                <span key={lang.id}>
                  {lang.name}
                  {lang.proficiency && ` (${lang.proficiency})`}
                  {index < resumeData.languages.length - 1 && ", "}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experiences */}
        {resumeData.experiences && resumeData.experiences.length > 0 && (
          <section>
            <h3 
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Professional Experience
            </h3>
            <div className="space-y-3">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold" style={{ color: textPrimary }}>
                      {exp.position}
                    </h4>
                    <span className="text-xs italic" style={{ color: textSecondary }}>
                      {exp.startDate} – {exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="text-xs mb-1" style={{ color: textSecondary }}>
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                      {exp.description}
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
              className="text-xs font-bold mb-2 tracking-widest border-b pb-1"
              style={{ 
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                borderColor: borderColor,
                color: textPrimary 
              }}
            >
              Projects
            </h3>
            <div className="space-y-3">
              {resumeData.projects.map((project) => (
                <div key={project.id}>
                  <h4 className="text-sm font-bold mb-1" style={{ color: textPrimary }}>
                    {project.name}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-xs hover:underline"
                        style={{ color: textSecondary }}
                      >
                        <ExternalLink size={10} className="inline" />
                      </a>
                    )}
                  </h4>
                  {project.description && (
                    <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TemplateOne;