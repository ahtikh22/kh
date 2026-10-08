import React, { useState } from 'react';
import { Send, X, Paperclip, AlertCircle } from 'lucide-react';
import { Mailbox } from '../../types';

interface ComposeModalProps {
  currentMailbox: Mailbox;
  availableMailboxes: Mailbox[];
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    subject: string;
    bodyHtml: string;
  }) => void;
  initialTo?: string;
  initialSubject?: string;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  currentMailbox,
  availableMailboxes,
  isOpen,
  onClose,
  onSend,
  initialTo = '',
  initialSubject = '',
}) => {
  if (!isOpen) return null;

  const [toEmail, setToEmail] = useState(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!toEmail.trim() || !toEmail.includes('@')) {
      setError('Please provide a valid recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter an email subject.');
      return;
    }

    const formattedBodyHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <p>${body.replace(/\n/g, '<br/>')}</p>
        <br/>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          Sent from <strong>${currentMailbox.displayName}</strong> (${currentMailbox.email}) via AhtiMail Enterprise Webmail.
        </p>
      </div>
    `;

    onSend({
      fromEmail: currentMailbox.email,
      fromName: currentMailbox.displayName,
      toEmail: toEmail.trim().toLowerCase(),
      subject: subject.trim(),
      bodyHtml: formattedBodyHtml,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white">Compose Message</h2>
            <p className="text-xs text-slate-400">
              Sending from <span className="text-indigo-400 font-mono">{currentMailbox.email}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">To (Recipient):</label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. colleague@company.com or external address"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            {/* Quick Pick recipient from available mailboxes */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500">Quick Recipient:</span>
              {availableMailboxes
                .filter((m) => m.email !== currentMailbox.email)
                .slice(0, 3)
                .map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setToEmail(m.email)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                  >
                    {m.email}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Subject:</label>
            <input
              type="text"
              placeholder="e.g. Project Update / Slack Integration / Meeting Notes"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Message Body:</label>
            <textarea
              rows={7}
              placeholder="Write your email message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">HTML formatting enabled automatically</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
