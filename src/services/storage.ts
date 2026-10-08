import { Mailbox, Company, EmailMessage, ActivityLog, ServiceType, AppPassword } from '../types';

const STORAGE_KEYS = {
  MAILBOXES: 'ahtimail_mailboxes_v1',
  COMPANIES: 'ahtimail_companies_v1',
  EMAILS: 'ahtimail_emails_v1',
  LOGS: 'ahtimail_logs_v1',
  SESSION: 'ahtimail_session_v1',
};

export const ADMIN_CREDENTIALS = {
  email: 'ahtio01@gmail.com',
  alternateEmail: 'ahti01@gmail.com',
  password: 'ahti@001',
  name: 'Ahti Admin (Super Control Panel)',
  role: 'superadmin' as const,
};

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Apex Global Corp',
    domain: 'apexcorp.com',
    accessKey: 'APEX-8821-X9',
    contactEmail: 'contact@apexcorp.com',
    maxAccounts: 50,
    allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'active',
  },
  {
    id: 'comp-2',
    name: 'NovaSoft Technologies',
    domain: 'novasoft.io',
    accessKey: 'NOVA-4412-M3',
    contactEmail: 'admin@novasoft.io',
    maxAccounts: 25,
    allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'active',
  },
  {
    id: 'comp-3',
    name: 'CloudLink Dynamics',
    domain: 'cloudlink.org',
    accessKey: 'LINK-1092-K5',
    contactEmail: 'hr@cloudlink.org',
    maxAccounts: 10,
    allowedServices: ['slack', 'zoom', 'teams'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: 'active',
  },
];

const INITIAL_MAILBOXES: Mailbox[] = [
  {
    id: 'box-1',
    email: 'alex@apexcorp.com',
    username: 'alex',
    domain: 'apexcorp.com',
    password: 'ApexPassword#2026',
    displayName: 'Alex Rivers',
    companyId: 'comp-1',
    companyName: 'Apex Global Corp',
    quotaMb: 5000,
    usedMb: 240,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
    appPasswords: [
      { id: 'ap-1', service: 'slack', name: 'Slack Workplace App Key', code: 'xoxb-9921-ahti-81729', createdAt: new Date().toISOString() },
      { id: 'ap-2', service: 'outlook', name: 'Outlook Exchange Token', code: 'ms-auth-4418-token-sec', createdAt: new Date().toISOString() },
    ],
    notes: 'Senior Engineering Lead at Apex Corp',
  },
  {
    id: 'box-2',
    email: 'sarah.khan@novasoft.io',
    username: 'sarah.khan',
    domain: 'novasoft.io',
    password: 'NovaSecure@786',
    displayName: 'Sarah Khan',
    companyId: 'comp-2',
    companyName: 'NovaSoft Technologies',
    quotaMb: 2000,
    usedMb: 120,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
    appPasswords: [
      { id: 'ap-3', service: 'teams', name: 'Teams SSO Sync', code: 'teams-app-token-3891', createdAt: new Date().toISOString() },
    ],
    notes: 'HR Director at NovaSoft',
  },
  {
    id: 'box-3',
    email: 'devteam@cloudlink.org',
    username: 'devteam',
    domain: 'cloudlink.org',
    password: 'CloudDevPass#99',
    displayName: 'CloudLink Dev Team',
    companyId: 'comp-3',
    companyName: 'CloudLink Dynamics',
    quotaMb: 10000,
    usedMb: 850,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    allowedServices: ['slack', 'zoom', 'teams'],
    appPasswords: [],
    notes: 'Team group mailbox',
  },
  {
    id: 'box-4',
    email: 'ahti.vip@apexcorp.com',
    username: 'ahti.vip',
    domain: 'apexcorp.com',
    password: 'ahti@001',
    displayName: 'Ahti Khan (Executive VIP)',
    companyId: 'comp-1',
    companyName: 'Apex Global Corp',
    quotaMb: 20000,
    usedMb: 420,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
    appPasswords: [
      { id: 'ap-4', service: 'slack', name: 'Slack VIP Token', code: 'xoxp-vip-slack-connect', createdAt: new Date().toISOString() },
      { id: 'ap-5', service: 'zoom', name: 'Zoom Host Passcode', code: 'zoom-jwt-8849-key', createdAt: new Date().toISOString() },
    ],
    notes: 'Direct personal executive account',
  },
];

