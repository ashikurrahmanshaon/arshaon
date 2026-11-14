export type WorkspaceFocus = 'overview' | 'computer' | 'printer' | 'bookshelf' | 'desk';

export type CreationCategory =
  | 'All'
  | 'Websites'
  | 'SaaS Products'
  | 'AI Projects'
  | 'Digital Marketing Campaigns'
  | 'Creative Work';

export type ModalType = 'none' | 'about' | 'office' | 'projects' | 'cv' | 'contact' | 'accessibility';

export interface AboutMeData {
  fullName: string;
  brandName: string;
  website: string;
  tagline: string;
  location: string;
  introduction: string;
  professionalIdentity: string;
  careerHistory: {
    role: string;
    organization: string;
    focus: string;
    description: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  interests: string[];
  personalJourney: string[];
}

export interface BusinessSpecialty {
  id: string;
  title: string;
  category: 'marketing' | 'advertising' | 'commerce' | 'technology';
  summary: string;
  capabilities: string[];
  toolsAndPlatforms: string[];
  deliverables: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  category: Exclude<CreationCategory, 'All'>;
  subtitle: string;
  description: string;
  details: string;
  previewTone: string;
  previewLabel: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface CVData {
  name: string;
  brand: string;
  title: string;
  website: string;
  email: string;
  location: string;
  summary: string;
  experience: {
    role: string;
    organization: string;
    scope: string;
    responsibilities: string[];
  }[];
  skills: {
    group: string;
    list: string[];
  }[];
  services: {
    title: string;
    description: string;
  }[];
  projects: {
    name: string;
    role: string;
    url: string;
    summary: string;
  }[];
  education: {
    program: string;
    institution: string;
    notes: string;
  }[];
  contact: {
    website: string;
    email: string;
    linkedin: string;
    github: string;
    availability: string;
  };
}
