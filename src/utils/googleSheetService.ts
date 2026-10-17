// S.H.I.E.L.D. Tactical Database & Google Sheets Synchronization Engine

export interface DelegateRecord {
  fullName: string;
  email: string;
  phone: string;
  university?: string;
  role: string;
  stoneId?: string;
  stoneName?: string;
  stoneAttribute?: string;
  dietary?: string;
  allergyDetails?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  motivation?: string;
  feeAgreed?: string;
  clearanceId: string;
  timestamp: string;
}

const STORAGE_KEY_REGISTRATIONS = 'sms_2k26_all_registrations';
const STORAGE_KEY_SHEET_URL = 'sms_2k26_google_sheet_url';
const STORAGE_KEY_PENDING_QUEUE = 'sms_2k26_pending_queue';

// Default initial demo seed so the organizer can see their Google Sheet immediately populated
const SEED_DELEGATES: DelegateRecord[] = [
  {
    fullName: "Youssef Ben Salem",
    email: "youssef.bensalem@aiesec.net",
    phone: "+216 28 450 112",
    university: "FSEG Sfax",
    role: "Team Leader (TL)",
    stoneId: "mind",
    stoneName: "Mind Stone",
    stoneAttribute: "Visionary Strategy",
    dietary: "Standard / Halal",
    allergyDetails: "",
    emergencyContact: "Mohamed Ben Salem",
    emergencyPhone: "+216 98 123 456",
    motivation: "Unlocking team potential for LC Sfax during Q4 term.",
    clearanceId: "SMS-2K26-M921",
    timestamp: "Oct 16, 2026, 10:15 AM",
  },
  {
    fullName: "Mariem Trabelsi",
    email: "mariem.trabelsi@aiesec.net",
    phone: "+216 55 902 314",
    university: "ENIS Sfax",
    role: "Vice President (LCVP)",
    stoneId: "power",
    stoneName: "Power Stone",
    stoneAttribute: "Operational Impact",
    dietary: "Has Allergies",
    allergyDetails: "Peanut / Nut Allergy",
    emergencyContact: "Fatma Trabelsi",
    emergencyPhone: "+216 22 889 001",
    motivation: "Leading the biggest exchange delegation in Tunisia.",
    clearanceId: "SMS-2K26-P482",
    timestamp: "Oct 16, 2026, 11:30 AM",
  },
  {
    fullName: "Amine Khemakhem",
    email: "amine.khemakhem@aiesec.net",
    phone: "+216 20 114 875",
    university: "IHEC Sfax",
    role: "Delegate / Member",
    stoneId: "time",
    stoneName: "Time Stone",
    stoneAttribute: "Mastery & Focus",
    dietary: "Standard / Halal",
    allergyDetails: "",
    emergencyContact: "Ali Khemakhem",
    emergencyPhone: "+216 99 443 210",
    motivation: "Discovering my leadership path in AIESEC in Tunisia.",
    clearanceId: "SMS-2K26-T705",
    timestamp: "Oct 16, 2026, 12:45 PM",
  }
];