const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'mail-1',
    toEmail: 'alex@apexcorp.com',
    fromEmail: 'no-reply@slack.com',
    fromName: 'Slack Enterprise Support',
    subject: 'Confirm your email to join the Slack workspace',
    preview: 'Your Slack 6-digit verification code is 482-910. Enter this code to verify your account.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #4a154b; margin-top: 0;">Welcome to Slack!</h2>
        <p>You have been invited to join the enterprise workspace with your corporate email <strong>alex@apexcorp.com</strong>.</p>
        <p>To finalize your account setup and enable direct messaging, audio huddles, and channel access, enter your one-time verification code below:</p>
        <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border: 2px dashed #4a154b; border-radius: 8px; text-align: center;">
          <span style="font-size: 14px; color: #64748b; display: block; margin-bottom: 6px;">Your 6-Digit Slack OTP Code</span>
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #4a154b; font-family: monospace;">482910</span>
        </div>
        <p style="font-size: 13px; color: #64748b;">This verification code will expire in 15 minutes. If you did not request this invitation, please ignore this email.</p>
      </div>
    `,
    date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    serviceBadge: 'slack',
    otpCode: '482910',
  },
  {
    id: 'mail-2',
    toEmail: 'alex@apexcorp.com',
    fromEmail: 'account-security-noreply@accountprotection.microsoft.com',
    fromName: 'Microsoft Outlook 365 Team',
    subject: 'Microsoft account security code: 829415',
    preview: 'Please use 829415 as your single-use code for Microsoft Outlook setup and Teams integration.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0078d4; margin-top: 0;">Microsoft Account Verification</h2>
        <p>We received your request for a single-use code to connect <strong>alex@apexcorp.com</strong> with Microsoft Outlook 365 and Microsoft Teams.</p>
        <div style="margin: 20px 0; padding: 14px 20px; background: #e0f2fe; border-radius: 6px; display: inline-block;">
          <span style="font-size: 26px; font-weight: bold; color: #0284c7; font-family: monospace;">829415</span>
        </div>
        <p>If you did not request this code, you can safely disregard this email. Someone may have typed your email address by mistake.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>
      </div>
    `,
    date: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    isRead: false,
    isStarred: false,
    folder: 'inbox',
    serviceBadge: 'outlook',
    otpCode: '829415',
  },
  {
    id: 'mail-3',
    toEmail: 'alex@apexcorp.com',
    fromEmail: 'no-reply@zoom.us',
    fromName: 'Zoom Video Communications',
    subject: 'Activate your Zoom Pro Video & Audio Conferencing Account',
    preview: 'Your company has assigned you a Zoom Pro license. Click to activate or use code 551902.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0b5cff; margin-top: 0;">Welcome to Zoom Video</h2>
        <p>Hello Alex Rivers,</p>
        <p>Your administrator at <strong>Apex Global Corp</strong> has provisioned a Zoom Pro account for your corporate identity.</p>
        <div style="margin: 20px 0; padding: 16px; background-color: #f1f5f9; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;">Activation Passcode:</p>
          <div style="font-size: 28px; font-weight: 700; color: #0b5cff; font-family: monospace;">551902</div>
        </div>
        <p>Enjoy HD meetings, team chat, and enterprise collaboration anywhere.</p>
      </div>
    `,
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    serviceBadge: 'zoom',
    otpCode: '551902',
  },
  {
    id: 'mail-4',
    toEmail: 'ahti.vip@apexcorp.com',
    fromEmail: 'invitations@slack.com',
    fromName: 'Slack Enterprise Grid',
    subject: 'Executive workspace privileges enabled on Slack',
    preview: 'Welcome Ahti Khan! Your executive single sign-on access to Slack has been provisioned.',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #4a154b; margin-top: 0;">Executive Slack Access Activated</h2>
        <p>Welcome <strong>Ahti Khan</strong>! Your corporate ID <strong>ahti.vip@apexcorp.com</strong> is configured with administrative privileges across all Slack corporate channels.</p>
        <div style="margin: 18px 0; padding: 14px; background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 6px;">
          <strong>Workspace ID:</strong> apex-corp-hq.slack.com<br/>
          <strong>Security OTP:</strong> <span style="font-family: monospace; font-size: 18px; color: #7e22ce; font-weight: bold;">990142</span>
        </div>
      </div>
    `,
    date: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    serviceBadge: 'slack',
    otpCode: '990142',
  },
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    action: 'Admin Panel Initialized',
    actor: 'ahti01@gmail.com',
    details: 'System control panel initialized with superadmin authority.',
    type: 'security',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    action: 'Slack OTP Sent',
    actor: 'System Integration Bridge',
    details: 'Delivered Slack verification OTP (482910) to alex@apexcorp.com',
    type: 'email',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    action: 'Mailbox Created',
    actor: 'Apex Global Corp',
    details: 'Provisioned mailbox alex@apexcorp.com with Slack, Outlook, Zoom, Teams enabled.',
    type: 'account',
  },
];

