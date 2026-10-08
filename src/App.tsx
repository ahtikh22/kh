import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/AdminPanel/Overview';
import { MailboxManager } from './components/AdminPanel/MailboxManager';
import { CompanyManager } from './components/AdminPanel/CompanyManager';
import { IntegrationCenter } from './components/AdminPanel/IntegrationCenter';
import { CreateMailboxModal } from './components/AdminPanel/CreateMailboxModal';
import { BulkCreateModal } from './components/AdminPanel/BulkCreateModal';
import { CreateCompanyModal } from './components/AdminPanel/CreateCompanyModal';
import { CompanyDashboard } from './components/CompanyPortal/CompanyDashboard';
import { WebmailView } from './components/Webmail/WebmailView';
import { LoginModal } from './components/LoginModal';
import { StorageService, ADMIN_CREDENTIALS } from './services/storage';
import { AppViewMode, Company, Mailbox, EmailMessage, ActivityLog, ServiceType } from './types';
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  Sparkles,
  Shield,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(() => StorageService.getCompanies());
  const [mailboxes, setMailboxes] = useState<Mailbox[]>(() => StorageService.getMailboxes());
  const [emails, setEmails] = useState<EmailMessage[]>(() => StorageService.getEmails());
  const [logs, setLogs] = useState<ActivityLog[]>(() => StorageService.getLogs());

  // View state
  const [currentMode, setCurrentMode] = useState<AppViewMode>('admin');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'mailboxes' | 'companies' | 'integrations'>('overview');

  // Active contexts
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    companies.length > 0 ? companies[0].id : ''
  );
  const [activeMailboxEmail, setActiveMailboxEmail] = useState<string>(
    mailboxes.length > 0 ? mailboxes[0].email : ''
  );

  // User session: Default to logged in as Ahti Superadmin
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    role: 'admin' | 'company' | 'mailbox';
    name: string;
  }>({
    email: ADMIN_CREDENTIALS.email,
    role: 'admin',
    name: 'Ahti Superadmin',
  });

  // Modals state
  const [isCreateMailboxOpen, setIsCreateMailboxOpen] = useState(false);
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [simulatorEmailTarget, setSimulatorEmailTarget] = useState<string>('');

  // Toast banner for feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state helpers
  const refreshAllState = () => {
    setCompanies(StorageService.getCompanies());
    setMailboxes(StorageService.getMailboxes());
    setEmails(StorageService.getEmails());
    setLogs(StorageService.getLogs());
  };

  // Handlers
  const handleCreateMailbox = (data: {
    username: string;
    domain: string;
    password: string;
    displayName: string;
    companyId?: string;
    allowedServices: ServiceType[];
    quotaMb: number;
    notes?: string;
  }) => {
    const created = StorageService.createMailbox(data);
    refreshAllState();
    showToast(`Created account: ${created.email} for Slack, Outlook, Zoom & Teams`);
  };

  const handleBulkCreate = (companyId: string, usernames: string[], domain: string, defaultPass?: string) => {
    const createdList = StorageService.bulkCreateMailboxes(companyId, usernames, domain, defaultPass);
    refreshAllState();
    showToast(`Batch created ${createdList.length} accounts under @${domain}`);
    return createdList;
  };

  const handleCreateCompany = (data: {
    name: string;
    domain: string;
    contactEmail: string;
    maxAccounts: number;
    allowedServices: ServiceType[];
  }) => {
    const created = StorageService.createCompany(data);
    refreshAllState();
    setSelectedCompanyId(created.id);
    showToast(`Provisioned company ${created.name} (Key: ${created.accessKey})`);
  };

  const handleUpdatePassword = (id: string, newPass: string) => {
    StorageService.updateMailboxPassword(id, newPass);
    refreshAllState();
    showToast('Mailbox password updated successfully');
  };

  const handleToggleMailboxStatus = (id: string) => {
    StorageService.toggleMailboxStatus(id);
    refreshAllState();
  };

  const handleDeleteMailbox = (id: string) => {
    StorageService.deleteMailbox(id);
    refreshAllState();
    showToast('Mailbox deleted');
  };

  const handleSendEmail = (data: {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    subject: string;
    bodyHtml: string;
  }) => {
    StorageService.sendEmail(data);
    refreshAllState();
    showToast(`Email sent to ${data.toEmail}`);
  };

  const handleSimulateServiceEmail = (toEmail: string, service: ServiceType) => {
    const newMail = StorageService.simulateServiceVerificationEmail(toEmail, service);
    refreshAllState();
    showToast(`Simulated ${service.toUpperCase()} OTP verification delivered to ${toEmail}`);
  };

  const handleToggleStar = (emailId: string) => {
    StorageService.toggleStarEmail(emailId);
    refreshAllState();
  };

  const handleMarkRead = (emailId: string, isRead: boolean) => {
    StorageService.markEmailRead(emailId, isRead);
    refreshAllState();
  };

  const handleDeleteEmail = (emailId: string) => {
    StorageService.deleteEmail(emailId);
    refreshAllState();
    showToast('Email moved to trash');
  };

  const handleOpenWebmailForEmail = (email: string) => {
    setActiveMailboxEmail(email);
    setCurrentMode('webmail');
  };

  const handleOpenSimulatorForEmail = (email: string) => {
    setSimulatorEmailTarget(email);
    setAdminSubTab('integrations');
    setCurrentMode('admin');
  };

  // Selected company object
  const currentCompany =
    companies.find((c) => c.id === selectedCompanyId) ||
    companies[0] || {
      id: 'default',
      name: 'Default Workspace',
      domain: 'companymail.net',
      accessKey: 'DEMO-001',
      contactEmail: 'admin@companymail.net',
      maxAccounts: 10,
      allowedServices: ['slack', 'outlook', 'zoom', 'teams'] as ServiceType[],
      createdAt: new Date().toISOString(),
      status: 'active' as const,
    };

  // Selected mailbox object
  const currentMailbox =
    mailboxes.find((m) => m.email.toLowerCase() === activeMailboxEmail.toLowerCase()) ||
    mailboxes[0] || {
      id: 'default-box',
      email: 'ahtio01@gmail.com',
      username: 'ahtio01',
      domain: 'gmail.com',
      password: ADMIN_CREDENTIALS.password,
      displayName: 'Ahti Superadmin',
      companyName: 'Master Admin HQ',
      quotaMb: 50000,
      usedMb: 24,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      allowedServices: ['slack', 'outlook', 'zoom', 'teams'] as ServiceType[],
      appPasswords: [],
    };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        currentUser={currentUser}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onSelectCompany={(id) => setSelectedCompanyId(id)}
        mailboxes={mailboxes}
        activeMailboxEmail={activeMailboxEmail}
        onSelectMailbox={(email) => setActiveMailboxEmail(email)}
        onOpenSimulator={() => {
          setAdminSubTab('integrations');
          setCurrentMode('admin');
        }}
        onLogout={() => setIsLoginModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-indigo-400/40 animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* MODE 1: ADMIN CONTROL PANEL */}
        {currentMode === 'admin' && (
          <div className="space-y-6">
            {/* Admin Subtabs Bar */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setAdminSubTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  adminSubTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setAdminSubTab('mailboxes')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  adminSubTab === 'mailboxes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Mailbox Accounts ({mailboxes.length})</span>
              </button>

              <button
                onClick={() => setAdminSubTab('companies')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  adminSubTab === 'companies'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Company Workspaces ({companies.length})</span>
              </button>

              <button
                onClick={() => setAdminSubTab('integrations')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  adminSubTab === 'integrations'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Slack · Outlook · Zoom · Teams (OTP Simulator)</span>
              </button>
            </div>

            {/* Admin Subtab Contents */}
            {adminSubTab === 'overview' && (
              <Overview
                mailboxes={mailboxes}
                companies={companies}
                emails={emails}
                logs={logs}
                onOpenCreateMailbox={() => setIsCreateMailboxOpen(true)}
                onOpenBulkCreate={() => setIsBulkCreateOpen(true)}
                onOpenCreateCompany={() => setIsCreateCompanyOpen(true)}
                onOpenSimulator={() => setAdminSubTab('integrations')}
                onOpenWebmail={handleOpenWebmailForEmail}
                onSelectCompany={(id) => {
                  setSelectedCompanyId(id);
                  setCurrentMode('company_portal');
                }}
              />
            )}

            {adminSubTab === 'mailboxes' && (
              <MailboxManager
                mailboxes={mailboxes}
                companies={companies}
                onOpenCreateMailbox={() => setIsCreateMailboxOpen(true)}
                onOpenBulkCreate={() => setIsBulkCreateOpen(true)}
                onOpenWebmail={handleOpenWebmailForEmail}
                onOpenSimulatorForEmail={handleOpenSimulatorForEmail}
                onToggleStatus={handleToggleMailboxStatus}
                onDeleteMailbox={handleDeleteMailbox}
                onUpdatePassword={handleUpdatePassword}
              />
            )}

            {adminSubTab === 'companies' && (
              <CompanyManager
                companies={companies}
                mailboxes={mailboxes}
                onOpenCreateCompany={() => setIsCreateCompanyOpen(true)}
                onSelectCompany={(id) => {
                  setSelectedCompanyId(id);
                  setCurrentMode('company_portal');
                }}
              />
            )}

            {adminSubTab === 'integrations' && (
              <IntegrationCenter
                mailboxes={mailboxes}
                onSimulateServiceEmail={handleSimulateServiceEmail}
                onOpenWebmail={handleOpenWebmailForEmail}
                preselectedEmail={simulatorEmailTarget}
              />
            )}
          </div>
        )}

        {/* MODE 2: COMPANY CLIENT PORTAL */}
        {currentMode === 'company_portal' && (
          <CompanyDashboard
            company={currentCompany}
            mailboxes={mailboxes}
            onCreateEmployee={handleCreateMailbox}
            onOpenWebmail={handleOpenWebmailForEmail}
            onOpenSimulatorForEmail={handleOpenSimulatorForEmail}
          />
        )}

        {/* MODE 3: ENTERPRISE WEBMAIL CLIENT */}
        {currentMode === 'webmail' && (
          <WebmailView
            currentMailbox={currentMailbox}
            allMailboxes={mailboxes}
            emails={emails}
            onSelectMailbox={(email) => setActiveMailboxEmail(email)}
            onSendEmail={handleSendEmail}
            onSimulateServiceEmail={handleSimulateServiceEmail}
            onToggleStar={handleToggleStar}
            onMarkRead={handleMarkRead}
            onDeleteEmail={handleDeleteEmail}
          />
        )}
      </main>

      {/* Creation Modals */}
      <CreateMailboxModal
        companies={companies}
        isOpen={isCreateMailboxOpen}
        onClose={() => setIsCreateMailboxOpen(false)}
        onSubmit={handleCreateMailbox}
      />

      <BulkCreateModal
        companies={companies}
        isOpen={isBulkCreateOpen}
        onClose={() => setIsBulkCreateOpen(false)}
        onBulkCreate={handleBulkCreate}
      />

      <CreateCompanyModal
        isOpen={isCreateCompanyOpen}
        onClose={() => setIsCreateCompanyOpen(false)}
        onSubmit={handleCreateCompany}
      />

      {/* Login / Switch Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAdminLoginSuccess={() => {
          setCurrentUser({
            email: ADMIN_CREDENTIALS.email,
            role: 'admin',
            name: 'Ahti Superadmin',
          });
          setCurrentMode('admin');
          setIsLoginModalOpen(false);
          showToast(`Logged into Admin Control Panel (${ADMIN_CREDENTIALS.email})`);
        }}
        onCompanyLoginSuccess={(companyId) => {
          setSelectedCompanyId(companyId);
          const c = companies.find((x) => x.id === companyId);
          setCurrentUser({
            email: c ? c.contactEmail : 'company@client.com',
            role: 'company',
            name: c ? c.name : 'Company Client',
          });
          setCurrentMode('company_portal');
          setIsLoginModalOpen(false);
          showToast(`Logged into ${c?.name} Company Portal`);
        }}
        onMailboxLoginSuccess={(email) => {
          setActiveMailboxEmail(email);
          const m = mailboxes.find((x) => x.email === email);
          setCurrentUser({
            email,
            role: 'mailbox',
            name: m ? m.displayName : 'Webmail User',
          });
          setCurrentMode('webmail');
          setIsLoginModalOpen(false);
          showToast(`Logged into Webmail for ${email}`);
        }}
        companies={companies}
        mailboxes={mailboxes}
      />
    </div>
  );
}
