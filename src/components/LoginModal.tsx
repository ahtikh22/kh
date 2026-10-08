import React, { useState } from 'react';
import { Shield, KeyRound, Building2, Mail, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../services/storage';
import { Company, Mailbox } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAdminLoginSuccess: () => void;
  onCompanyLoginSuccess: (companyId: string) => void;
  onMailboxLoginSuccess: (email: string) => void;
  companies: Company[];
  mailboxes: Mailbox[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  onCompanyLoginSuccess,
  onMailboxLoginSuccess,
  companies,
  mailboxes,
}) => {
  if (!isOpen) return null;

  const [loginType, setLoginType] = useState<'admin' | 'company' | 'mailbox'>('admin');

  // Admin form
  const [adminEmail, setAdminEmail] = useState(ADMIN_CREDENTIALS.email);
  const [adminPassword, setAdminPassword] = useState(ADMIN_CREDENTIALS.password);

  // Company form
  const [companyKey, setCompanyKey] = useState(companies.length > 0 ? companies[0].accessKey : '');

  // Mailbox form
  const [mailboxEmail, setMailboxEmail] = useState(mailboxes.length > 0 ? mailboxes[0].email : '');
  const [mailboxPassword, setMailboxPassword] = useState(
    mailboxes.length > 0 ? mailboxes[0].password : ''
  );

  const [error, setError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const isEmailValid =
      trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase() ||
      trimmedEmail === ADMIN_CREDENTIALS.alternateEmail.toLowerCase();

    if (isEmailValid && adminPassword.trim() === ADMIN_CREDENTIALS.password) {
      onAdminLoginSuccess();
    } else {
      setError(
        `Invalid credentials. Use admin email "${ADMIN_CREDENTIALS.email}" and password "${ADMIN_CREDENTIALS.password}".`
      );
    }
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = companies.find(
      (c) => c.accessKey.trim().toLowerCase() === companyKey.trim().toLowerCase()
    );

    if (matched) {
      onCompanyLoginSuccess(matched.id);
    } else {
      setError('Invalid Company Access Key. Please check the key provided by the Administrator.');
    }
  };

  const handleMailboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = mailboxes.find(
      (m) =>
        m.email.toLowerCase() === mailboxEmail.trim().toLowerCase() &&
        m.password === mailboxPassword.trim()
    );

    if (matched) {
      onMailboxLoginSuccess(matched.email);
    } else {
      setError('Invalid corporate email or password. Please verify your credentials.');
    }
  };

  const handleAutoFillAdmin = () => {
    setAdminEmail(ADMIN_CREDENTIALS.email);
    setAdminPassword(ADMIN_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">AhtiMail Enterprise Portal</h2>
          <p className="text-xs text-slate-400">
            Control Panel Login · Company Access · Webmail Client
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
            className={`py-1.5 px-2 rounded-md transition-all ${
              loginType === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Panel
          </button>
          <button
            onClick={() => {
              setLoginType('company');
              setError('');
            }}
            className={`py-1.5 px-2 rounded-md transition-all ${
              loginType === 'company'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Company Key
          </button>
          <button
            onClick={() => {
              setLoginType('mailbox');
              setError('');
            }}
            className={`py-1.5 px-2 rounded-md transition-all ${
              loginType === 'mailbox'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Webmail Login
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Superadmin Login */}
        {loginType === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-3.5 text-xs">
            <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-2.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-indigo-300 text-[11px]">Default Admin Credentials</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {ADMIN_CREDENTIALS.email} · Pass: {ADMIN_CREDENTIALS.password}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoFillAdmin}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold transition-colors"
              >
                Auto-fill
              </button>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Admin Email Address:</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                placeholder="ahtio01@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Admin Password:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                placeholder="ahti@001"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs shadow-md transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Login to Admin Control Panel</span>
            </button>
          </form>
        )}

        {/* Tab 2: Company Key Portal Login */}
        {loginType === 'company' && (
          <form onSubmit={handleCompanySubmit} className="space-y-3.5 text-xs">
            <p className="text-slate-400 text-xs">
              Kisi company ke manager ko diya gaya <strong>Client Access Key</strong> enter karein taake unka workspace open ho:
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Access Key:</label>
              <input
                type="text"
                value={companyKey}
                onChange={(e) => setCompanyKey(e.target.value)}
                required
                placeholder="e.g. APEX-8821-X9"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Demo Company Keys */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-500 block">Or pick a demo company:</span>
              <div className="flex flex-wrap gap-1.5">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCompanyKey(c.accessKey)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono border border-slate-700"
                  >
                    {c.name} ({c.accessKey})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs shadow-md transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Access Company Workspace</span>
            </button>
          </form>
        )}

        {/* Tab 3: Webmail Login */}
        {loginType === 'mailbox' && (
          <form onSubmit={handleMailboxSubmit} className="space-y-3.5 text-xs">
            <p className="text-slate-400 text-xs">
              Employee corporate email aur password se Webmail inbox ma sign in karein:
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Email:</label>
              <input
                type="email"
                value={mailboxEmail}
                onChange={(e) => setMailboxEmail(e.target.value)}
                required
                placeholder="alex@apexcorp.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mailbox Password:</label>
              <input
                type="password"
                value={mailboxPassword}
                onChange={(e) => setMailboxPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs shadow-md transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Open Employee Webmail</span>
            </button>
          </form>
        )}

        {/* Close Button if opened as modal */}
        {onClose && (
          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-xs font-medium"
            >
              Continue without signing out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
