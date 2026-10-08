import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Share2,
  Key,
  Copy,
  Check,
  ExternalLink,
  Users,
  ShieldCheck,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { Company, Mailbox } from '../../types';

interface CompanyManagerProps {
  companies: Company[];
  mailboxes: Mailbox[];
  onOpenCreateCompany: () => void;
  onSelectCompany: (companyId: string) => void;
}

export const CompanyManager: React.FC<CompanyManagerProps> = ({
  companies,
  mailboxes,
  onOpenCreateCompany,
  onSelectCompany,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharingCompany, setSharingCompany] = useState<Company | null>(null);
  const [copiedShareText, setCopiedShareText] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCompanyMailboxCount = (companyId: string) => {
    return mailboxes.filter((m) => m.companyId === companyId).length;
  };

  const generateShareMessage = (company: Company) => {
    return `Assalam-o-Alaikum / Hello ${company.name} Team,

Aapka AhtiMail Enterprise Workspace ready ho gaya hai. Aap is portal se apni team ke emails create kar sakte hain aur Slack, Outlook, Zoom, aur Microsoft Teams ke sath use kar sakte hain.

Portal Login Details:
🏢 Company Name: ${company.name}
🌐 Domain: @${company.domain}
🔑 Client Access Key: ${company.accessKey}
👥 Allowed Mailboxes: ${company.maxAccounts} Accounts
💬 Messaging Apps: ${company.allowedServices.join(', ').toUpperCase()}

Aap portal open kar ke direct access key enter karein aur employee IDs generate karein. Har ID ka webmail inbox verification codes aur OTP receive karega.`;
  };

  const handleCopyShareKit = (company: Company) => {
    const text = generateShareMessage(company);
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Company & Client Workspaces</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Kisi bhi company ko unka dedicated workspace dain. Wo apna Access Key use kar ke apne employees ki emails bana saktay hain aur Slack, Outlook, Zoom, Teams ke sath configure kar saktay hain.
          </p>
        </div>

        <button
          onClick={onOpenCreateCompany}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Company</span>
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company) => {
          const accountCount = getCompanyMailboxCount(company.id);
          const percentUsed = Math.min(100, Math.round((accountCount / company.maxAccounts) * 100));

          return (
            <div
              key={company.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{company.name}</h3>
                      <p className="text-[11px] text-indigo-400 font-mono">@{company.domain}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                    {company.status}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {/* Account Quota Progress */}
                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                      <span>Accounts Usage</span>
                      <span className="text-slate-200 font-semibold">
                        {accountCount} / {company.maxAccounts} IDs
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                  </div>

                  {/* Access Key Display */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-between">
                      <span>Client Access Key</span>
                      <span className="text-slate-400">Share with client</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-indigo-300 font-mono text-xs font-semibold">
                        {company.accessKey}
                      </code>
                      <button
                        onClick={() => handleCopy(company.accessKey, company.id)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Copy Key"
                      >
                        {copiedKey === company.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Messaging Apps Enabled */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 block mb-1">Allowed Apps:</span>
                    <div className="flex flex-wrap gap-1">
                      {company.allowedServices.map((service) => (
                        <span
                          key={service}
                          className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectCompany(company.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Client Portal</span>
                </button>

                <button
                  onClick={() => setSharingCompany(company)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors"
                  title="Share Company Access Kit"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Company Handover Kit Modal */}
      {sharingCompany && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Client Handover Kit</h3>
                <p className="text-xs text-slate-400">{sharingCompany.name} (@{sharingCompany.domain})</p>
              </div>
              <button
                onClick={() => setSharingCompany(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Yeh text message ya email copy kar ke company ke owner/HR ko send karein. Wo is key ke zariye portal open kar ke apni IDs bana sakeinge:
            </p>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {generateShareMessage(sharingCompany)}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSharingCompany(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Close
              </button>
              <button
                onClick={() => handleCopyShareKit(sharingCompany)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
              >
                {copiedShareText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedShareText ? 'Copied Kit' : 'Copy Handover Kit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
