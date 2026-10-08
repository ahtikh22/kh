export type ServiceType = 'slack' | 'outlook' | 'zoom' | 'teams';

export interface AppPassword {
  id: string;
  service: ServiceType | 'general';
  name: string;
  code: string;
  createdAt: string;
}

export interface Mailbox {
  id: string;
  email: string;
  username: string;
  domain: string;
  password: string;
  displayName: string;
  companyId?: string;
  companyName: string;
  quotaMb: number;
  usedMb: number;
  status: 'active' | 'suspended';
  createdAt: string;
  allowedServices: ServiceType[];
  appPasswords: AppPassword[];
  notes?: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  accessKey: string;
  contactEmail: string;
  maxAccounts: number;
  allowedServices: ServiceType[];
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface EmailMessage {
  id: string;
  toEmail: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  preview: string;
  bodyHtml: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  serviceBadge?: ServiceType | 'system';
  otpCode?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  type: 'account' | 'company' | 'security' | 'email';
}

export type AppViewMode = 'admin' | 'company_portal' | 'webmail';
