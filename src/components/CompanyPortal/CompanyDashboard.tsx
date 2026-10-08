import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Users,
  Copy,
  Check,
  ExternalLink,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Download,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { Company, Mailbox, ServiceType } from '../../types';

interface CompanyDashboardProps {
  company: Company;
  mailboxes: Mailbox[];
  onCreateEmployee: (data: {
    username: string;
    domain: string;
    password: string;
    displayName: string;
    companyId: string;
    allowedServices: ServiceType[];
    quotaMb: number;
  }) => void;
  onOpenWebmail: (email: string) => void;
  onOpenSimulatorForEmail: (email: string) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  company,
  mailboxes,
  onCreateEmployee,
  onOpenWebmail,
  onOpenSimulatorForEmail,
}) => {
  const companyMailboxes = mailboxes.filter((m) => m.companyId === company.id);

  const [isCreating, setIsCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState(`Pass#${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const togglePassword = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    onCreateEmployee({
      username: username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''),
      domain: company.domain,
      password: password.trim(),
      displayName: displayName.trim() || username.trim(),
      companyId: company.id,
      allowedServices: company.allowedServices,
      quotaMb: 5000,
    });

    setUsername('');
    setDisplayName('');
    setPassword(`Pass#${Math.floor(1000 + Math.random() * 9000)}`);
    setIsCreating(false);
  };

  const handleExportCompanyCSV = () => {
    const headers = 'Email,Username,Password,Name,AllowedApps\n';
    const rows = companyMailboxes
      .map(
        (m) => `"${m.email}","${m.username}","${m.password}","${m.displayName}","${m.allowedServices.join(';')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${company.name.toLowerCase().replace(/\s+/g, '_')}_accounts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Company Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{company.name}</h1>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  @{company.domain}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client Workspace Portal · Create team emails & passwords for Slack, Outlook, Zoom, Teams
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Team Email</span>
            </button>

            <button
              onClick={handleExportCompanyCSV}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="Download employee list"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Workspace Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Accounts Usage</span>
            <span className="font-semibold text-white">
              {companyMailboxes.length} / {company.maxAccounts} Used
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Corporate Domain</span>
            <span className="font-mono text-indigo-300 font-semibold">@{company.domain}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Messaging Apps</span>
            <span className="font-mono text-slate-200 uppercase text-[11px]">
              {company.allowedServices.join(' · ')}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Portal Access Key</span>
            <span className="font-mono text-emerald-400 font-semibold">{company.accessKey}</span>
          </div>
        </div>
      </div>

      {/* Inline Create Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Employee Corporate Account</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Username:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="e.g. david or contact"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-l-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2 rounded-r-lg text-slate-400 font-mono">
                    @{company.domain}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Employee Name:</label>
                <input
                  type="text"
                  placeholder="e.g. David Miller"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Password:</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Employee can use this password for Webmail, Slack, Outlook, Zoom, Teams.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs"
                >
                  Generate Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Mailbox Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Company Team Mailboxes ({companyMailboxes.length})</h2>
          </div>
          <span className="text-xs text-slate-400">
            Click 'Open Webmail' to check inboxes or verify Slack/Zoom/Teams invites
          </span>
        </div>

        {companyMailboxes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-medium text-slate-300">No employee emails created yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click 'New Team Email' above to create your first company mailbox.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800 text-xs">
            {companyMailboxes.map((mailbox) => {
              const isPasswordVisible = showPasswordMap[mailbox.id];

              return (
                <div
                  key={mailbox.id}
                  className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Account Name & Email */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm tracking-tight">
                        {mailbox.email}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {mailbox.displayName} · Quota: {mailbox.quotaMb}MB
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                      <span>Supported:</span>
                      {mailbox.allowedServices.map((s) => (
                        <span key={s} className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded text-[10px] uppercase font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Password Card */}
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-3 min-w-[210px]">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Password</span>
                      <span className="font-mono text-slate-200">
                        {isPasswordVisible ? mailbox.password : '••••••••••••'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePassword(mailbox.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title={isPasswordVisible ? 'Hide' : 'Show'}
                      >
                        {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(mailbox.password, `comp-pass-${mailbox.id}`)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy Password"
                      >
                        {copiedId === `comp-pass-${mailbox.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenWebmail(mailbox.email)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Webmail</span>
                    </button>

                    <button
                      onClick={() => onOpenSimulatorForEmail(mailbox.email)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 rounded-lg text-xs font-medium transition-colors"
                      title="Test Slack or Teams OTP"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test OTP</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide: How to connect to Slack, Outlook, Zoom, Teams */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>How to use these emails on Slack, Outlook, Zoom & Teams:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <strong className="text-purple-400 font-semibold block">1. Slack Workspace:</strong>
            <p className="text-[11px] text-slate-400">
              Slack signup ma apna corporate email enter karein. Slack se 6-digit OTP code aapke AhtiMail Webmail inbox ma aayega. Code enter karein aur login complete karein.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <strong className="text-sky-400 font-semibold block">2. Microsoft Outlook 365:</strong>
            <p className="text-[11px] text-slate-400">
              Outlook client ma manual IMAP setup select karein. Host: <code className="text-slate-200">mail.ahtimail.net</code>, Port: 993 SSL. Outgoing Host: <code className="text-slate-200">smtp.ahtimail.net</code>, Port: 587. Password yahan se copy karein.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <strong className="text-blue-400 font-semibold block">3. Zoom Meetings:</strong>
            <p className="text-[11px] text-slate-400">
              Zoom app ma account create karte waqt yeh email use karein. Zoom activation passcode aapke inbox ma arrive hoga.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <strong className="text-indigo-400 font-semibold block">4. Microsoft Teams:</strong>
            <p className="text-[11px] text-slate-400">
              Teams organization invitation direct is mailbox pe receive hoga. Employee Teams application ma corporate email & password se direct chat kar sakta hai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
