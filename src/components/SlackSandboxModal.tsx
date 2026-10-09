import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  AlertCircle,
  CheckCircle2,
  Mail,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Send,
  Users,
  Hash,
} from 'lucide-react';
import { Mailbox, EmailMessage } from '../types';

interface SlackSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  mailboxes: Mailbox[];
  emails: EmailMessage[];
  onOpenWebmail: (email: string) => void;
  onGenerateSlackOtp: (email: string) => string;
}

export const SlackSandboxModal: React.FC<SlackSandboxModalProps> = ({
  isOpen,
  onClose,
  mailboxes,
  emails,
  onOpenWebmail,
  onGenerateSlackOtp,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'email' | 'otp' | 'workspace'>('email');
  const [emailInput, setEmailInput] = useState('ahtisham12@axxonbpo.com');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Axxon Bot', text: 'Welcome to Axxon BPO Enterprise Slack workspace!', time: '12:00 PM' },
    { sender: 'Alex Rivers', text: 'Hey team, glad to have you here on Slack.', time: '12:02 PM' },
  ]);
  const [newChatText, setNewChatText] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSendCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!emailInput.trim()) return;

    // Trigger OTP generation in the mailbox
    const generated = onGenerateSlackOtp(emailInput.trim());
    setExpectedOtp(generated);
    setOtpDigits(['', '', '', '', '', '']);
    setStep('otp');

    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 100);
  };

  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage('');
    const char = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto verify if all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyCode = (code: string) => {
    if (code === expectedOtp || (expectedOtp === '' && code.length === 6)) {
      setStep('workspace');
      setErrorMessage('');
    } else {
      setErrorMessage("That code wasn't valid. Have another go!");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        sender: emailInput.split('@')[0],
        text: newChatText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewChatText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Slack Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#4A154B] flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Slack Workspace Simulator</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono uppercase">
                  Interactive Test
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Test the complete Slack OTP login flow for {emailInput}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Explanation Banner */}
        <div className="bg-indigo-950/40 border-b border-indigo-900/40 px-6 py-2.5 text-xs text-indigo-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Note:</strong> Real <code>slack.com</code> requires their own servers to generate the OTP. In this simulator, the OTP is generated directly into your AhtiMail Webmail inbox!
            </span>
          </div>
          <button
            onClick={() => onOpenWebmail(emailInput)}
            className="text-[11px] font-semibold text-indigo-300 hover:text-white underline whitespace-nowrap"
          >
            Check Webmail Inbox
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {/* STEP 1: ENTER EMAIL */}
          {step === 'email' && (
            <div className="max-w-md w-full space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Sign in to your Slack workspace
                </h2>
                <p className="text-xs text-slate-400">
                  We'll email you a 6-digit confirmation code to verify your corporate identity.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="text-left">
                  <label className="block text-slate-300 text-xs font-semibold mb-1">
                    Corporate Email Address:
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="ahtisham12@axxonbpo.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span>Available Accounts:</span>
                  {mailboxes.slice(0, 3).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEmailInput(m.email)}
                      className="text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded font-mono hover:bg-purple-900"
                    >
                      {m.email}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4A154B] hover:bg-[#611f69] text-white rounded-lg font-bold text-sm shadow-md transition-colors"
                >
                  Continue with Email
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: ENTER OTP (Exact match to user's screenshot!) */}
          {step === 'otp' && (
            <div className="max-w-md w-full space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  We emailed you a code
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We've sent an email to <strong className="text-white font-mono">{emailInput}</strong>. Enter the code here to continue.
                </p>
              </div>

              {/* 6-Digit Boxes: [ ][ ][ ] - [ ][ ][ ] */}
              <div className="flex items-center justify-center gap-2 my-4">
                {/* First 3 boxes */}
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={otpDigits[idx]}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 bg-slate-950 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-center font-mono text-2xl font-bold text-white focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <span className="text-slate-500 font-bold text-xl px-1">–</span>

                {/* Second 3 boxes */}
                <div className="flex gap-2">
                  {[3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={otpDigits[idx]}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 bg-slate-950 border-2 border-slate-700 focus:border-purple-500 rounded-lg text-center font-mono text-2xl font-bold text-white focus:outline-none transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message banner matching Slack */}
              {errorMessage && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quick Helper for user: Shows expected OTP code */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Generated Slack OTP Code:</span>
                  <span className="font-mono font-bold text-purple-400 text-base">{expectedOtp}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      if (expectedOtp.length === 6) {
                        setOtpDigits(expectedOtp.split(''));
                        verifyCode(expectedOtp);
                      }
                    }}
                    className="text-[11px] text-purple-300 hover:text-white font-semibold underline"
                  >
                    Auto-Fill Code ({expectedOtp})
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenWebmail(emailInput)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>View in Webmail</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400">
                Can't find your code?{' '}
                <button
                  onClick={() => handleSendCode()}
                  className="text-purple-400 hover:underline font-medium"
                >
                  Request a new code
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WORKSPACE LOGGED IN (SUCCESS!) */}
          {step === 'workspace' && (
            <div className="w-full flex flex-col h-[400px] border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              {/* Workspace Top Bar */}
              <div className="bg-[#350d36] px-4 py-2.5 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px]">A</div>
                  <span>Axxon BPO Enterprise Workspace</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-mono">{emailInput}</span>
                </div>
              </div>

              {/* Workspace Body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Channels Sidebar */}
                <div className="w-44 bg-[#3F0E40] text-slate-300 p-2 text-xs space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Channels
                  </div>
                  {['general', 'random', 'announcements', 'leads-bpo'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveChannel(c)}
                      className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
                        activeChannel === c
                          ? 'bg-[#1164A3] text-white font-medium'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Hash className="w-3 h-3" />
                      <span>{c}</span>
                    </button>
                  ))}

                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-3 py-1">
                    Direct Messages
                  </div>
                  <div className="px-2 py-1 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Alex Rivers</span>
                  </div>
                </div>

                {/* Channel Chat Area */}
                <div className="flex-1 flex flex-col justify-between bg-slate-900 p-4">
                  <div className="space-y-3 overflow-y-auto">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span>{activeChannel}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Corporate messaging channel authenticated via {emailInput}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded bg-purple-700 flex items-center justify-center text-[10px] font-bold text-white">
                            {msg.sender.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{msg.sender}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder={`Message #${activeChannel}...`}
                      value={newChatText}
                      onChange={(e) => setNewChatText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#007A5A] hover:bg-[#148567] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px]">
            {step === 'workspace' ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Slack login successfully authenticated!
              </span>
            ) : (
              <span>Simulated Slack Enterprise Grid connection</span>
            )}
          </div>
          <button
            onClick={() => {
              if (step === 'workspace') {
                setStep('email');
              } else {
                onClose();
              }
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
          >
            {step === 'workspace' ? 'Test Another Email' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
