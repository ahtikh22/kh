import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  KeyRound,
  Sparkles,
  ShieldAlert,
  Power,
  RefreshCw,
} from 'lucide-react';
import { Mailbox, Company, ServiceType } from '../../types';

interface MailboxManagerProps {
  mailboxes: Mailbox[];
  companies: Company[];
  onOpenCreateMailbox: () => void;
  onOpenBulkCreate: () => void;
  onOpenWebmail: (email: string) => void;
  onOpenSimulatorForEmail: (email: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteMailbox: (id: string) => void;
  onUpdatePassword: (id: string, newPass: string) => void;
}

export const MailboxManager: React.FC<MailboxManagerProps> = ({
  mailboxes,
  companies,
  onOpenCreateMailbox,
  onOpenBulkCreate,
  onOpenWebmail,
  onOpenSimulatorForEmail,
  onToggleStatus,
  onDeleteMailbox,
  onUpdatePassword,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [selectedMailboxDetails, setSelectedMailboxDetails] = useState<Mailbox | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMailboxes = mailboxes.filter((m) => {
    const matchesSearch =
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany =
      selectedCompanyFilter === 'all' || m.companyId === selectedCompanyFilter;

    const matchesService =
      selectedServiceFilter === 'all' ||
      m.allowedServices.includes(selectedServiceFilter as ServiceType);

    return matchesSearch && matchesCompany && matchesService;
  });

  const handleExportCSV = () => {
    const headers = 'Email,Username,Domain,Password,DisplayName,Company,AllowedServices,Status\n';
    const rows = filteredMailboxes
      .map(
        (m) =>
          `"${m.email}","${m.username}","${m.domain}","${m.password}","${m.displayName}","${m.companyName}","${m.allowedServices.join(';')}",${m.status}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ahtimail_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSavePassword = (id: string) => {
    if (!newPasswordVal.trim()) return;
    onUpdatePassword(id, newPasswordVal.trim());
    setEditingPasswordId(null);
    setNewPasswordVal('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Mailbox Accounts Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, configure, and monitor business email accounts & passwords for Slack, Outlook, Zoom, and Teams.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenCreateMailbox}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Account</span>
          </button>

          <button
            onClick={onOpenBulkCreate}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Bulk Generator</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="Export filtered accounts to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email, name, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Company Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Company:</span>
          <select
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="all">All Companies ({mailboxes.length})</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (@{c.domain})
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Service:</span>
          <select
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="all">All Apps</option>
            <option value="slack">Slack</option>
            <option value="outlook">Outlook</option>
            <option value="zoom">Zoom</option>
            <option value="teams">Teams</option>
          </select>
        </div>
      </div>

      {/* Accounts List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredMailboxes.length}</strong> of{' '}
            {mailboxes.length} accounts
          </span>
          <span className="text-[11px] text-slate-500">
            Click 'Open Webmail' to enter any user's inbox
          </span>
        </div>

        {filteredMailboxes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No accounts match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or create a new mailbox.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredMailboxes.map((mailbox) => {
              const isPasswordVisible = showPasswordMap[mailbox.id];
              const isEditingPass = editingPasswordId === mailbox.id;

              return (
                <div
                  key={mailbox.id}
                  className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  {/* Left: Email, User, Company */}
                  <div className="space-y-1 min-w-[240px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm tracking-tight">
                        {mailbox.email}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border ${
                          mailbox.status === 'active'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                            : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                        }`}
                      >
                        {mailbox.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <span>{mailbox.displayName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">{mailbox.companyName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">
                        {mailbox.usedMb}MB / {mailbox.quotaMb}MB
                      </span>
                    </div>

                    {/* Enabled Services Badges */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500">Apps:</span>
                      {mailbox.allowedServices.map((s) => (
                        <span
                          key={s}
                          className="bg-slate-800 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 uppercase"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Password Management */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between gap-3 min-w-[240px]">
                    {isEditingPass ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={newPasswordVal}
                          onChange={(e) => setNewPasswordVal(e.target.value)}
                          placeholder="New password"
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-full font-mono"
                        />
                        <button
                          onClick={() => handleSavePassword(mailbox.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPasswordId(null)}
                          className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                            Password / Login Key
                          </span>
                          <span className="font-mono text-slate-200 text-xs">
                            {isPasswordVisible ? mailbox.password : '••••••••••••'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => togglePasswordVisibility(mailbox.id)}
                            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                            title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => copyToClipboard(mailbox.password, `pass-${mailbox.id}`)}
                            className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                            title="Copy Password"
                          >
                            {copiedId === `pass-${mailbox.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setEditingPasswordId(mailbox.id);
                              setNewPasswordVal(mailbox.password);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Edit Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                    {/* Open Webmail */}
                    <button
                      onClick={() => onOpenWebmail(mailbox.email)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
                      title="Open Webmail client for this mailbox"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Webmail</span>
                    </button>

                    {/* Test OTP */}
                    <button
                      onClick={() => onOpenSimulatorForEmail(mailbox.email)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 rounded-lg text-xs font-medium transition-colors"
                      title="Simulate sending Slack / Teams / Zoom OTP to this mailbox"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test OTP</span>
                    </button>

                    {/* View Details / App Passwords */}
                    <button
                      onClick={() => setSelectedMailboxDetails(mailbox)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      title="View App Passwords & IMAP Setup"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => onToggleStatus(mailbox.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        mailbox.status === 'active'
                          ? 'bg-slate-800 hover:bg-amber-950/50 text-slate-400 hover:text-amber-400 border-slate-700'
                          : 'bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-400 border-emerald-800'
                      }`}
                      title={mailbox.status === 'active' ? 'Suspend Mailbox' : 'Activate Mailbox'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete mailbox ${mailbox.email}?`)) {
                          onDeleteMailbox(mailbox.id);
                        }
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 transition-colors"
                      title="Delete Mailbox"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mailbox Details Modal (IMAP & App Passwords) */}
      {selectedMailboxDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Connection & App Credentials</h3>
                <p className="text-xs text-slate-400">{selectedMailboxDetails.email}</p>
              </div>
              <button
                onClick={() => setSelectedMailboxDetails(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Credentials Summary */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-white font-semibold">{selectedMailboxDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono text-indigo-300 font-semibold">{selectedMailboxDetails.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Organization:</span>
                <span className="text-slate-200">{selectedMailboxDetails.companyName}</span>
              </div>
            </div>

            {/* IMAP/SMTP Standard Settings for Outlook & Mobile */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-300 mb-2">
                Outlook & Desktop Client Configuration
              </h4>
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-1 font-mono text-slate-300">
                <p><span className="text-slate-500">IMAP Host:</span> mail.ahtimail.net (Port 993 SSL/TLS)</p>
                <p><span className="text-slate-500">SMTP Host:</span> smtp.ahtimail.net (Port 587 STARTTLS)</p>
                <p><span className="text-slate-500">Username:</span> {selectedMailboxDetails.email}</p>
              </div>
            </div>

            {/* App Passwords */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-300 mb-2">
                Connected App Passwords (Slack / Teams / Zoom)
              </h4>
              <div className="space-y-2">
                {selectedMailboxDetails.appPasswords.length === 0 ? (
                  <p className="text-xs text-slate-500">No specific app passwords generated yet.</p>
                ) : (
                  selectedMailboxDetails.appPasswords.map((ap) => (
                    <div
                      key={ap.id}
                      className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200 uppercase text-[11px] font-mono mr-2">
                          [{ap.service}]
                        </span>
                        <span className="text-slate-300">{ap.name}</span>
                        <div className="font-mono text-indigo-400 text-[11px] mt-0.5">{ap.code}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(ap.code, ap.id)}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="Copy App Token"
                      >
                        {copiedId === ap.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMailboxDetails(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
