import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Sparkles, Check, ArrowRight, ArrowLeft, RotateCcw, User, Compass, AlertCircle, Award, Mail, ExternalLink, Ticket, Printer, Table } from 'lucide-react';
import confetti from 'canvas-confetti';
import { infinityStones } from '../data/stonesData';
import { FacetedStone } from './FacetedStone';
import { audioEngine } from '../utils/audioEngine';
import { emailService } from '../utils/emailService';
import { googleSheetService } from '../utils/googleSheetService';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  role: string;
  stoneId: string;
  dietary: string;
  allergyDetails?: string;
  emergencyContact: string;
  emergencyPhone: string;
  motivation: string;
  agreedToOath: boolean;
  clearanceId?: string;
  timestamp?: string;
}

const initialForm: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  university: '',
  role: 'Delegate / Member',
  stoneId: 'mind',
  dietary: 'Standard / Halal',
  allergyDetails: '',
  emergencyContact: '',
  emergencyPhone: '',
  motivation: '',
  agreedToOath: false,
};

const leadershipRoles = [
  'Delegate / Member',
  'Team Leader (TL)',
  'Vice President (LCVP)',
  'Local Committee President (LCP)',
  'Conference Team / OC',
  'Exchange Participant (EP)',
  'Alumnus',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<RegistrationData>(initialForm);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedPass, setSubmittedPass] = useState<RegistrationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<{ synced: boolean; message: string; duplicate?: boolean } | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [showTicketPreview, setShowTicketPreview] = useState(false);
  const [ticketHtmlContent, setTicketHtmlContent] = useState<string>('');

  // Check if user already registered previously
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPass = localStorage.getItem('sms_2k26_current_pass');
      if (savedPass) {
        try {
          const parsed = JSON.parse(savedPass);
          setSubmittedPass(parsed);
          const stone = infinityStones.find((s) => s.id === parsed.stoneId) || infinityStones[0];
          setTicketHtmlContent(emailService.generateTicketHtml({
            fullName: parsed.fullName,
            email: parsed.email,
            phone: parsed.phone,
            university: parsed.university,
            role: parsed.role,
            stoneName: stone.name,
            stoneAttribute: stone.attribute,
            stoneHex: stone.hex,
            clearanceId: parsed.clearanceId || 'SMS-2K26',
            dietary: parsed.dietary,
            allergyDetails: parsed.allergyDetails,
            timestamp: parsed.timestamp || 'Oct 23–25, 2026',
          }));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreedToOath: e.target.checked }));
    setErrorMsg('');
  };

  const handleStoneSelect = (id: string) => {
    const stone = infinityStones.find((s) => s.id === id);
    if (stone) {
      audioEngine.playStoneResonance(stone.frequency, stone.name, stone.attribute);
    }
    setFormData((prev) => ({ ...prev, stoneId: id }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Please specify your Full Codename / Name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMsg('Please enter a valid communications email address.');
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg('Please enter your tactical WhatsApp or mobile number.');
        return false;
      }
    } else if (step === 3) {
      if ((formData.dietary === 'Has Allergies' || formData.dietary.includes('Allerg')) && !formData.allergyDetails?.trim()) {
        setErrorMsg('Please specify the exact details of your food or medical allergy.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.agreedToOath) {
        setErrorMsg('You must take the Delegate Oath of SMS 2K26 to proceed.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      audioEngine.playTacticalClick();
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    audioEngine.playTacticalClick();
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    audioEngine.playAvengersThemeFanfare();

    // Generate VIP Clearance ID
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const clearanceCode = `SMS-2K26-${randomHex}`;
    const formattedTimestamp = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newPass: RegistrationData = {
      ...formData,
      clearanceId: clearanceCode,
      timestamp: formattedTimestamp,
    };

    const stone = infinityStones.find((s) => s.id === formData.stoneId) || infinityStones[0];

    try {
      // 1. Record registration to Google Sheet & S.H.I.E.L.D. database
      const syncResult = await googleSheetService.recordRegistration({
        fullName: newPass.fullName,
        email: newPass.email,
        phone: newPass.phone,
        university: newPass.university,
        role: newPass.role,
        stoneId: newPass.stoneId,
        stoneName: stone.name,
        stoneAttribute: stone.attribute,
        dietary: newPass.dietary,
        allergyDetails: newPass.allergyDetails,
        emergencyContact: newPass.emergencyContact,
        emergencyPhone: newPass.emergencyPhone,
        motivation: newPass.motivation,
        clearanceId: clearanceCode,
        timestamp: formattedTimestamp,
      });

      setSheetSyncStatus(syncResult);

      // 2. Persist confirmed pass locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('sms_2k26_current_pass', JSON.stringify(newPass));
      }

      setSubmittedPass(newPass);

      // 3. Dispatch Official VIP Ticket to delegate email
      setIsEmailSending(true);
      emailService.sendTicketEmail({
        fullName: newPass.fullName,
        email: newPass.email,
        phone: newPass.phone,
        university: newPass.university,
        role: newPass.role,
        stoneName: stone.name,
        stoneAttribute: stone.attribute,
        stoneHex: stone.hex,
        clearanceId: clearanceCode,
        dietary: newPass.dietary,
        allergyDetails: newPass.allergyDetails,
        timestamp: formattedTimestamp,
      }).then((res) => {
        setIsEmailSending(false);
        setTicketHtmlContent(res.ticketHtml);
      }).catch(() => {
        setIsEmailSending(false);
      });

      // 4. Blast celebratory confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D4A72C', '#F6CC78', '#F04452', '#35B9FF', '#45D483', '#7B2CFF'],
      });
    } catch (err: any) {
      console.error('Registration submission error:', err);
      setErrorMsg('A transmission error occurred while registering. Your information has been safely preserved. Please retry submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPass = () => {
    audioEngine.playTacticalClick();
    setSubmittedPass(null);
    setCurrentStep(1);
    setFormData(initialForm);
    localStorage.removeItem('sms_2k26_current_pass');
  };

  const selectedStoneObj = infinityStones.find((s) => s.id === (submittedPass?.stoneId || formData.stoneId)) || infinityStones[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#050609] border border-[#D4A72C]/60 shadow-[0_0_90px_rgba(212,167,44,0.35)] overflow-hidden">
        
        {/* Top Specular Gold Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A72C] to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D1326] border-b border-[#D4A72C]/30 shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src="/brand/sms_logo_gold.png"
              alt="SMS Logo"
              className="w-10 h-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,167,44,0.7)] shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4A72C] uppercase font-bold block">
                S.H.I.E.L.D. COMMISSIONING PROTOCOL // SMS 2K26
              </span>
              <h3 className="font-marvel text-lg sm:text-xl font-black text-white tracking-wider">
                DELEGATE REGISTRATION TERMINAL
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {submittedPass && (
              <button
                onClick={handleResetPass}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-[#050609] hover:bg-white/10 text-xs font-mono text-white/70 transition-colors"
                title="Register another delegate"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>NEW REGISTRATION</span>
              </button>
            )}

            <button
              onClick={() => {
                audioEngine.playTacticalClick();
                onClose();
              }}
              className="p-2 rounded-full border border-white/20 bg-black/60 hover:bg-[#D4A72C]/20 hover:border-[#D4A72C] text-white/80 hover:text-[#F6CC78] transition-all"
              aria-label="Close registration terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#050609] touch-scroll">
          
          {submittedPass ? (
            /* ==================== CLEAN REGISTRATION CONFIRMATION ==================== */
            <div className="max-w-xl mx-auto flex flex-col items-center text-center py-6 sm:py-8 animate-[fadeIn_0.3s_ease-out]">
              {/* Glowing Success Check Emblem */}
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-[#45D483]/25 blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-[#0D1326] border-2 border-[#45D483] flex items-center justify-center shadow-[0_0_40px_rgba(69,212,131,0.5)]">
                  <Check className="w-10 h-10 text-[#45D483]" />
                </div>
              </div>

              {/* Status Clearance Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#45D483]/15 border border-[#45D483]/50 text-[#45D483] text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(69,212,131,0.25)]">
                <ShieldCheck className="w-4 h-4" />
                <span>COMMISSIONING AUTHORIZED // LEVEL 7</span>
              </div>

              {/* Headline */}
              <h3 className="text-3xl sm:text-4xl font-marvel font-black uppercase text-white tracking-wider">
                REGISTRATION SUCCESSFUL!
              </h3>
              
              <p className="mt-3 text-sm sm:text-base text-white/80 font-grotesk max-w-md leading-relaxed">
                Welcome to the assembly, <span className="text-[#F6CC78] font-bold">{submittedPass.fullName}</span>! You have been successfully registered for <span className="text-[#D4A72C] font-semibold">SMS 2K26</span>.
              </p>

              {/* Clean Reference Dossier */}
              <div className="w-full mt-6 p-5 sm:p-6 rounded-2xl bg-[#0D1326]/90 border border-[#D4A72C]/30 text-left shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4A72C] font-bold">
                    REGISTRATION DOSSIER
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F6CC78]">
                    REF: {submittedPass.clearanceId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px]">DELEGATE NAME</span>
                    <span className="text-white font-bold text-sm font-marvel mt-0.5 block">{submittedPass.fullName}</span>
                  </div>

                  <div>
                    <span className="text-white/40 block text-[10px]">COMMUNICATIONS UPLINK</span>
                    <span className="text-[#F6CC78] truncate block mt-0.5">{submittedPass.email}</span>
                  </div>

                  <div>
                    <span className="text-white/40 block text-[10px]">STONE RESONANCE</span>
                    <span className="text-white font-bold block mt-0.5" style={{ color: selectedStoneObj.hex }}>
                      {selectedStoneObj.name.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-white/40 block text-[10px]">CONVERGENCE VENUE</span>
                    <span className="text-white block mt-0.5">Hôtel Monastir Center • Oct 23–25</span>
                  </div>
                </div>

                {submittedPass.allergyDetails && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#F04452]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Allergy Safeguard: {submittedPass.allergyDetails}</span>
                  </div>
                )}
              </div>

              {/* Official Email Ticket Dispatch Status */}
              <div className="w-full mt-4 p-4 rounded-xl bg-[#0D1326] border border-[#D4A72C]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-lg">
                <div className="flex items-center gap-2.5 text-[#45D483]">
                  <Mail className="w-4 h-4 text-[#45D483] animate-pulse shrink-0" />
                  <span className="font-bold">
                    {isEmailSending ? 'TRANSMITTING VIP TICKET TO INBOX...' : 'VIP TICKET TRANSMITTED TO:'}
                  </span>
                </div>
                <span className="text-[#F6CC78] font-bold font-mono truncate">{submittedPass.email}</span>
              </div>

              {/* Google Sheets Sync Status Ribbon */}
              <div className="w-full mt-3 p-4 rounded-xl bg-[#0D1326] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-lg">
                <div className="flex items-center gap-2.5">
                  <Table className="w-4 h-4 text-[#D4A72C] shrink-0" />
                  <span className="text-white/80 font-bold">
                    CENTRALIZED GOOGLE SPREADSHEET:
                  </span>
                </div>
                <span className={`font-mono font-bold text-right sm:max-w-xs truncate ${sheetSyncStatus?.synced ? 'text-[#45D483]' : 'text-[#F6CC78]'}`}>
                  {sheetSyncStatus ? sheetSyncStatus.message : 'Stored securely in S.H.I.E.L.D. database'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 w-full">
                <button
                  onClick={() => {
                    audioEngine.playTacticalClick();
                    setShowTicketPreview(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0D1326] border border-[#D4A72C]/60 text-[#F6CC78] font-marvel text-xs font-bold tracking-[0.16em] uppercase hover:bg-[#D4A72C]/20 transition-all shadow-[0_0_15px_rgba(212,167,44,0.25)] active:scale-95 text-center"
                >
                  <Ticket className="w-4 h-4 text-[#D4A72C]" />
                  <span>PREVIEW EMAIL TICKET</span>
                </button>

                <a
                  href={emailService.getMailtoUrl({
                    fullName: submittedPass.fullName,
                    email: submittedPass.email,
                    phone: submittedPass.phone,
                    role: submittedPass.role,
                    stoneName: selectedStoneObj.name,
                    stoneAttribute: selectedStoneObj.attribute,
                    stoneHex: selectedStoneObj.hex,
                    clearanceId: submittedPass.clearanceId || 'SMS-2K26',
                    allergyDetails: submittedPass.allergyDetails,
                    timestamp: submittedPass.timestamp || '',
                  })}
                  onClick={() => audioEngine.playTacticalClick()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-[#050609] hover:bg-white/10 text-white/80 font-marvel text-xs font-bold tracking-[0.14em] uppercase transition-all active:scale-95 text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#35B9FF]" />
                  <span>OPEN IN MAIL APP</span>
                </a>

                <button
                  onClick={() => {
                    audioEngine.playTacticalClick();
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-[0.2em] uppercase hover:brightness-110 transition-all shadow-[0_0_25px_rgba(212,167,44,0.6)] active:scale-95 text-center"
                >
                  <Check className="w-4 h-4" />
                  <span>DONE // ENTER SITE</span>
                </button>

                <button
                  onClick={handleResetPass}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/20 bg-[#0D1326] hover:bg-white/10 text-white/70 font-marvel text-xs font-bold tracking-[0.14em] uppercase transition-all active:scale-95 text-center"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4A72C]" />
                  <span>REGISTER ANOTHER</span>
                </button>
              </div>
            </div>
          ) : (
            /* ==================== 4-STEP IN-THEME REGISTRATION FORM ==================== */
            <div className="max-w-2xl mx-auto">
              
              {/* Stepper Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2 text-xs font-mono text-white/60">
                  <span className="text-[#D4A72C] font-bold">PHASE 0{currentStep} OF 04</span>
                  <span>
                    {currentStep === 1 && 'HERO IDENTITY'}
                    {currentStep === 2 && 'LEADERSHIP ROLE'}
                    {currentStep === 3 && 'PRIMORDIAL RESONANCE'}
                    {currentStep === 4 && 'DELEGATE OATH'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#0D1326] rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] transition-all duration-300 shadow-[0_0_12px_#D4A72C]"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-6 p-3 rounded-xl bg-[#F04452]/15 border border-[#F04452]/60 text-[#F04452] text-xs font-mono flex items-center gap-2 animate-[shake_0.2s_ease-in-out]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* ---------- STEP 1: HERO IDENTITY ---------- */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h4 className="font-marvel text-lg font-black text-white tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-[#D4A72C]" />
                        <span>PERSONAL IDENTITY // CODENAME</span>
                      </h4>
                      <p className="text-xs text-white/60 font-grotesk mt-0.5">
                        Establish your personal identifier for national clearance and delegate credentialing.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                        [ 01 ] Full Name (First & Last) *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Yassine Ben Salem"
                        className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                          [ 02 ] Communications Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. yassine@aiesec.net"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                          [ 03 ] WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+216 XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                        [ 04 ] University / Faculty & Field of Study
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="e.g. FSEGS Sfax — Business Administration"
                        className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* ---------- STEP 2: LEADERSHIP TIER & DETAILS ---------- */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h4 className="font-marvel text-lg font-black text-white tracking-wider flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#D4A72C]" />
                        <span>LEADERSHIP TIER & EMERGENCY DETAILS</span>
                      </h4>
                      <p className="text-xs text-white/60 font-grotesk mt-0.5">
                        Indicate your current leadership role and emergency contact details.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                        [ 01 ] Leadership Role / Title
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                      >
                        {leadershipRoles.map((r) => (
                          <option key={r} value={r} className="bg-[#050609] text-white">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                          [ 02 ] Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          placeholder="e.g. Parent / Sibling Name"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                          [ 03 ] Emergency Phone
                        </label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          placeholder="+216 XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------- STEP 3: PRIMORDIAL RESONANCE (CHOOSE YOUR STONE) ---------- */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h4 className="font-marvel text-lg font-black text-white tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                        <span>PRIMORDIAL POWER RESONANCE</span>
                      </h4>
                      <p className="text-xs text-white/60 font-grotesk mt-0.5">
                        Select which of the six Infinity Pillars you are called to master at SMS 2K26.
                      </p>
                    </div>

                    {/* 6 Stones Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {infinityStones.map((stone) => {
                        const isChosen = formData.stoneId === stone.id;
                        return (
                          <div
                            key={stone.id}
                            onClick={() => handleStoneSelect(stone.id)}
                            className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex flex-col items-center text-center ${
                              isChosen
                                ? 'bg-[#0D1326] shadow-xl scale-[1.02]'
                                : 'bg-[#050609]/70 border-white/10 hover:border-white/30'
                            }`}
                            style={{
                              borderColor: isChosen ? stone.hex : undefined,
                              boxShadow: isChosen ? `0 0 20px ${stone.hex}50, inset 0 0 15px ${stone.hex}25` : undefined,
                            }}
                          >
                            <FacetedStone id={stone.id} color={stone.hex} size={34} isHovered={isChosen} />
                            <span className="font-marvel font-bold text-xs uppercase mt-2" style={{ color: stone.hex }}>
                              {stone.name.replace(' Stone', '')}
                            </span>
                            <span className="text-[10px] text-white/60 font-grotesk mt-0.5 leading-tight">
                              {stone.attribute}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                        Dietary Requirements & Accommodation Preferences
                      </label>
                      <select
                        name="dietary"
                        value={formData.dietary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors"
                      >
                        <option value="Standard / Halal" className="bg-[#050609] text-white">Standard / Halal Catering</option>
                        <option value="Vegetarian" className="bg-[#050609] text-white">Vegetarian</option>
                        <option value="Vegan" className="bg-[#050609] text-white">Vegan</option>
                        <option value="Has Allergies" className="bg-[#050609] text-white">Food / Medical Allergy (Specify Below)</option>
                        <option value="Gluten-Free" className="bg-[#050609] text-white">Gluten-Free</option>
                      </select>
                    </div>

                    {/* Conditional Allergy Specification Field */}
                    {(formData.dietary === 'Has Allergies' || formData.dietary.includes('Allerg')) && (
                      <div className="pt-2 animate-[fadeIn_0.2s_ease-out]">
                        <label className="block text-xs font-mono uppercase text-[#F04452] mb-1.5 flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-[#F04452]" />
                          <span>[ ! ] Specify Your Allergy Details *</span>
                        </label>
                        <input
                          type="text"
                          name="allergyDetails"
                          value={formData.allergyDetails || ''}
                          onChange={handleInputChange}
                          placeholder="e.g. Peanuts, Seafood, Lactose, Gluten, Medication allergies..."
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-[#F04452]/60 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#F04452] focus:ring-1 focus:ring-[#F04452] transition-colors shadow-[0_0_15px_rgba(240,68,82,0.2)]"
                          required
                        />
                        <span className="text-[10px] text-white/50 font-grotesk mt-1 block">
                          The event catering and safety team at Hôtel Monastir Center will ensure dedicated allergy-safe meal preparation for you.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- STEP 4: THE DELEGATE OATH ---------- */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="border-b border-white/10 pb-3 mb-4">
                      <h4 className="font-marvel text-lg font-black text-white tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#D4A72C]" />
                        <span>THE OATH OF CONVERGENCE</span>
                      </h4>
                      <p className="text-xs text-white/60 font-grotesk mt-0.5">
                        Formalize your commitment to the national assembly of youth leaders.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#F6CC78] mb-1.5">
                        Your Leadership Quest // Motivation
                      </label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="What breakthrough impact do you aim to unlock for your Local Committee and Tunisia at SMS 2K26?"
                        className="w-full px-4 py-3 rounded-xl bg-[#0D1326] border border-white/15 text-white font-montserrat text-sm placeholder-white/30 focus:outline-none focus:border-[#D4A72C] focus:ring-1 focus:ring-[#D4A72C] transition-colors resize-none"
                      />
                    </div>

                    {/* The Oath Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#0D1326]/80 border border-[#D4A72C]/40 text-left">
                      <p className="text-xs sm:text-sm font-grotesk text-white/90 italic leading-relaxed">
                        "I stand ready to assemble alongside Earth’s mightiest youth leaders at SMS 2K26. I commit to harness the six primordial stones, challenge my limitations, and unite with my generation for a greater tomorrow."
                      </p>

                      <label className="mt-4 flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formData.agreedToOath}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 rounded text-[#D4A72C] focus:ring-[#D4A72C] border-white/30 bg-[#050609]"
                        />
                        <span className="text-xs font-mono text-[#F6CC78] font-bold">
                          I SOLEMNLY SWEAR THE OATH OF SMS 2K26 *
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Navigation Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 bg-[#0D1326] text-white/70 hover:text-white hover:bg-white/10 text-xs font-mono uppercase transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs font-black tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,167,44,0.5)] active:scale-95"
                    >
                      <span>CONTINUE PHASE 0{currentStep + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#D4A72C] via-[#F6CC78] to-[#D4A72C] text-[#050609] font-marvel text-xs sm:text-sm font-black tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(212,167,44,0.8)] ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:brightness-110 active:scale-95 animate-pulse'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#050609] border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>TRANSMITTING TO GOOGLE SHEET...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 fill-current text-[#050609]" />
                          <span>AUTHORIZE COMMISSIONING</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Status Ribbon */}
        <div className="px-6 py-2.5 bg-[#0D1326] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50 shrink-0">
          <div className="flex items-center gap-1.5 text-[#45D483]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT ENCRYPTED CREDENTIAL SUBMISSION // GOOGLE SHEETS SYNC</span>
          </div>
          <span>AIESEC IN SFAX • SMS 2K26</span>
        </div>
      </div>

      {/* VIP Ticket Preview Overlay */}
      {showTicketPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#050609] border-2 border-[#D4A72C] rounded-2xl shadow-[0_0_50px_rgba(212,167,44,0.4)] overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0D1326] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-[#D4A72C]" />
                <div>
                  <h3 className="text-white font-marvel text-base sm:text-lg font-bold tracking-wider">
                    OFFICIAL VIP TICKET DISPATCH // PREVIEW
                  </h3>
                  <p className="text-[11px] font-mono text-white/50">
                    Dispatched to inbox & available for offline check-in
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioEngine.playTacticalClick();
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(ticketHtmlContent);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => printWindow.print(), 250);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-mono transition-all"
                  title="Print / Save PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-[#F6CC78]" />
                  <span className="hidden sm:inline">PRINT / PDF</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playTacticalClick();
                    setShowTicketPreview(false);
                  }}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* iFrame Ticket Renderer */}
            <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-[#050609] touch-scroll">
              <iframe
                title="SMS 2K26 VIP Ticket"
                srcDoc={ticketHtmlContent}
                className="w-full h-[65vh] border border-white/10 rounded-xl bg-[#050609]"
              />
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0D1326] flex items-center justify-between text-xs font-mono shrink-0">
              <span className="text-white/50 text-[11px]">HOTEL MONASTIR CENTER • OCT 23–25, 2026</span>
              <button
                onClick={() => {
                  audioEngine.playTacticalClick();
                  setShowTicketPreview(false);
                }}
                className="px-5 py-2 rounded-full bg-[#D4A72C] text-[#050609] font-marvel text-xs font-bold tracking-widest uppercase hover:brightness-110 transition-all"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

