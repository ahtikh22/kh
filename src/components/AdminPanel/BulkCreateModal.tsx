import React, { useState } from 'react';
import { FileSpreadsheet, Check, Sparkles, AlertCircle, Copy } from 'lucide-react';
import { Company, Mailbox } from '../../types';

interface BulkCreateModalProps {
  companies: Company[];
  isOpen: boolean;
  onClose: () => void;
  onBulkCreate: (companyId: string, usernames: string[], domain: string, defaultPass?: string) => Mailbox[];
}

export const BulkCreateModal: React.FC<BulkCreateModalProps> = ({
  companies,
  isOpen,
  onClose,
  onBulkCreate,
}) => {
  if (!isOpen) return null;

  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies.length > 0 ? companies[0].id : ''
  );
  const [usernamesText, setUsernamesText] = useState('john, sarah, david, finance, support');
  const [defaultPassword, setDefaultPassword] = useState('AhtiCorp#2026');
  const [generatedResults, setGeneratedResults] = useState<Mailbox[] | null>(null);
  const [error, setError] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const activeDomain = selectedCompany ? selectedCompany.domain : 'companymail.net';

  const handleRunBulk = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rawNames = usernamesText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawNames.length === 0) {
      setError('Please enter at least one username.');
      return;
    }

    try {
      const results = onBulkCreate(selectedCompanyId, rawNames, activeDomain, defaultPassword);
      setGeneratedResults(results);
    } catch (err: any) {
      setError(err?.message || 'Error creating bulk accounts.');
    }
  };

  const handleCopyAllCredentials = () => {
    if (!generatedResults) return;
    const text = generatedResults
      .map((m) => `Email: ${m.email} | Pass: ${m.password} | Name: ${m.displayName}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Bulk Account Generator</h2>
              <p className="text-xs text-slate-400">Generate multiple employee IDs & passwords at once</p>
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

        {!generatedResults ? (
          <form onSubmit={handleRunBulk} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Workspace:</label>
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
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Enter Usernames (separated by commas or new lines):
              </label>
              <textarea
                rows={5}
                value={usernamesText}
                onChange={(e) => setUsernamesText(e.target.value)}
                placeholder="john, sarah, mark, support, info, developer1"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Har username ke sath domain <strong className="text-indigo-400">@{activeDomain}</strong> attach hogi.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Default Password for Batch:</label>
              <input
                type="text"
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Employees can change this password upon first login in Webmail.
              </p>
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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                Generate Accounts
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 flex items-center justify-between">
              <div>
                <p className="font-semibold">Successfully Generated {generatedResults.length} Accounts!</p>
                <p className="text-[11px] text-emerald-400/80">Ready to use for Slack, Outlook, Zoom, Teams.</p>
              </div>
              <button
                onClick={handleCopyAllCredentials}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium text-xs shadow-sm"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800">
              {generatedResults.map((box) => (
                <div key={box.id} className="p-2.5 bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white font-mono">{box.email}</div>
                    <div className="text-[11px] text-slate-400">{box.displayName}</div>
                  </div>
                  <div className="font-mono text-indigo-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {box.password}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setGeneratedResults(null);
                  onClose();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
