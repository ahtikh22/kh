import React, { useState } from 'react';
import { Mail, KeyRound, Sparkles, Building2, Check, AlertCircle } from 'lucide-react';
import { Company, ServiceType } from '../../types';

interface CreateMailboxModalProps {
  companies: Company[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    domain: string;
    password: string;
    displayName: string;
    companyId?: string;
    allowedServices: ServiceType[];
    quotaMb: number;
    notes?: string;
  }) => void;
}

export const CreateMailboxModal: React.FC<CreateMailboxModalProps> = ({
  companies,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies.length > 0 ? companies[0].id : ''
  );
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState(`AhtiPass#${Math.floor(1000 + Math.random() * 9000)}`);
  const [displayName, setDisplayName] = useState('');
  const [quotaMb, setQuotaMb] = useState(5000);
  const [allowedServices, setAllowedServices] = useState<ServiceType[]>([
    'slack',
    'outlook',
    'zoom',
    'teams',
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const activeDomain = selectedCompany ? selectedCompany.domain : customDomain || 'companymail.net';

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let res = 'Ahti@';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const toggleService = (s: ServiceType) => {
    if (allowedServices.includes(s)) {
      setAllowedServices(allowedServices.filter((x) => x !== s));
    } else {
      setAllowedServices([...allowedServices, s]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    if (!cleanUser) {
      setError('Please provide a valid username.');
      return;
    }
    if (!password.trim()) {
      setError('Please provide a password.');
      return;
    }

    try {
      onSubmit({
        username: cleanUser,
        domain: activeDomain,
        password: password.trim(),
        displayName: displayName.trim() || cleanUser,
        companyId: selectedCompanyId || undefined,
        allowedServices,
        quotaMb,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create mailbox.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-white">Create New Corporate Mailbox</h2>
              <p className="text-xs text-slate-400">Generate email & password for business identity</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Company Workspace Assignment */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Organization:</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} (@{comp.domain})
                </option>
              ))}
              <option value="">Independent Custom Domain</option>
            </select>
          </div>

          {!selectedCompanyId && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Custom Domain Name:</label>
              <input
                type="text"
                placeholder="e.g. acme.com or slackteam.io"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Email Address Prefix */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Username / Email Prefix:</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="e.g. alex or sarah.khan or sales"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 bg-slate-950 border border-slate-700 rounded-l-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2 rounded-r-lg text-slate-300 font-mono">
                @{activeDomain}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Final Email:{' '}
              <strong className="text-indigo-400 font-mono">
                {username ? username.toLowerCase() : 'username'}@{activeDomain}
              </strong>
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Employee / Full Name:</label>
            <input
              type="text"
              placeholder="e.g. Alex Rivers or HR Operations"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password Input + Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Account Password:</label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-generate Password</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Employee will use this password to sign into Webmail, Slack, Outlook, Zoom, and Teams.
            </p>
          </div>

          {/* Allowed Messaging Apps */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Enabled Messaging Apps & Integrations:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['slack', 'outlook', 'zoom', 'teams'] as ServiceType[]).map((service) => {
                const isSelected = allowedServices.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-2.5 rounded-lg border text-xs font-medium uppercase font-mono flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{service}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quota */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Storage Quota:</label>
            <select
              value={quotaMb}
              onChange={(e) => setQuotaMb(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1000}>1,000 MB (1 GB Starter)</option>
              <option value={5000}>5,000 MB (5 GB Standard Business)</option>
              <option value={10000}>10,000 MB (10 GB Professional)</option>
              <option value={25000}>25,000 MB (25 GB Executive)</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