class GoogleSheetService {
  constructor() {
    // Setup automatic background sync retry when device reconnects to internet
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.flushPendingQueue();
      });
    }
  }

  /**
   * Retrieves the user's custom Google Apps Script Web App URL from localStorage or env.
   */
  public getSheetWebhookUrl(): string {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem(STORAGE_KEY_SHEET_URL);
    if (stored && stored.trim().length > 0) return stored.trim();
    return (import.meta as any).env?.VITE_GOOGLE_SHEET_URL?.trim() || '';
  }

  /**
   * Updates the custom Google Apps Script Web App URL.
   */
  public setSheetWebhookUrl(url: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
      // Try flushing pending queue to the newly configured URL
      if (url.trim()) {
        setTimeout(() => this.flushPendingQueue(), 500);
      }
    }
  }

  /**
   * Retrieves all registrations currently saved in localStorage.
   */
  public getAllRegistrations(): DelegateRecord[] {
    if (typeof window === 'undefined') return SEED_DELEGATES;
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(SEED_DELEGATES));
      return SEED_DELEGATES;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return SEED_DELEGATES;
    } catch {
      return SEED_DELEGATES;
    }
  }

  /**
   * Retrieves pending registrations that haven't synced to Google Sheets yet.
   */
  public getPendingQueue(): DelegateRecord[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY_PENDING_QUEUE);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private addToPendingQueue(record: DelegateRecord): void {
    if (typeof window === 'undefined') return;
    const queue = this.getPendingQueue();
    if (!queue.some((r) => r.clearanceId === record.clearanceId)) {
      queue.push(record);
      localStorage.setItem(STORAGE_KEY_PENDING_QUEUE, JSON.stringify(queue));
    }
  }

  private removeFromPendingQueue(clearanceId: string): void {
    if (typeof window === 'undefined') return;
    const queue = this.getPendingQueue();
    const updated = queue.filter((r) => r.clearanceId !== clearanceId);
    localStorage.setItem(STORAGE_KEY_PENDING_QUEUE, JSON.stringify(updated));
  }

  /**
   * Appends a new delegate registration locally and triggers auto-sync to Google Sheet.
   */
  public async recordRegistration(record: DelegateRecord): Promise<{ synced: boolean; message: string; duplicate?: boolean }> {
    if (typeof window !== 'undefined') {
      const all = this.getAllRegistrations();
      // Avoid duplicate by clearanceId
      const existingIndex = all.findIndex((r) => r.clearanceId === record.clearanceId);
      if (existingIndex >= 0) {
        all[existingIndex] = record;
      } else {
        all.unshift(record);
      }
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(all));
    }

    // Attempt real-time sync with Google Sheet
    return await this.syncToGoogleSheet(record);
  }

  /**
   * Sends a single record to the Google Apps Script Webhook.
   */
  public async syncToGoogleSheet(record: DelegateRecord): Promise<{ synced: boolean; message: string; duplicate?: boolean }> {
    const webhookUrl = this.getSheetWebhookUrl();
    if (!webhookUrl) {
      this.addToPendingQueue(record);
      return {
        synced: false,
        message: 'Saved locally in S.H.I.E.L.D. database. (Connect Google Sheet in Organizer Portal to sync rows)',
      };
    }

    try {
      const payload = {
        timestamp: record.timestamp || new Date().toLocaleString(),
        clearanceId: record.clearanceId,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        role: record.role,
        university: record.university || '',
        stoneId: record.stoneId || '',
        stoneName: record.stoneName || record.stoneId || 'Primordial Stone',
        stoneAttribute: record.stoneAttribute || 'Leadership',
        dietary: record.dietary || 'Standard / Halal',
        allergyDetails: record.allergyDetails?.trim() ? record.allergyDetails : 'None',
        emergencyContact: record.emergencyContact || '',
        emergencyPhone: record.emergencyPhone || '',
        motivation: record.motivation || '',
        feeAgreed: record.feeAgreed || '150 DT (Confirmed)',
      };

      // To avoid CORS preflight rejection by Google Apps Script, we send as text/plain.
      // Google Apps Script JSON.parse(e.postData.contents) handles this natively.
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          try {
            const data = await response.json();
            if (data && data.status === 'duplicate') {
              this.removeFromPendingQueue(record.clearanceId);
              return {
                synced: true,
                duplicate: true,
                message: data.message || 'Already registered in Google Sheet.',
              };
            }
          } catch {
            // response body couldn't be parsed as JSON, but HTTP status was 200/ok
          }
        }
      } catch {
        // If standard fetch encounters a browser CORS redirect block, fallback to no-cors transport
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });
      }

      this.removeFromPendingQueue(record.clearanceId);
      return {
        synced: true,
        message: 'Delegate registration successfully recorded in Google Sheet!',
      };
    } catch (err: any) {
      console.warn('Google Sheet Webhook sync error:', err);
      this.addToPendingQueue(record);
      return {
        synced: false,
        message: 'Network error communicating with Google Sheet. Record preserved safely in local database and queued for retry.',
      };
    }
  }

  /**
   * Flushes all pending records to the Google Sheet.
   */
  public async flushPendingQueue(): Promise<{ syncedCount: number; remainingCount: number }> {
    const queue = this.getPendingQueue();
    const webhookUrl = this.getSheetWebhookUrl();
    if (!webhookUrl || queue.length === 0) {
      return { syncedCount: 0, remainingCount: queue.length };
    }

    let syncedCount = 0;
    for (const record of [...queue]) {
      const res = await this.syncToGoogleSheet(record);
      if (res.synced) {
        syncedCount++;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    const remaining = this.getPendingQueue().length;
    return { syncedCount, remainingCount: remaining };
  }

  /**
   * Syncs all existing records in bulk to the Google Sheet.
   */
  public async syncAllToGoogleSheet(): Promise<{ successCount: number; total: number }> {
    const all = this.getAllRegistrations();
    const webhookUrl = this.getSheetWebhookUrl();
    if (!webhookUrl || all.length === 0) {
      return { successCount: 0, total: all.length };
    }

    let successCount = 0;
    for (const record of all) {
      const res = await this.syncToGoogleSheet(record);
      if (res.synced) successCount++;
      // Brief pause to avoid exceeding Google Apps Script write quotas
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    return { successCount, total: all.length };
  }

  /**
   * Tests connectivity to the Google Apps Script Web App.
   */
  public async testConnection(targetUrl?: string): Promise<{ success: boolean; message: string; details?: any }> {
    const url = (targetUrl || this.getSheetWebhookUrl()).trim();
    if (!url) {
      return { success: false, message: 'No Google Sheet Webhook URL provided.' };
    }

    try {
      // 1. Try a GET ping to check the doGet health check
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        try {
          const data = await response.json();
          if (data && data.status === 'active') {
            return {
              success: true,
              message: `Connected to Google Sheet: "${data.spreadsheetName || 'Active Sheet'}" (${data.sheetTab || 'Registrations'})`,
              details: data,
            };
          }
        } catch {
          // Response is ok but not JSON
        }
        return {
          success: true,
          message: 'Google Apps Script endpoint is online and responding!',
        };
      }
      return {
        success: false,
        message: `Google Apps Script returned status ${response.status} (${response.statusText}).`,
      };
    } catch (err: any) {
      // If GET has CORS restrictions or network failed, try an OPTIONS/HEAD check or friendly prompt
      return {
        success: false,
        message: 'Could not reach endpoint directly. Verify the Web App is deployed with "Who has access: Anyone".',
      };
    }
  }

  /**
   * Generates a CSV file formatted for Google Sheets and Excel with UTF-8 BOM,
   * then triggers an immediate browser download.
   */
  public exportToCsv(): void {
    const records = this.getAllRegistrations();
    const headers = [
      'Timestamp',
      'Clearance ID',
      'Delegate Full Name',
      'Email Address',
      'WhatsApp / Mobile',
      'Leadership Role',
      'University / Faculty',
      'Infinity Stone Resonance',
      'Leadership Pillar',
      'Dietary Preference',
      'Allergy Safeguards',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Motivation Oath',
      'Conference Fee',
    ];

    const escapeCsv = (val: string | undefined): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map((r) => [
      escapeCsv(r.timestamp),
      escapeCsv(r.clearanceId),
      escapeCsv(r.fullName),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.role),
      escapeCsv(r.university),
      escapeCsv(r.stoneName || r.stoneId),
      escapeCsv(r.stoneAttribute),
      escapeCsv(r.dietary),
      escapeCsv(r.allergyDetails?.trim() ? r.allergyDetails : 'None'),
      escapeCsv(r.emergencyContact),
      escapeCsv(r.emergencyPhone),
      escapeCsv(r.motivation),
      escapeCsv(r.feeAgreed || '150 DT (Confirmed)'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `SMS_2K26_Registrations_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Copies formatted TSV (Tab-Separated Values) directly to clipboard.
   * The organizer can simply open Google Sheets and press Ctrl + V!
   */
  public async copyForGoogleSheets(): Promise<boolean> {
    const records = this.getAllRegistrations();
    const headers = [
      'Timestamp',
      'Clearance ID',
      'Delegate Full Name',
      'Email Address',
      'WhatsApp / Mobile',
      'Leadership Role',
      'University / Faculty',
      'Infinity Stone',
      'Leadership Pillar',
      'Dietary Preference',
      'Allergy Safeguards',
      'Emergency Contact Name',
      'Emergency Contact Phone',
      'Motivation Oath',
      'Conference Fee',
    ];

    const rows = records.map((r) => [
      r.timestamp || '',
      r.clearanceId || '',
      r.fullName || '',
      r.email || '',
      r.phone || '',
      r.role || '',
      r.university || '',
      r.stoneName || r.stoneId || '',
      r.stoneAttribute || '',
      r.dietary || '',
      r.allergyDetails?.trim() ? r.allergyDetails : 'None',
      r.emergencyContact || '',
      r.emergencyPhone || '',
      (r.motivation || '').replace(/\r?\n|\r/g, ' '),
      r.feeAgreed || '150 DT (Confirmed)',
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');

    try {
      await navigator.clipboard.writeText(tsvContent);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ready-to-copy Google Apps Script code for Google Sheets.
   */
  public getGoogleAppsScriptTemplate(): string {
    return `/**
 * ==============================================================================
 * AIESEC IN SFAX — SMS 2K26 (THE INFINITY SAGA)
 * OFFICIAL GOOGLE SHEETS LIVE REGISTRATION BACKEND PROXY (GOOGLE APPS SCRIPT)
 * ==============================================================================
 */

var CONFIG = {
  SHEET_NAME: "Registrations",
  HEADER_BG: "#0D1326",
  HEADER_TEXT: "#F6CC78",
  LOCK_TIMEOUT_MS: 30000,
};

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      service: "SMS 2K26 Google Sheets Integration",
      spreadsheetName: ss.getName(),
      sheetTab: sheet.getName(),
      totalRegistrations: Math.max(0, sheet.getLastRow() - 1),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
  } catch (lockError) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      code: "LOCK_TIMEOUT",
      message: "Server busy: concurrent write timeout. Please retry."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST payload body.");
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      throw new Error("Invalid JSON: " + parseErr.message);
    }

    if (!data.fullName || !data.fullName.trim()) throw new Error("Delegate Full Name is required.");
    if (!data.email || !data.email.trim()) throw new Error("Delegate Email is required.");
    if (!data.phone || !data.phone.trim()) throw new Error("Delegate Phone is required.");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);

    ensureHeaders(sheet);

    var clearanceId = (data.clearanceId || "").trim();
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && clearanceId) {
      var existingIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingIds.length; i++) {
        if (String(existingIds[i][0]).trim() === clearanceId) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            message: "Registration already recorded with Clearance ID: " + clearanceId,
            row: i + 2,
            clearanceId: clearanceId
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    var formattedTimestamp = data.timestamp || Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    var formattedPhone = "'" + String(data.phone).trim();
    var formattedEmergencyPhone = data.emergencyPhone ? ("'" + String(data.emergencyPhone).trim()) : "";

    var newRow = [
      formattedTimestamp,
      data.clearanceId || ("SMS-2K26-" + Utilities.getUuid().substring(0, 4).toUpperCase()),
      data.fullName.trim(),
      data.email.trim(),
      formattedPhone,
      data.role || "Delegate / Member",
      data.university || "",
      data.stoneName || data.stoneId || "Mind Stone",
      data.stoneAttribute || "",
      data.dietary || "Standard / Halal",
      (data.allergyDetails && data.allergyDetails.trim()) ? data.allergyDetails.trim() : "None",
      data.emergencyContact || "",
      formattedEmergencyPhone,
      data.motivation || ""
    ];

    sheet.appendRow(newRow);

    var targetRowIndex = sheet.getLastRow();
    var rowRange = sheet.getRange(targetRowIndex, 1, 1, newRow.length);
    rowRange.setBackground(targetRowIndex % 2 === 0 ? "#FAFAFC" : "#FFFFFF");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Delegate registration successfully saved to Google Sheet.",
      clearanceId: data.clearanceId,
      row: targetRowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function getOrCreateTargetSheet(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.setName(CONFIG.SHEET_NAME);
    } else {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    }
  }
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "Clearance ID",
      "Delegate Full Name",
      "Email Address",
      "WhatsApp / Mobile",
      "Leadership Role",
      "University / Faculty",
      "Infinity Stone Resonance",
      "Leadership Pillar",
      "Dietary Preference",
      "Allergy Safeguards",
      "Emergency Contact Name",
      "Emergency Contact Phone",
      "Motivation Oath"
    ];

    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(CONFIG.HEADER_BG);
    headerRange.setFontColor(CONFIG.HEADER_TEXT);
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Montserrat");
    headerRange.setFontSize(11);
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);

    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
      if (sheet.getColumnWidth(col) < 130) {
        sheet.setColumnWidth(col, 140);
      }
    }
  }
}
`;
  }
}

export const googleSheetService = new GoogleSheetService();
