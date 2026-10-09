import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Building2,
  Mail,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lock,
  UserPlus,
  LogIn,
  Layers,
} from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../services/storage';
import { Company, Mailbox, ServiceType } from '../types';

interface FullPageAuthProps {
  companies: Company[];
  mailboxes: Mailbox[];
  onAdminLogin: () => void;
  onCompanyLogin: (companyId: string) => void;
  onMailboxLogin: (email: string) => void;
  onSignUp: (data: {
    fullName: string;
    username: string;
    companyName: string;
    domain: string;
    password: string;
    services: ServiceType[];
  }) => void;
}

export const FullPageAuth: React.FC<FullPageAuthProps> = ({
  companies,
  mailboxes,
  onAdminLogin,
  onCompanyLogin,
  onMailboxLogin,
  onSignUp,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginRole, setLoginRole] = useState<'admin' | 'company' | 'mailbox'>('admin');

  // Admin login inputs
  const [adminEmail, setAdminEmail] = useState(ADMIN_CREDENTIALS.email);
  const [adminPassword, setAdminPassword] = useState(ADMIN_CREDENTIALS.password);

  // Company login inputs
  const defaultCompanyKey = companies.length > 0 ? companies[0].accessKey : 'AXXON-7719-B2';
  const [companyKey, setCompanyKey] = useState(defaultCompanyKey);

  // Mailbox login inputs
  const defaultMailbox = mailboxes.length > 0 ? mailboxes[0] : null;
  const [mailboxEmail, setMailboxEmail] = useState(
    defaultMailbox ? defaultMailbox.email : 'ahtisham12@axxonbpo.com'
  );
  const [mailboxPassword, setMailboxPassword] = useState(
    defaultMailbox ? defaultMailbox.password : 'ahti@001'
  );

  // Sign up inputs
  const [signupFullName, setSignupFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupDomain, setSignupDomain] = useState('');
  const [signupPassword, setSignupPassword] = useState('Pass#2026');
  const [signupServices, setSignupServices] = useState<ServiceType[]>([
    'slack',
    'outlook',
    'zoom',
    'teams',
  ]);

  const [error, setError] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    const isValidEmail =
      cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() ||
      cleanEmail === ADMIN_CREDENTIALS.alternateEmail.toLowerCase();

    if (isValidEmail && adminPassword.trim() === ADMIN_CREDENTIALS.password) {
      onAdminLogin();
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
      onCompanyLogin(matched.id);
    } else {
      setError('Invalid Company Access Key. Please check the access key provided by the Admin.');
    }
  };

  const handleMailboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = mailboxEmail.trim().toLowerCase();
    const matched = mailboxes.find(
      (m) => m.email.toLowerCase() === cleanEmail && m.password === mailboxPassword.trim()
    );

    if (matched) {
      onMailboxLogin(matched.email);
    } else {
      setError('Invalid email or password. Please verify your corporate account credentials.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupUsername.trim() || !signupDomain.trim()) {
      setError('Username and domain are required.');
      return;
    }

    try {
      onSignUp({
        fullName: signupFullName.trim() || signupUsername.trim(),
        username: signupUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''),
        companyName: signupCompanyName.trim() || `${signupDomain} Org`,
        domain: signupDomain.trim().toLowerCase().replace(/^@/, ''),
        password: signupPassword.trim(),
        services: signupServices,
      });
    } catch (err: any) {
      setError(err?.message || 'Error creating account.');
    }
  };

  const toggleService = (s: ServiceType) => {
    if (signupServices.includes(s)) {
      setSignupServices(signupServices.filter((x) => x !== s));
    } else {
      setSignupServices([...signupServices, s]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">AhtiMail</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  Enterprise Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Webmail · Identity Provisioning · Slack · Outlook · Zoom · Teams
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Secure Enterprise Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />

          {/* Heading */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {authMode === 'signin' ? 'Sign In to Your Account' : 'Register New Workspace'}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === 'signin'
                ? 'Pehle sign in karein. Uske baad aap Control Panel ya Webmail use kar sakenge.'
                : 'Apni company ya organization ke liye naya workspace create karein.'}
            </p>
          </div>

          {/* Sign In vs Sign Up Toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
            <button
              onClick={() => {
                setAuthMode('signin');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (Login)</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up (Naya Account)</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AUTH MODE 1: SIGN IN */}
          {authMode === 'signin' && (
            <div className="space-y-4">
              {/* Role Selectors */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('admin');
                    setError('');
                  }}
                  className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    loginRole === 'admin'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('company');
                    setError('');
                  }}
                  className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    loginRole === 'company'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Company</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('mailbox');
                    setError('');
                  }}
                  className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    loginRole === 'mailbox'
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Webmail</span>
                </button>
              </div>

              {/* TAB 1: ADMIN LOGIN */}
              {loginRole === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                  {/* Master Credentials Highlight Box */}
                  <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                        Superadmin Login Credentials
                      </span>
                      <div className="font-mono text-slate-300 text-[11px] mt-0.5">
                        <span className="text-slate-400">Email:</span> {ADMIN_CREDENTIALS.email}
                      </div>
                      <div className="font-mono text-slate-300 text-[11px]">
                        <span className="text-slate-400">Password:</span> {ADMIN_CREDENTIALS.password}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail(ADMIN_CREDENTIALS.email);
                        setAdminPassword(ADMIN_CREDENTIALS.password);
                        onAdminLogin();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow-md transition-colors whitespace-nowrap flex items-center gap-1.5 justify-center"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1-Click Admin Login</span>
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Enter Admin Control Panel</span>
                  </button>
                </form>
              )}

              {/* TAB 2: COMPANY PORTAL LOGIN */}
              {loginRole === 'company' && (
                <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
                  <div className="text-slate-400 text-xs">
                    Admin ki taraf se diya gaya <strong>Company Access Key</strong> enter karein taake company ka portal khulay:
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company Access Key:</label>
                    <input
                      type="text"
                      value={companyKey}
                      onChange={(e) => setCompanyKey(e.target.value)}
                      required
                      placeholder="e.g. AXXON-7719-B2 or APEX-8821-X9"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Quick Pick Company Keys */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 block">Click demo key to auto-login:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {companies.slice(0, 3).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCompanyKey(c.accessKey);
                            onCompanyLogin(c.id);
                          }}
                          className="text-[11px] bg-slate-950 hover:bg-slate-800 text-sky-300 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono transition-colors"
                        >
                          {c.name} ({c.accessKey})
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open Company Workspace</span>
                  </button>
                </form>
              )}

              {/* TAB 3: EMPLOYEE WEBMAIL LOGIN */}
              {loginRole === 'mailbox' && (
                <form onSubmit={handleMailboxSubmit} className="space-y-4 text-xs">
                  <div className="text-slate-400 text-xs">
                    Apna corporate email aur password daal kar Webmail inbox mein login karein:
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Corporate Email Address:</label>
                    <input
                      type="email"
                      value={mailboxEmail}
                      onChange={(e) => setMailboxEmail(e.target.value)}
                      required
                      placeholder="ahtisham12@axxonbpo.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mailbox Password:</label>
                    <input
                      type="password"
                      value={mailboxPassword}
                      onChange={(e) => setMailboxPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Quick Pick Mailboxes */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 block">Quick Pick Accounts:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {mailboxes.slice(0, 3).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setMailboxEmail(m.email);
                            setMailboxPassword(m.password);
                            onMailboxLogin(m.email);
                          }}
                          className="text-[11px] bg-slate-950 hover:bg-slate-800 text-purple-300 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono transition-colors"
                        >
                          {m.email}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open Webmail Inbox</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* AUTH MODE 2: SIGN UP (NEW ACCOUNT) */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name:</label>
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                    placeholder="e.g. Ahtisham Khan"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization:</label>
                  <input
                    type="text"
                    value={signupCompanyName}
                    onChange={(e) => setSignupCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Axxon BPO"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Username Prefix:</label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                    placeholder="e.g. ahtisham12 or contact"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain Name:</label>
                  <input
                    type="text"
                    value={signupDomain}
                    onChange={(e) => setSignupDomain(e.target.value)}
                    required
                    placeholder="axxonbpo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Password:</label>
                <input
                  type="text"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  placeholder="Set your password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Enable Messaging Services:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['slack', 'outlook', 'zoom', 'teams'] as ServiceType[]).map((service) => {
                    const isSelected = signupServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`p-2 rounded-lg border text-xs font-medium uppercase font-mono flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{service}</span>
                        {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Workspace & Sign In</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-3 text-center text-xs text-slate-500">
        AhtiMail Control Panel & Webmail Suite · Admin Email: <code>{ADMIN_CREDENTIALS.email}</code>
      </footer>
    </div>
  );
};
