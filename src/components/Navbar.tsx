import React from 'react';
import { Mail, Shield, Building2, Inbox, KeyRound, LogOut, Sparkles } from 'lucide-react';
import { AppViewMode, Company, Mailbox } from '../types';

interface NavbarProps {
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  currentUser: { email: string; role: 'admin' | 'company' | 'mailbox'; name: string };
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  mailboxes: Mailbox[];
  activeMailboxEmail: string;
  onSelectMailbox: (email: string) => void;
  onOpenSimulator: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  currentUser,
  companies,
  selectedCompanyId,
  onSelectCompany,
  mailboxes,
  activeMailboxEmail,
  onSelectMailbox,
  onOpenSimulator,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">AhtiMail</span>
                <span className="text-xs text-indigo-400 font-medium px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
                  Control Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Webmail & Organization Identity Suite (Slack · Outlook · Zoom · Teams)
              </p>
            </div>
          </div>

          {/* Central Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800/80">
            <button
              onClick={() => onSelectMode('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Panel</span>
            </button>

            <button
              onClick={() => onSelectMode('company_portal')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentMode === 'company_portal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Portal</span>
            </button>

            <button
              onClick={() => onSelectMode('webmail')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentMode === 'webmail'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Webmail Client</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick OTP Simulator Trigger */}
            <button
              onClick={onOpenSimulator}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/50 rounded-md transition-colors"
              title="Simulate Slack, Outlook, Zoom or Teams OTP message"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>OTP Simulator</span>
            </button>

            {/* Quick Context Switcher based on mode */}
            {currentMode === 'company_portal' && companies.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-500 hidden lg:inline">Company:</span>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => onSelectCompany(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (@{c.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentMode === 'webmail' && mailboxes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-500 hidden lg:inline">Mailbox:</span>
                <select
                  value={activeMailboxEmail}
                  onChange={(e) => onSelectMailbox(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 max-w-[180px] truncate"
                >
                  {mailboxes.map((m) => (
                    <option key={m.id} value={m.email}>
                      {m.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Active User Indicator */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-slate-200 leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {currentUser.email}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded transition-colors"
                title="Switch Account / Lock Panel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
