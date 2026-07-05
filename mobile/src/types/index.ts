export interface Project {
  id: string;
  title: string;
  category: 'Android' | 'Website' | 'Backend' | 'Full Stack';
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  screenshots: string[];
  githubUrl?: string;
  liveUrl?: string;
  playStoreUrl?: string;
  clientReview?: { author: string; rating: number; comment: string };
  featured: boolean;
  year: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceFrom: number;
  deliveryDays: number;
  category: string;
  featured: boolean;
  deliverables: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readMinutes: number;
  publishedAt: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  phone?: string;
  provider: 'google' | 'guest';
}

export type RequestType = 'Website' | 'Android App' | 'Backend / API' | 'Full Stack' | 'Bug Fixing' | 'Other';
export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type RequestStatus = 'Pending' | 'In Review' | 'Accepted' | 'In Progress' | 'Completed' | 'Rejected';

export interface ProjectRequest {
  id: string;
  ticket: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  projectType: RequestType;
  priority: RequestPriority;
  description: string;
  status: RequestStatus;
  createdAt: string;
  synced: boolean;
}

export interface BugReport {
  id: string;
  ticket: string;
  title: string;
  description: string;
  priority: RequestPriority;
  deviceInfo: string;
  osVersion: string;
  appVersion: string;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed';
  createdAt: string;
  synced: boolean;
}
