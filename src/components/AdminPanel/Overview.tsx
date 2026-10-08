import React, { useState } from 'react';
import {
  Users,
  Building2,
  Mail,
  HardDrive,
  Copy,
  Check,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { Mailbox, Company, EmailMessage, ActivityLog } from '../../types';
import { ADMIN_CREDENTIALS } from '../../services/storage';

interface OverviewProps {
  mailboxes: Mailbox[];
  companies: Company[];
  emails: EmailMessage[];
  logs: ActivityLog[];
  onOpenCreateMailbox: () => void;
  onOpenBulkCreate: () => void;
  onOpenCreateCompany: () => void;
  onOpenSimulator: () => void;
  onOpenWebmail: (email: string) => void;
  onSelectCompany: (companyId: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  mailboxes,
  companies,
  emails,
  logs,
  onOpenCreateMailbox,
  onOpenBulkCreate,
  onOpenCreateCompany,
  onOpenSimulator,
  onOpenWebmail,
  onSelectCompany,
}) => {
  const [copiedPass, setCopiedPass] = useState<string | null>(null);
  const [copiedAdmin, setCopiedAdmin] = useState(false);

  const totalUsedMb = mailboxes.reduce((acc, m) => acc + (m.usedMb || 0), 0);
  const totalQuotaMb = mailboxes.reduce((acc, m) => acc + (m.quotaMb || 5000), 0);
  const activeCount = mailboxes.filter((m) => m.status === 'active').length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPass(id);
    setTimeout(() => setCopiedPass(null), 2000);
  };

  const handleCopyAdmin = () => {
    navigator.clipboard.writeText(`Email: ${ADMIN_CREDENTIALS.email}\nPassword: ${ADMIN_CREDENTIALS.password}`);
    setCopiedAdmin(true);
    setTimeout(() => setCopiedAdmin(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Admin Credentials Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white tracking-tight">
                Ahti Administrator Control Panel
              </h1>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Yahan se aap kisi bhi company ke liye custom corporate emails create kar sakte hain, passwords manage kar sakte hain, aur Slack, Outlook, Zoom, Teams ke sath connect kar sakte hain.
            </p>
          </div>

          {/* Admin Credentials Quick Card */}
          <div className="bg-slate-950/80 border border-indigo-900/50 rounded-lg p-3 text-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 block mb-0.5">
                Admin Master Login
              </span>
              <div className="font-mono text-slate-300">
                <span className="text-slate-400">User:</span> {ADMIN_CREDENTIALS.email}
              </div>
              <div className="font-mono text-slate-300">
                <span className="text-slate-400">Pass:</span> {ADMIN_CREDENTIALS.password}
              </div>
            </div>
            <button
              onClick={handleCopyAdmin}
              className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded border border-indigo-500/30 transition-colors flex items-center gap-1"
              title="Copy admin credentials"
            >
              {copiedAdmin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="text-[11px] font-medium hidden sm:inline">
                {copiedAdmin ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Mailboxes</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mailboxes.length}</div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-medium">{activeCount} Active</span>
            <span aria-hidden="true">·</span>
            <span>{mailboxes.length - activeCount} Suspended</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Partner Companies</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{companies.length}</div>
          <div className="mt-1 text-xs text-slate-400 flex items-center gap-2">
            <span>Configured Domains: {companies.map((c) => '@' + c.domain).slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Messages & OTPs</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{emails.length}</div>
          <div className="mt-1 text-xs text-slate-400">
            Slack, Outlook, Zoom & Teams notifications
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Storage Allocated</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{(totalUsedMb / 1024).toFixed(1)} GB</div>
          <div className="mt-1 text-xs text-slate-400">
            of {(totalQuotaMb / 1024).toFixed(0)} GB total provisioned
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={onOpenCreateMailbox}
            className="flex items-center gap-3 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-left shadow-sm"
          >
            <div className="p-2 bg-indigo-700/60 rounded-md">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-xs leading-tight">Create Single Mailbox</p>
              <p className="text-[11px] text-indigo-200 mt-0.5">New email & password</p>
            </div>
          </button>

          <button
            onClick={onOpenBulkCreate}
            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-slate-700/60 rounded-md text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-xs leading-tight">Bulk Accounts Generator</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Generate 10+ IDs at once</p>
            </div>
          </button>

          <button
            onClick={onOpenCreateCompany}
            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-slate-700/60 rounded-md text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-xs leading-tight">Add Company / Client</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Create client workspace</p>
            </div>
          </button>

          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors text-left"
          >
            <div className="p-2 bg-slate-700/60 rounded-md text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-xs leading-tight">Test OTP & Verifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Slack, Teams, Zoom OTP</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Mailboxes & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Mailboxes (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Provisioned Accounts & Mailboxes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct access to created mailboxes, passwords, and webmails
              </p>
            </div>
            <button
              onClick={onOpenCreateMailbox}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Mailbox</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 pl-1">Email / User</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Password</th>
                  <th className="pb-3">Apps Enabled</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {mailboxes.slice(0, 6).map((mailbox) => (
                  <tr key={mailbox.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pl-1">
                      <div className="font-semibold text-white">{mailbox.email}</div>
                      <div className="text-[11px] text-slate-400">{mailbox.displayName}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-300">{mailbox.companyName}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {mailbox.password}
                        </span>
                        <button
                          onClick={() => handleCopy(mailbox.password, mailbox.id)}
                          className="text-slate-500 hover:text-slate-300 p-1"
                          title="Copy Password"
                        >
                          {copiedPass === mailbox.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        {mailbox.allowedServices.map((s) => (
                          <span
                            key={s}
                            className="bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono text-slate-300 border border-slate-700/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right pr-1">
                      <button
                        onClick={() => onOpenWebmail(mailbox.email)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-800/60 rounded transition-colors"
                      >
                        <span>Open Webmail</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Workspaces & Quick Sharing (1 col) */}
        <div className="space-y-6">
          {/* Company Sharing Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Client Companies</h3>
              </div>
              <button
                onClick={onOpenCreateCompany}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                + Add Company
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Kisi company ko unka access key dein taake wo apni IDs khud generate aur manage kar sakein:
            </p>

            <div className="space-y-2.5">
              {companies.map((comp) => {
                const count = mailboxes.filter((m) => m.companyId === comp.id).length;
                return (
                  <div
                    key={comp.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">{comp.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">@{comp.domain} · {count}/{comp.maxAccounts} IDs</p>
                      <p className="text-[11px] text-indigo-400 font-mono mt-0.5">Key: {comp.accessKey}</p>
                    </div>
                    <button
                      onClick={() => onSelectCompany(comp.id)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-medium transition-colors"
                    >
                      Open Portal
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Recent System Events</h3>
            <div className="space-y-3 text-xs">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="border-l-2 border-indigo-500/50 pl-2.5 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
