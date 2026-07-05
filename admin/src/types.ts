export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectRequestRow {
  _id: string;
  ticket: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  projectType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  status: 'Pending' | 'In Review' | 'Accepted' | 'In Progress' | 'Completed' | 'Rejected';
  createdAt: string;
}

export interface BugReportRow {
  _id: string;
  ticket: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  deviceInfo?: string;
  appVersion?: string;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed';
  createdAt: string;
}

export const REQUEST_STATUSES = [
  'Pending',
  'In Review',
  'Accepted',
  'In Progress',
  'Completed',
  'Rejected',
] as const;

export const BUG_STATUSES = ['Open', 'In Progress', 'Fixed', 'Closed'] as const;
