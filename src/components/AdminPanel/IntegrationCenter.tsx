import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Mailbox, ServiceType } from '../../types';

interface IntegrationCenterProps {
  mailboxes: Mailbox[];
  onSimulateServiceEmail: (email: string, service: ServiceType) => void;
  onOpenWebmail: (email: string) => void;
  preselectedEmail?: string;
}

export const IntegrationCenter: React.FC<IntegrationCenterProps> = ({
  mailboxes,
  onSimulateServiceEmail,
  onOpenWebmail,
  preselectedEmail,
}) => {
  const [targetEmail, setTargetEmail] = useState<string>(
    preselectedEmail || (mailboxes.length > 0 ? mailboxes[0].email : '')
  );
  const [selectedService, setSelectedService] = useState<ServiceType>('slack');
  const [lastSentInfo, setLastSentInfo] = useState<{
    email: string;
    service: ServiceType;
    otp: string;
    timestamp: string;
  } | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const handleTriggerSimulate = () => {
    if (!targetEmail) return;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    onSimulateServiceEmail(targetEmail, selectedService);

    setLastSentInfo({
      email: targetEmail,
      service: selectedService,
      otp: generatedOtp,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const servicesInfo = [
    {
      id: 'slack' as ServiceType,
      name: 'Slack Technologies',
      description: 'Workspace channels, direct messaging, huddles, and bot apps.',
      instructions: [
        'Open slack.com/get-started and enter your provisioned mailbox (e.g. user@company.com).',
        'Slack will send a 6-digit confirmation OTP to verify corporate ownership.',
        'Check the AhtiMail Webmail inbox for that mailbox to get the verification code.',
        'Optionally generate a Slack App Password token for automated webhook or bot sync.',
      ],
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    },
    {
      id: 'outlook' as ServiceType,
      name: 'Microsoft Outlook 365',
      description: 'Exchange/IMAP/SMTP corporate mail, calendar invites, and contacts.',
      instructions: [
        'Add account in Outlook Desktop, iOS/Android, or Outlook Web using IMAP/SMTP.',
        'Incoming Mail: mail.ahtimail.net (Port 993, SSL/TLS).',
        'Outgoing Mail: smtp.ahtimail.net (Port 587, STARTTLS).',
        'Enter mailbox email and password configured in this Admin Control Panel.',
      ],
      color: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
    },
    {
      id: 'zoom' as ServiceType,
      name: 'Zoom Video & Meetings',
      description: 'HD video conferencing, team chat channels, and webinar hosting.',
      instructions: [
        'Register account on zoom.us using your corporate domain email.',
        'Receive the Zoom Pro activation and host confirmation email in AhtiMail Webmail.',
        'Click the verification link or enter the 6-digit host passcode to activate.',
        'Start scheduling Zoom conferences with verified corporate credentials.',
      ],
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    },
    {
      id: 'teams' as ServiceType,
      name: 'Microsoft Teams',
      description: 'Enterprise team channels, group calls, and Office collaborative workspace.',
      instructions: [
        'Invite user@company.com to your Microsoft Teams organization.',
        'The employee receives the single-use Teams security pass in their Webmail inbox.',
        'Login to Microsoft Teams desktop/mobile app using the generated password.',
        'Start direct messaging, audio/video calling, and sharing corporate files.',
      ],
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <span>Messaging Apps & Service Integration Center</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Setup and verify mailboxes for Slack, Microsoft Outlook, Zoom, and Microsoft Teams. You can simulate live verification emails and test OTP codes in 1-click.
        </p>
      </div>

      {/* Live OTP & Verification Simulator Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-indigo-900/50 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Live Verification & OTP Simulator (1-Click Test)
          </h2>
        </div>
        <p className="text-xs text-slate-300 mb-4 max-w-2xl">
          Jab aap kisi company ko email ID dein aur wo Slack, Outlook, Zoom ya Teams ma register karein, toh verification code test karne ke liye yahan se 1-click test email bhejein:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Target Mailbox */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Select Recipient Mailbox:
            </label>
            <select
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {mailboxes.map((m) => (
                <option key={m.id} value={m.email}>
                  {m.email} ({m.companyName})
                </option>
              ))}
            </select>
          </div>

          {/* Service Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Select Service to Simulate:
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value as ServiceType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="slack">Slack (Workspace Invite & OTP)</option>
              <option value="outlook">Microsoft Outlook (Security Code)</option>
              <option value="zoom">Zoom (Activation Code)</option>
              <option value="teams">Microsoft Teams (Organization Invite)</option>
            </select>
          </div>

          {/* Trigger Button */}
          <div className="flex items-end">
            <button
              onClick={handleTriggerSimulate}
              disabled={!targetEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-all h-[38px]"
            >
              <Send className="w-4 h-4" />
              <span>Simulate & Deliver OTP</span>
            </button>
          </div>
        </div>

        {/* Success Triggered Box */}
        {lastSentInfo && (
          <div className="bg-slate-950/90 border border-emerald-800/60 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">
                  Verification Email Sent to <span className="text-emerald-300">{lastSentInfo.email}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Service: <strong className="uppercase text-slate-200">{lastSentInfo.service}</strong> at {lastSentInfo.timestamp}. Code has been delivered to inbox.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenWebmail(lastSentInfo.email)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-xs font-medium transition-colors"
              >
                <span>Open in Webmail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Services Setup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servicesInfo.map((info) => (
          <div
            key={info.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-sm">{info.name}</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">
                  {info.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{info.description}</p>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 uppercase block tracking-wider">
                  Setup & Verification Steps:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {info.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-mono text-[11px] mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Ready for all company mailboxes</span>
              <button
                onClick={() => {
                  setSelectedService(info.id);
                  handleTriggerSimulate();
                }}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <span>Test OTP Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
