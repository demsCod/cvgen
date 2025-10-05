import moment from 'moment';

export interface ResumeSummary {
  id: string;
  title: string;
  updatedAt: string; // ISO string
  thumbnailLink?: string;
  role?: string;
  location?: string;
  tags?: string[];
}

// Helper to generate recent dates
const daysAgo = (d: number) => moment().subtract(d, 'days').toISOString();

export const mockResumes: ResumeSummary[] = [
  {
    id: 'cv-001',
    title: 'Développeur Full Stack Senior',
    updatedAt: daysAgo(1),
    role: 'Full Stack Engineer',
    location: 'Paris, FR',
    tags: ['React', 'Node.js', 'TypeScript'],
  },
  {
    id: 'cv-002',
    title: 'Data Scientist - NLP',
    updatedAt: daysAgo(3),
    role: 'Data Scientist',
    location: 'Lyon, FR',
    tags: ['Python', 'NLP', 'Transformers'],
  },
  {
    id: 'cv-003',
    title: 'Ingénieur IA / MLOps',
    updatedAt: daysAgo(7),
    role: 'ML Engineer',
    location: 'Remote',
    tags: ['MLOps', 'Docker', 'Kubernetes'],
  },
  {
    id: 'cv-004',
    title: 'Product Manager Technique',
    updatedAt: daysAgo(12),
    role: 'PM Tech',
    location: 'Marseille, FR',
    tags: ['Product', 'Agile', 'Roadmap'],
  },
  {
    id: 'cv-005',
    title: 'UX/UI Designer Portfolio',
    updatedAt: daysAgo(20),
    role: 'UX/UI Designer',
    location: 'Nantes, FR',
    tags: ['Figma', 'Design System', 'Prototyping'],
  }
];

export function fetchMockResumes(delayMs = 600): Promise<ResumeSummary[]> {
  return new Promise(resolve => setTimeout(() => resolve(mockResumes), delayMs));
}
