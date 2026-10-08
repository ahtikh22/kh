import React, { useState } from 'react';
import { Building2, Check, AlertCircle } from 'lucide-react';
import { ServiceType } from '../../types';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    domain: string;
    contactEmail: string;
    maxAccounts: number;
    allowedServices: ServiceType[];
  }) => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [maxAccounts, setMaxAccounts] = useState(25);
  const [allowedServices, setAllowedServices] = useState<ServiceType[]>([
    'slack',
    'outlook',
    'zoom',
    'teams',
  ]);
  const [error, setError] = useState('');

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

    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }
    const cleanDomain = domain.toLowerCase().trim().replace(/^@/, '');
    if (!cleanDomain || !cleanDomain.includes('.')) {
      setError('Please provide a valid domain name (e.g. acme.com).');
      return;
    }

    try {
      onSubmit({
        name: name.trim(),
        domain: cleanDomain,
        contactEmail: contactEmail.trim() || `admin@${cleanDomain}`,
        maxAccounts,
        allowedServices,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create company.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">Add New Company Workspace</h2>
              <p className="text-xs text-slate-400">Allocate domain & client portal key for a business</p>
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
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company / Organization Name:</label>
            <input
              type="text"
              placeholder="e.g. Apex Global Corp or Horizon Tech"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Assigned Domain Name:</label>
            <div className="flex items-center">
              <span className="bg-slate-800 border border-r-0 border-slate-700 px-3 py-2 rounded-l-lg text-slate-400 font-mono">
                @
              </span>
              <input
                type="text"
                placeholder="apexcorp.com or teamhq.io"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-r-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contact Email / Admin:</label>
            <input
              type="email"
              placeholder="hr@company.com or contact@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Maximum Mailbox Accounts:</label>
            <input
              type="number"
              min={1}
              max={500}
              value={maxAccounts}
              onChange={(e) => setMaxAccounts(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Allowed Messaging Services for this Company:
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
                        ? 'bg-sky-600/20 border-sky-500 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{service}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>

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
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              Provision Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