// Helper to safely load from local storage
function loadItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

export const StorageService = {
  getCompanies(): Company[] {
    return loadItem(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  },

  saveCompanies(companies: Company[]): void {
    saveItem(STORAGE_KEYS.COMPANIES, companies);
  },

  getMailboxes(): Mailbox[] {
    return loadItem(STORAGE_KEYS.MAILBOXES, INITIAL_MAILBOXES);
  },

  saveMailboxes(mailboxes: Mailbox[]): void {
    saveItem(STORAGE_KEYS.MAILBOXES, mailboxes);
  },

  getEmails(): EmailMessage[] {
    return loadItem(STORAGE_KEYS.EMAILS, INITIAL_EMAILS);
  },

  saveEmails(emails: EmailMessage[]): void {
    saveItem(STORAGE_KEYS.EMAILS, emails);
  },

  getLogs(): ActivityLog[] {
    return loadItem(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  },

  logActivity(action: string, actor: string, details: string, type: ActivityLog['type'] = 'account'): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details,
      type,
    };
    saveItem(STORAGE_KEYS.LOGS, [newLog, ...logs.slice(0, 99)]);
  },

  createMailbox(data: {
    username: string;
    domain: string;
    password?: string;
    displayName: string;
    companyId?: string;
    allowedServices: ServiceType[];
    quotaMb?: number;
    notes?: string;
  }): Mailbox {
    const mailboxes = this.getMailboxes();
    const companies = this.getCompanies();

    const company = companies.find(c => c.id === data.companyId);
    const companyName = company ? company.name : 'Independent Workspace';
    const email = `${data.username.toLowerCase().trim()}@${data.domain.toLowerCase().trim()}`;

    // Verify uniqueness
    if (mailboxes.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`Mailbox "${email}" already exists! Please choose another username.`);
    }

    const password = data.password && data.password.trim() ? data.password.trim() : `AhtiPass#${Math.floor(1000 + Math.random() * 9000)}`;

    const newMailbox: Mailbox = {
      id: `box-${Date.now()}`,
      email,
      username: data.username.toLowerCase().trim(),
      domain: data.domain.toLowerCase().trim(),
      password,
      displayName: data.displayName || data.username,
      companyId: data.companyId,
      companyName,
      quotaMb: data.quotaMb || 5000,
      usedMb: 5,
      status: 'active',
      createdAt: new Date().toISOString(),
      allowedServices: data.allowedServices.length > 0 ? data.allowedServices : ['slack', 'outlook', 'zoom', 'teams'],
      appPasswords: [
        {
          id: `ap-${Date.now()}-1`,
          service: 'slack',
          name: 'Slack Connect App Password',
          code: `slk-${Math.random().toString(36).substring(2, 8)}-auth`,
          createdAt: new Date().toISOString(),
        },
        {
          id: `ap-${Date.now()}-2`,
          service: 'outlook',
          name: 'Outlook IMAP/SMTP Key',
          code: `ms-${Math.random().toString(36).substring(2, 8)}-sync`,
          createdAt: new Date().toISOString(),
        },
      ],
      notes: data.notes || '',
    };

    const updated = [newMailbox, ...mailboxes];
    this.saveMailboxes(updated);

    this.logActivity(
      'Mailbox Created',
      ADMIN_CREDENTIALS.email,
      `Created ${newMailbox.email} for ${companyName} with services: ${newMailbox.allowedServices.join(', ')}`,
      'account'
    );

    // Send welcome system email
    this.receiveSystemWelcomeEmail(newMailbox);

    return newMailbox;
  },

  bulkCreateMailboxes(companyId: string, usernames: string[], domain: string, defaultPassword?: string): Mailbox[] {
    const created: Mailbox[] = [];
    for (const name of usernames) {
      const clean = name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
      if (!clean) continue;
      try {
        const box = this.createMailbox({
          username: clean,
          domain,
          companyId,
          displayName: clean.charAt(0).toUpperCase() + clean.slice(1).replace('.', ' '),
          password: defaultPassword || `Ahti@${Math.floor(1000 + Math.random() * 9000)}`,
          allowedServices: ['slack', 'outlook', 'zoom', 'teams'],
          quotaMb: 5000,
        });
        created.push(box);
      } catch {
        // Skip duplicate or handle gracefully
      }
    }
    return created;
  },

  updateMailboxPassword(mailboxId: string, newPassword: string): void {
    const mailboxes = this.getMailboxes();
    const target = mailboxes.find(m => m.id === mailboxId);
    if (!target) return;

    target.password = newPassword;
    this.saveMailboxes(mailboxes);

    this.logActivity(
      'Password Updated',
      ADMIN_CREDENTIALS.email,
      `Password changed for mailbox ${target.email}`,
      'security'
    );
  },

  toggleMailboxStatus(mailboxId: string): void {
    const mailboxes = this.getMailboxes();
    const target = mailboxes.find(m => m.id === mailboxId);
    if (!target) return;

    target.status = target.status === 'active' ? 'suspended' : 'active';
    this.saveMailboxes(mailboxes);

    this.logActivity(
      'Status Changed',
      ADMIN_CREDENTIALS.email,
      `Mailbox ${target.email} status set to ${target.status}`,
      'account'
    );
  },

  deleteMailbox(mailboxId: string): void {
    const mailboxes = this.getMailboxes();
    const target = mailboxes.find(m => m.id === mailboxId);
    const updated = mailboxes.filter(m => m.id !== mailboxId);
    this.saveMailboxes(updated);

    if (target) {
      this.logActivity(
        'Mailbox Deleted',
        ADMIN_CREDENTIALS.email,
        `Deleted mailbox ${target.email}`,
        'account'
      );
    }
  },

  createCompany(data: {
    name: string;
    domain: string;
    contactEmail: string;
    maxAccounts: number;
    allowedServices: ServiceType[];
  }): Company {
    const companies = this.getCompanies();
    const cleanDomain = data.domain.toLowerCase().trim().replace(/^@/, '');

    const accessKey = `${data.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'COMP')}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: data.name.trim(),
      domain: cleanDomain,
      accessKey,
      contactEmail: data.contactEmail.trim(),
      maxAccounts: data.maxAccounts || 20,
      allowedServices: data.allowedServices.length > 0 ? data.allowedServices : ['slack', 'outlook', 'zoom', 'teams'],
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const updated = [newCompany, ...companies];
    this.saveCompanies(updated);

    this.logActivity(
      'Company Provisioned',
      ADMIN_CREDENTIALS.email,
      `Created company "${newCompany.name}" with domain @${newCompany.domain} (Key: ${accessKey})`,
      'company'
    );

    return newCompany;
  },

  generateNewAppPassword(mailboxId: string, service: ServiceType, name: string): AppPassword {
    const mailboxes = this.getMailboxes();
    const target = mailboxes.find(m => m.id === mailboxId);
    if (!target) throw new Error('Mailbox not found');

    const newKey: AppPassword = {
      id: `ap-${Date.now()}`,
      service,
      name,
      code: `${service}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };

    target.appPasswords = [newKey, ...target.appPasswords];
    this.saveMailboxes(mailboxes);

    this.logActivity(
      'App Password Generated',
      ADMIN_CREDENTIALS.email,
      `Generated ${service.toUpperCase()} app token for ${target.email}`,
      'security'
    );

    return newKey;
  },

  // Simulates sending an email
  sendEmail(data: {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    subject: string;
    bodyHtml: string;
  }): EmailMessage {
    const emails = this.getEmails();
    const mailboxes = this.getMailboxes();

    const senderMailbox = mailboxes.find(m => m.email.toLowerCase() === data.fromEmail.toLowerCase());
    if (senderMailbox) {
      senderMailbox.usedMb = Math.min(senderMailbox.quotaMb, senderMailbox.usedMb + 1);
      this.saveMailboxes(mailboxes);
    }

    const preview = data.bodyHtml.replace(/<[^>]*>/g, '').substring(0, 100);

    // Create message in sent folder for sender
    const sentMessage: EmailMessage = {
      id: `mail-sent-${Date.now()}`,
      toEmail: data.toEmail,
      fromEmail: data.fromEmail,
      fromName: data.fromName,
      subject: data.subject,
      preview,
      bodyHtml: data.bodyHtml,
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      folder: 'sent',
    };

    // If destination is one of our mailboxes, also deliver to their inbox!
    const recipientMailbox = mailboxes.find(m => m.email.toLowerCase() === data.toEmail.toLowerCase());
    let incomingMessage: EmailMessage | null = null;
    if (recipientMailbox) {
      incomingMessage = {
        id: `mail-in-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        toEmail: data.toEmail,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        subject: data.subject,
        preview,
        bodyHtml: data.bodyHtml,
        date: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        folder: 'inbox',
      };
      recipientMailbox.usedMb = Math.min(recipientMailbox.quotaMb, recipientMailbox.usedMb + 1);
      this.saveMailboxes(mailboxes);
    }

    const updatedEmails = incomingMessage ? [incomingMessage, sentMessage, ...emails] : [sentMessage, ...emails];
    this.saveEmails(updatedEmails);

    this.logActivity(
      'Email Sent',
      data.fromEmail,
      `Sent email "${data.subject}" to ${data.toEmail}`,
      'email'
    );

    return sentMessage;
  },

  // Simulates receiving verification/OTP email for Slack, Outlook, Zoom, Teams
  simulateServiceVerificationEmail(toEmail: string, service: ServiceType): EmailMessage {
    const emails = this.getEmails();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let fromEmail = 'no-reply@slack.com';
    let fromName = 'Slack Technologies';
    let subject = `Slack Verification Code: ${otp}`;
    let bodyHtml = '';

    if (service === 'slack') {
      fromEmail = 'no-reply@slack.com';
      fromName = 'Slack Team';
      subject = `Slack workspace verification code: ${otp}`;
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 580px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 24px; height: 24px; background: #4a154b; border-radius: 4px; display: inline-block;"></div>
            <strong style="color: #4a154b; font-size: 18px;">Slack Workspace Verification</strong>
          </div>
          <p>Hi there,</p>
          <p>You requested a confirmation email to connect your account <strong>${toEmail}</strong> to your company's Slack workspace.</p>
          <div style="margin: 24px 0; padding: 20px; background-color: #f8fafc; border: 2px dashed #4a154b; border-radius: 8px; text-align: center;">
            <span style="font-size: 13px; color: #64748b; display: block; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Your One-Time Passcode (OTP)</span>
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #4a154b; font-family: monospace;">${otp}</span>
          </div>
          <p>Enter this verification code on Slack to start chatting, sharing files, and collaborating with your team.</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Slack Technologies, 500 Howard Street, San Francisco, CA 94105</p>
        </div>
      `;
    } else if (service === 'outlook') {
      fromEmail = 'account-security-noreply@accountprotection.microsoft.com';
      fromName = 'Microsoft Outlook 365';
      subject = `Microsoft account security code: ${otp}`;
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 580px;">
          <h2 style="color: #0078d4; margin-top: 0;">Microsoft Account Verification Code</h2>
          <p>Please use this single-use code to configure your Microsoft Outlook desktop/web client and authenticate <strong>${toEmail}</strong>:</p>
          <div style="margin: 20px 0; padding: 16px 24px; background: #f0f9ff; border-left: 4px solid #0284c7; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: 700; color: #0369a1; font-family: monospace;">${otp}</span>
          </div>
          <p>If you did not request this security code, please check with your system administrator.</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">Microsoft Security Team</p>
        </div>
      `;
    } else if (service === 'zoom') {
      fromEmail = 'no-reply@zoom.us';
      fromName = 'Zoom Video Communications';
      subject = `Zoom Account Activation Code: ${otp}`;
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 580px;">
          <h2 style="color: #0b5cff; margin-top: 0;">Welcome to Zoom Video</h2>
          <p>Your business email <strong>${toEmail}</strong> has been registered on Zoom.</p>
          <p>Use the following 6-digit confirmation code to activate your video conference meetings and team chat privileges:</p>
          <div style="margin: 20px 0; padding: 18px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 5px; color: #1d4ed8; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #64748b;">Code expires in 10 minutes. Happy Zooming!</p>
        </div>
      `;
    } else if (service === 'teams') {
      fromEmail = 'teams-noreply@microsoft.com';
      fromName = 'Microsoft Teams Notifications';
      subject = `Microsoft Teams workspace invite code: ${otp}`;
      bodyHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 580px;">
          <h2 style="color: #4f46e5; margin-top: 0;">Microsoft Teams Organization Joined</h2>
          <p>Hello,</p>
          <p>You have been added to your organization's Microsoft Teams workspace with email <strong>${toEmail}</strong>.</p>
          <div style="margin: 20px 0; padding: 16px 20px; background: #eef2ff; border-radius: 6px; text-align: center;">
            <span style="font-size: 13px; color: #4338ca; display: block; margin-bottom: 4px;">Teams Verification Passcode</span>
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3730a3; font-family: monospace;">${otp}</span>
          </div>
          <p>Join team channels, start 1-on-1 calls, and share documents seamlessly.</p>
        </div>
      `;
    }

    const newEmail: EmailMessage = {
      id: `mail-${service}-${Date.now()}`,
      toEmail,
      fromEmail,
      fromName,
      subject,
      preview: `Your verification code is ${otp}. Use this code to authenticate with ${service.toUpperCase()}.`,
      bodyHtml,
      date: new Date().toISOString(),
      isRead: false,
      isStarred: true,
      folder: 'inbox',
      serviceBadge: service,
      otpCode: otp,
    };

    const updated = [newEmail, ...emails];
    this.saveEmails(updated);

    this.logActivity(
      `${service.toUpperCase()} OTP Sent`,
      'Integration Simulator',
      `Delivered verification code ${otp} to ${toEmail}`,
      'email'
    );

    return newEmail;
  },

  receiveSystemWelcomeEmail(mailbox: Mailbox): void {
    const emails = this.getEmails();
    const welcomeMail: EmailMessage = {
      id: `mail-welcome-${Date.now()}`,
      toEmail: mailbox.email,
      fromEmail: 'admin@ahtimail.net',
      fromName: 'AhtiMail Administrator',
      subject: `Welcome to your new enterprise mailbox: ${mailbox.email}`,
      preview: `Your corporate email account has been created successfully. Ready for Slack, Outlook, Zoom, and Teams!`,
      bodyHtml: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #059669; margin-top: 0;">Your Corporate Webmail is Active</h2>
          <p>Hello <strong>${mailbox.displayName}</strong>,</p>
          <p>Welcome to your newly provisioned corporate email account for <strong>${mailbox.companyName}</strong>.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Email Address:</strong> ${mailbox.email}</p>
            <p style="margin: 4px 0;"><strong>Allocated Quota:</strong> ${mailbox.quotaMb} MB</p>
            <p style="margin: 4px 0;"><strong>Enabled Messaging Integrations:</strong> ${mailbox.allowedServices.join(', ').toUpperCase()}</p>
          </div>
          <p>You can use this email address to register or sign in to <strong>Slack, Microsoft Outlook, Zoom, and MS Teams</strong>. Any confirmation codes or workspace invitations will appear directly in this inbox.</p>
        </div>
      `,
      date: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      folder: 'inbox',
      serviceBadge: 'system',
    };
    this.saveEmails([welcomeMail, ...emails]);
  },

  toggleStarEmail(emailId: string): void {
    const emails = this.getEmails();
    const mail = emails.find(e => e.id === emailId);
    if (!mail) return;
    mail.isStarred = !mail.isStarred;
    this.saveEmails(emails);
  },

  markEmailRead(emailId: string, isRead = true): void {
    const emails = this.getEmails();
    const mail = emails.find(e => e.id === emailId);
    if (!mail) return;
    mail.isRead = isRead;
    this.saveEmails(emails);
  },

  deleteEmail(emailId: string): void {
    const emails = this.getEmails();
    const mail = emails.find(e => e.id === emailId);
    if (!mail) return;

    if (mail.folder === 'trash') {
      // permanently delete
      const updated = emails.filter(e => e.id !== emailId);
      this.saveEmails(updated);
    } else {
      mail.folder = 'trash';
      this.saveEmails(emails);
    }
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.MAILBOXES);
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  },
};
