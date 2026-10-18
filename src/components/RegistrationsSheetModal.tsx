import React, { useState, useEffect } from 'react';
import { X, Table, Download, Copy, Check, ExternalLink, Link2, Search, Users, ShieldAlert, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { googleSheetService, DelegateRecord } from '../utils/googleSheetService';
import { audioEngine } from '../utils/audioEngine';

interface RegistrationsSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationsSheetModal: React.FC<RegistrationsSheetModalProps> = ({ isOpen, onClose }) => {
  const [registrations, setRegistrations] = useState<DelegateRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedData, setCopiedData] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pendingRecords, setPendingRecords] = useState<DelegateRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'connect'>('roster');

  useEffect(() => {
    if (isOpen) {
      setRegistrations(googleSheetService.getAllRegistrations());
      setWebhookUrl(googleSheetService.getSheetWebhookUrl());
      setPendingRecords(googleSheetService.getPendingQueue());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRegistrations = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      (r.gender && r.gender.toLowerCase().includes(q)) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      (r.stoneName && r.stoneName.toLowerCase().includes(q)) ||
      (r.allergyDetails && r.allergyDetails.toLowerCase().includes(q)) ||
      r.clearanceId.toLowerCase().includes(q)
    );
  });

  const handleExportCsv = () => {
    audioEngine.playTacticalClick();
    googleSheetService.exportToCsv();
  };

  const handleCopyTsv = async () => {
    audioEngine.playTacticalClick();
    const success = await googleSheetService.copyForGoogleSheets();
    if (success) {
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2500);
    }
  };

  const handleSaveWebhook = () => {
    audioEngine.playTacticalClick();
    googleSheetService.setSheetWebhookUrl(webhookUrl);
    setSaveStatus('Webhook URL successfully configured & saved!');
    setPendingRecords(googleSheetService.getPendingQueue());
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleTestWebhook = async () => {
    audioEngine.playTacticalClick();
    if (!webhookUrl.trim()) {
      setTestResult({ success: false, message: 'Please enter a Google Apps Script Web App URL first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    const res = await googleSheetService.testConnection(webhookUrl);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleFlushPending = async () => {
    audioEngine.playTacticalClick();
    setIsSyncing(true);
    const res = await googleSheetService.flushPendingQueue();
    setIsSyncing(false);
    setPendingRecords(googleSheetService.getPendingQueue());
    setSaveStatus(`Transmitted ${res.syncedCount} queued records!`);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleSyncAll = async () => {
    audioEngine.playTacticalClick();
    if (!webhookUrl.trim()) {
      setActiveTab('connect');
      return;
    }
    setIsSyncing(true);
    const result = await googleSheetService.syncAllToGoogleSheet();
    setIsSyncing(false);
    setSaveStatus(`Transmitted ${result.successCount} of ${result.total} records to Google Sheet!`);
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleCopyAppsScript = () => {
    audioEngine.playTacticalClick();
    navigator.clipboard.writeText(googleSheetService.getGoogleAppsScriptTemplate());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const allergyCount = registrations.filter((r) => r.allergyDetails && r.allergyDetails.trim() !== '').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#050609] border-2 border-[#D4A72C] rounded-2xl shadow-[0_0_60px_rgba(212,167,44,0.35)] overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0D1326] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4A72C]/15 border border-[#D4A72C]/40 text-[#F6CC78]">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-marvel text-lg sm:text-xl font-bold tracking-wider text-white">
                  S.H.I.E.L.D. REGISTRATION DATABASE // GOOGLE SHEETS SYNC
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#45D483]/15 border border-[#45D483]/40 text-[#45D483]">
                  LIVE SYSTEM
                </span>
              </div>
              <p className="text-xs font-mono text-white/50">
                Total Assembled Delegates: <strong className="text-[#F6CC78]">{registrations.length}</strong> • Allergy Safeguards Active: <strong className="text-[#F04452]">{allergyCount}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab navigation */}
            <div className="flex rounded-lg bg-[#050609] border border-white/10 p-1 text-xs font-mono">
              <button
                onClick={() => {
                  audioEngine.playTacticalClick();
                  setActiveTab('roster');
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'roster'
                    ? 'bg-[#D4A72C] text-[#050609] font-bold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                REGISTRATION ROSTER ({registrations.length})
              </button>
              <button
                onClick={() => {
                  audioEngine.playTacticalClick();
                  setActiveTab('connect');
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'connect'
                    ? 'bg-[#D4A72C] text-[#050609] font-bold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>LINK GOOGLE SHEET</span>
              </button>
            </div>

            <button
              onClick={() => {
                audioEngine.playTacticalClick();
                onClose();
              }}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Database"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {saveStatus && (
          <div className="bg-[#45D483]/20 border-b border-[#45D483]/40 px-6 py-2.5 text-xs font-mono text-[#45D483] flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Modal Main Body */}
        {activeTab === 'roster' ? (
          <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-6 gap-3 sm:gap-4 bg-[#050609]">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search delegates by name, email, role, or allergy..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0D1326] border border-white/15 text-white font-mono text-xs placeholder-white/30 focus:outline-none focus:border-[#D4A72C]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-bold tracking-wider uppercase hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,167,44,0.4)] active:scale-95 text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD CSV</span>
                </button>

                <button
                  onClick={handleCopyTsv}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-[#0D1326] hover:bg-white/10 text-white/80 font-marvel text-xs font-bold tracking-wider uppercase transition-all active:scale-95 text-center"
                >
                  {copiedData ? <Check className="w-3.5 h-3.5 text-[#45D483]" /> : <Copy className="w-3.5 h-3.5 text-[#35B9FF]" />}
                  <span>{copiedData ? 'COPIED TO CLIPBOARD!' : 'COPY (PASTE IN SHEET)'}</span>
                </button>

                <button
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#45D483]/40 bg-[#45D483]/10 hover:bg-[#45D483]/20 text-[#45D483] font-marvel text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50 active:scale-95 text-center"
                  title="Push all registered delegates to your linked Google Sheet"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'SYNCING...' : 'LIVE SYNC'}</span>
                </button>
              </div>
            </div>

            {/* Mobile swipe helper */}
            <div className="sm:hidden flex items-center justify-between text-[10px] font-mono text-[#F6CC78]/80 bg-[#0D1326]/60 px-3 py-1.5 rounded-lg border border-[#D4A72C]/20 shrink-0">
              <span>↔ Swipe table horizontally to view all columns</span>
              <span className="text-[#45D483] font-bold">{filteredRegistrations.length} Records</span>
            </div>

            {/* Delegates Roster Table */}
            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-[#080B14] touch-scroll">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/15 bg-[#0D1326] text-white/60 uppercase sticky top-0 z-10 text-[11px]">
                    <th className="py-3 px-3">Clearance</th>
                    <th className="py-3 px-4">Delegate Name</th>
                    <th className="py-3 px-3">Gender</th>
                    <th className="py-3 px-4">Email / Phone</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Room / Fee</th>
                    <th className="py-3 px-3">Infinity Stone</th>
                    <th className="py-3 px-3">Allergy Safeguard</th>
                    <th className="py-3 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-white/40">
                        No registrations match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg, idx) => (
                      <tr key={reg.clearanceId || idx} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 text-[#F6CC78] font-bold">
                          {reg.clearanceId}
                        </td>
                        <td className="py-3 px-4 text-white font-bold font-sans">
                          {reg.fullName}
                          {reg.university && (
                            <span className="block text-[10px] text-white/40 font-mono font-normal">
                              {reg.university}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {reg.gender ? (
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              reg.gender.toLowerCase() === 'male' || reg.gender.toLowerCase() === 'boy'
                                ? 'bg-[#35B9FF]/15 border border-[#35B9FF]/40 text-[#35B9FF]'
                                : 'bg-[#FF5FA2]/15 border border-[#FF5FA2]/40 text-[#FF85BA]'
                            }`}>
                              {reg.gender}
                            </span>
                          ) : (
                            <span className="text-white/30 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-white/80 block">{reg.email}</span>
                          <span className="text-white/40 text-[10px] block">{reg.phone}</span>
                        </td>
                        <td className="py-3 px-3 text-white/70">
                          {reg.role}
                        </td>
                        <td className="py-3 px-3">
                          {reg.singleRoom || (reg.feeAgreed && reg.feeAgreed.includes('190')) ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4A72C]/20 border border-[#D4A72C]/50 text-[#F6CC78] whitespace-nowrap">
                              190 DT (Single)
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10 text-white/70 whitespace-nowrap">
                              150 DT (Standard)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4A72C]/10 border border-[#D4A72C]/30 text-[#F6CC78]">
                            {reg.stoneName || reg.stoneId || 'Mind'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {reg.allergyDetails && reg.allergyDetails.trim() ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F04452]/20 border border-[#F04452]/50 text-[#F04452]">
                              <AlertCircle className="w-3 h-3" />
                              <span>{reg.allergyDetails}</span>
                            </span>
                          ) : (
                            <span className="text-white/30 text-[11px]">— None</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-white/40 text-[10px] whitespace-nowrap">
                          {reg.timestamp || 'Oct 23–25, 2026'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Tips footer */}
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-white/40 pt-1">
              <span>Tip: Click <strong>"DOWNLOAD FOR GOOGLE SHEETS"</strong> to get the instant .CSV, or <strong>"COPY ALL"</strong> and press <strong>Ctrl+V</strong> in any Google Sheet.</span>
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#35B9FF] hover:underline"
              >
                <span>Open Blank Google Sheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Google Sheets Webhook Configuration Tab */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#050609] touch-scroll">
            {/* Guide Step-by-Step */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0D1326] border border-[#D4A72C]/40 space-y-3">
              <h4 className="font-marvel text-base text-[#F6CC78] font-bold tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                <span>HOW TO LINK YOUR GOOGLE SHEET IN 60 SECONDS (AUTOMATIC REAL-TIME SYNC)</span>
              </h4>
              <ol className="text-xs font-mono text-white/70 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Create or open your Google Sheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-[#35B9FF] underline">sheets.new</a>.</li>
                <li>In the top menu, click <strong>Extensions</strong> → <strong>Apps Script</strong>.</li>
                <li>Delete any default code, paste the <strong>S.H.I.E.L.D. Google Script</strong> (shown below), and click <strong>Save</strong>.</li>
                <li>Click <strong>Deploy</strong> (blue button top right) → <strong>New deployment</strong>.</li>
                <li>Choose type: <strong>Web app</strong>. Set <em>Execute as: "Me"</em> and <em>Who has access: "Anyone"</em>.</li>
                <li>Click <strong>Deploy</strong>, copy the generated <strong>Web app URL</strong>, and paste it into the input below!</li>
              </ol>
            </div>

            {/* Webhook Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-white/80 font-bold uppercase">
                YOUR GOOGLE APPS SCRIPT WEB APP URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1326] border border-white/20 text-white font-mono text-xs placeholder-white/30 focus:outline-none focus:border-[#D4A72C]"
                />
                <button
                  onClick={handleSaveWebhook}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-bold tracking-widest uppercase hover:brightness-110 transition-all shrink-0"
                >
                  SAVE & ACTIVATE
                </button>
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase transition-all shrink-0 disabled:opacity-50"
                >
                  {isTesting ? 'TESTING...' : 'TEST CONNECTION'}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-[#45D483]/15 border-[#45D483]/50 text-[#45D483]'
                      : 'bg-[#F04452]/15 border-[#F04452]/50 text-[#F04452]'
                  }`}
                >
                  {testResult.success ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Pending Queue Notice */}
              {pendingRecords.length > 0 && (
                <div className="p-3 rounded-xl bg-[#D4A72C]/15 border border-[#D4A72C]/50 text-[#F6CC78] text-xs font-mono flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                    <span>
                      <strong>{pendingRecords.length}</strong> offline / pending registration(s) queued.
                    </span>
                  </div>
                  <button
                    onClick={handleFlushPending}
                    disabled={isSyncing}
                    className="px-3 py-1 rounded bg-[#D4A72C] text-[#050609] font-bold text-[11px] uppercase hover:brightness-110 transition-all"
                  >
                    SYNC QUEUE NOW
                  </button>
                </div>
              )}

              <p className="text-[11px] font-mono text-white/40">
                Once saved, every delegate who submits the registration form will automatically be added as a new row in your Google Sheet immediately.
              </p>
            </div>

            {/* Copyable Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/80 font-bold uppercase">
                  S.H.I.E.L.D. GOOGLE APPS SCRIPT CODE
                </span>
                <button
                  onClick={handleCopyAppsScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0D1326] border border-white/20 text-[#35B9FF] text-xs font-mono hover:bg-white/10 transition-all"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#45D483]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'CODE COPIED!' : 'COPY CODE'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#030407] border border-white/10 text-white/70 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed select-all">
                {googleSheetService.getGoogleAppsScriptTemplate()}
              </pre>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-[#0D1326] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/50 shrink-0">
          <div className="flex items-center gap-2 text-[#45D483]">
            <span className="w-2 h-2 rounded-full bg-[#45D483] animate-pulse" />
            <span>256-BIT S.H.I.E.L.D. DATA SYNCHRONIZATION ACTIVE</span>
          </div>

          <button
            onClick={() => {
              audioEngine.playTacticalClick();
              onClose();
            }}
            className="px-5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 font-marvel text-xs tracking-wider uppercase transition-all"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
