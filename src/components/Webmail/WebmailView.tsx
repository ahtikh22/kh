import React, { useState } from 'react';
import {
  Inbox,
  Send,
  Star,
  Trash2,
  Search,
  Plus,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Mailbox, EmailMessage, ServiceType } from '../../types';
import { ComposeModal } from './ComposeModal';

interface WebmailViewProps {
  currentMailbox: Mailbox;
  allMailboxes: Mailbox[];
  emails: EmailMessage[];
  onSelectMailbox: (email: string) => void;
  onSendEmail: (data: {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    subject: string;
    bodyHtml: string;
  }) => void;
  onSimulateServiceEmail: (toEmail: string, service: ServiceType) => void;
  onToggleStar: (emailId: string) => void;
  onMarkRead: (emailId: string, isRead: boolean) => void;
  onDeleteEmail: (emailId: string) => void;
}

type FolderType = 'inbox' | 'sent' | 'starred' | 'trash';

export const WebmailView: React.FC<WebmailViewProps> = ({
  currentMailbox,
  allMailboxes,
  emails,
  onSelectMailbox,
  onSendEmail,
  onSimulateServiceEmail,
  onToggleStar,
  onMarkRead,
  onDeleteEmail,
}) => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialTo, setComposeInitialTo] = useState('');
  const [composeInitialSubject, setComposeInitialSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);

  // Filter emails for this current mailbox
  const mailboxEmails = emails.filter((e) => {
    if (currentFolder === 'inbox') {
      return e.toEmail.toLowerCase() === currentMailbox.email.toLowerCase() && e.folder === 'inbox';
    }
    if (currentFolder === 'sent') {
      return e.fromEmail.toLowerCase() === currentMailbox.email.toLowerCase() && e.folder === 'sent';
    }
    if (currentFolder === 'starred') {
      return (
        (e.toEmail.toLowerCase() === currentMailbox.email.toLowerCase() ||
          e.fromEmail.toLowerCase() === currentMailbox.email.toLowerCase()) &&
        e.isStarred
      );
    }
    if (currentFolder === 'trash') {
      return (
        (e.toEmail.toLowerCase() === currentMailbox.email.toLowerCase() ||
          e.fromEmail.toLowerCase() === currentMailbox.email.toLowerCase()) &&
        e.folder === 'trash'
      );
    }
    return false;
  });

  const filteredEmails = mailboxEmails.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fromEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  const unreadCount = emails.filter(
    (e) =>
      e.toEmail.toLowerCase() === currentMailbox.email.toLowerCase() &&
      e.folder === 'inbox' &&
      !e.isRead
  ).length;

  const handleSelectEmail = (msg: EmailMessage) => {
    setSelectedEmailId(msg.id);
    if (!msg.isRead) {
      onMarkRead(msg.id, true);
    }
  };

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(code);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const handleReply = (email: EmailMessage) => {
    setComposeInitialTo(email.fromEmail);
    setComposeInitialSubject(`Re: ${email.subject}`);
    setIsComposeOpen(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[calc(100vh-140px)] min-h-[640px]">
      {/* Top Webmail Bar: Current Mailbox Switcher & Quick OTP Simulators */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Active Mailbox identity */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{currentMailbox.displayName}</span>
              <span className="text-[11px] font-mono text-indigo-400">&lt;{currentMailbox.email}&gt;</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentMailbox.companyName} · Quota: {currentMailbox.usedMb}MB / {currentMailbox.quotaMb}MB
            </p>
          </div>
        </div>

        {/* Center: Switch Mailbox Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs hidden sm:inline">Switch Mailbox:</span>
          <select
            value={currentMailbox.email}
            onChange={(e) => onSelectMailbox(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          >
            {allMailboxes.map((m) => (
              <option key={m.id} value={m.email}>
                {m.email} ({m.companyName})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Quick OTP Triggers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-amber-400/90 font-medium hidden md:inline">
            1-Click OTP Test:
          </span>
          <button
            onClick={() => onSimulateServiceEmail(currentMailbox.email, 'slack')}
            className="px-2 py-1 bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800/60 rounded text-[11px] font-mono transition-colors"
            title="Simulate receiving Slack confirmation email"
          >
            + Slack OTP
          </button>
          <button
            onClick={() => onSimulateServiceEmail(currentMailbox.email, 'outlook')}
            className="px-2 py-1 bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-800/60 rounded text-[11px] font-mono transition-colors"
            title="Simulate receiving Outlook 365 security code"
          >
            + Outlook OTP
          </button>
          <button
            onClick={() => onSimulateServiceEmail(currentMailbox.email, 'teams')}
            className="px-2 py-1 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 rounded text-[11px] font-mono transition-colors"
            title="Simulate receiving Microsoft Teams code"
          >
            + Teams OTP
          </button>
          <button
            onClick={() => onSimulateServiceEmail(currentMailbox.email, 'zoom')}
            className="px-2 py-1 bg-blue-950/70 hover:bg-blue-900 text-blue-300 border border-blue-800/60 rounded text-[11px] font-mono transition-colors"
            title="Simulate receiving Zoom activation"
          >
            + Zoom OTP
          </button>
        </div>
      </div>

      {/* Main Webmail Layout: Folders | Email List | Email Viewer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Folders */}
        <div className="w-48 bg-slate-950/70 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
          <div className="space-y-3">
            {/* Compose Button */}
            <button
              onClick={() => {
                setComposeInitialTo('');
                setComposeInitialSubject('');
                setIsComposeOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </button>

            {/* Folder List */}
            <nav className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setCurrentFolder('inbox');
                  setSelectedEmailId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  currentFolder === 'inbox'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inbox</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentFolder('starred');
                  setSelectedEmailId(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentFolder === 'starred'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Starred</span>
              </button>

              <button
                onClick={() => {
                  setCurrentFolder('sent');
                  setSelectedEmailId(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentFolder === 'sent'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sent</span>
              </button>

              <button
                onClick={() => {
                  setCurrentFolder('trash');
                  setSelectedEmailId(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentFolder === 'trash'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Trash</span>
              </button>
            </nav>
          </div>

          {/* Storage Quota widget */}
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Mailbox Storage</span>
              <span className="font-semibold text-slate-200">
                {Math.round((currentMailbox.usedMb / currentMailbox.quotaMb) * 100)}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((currentMailbox.usedMb / currentMailbox.quotaMb) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[10px] text-slate-500">
              {currentMailbox.usedMb}MB of {currentMailbox.quotaMb}MB
            </div>
          </div>
        </div>

        {/* Middle Column: Email List */}
        <div
          className={`${
            selectedEmail ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-96 flex-col border-r border-slate-800 bg-slate-900/40`}
        >
          {/* Search Box in Email List */}
          <div className="p-2.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <p className="font-medium text-slate-300">Folder is empty</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Use the "+ OTP" buttons above to simulate incoming Slack, Teams, or Outlook emails!
                </p>
              </div>
            ) : (
              filteredEmails.map((msg) => {
                const isSelected = selectedEmailId === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectEmail(msg)}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/60 border-l-2 border-indigo-500'
                        : msg.isRead
                        ? 'hover:bg-slate-800/40'
                        : 'bg-slate-800/20 hover:bg-slate-800/50 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`truncate max-w-[170px] ${!msg.isRead ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {currentFolder === 'sent' ? `To: ${msg.toEmail}` : msg.fromName}
                      </span>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.serviceBadge && msg.serviceBadge !== 'system' && (
                        <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {msg.serviceBadge}
                        </span>
                      )}
                      {msg.otpCode && (
                        <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                          OTP: {msg.otpCode}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs truncate ${!msg.isRead ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                      {msg.subject}
                    </p>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {msg.preview}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Email Viewer */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col p-6 space-y-4">
              {/* Back button on small screen */}
              <button
                onClick={() => setSelectedEmailId(null)}
                className="md:hidden flex items-center gap-1 text-xs text-indigo-400 font-medium mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to list</span>
              </button>

              {/* Email Header */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleStar(selectedEmail.id)}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                        selectedEmail.isStarred ? 'text-amber-400' : 'text-slate-400'
                      }`}
                      title="Star email"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteEmail(selectedEmail.id);
                        setSelectedEmailId(null);
                      }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete email"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {selectedEmail.fromName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {selectedEmail.fromName}{' '}
                        <span className="font-mono text-slate-400 text-[11px]">
                          &lt;{selectedEmail.fromEmail}&gt;
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        To: <span className="font-mono text-slate-300">{selectedEmail.toEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Prominent Verification OTP Callout if detected */}
              {selectedEmail.otpCode && (
                <div className="bg-amber-950/50 border border-amber-800/80 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                      Verification Passcode Detected
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Use this code to verify your corporate account on{' '}
                      <strong className="uppercase text-amber-300">
                        {selectedEmail.serviceBadge || 'service'}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="font-mono font-bold text-2xl text-amber-300 tracking-wider bg-slate-950 px-3 py-1 rounded border border-amber-900">
                      {selectedEmail.otpCode}
                    </div>
                    <button
                      onClick={() => handleCopyOtp(selectedEmail.otpCode!)}
                      className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="Copy OTP Code"
                    >
                      {copiedOtp === selectedEmail.otpCode ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copiedOtp === selectedEmail.otpCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Email Body rendered securely */}
              <div
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 text-xs text-slate-200 leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
              />

              {/* Reply / Forward Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleReply(selectedEmail)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Select an email to view details</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Incoming verification messages from Slack, Outlook, Zoom, and Teams will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        currentMailbox={currentMailbox}
        availableMailboxes={allMailboxes}
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={onSendEmail}
        initialTo={composeInitialTo}
        initialSubject={composeInitialSubject}
      />
    </div>
  );
};
