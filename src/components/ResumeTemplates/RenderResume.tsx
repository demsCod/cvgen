import { int } from "zod";
import TemplateOne from "./TemplateOne";

export interface ResumeData {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  summary?: string;
  experiences?: { id: string; position: string; company: string; startDate: string; endDate?: string; description?: string }[];
  education?: { id: string; institution: string; degree: string; startDate: string; endDate?: string; description?: string }[];
  skills?: { id: string; name: string; level?: string }[];
  projects?: { id: string; name: string; description?: string; link?: string }[];
  languages?: { id: string; name: string; proficiency?: string }[];
}

export interface RenderResumeProps { templateId: string; resumeData: ResumeData; colorPalette?: string[]; fontFamily?: string; template: string; }

const RenderResume = ({ templateId, resumeData, colorPalette, fontFamily, template }: RenderResumeProps) => {
  switch (templateId) {
    case 'template1':
      return <TemplateOne templateId={templateId} resumeData={resumeData} colorPalette={colorPalette} fontFamily={fontFamily} template={template} />;
    // case 'template2':
    //   return <TemplateTwo resumeData={resumeData} colorPalette={colorPalette} fontFamily={fontFamily} />;
    // case 'template3':
    //   return <TemplateThree resumeData={resumeData} colorPalette={colorPalette} fontFamily={fontFamily} />;
    default:
      return null;
  }
}
  
  export default RenderResume;