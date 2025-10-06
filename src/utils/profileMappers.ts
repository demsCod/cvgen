import type { CandidateProfile } from '@/types';
import type { ResumeData } from '@/components/ResumeTemplates/RenderResume';

const mockData = {
  fullName: 'Jean Dupont',
  title: 'Développeur Full Stack Senior',
  email: 'jean.dupont@example.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  github: 'jeandupont',
  linkedin: 'https://linkedin.com/in/jeandupont',
  summary: 'Développeur passionné avec plus de 8 ans d\'expérience dans le développement web et mobile. Spécialisé dans les technologies JavaScript modernes et l\'architecture cloud.',
  experiences: [
    {
      id: '1',
      position: 'Lead Développeur Full Stack',
      company: 'TechCorp',
      startDate: 'Jan 2020',
      endDate: 'Présent',
      description: 'Direction technique d\'une équipe de 6 développeurs. Mise en place d\'une architecture microservices avec Node.js et React. Amélioration des performances de 40%.'
    },
    {
      id: '2',
      position: 'Développeur Full Stack',
      company: 'StartupInc',
      startDate: 'Mar 2018',
      endDate: 'Dec 2019',
      description: 'Développement full stack d\'une application SaaS avec React, Node.js et PostgreSQL. Mise en place de l\'intégration continue.'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'École Supérieure d\'Informatique',
      degree: 'Master en Génie Logiciel',
      startDate: '2015',
      endDate: '2017'
    },
    {
      id: '2',
      institution: 'Université de Paris',
      degree: 'Licence en Informatique',
      startDate: '2012',
      endDate: '2015'
    }
  ],
  skills: [
    { id: '1', name: 'React.js', level: 'Expert' },
    { id: '2', name: 'Node.js', level: 'Expert' },
    { id: '3', name: 'TypeScript', level: 'Avancé' },
    { id: '4', name: 'AWS', level: 'Intermédiaire' },
    { id: '5', name: 'Docker', level: 'Avancé' }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Plateforme e-commerce complète avec panier, paiement et gestion des commandes. Stack: Next.js, Stripe, MongoDB.',
      link: 'https://github.com/jeandupont/ecommerce'
    },
    {
      id: '2',
      name: 'Task Manager',
      description: 'Application de gestion de tâches collaborative avec temps réel. Stack: React, Socket.io, Express.',
      link: 'https://github.com/jeandupont/taskmanager'
    }
  ],
  languages: [
    { id: '1', name: 'Français', proficiency: 'Natif' },
    { id: '2', name: 'Anglais', proficiency: 'Professionnel' },
    { id: '3', name: 'Espagnol', proficiency: 'Intermédiaire' }
  ]
};

export function mapProfileToResumeData(profile: CandidateProfile): ResumeData {
  if (!profile) return mockData;
  
  const socials = profile.socials || {};
  const address = profile.address || {};
  
  return {
    fullName: profile.fullName || mockData.fullName,
    title: profile.title || mockData.title,
    email: profile.email || mockData.email,
    phone: profile.phone || mockData.phone,
    location: address.city ? `${address.city}${address.country ? `, ${address.country}` : ''}` : address.country || mockData.location,
    github: socials.github || mockData.github,
    linkedin: socials.linkedin || mockData.linkedin,
    summary: profile.summary || mockData.summary,
    experiences: profile.experiences?.length > 0 
      ? profile.experiences.map(exp => ({
          id: exp.id || crypto.randomUUID(),
          position: exp.role || '',
          company: exp.company || '',
          startDate: exp.start || '',
          endDate: exp.end,
          description: exp.description
        }))
      : mockData.experiences,
    education: profile.education?.length > 0
      ? profile.education.map(edu => ({
          id: crypto.randomUUID(),
          institution: edu.school || '',
          degree: edu.degree || '',
          startDate: edu.start || '',
          endDate: edu.end
        }))
      : mockData.education,
    skills: profile.skills?.length > 0
      ? profile.skills.map(skill => ({
          id: skill.id || crypto.randomUUID(),
          name: skill.name,
          level: skill.level
        }))
      : mockData.skills,
    projects: profile.projects?.length > 0
      ? profile.projects.map(project => ({
          id: project.id || crypto.randomUUID(),
          name: project.name || '',
          description: project.description,
          link: project.links?.website
        }))
      : mockData.projects,
    languages: profile.languages?.length > 0
      ? profile.languages.map(lang => ({
          id: lang.id || crypto.randomUUID(),
          name: lang.name,
          proficiency: lang.level
        }))
      : mockData.languages
  };
}