/**
 * ==============================================================================
 * AIESEC IN SFAX — SMS 2K26 (THE INFINITY SAGA)
 * OFFICIAL GOOGLE SHEETS LIVE REGISTRATION BACKEND PROXY (GOOGLE APPS SCRIPT)
 * ==============================================================================
 * 
 * Features:
 *  1. Atomic write locks via LockService (prevents race conditions & row collisions).
 *  2. Duplicate prevention by Clearance ID & Email address.
 *  3. Automatic creation and Marvel/S.H.I.E.L.D. themed styling of column headers.
 *  4. Format preservation (stores phone numbers as clean text strings).
 *  5. Health check via doGet(e) for 1-click connectivity verification.
 *  6. Safe error responses with CORS-compliant JSON outputs.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 *  1. Open your target Google Spreadsheet (https://sheets.google.com).
 *  2. Go to "Extensions" > "Apps Script".
 *  3. Replace any default code in Code.gs with this entire file.
 *  4. Click the blue "Deploy" button at the top-right -> "New deployment".
 *  5. Click the gear icon next to "Select type" -> select "Web app".
 *  6. Configuration:
 *       - Description: "SMS 2K26 Delegate Registration Hook"
 *       - Execute as: "Me" (your Google account)
 *       - Who has access: "Anyone" (Required so public delegates can submit without Google login)
 *  7. Click "Deploy", authorize access if prompted, and copy the "Web app URL" 
 *     (starts with https://script.google.com/macros/s/.../exec).
 *  8. Paste that URL into your site's .env file (VITE_GOOGLE_SHEET_URL=...) or inside 
 *     the Organizer Portal on the website!
 * ==============================================================================
 */

// Configuration constants
var CONFIG = {
  SHEET_NAME: "Registrations", // Name of the target sheet tab (auto-created if missing)
  HEADER_BG: "#0D1326",        // S.H.I.E.L.D. Deep Cosmic Navy
  HEADER_TEXT: "#F6CC78",      // Imperial Gold
  LOCK_TIMEOUT_MS: 30000,      // 30 seconds atomic lock timeout
};

/**
 * Handle GET requests (Used for health checks and connectivity testing from the website)
 */
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

/**
 * Handle POST requests (Appends incoming validated delegate registration data)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // 1. Acquire atomic script lock to safely support concurrent delegate submissions
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
  } catch (lockError) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      code: "LOCK_TIMEOUT",
      message: "Server is handling heavy traffic. Please retry in a few seconds."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 2. Parse and validate incoming payload
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST payload body.");
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      throw new Error("Invalid JSON payload: " + parseErr.message);
    }

    // Required fields validation
    if (!data.fullName || !data.fullName.trim()) {
      throw new Error("Delegate Full Name is required.");
    }
    if (!data.email || !data.email.trim()) {
      throw new Error("Delegate Email is required.");
    }
    if (!data.phone || !data.phone.trim()) {
      throw new Error("Delegate Phone number is required.");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);

    // 3. Ensure header row exists
    ensureHeaders(sheet);

    // 4. Duplicate prevention check (matches Clearance ID or Email)
    var clearanceId = (data.clearanceId || "").trim();
    var email = (data.email || "").trim().toLowerCase();
    
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var headerVals = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var clearanceCol = 2;
      var emailCol = 5;
      for (var c = 0; c < headerVals.length; c++) {
        var hText = String(headerVals[c]).trim().toLowerCase();
        if (hText.indexOf("clearance") !== -1) clearanceCol = c + 1;
        if (hText.indexOf("email") !== -1) emailCol = c + 1;
      }

      var existingIds = sheet.getRange(2, clearanceCol, lastRow - 1, 1).getValues();
      var existingEmails = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();

      for (var i = 0; i < existingIds.length; i++) {
        var existingId = String(existingIds[i][0]).trim();
        var existingEmail = String(existingEmails[i][0]).trim().toLowerCase();

        if (clearanceId && existingId === clearanceId) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            message: "Registration already recorded with Clearance ID: " + clearanceId,
            row: i + 2,
            clearanceId: clearanceId
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 5. Construct cleanly formatted row data
    var formattedTimestamp = data.timestamp || Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    var formattedPhone = "'" + String(data.phone).trim(); // Leading quote preserves + and zeros
    var formattedEmergencyPhone = data.emergencyPhone ? ("'" + String(data.emergencyPhone).trim()) : "";

    var newRow = [
      formattedTimestamp,
      data.clearanceId || ("SMS-2K26-" + Utilities.getUuid().substring(0, 4).toUpperCase()),
      data.fullName.trim(),
      data.gender || "",
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
      data.motivation || "",
      data.feeAgreed || "150 DT (Confirmed)"
    ];

    // 6. Append row
    sheet.appendRow(newRow);

    // Subtle alternate row shading for readability
    var targetRowIndex = sheet.getLastRow();
    var rowRange = sheet.getRange(targetRowIndex, 1, 1, newRow.length);
    if (targetRowIndex % 2 === 0) {
      rowRange.setBackground("#FAFAFC");
    } else {
      rowRange.setBackground("#FFFFFF");
    }

    // Return success response
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
    // 7. Always release atomic lock
    lock.releaseLock();
  }
}

/**
 * Returns or creates the target worksheet tab.
 */
function getOrCreateTargetSheet(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    // If target sheet tab doesn't exist, use active sheet or create one
    sheet = ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.setName(CONFIG.SHEET_NAME);
    } else {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    }
  }
  return sheet;
}

/**
 * Creates and formats column headers if sheet is empty, or adds missing columns.
 */
function ensureHeaders(sheet) {
  var headers = [
    "Timestamp",
    "Clearance ID",
    "Delegate Full Name",
    "Gender",
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
    "Motivation Oath",
    "Conference Fee"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(CONFIG.HEADER_BG);
    headerRange.setFontColor(CONFIG.HEADER_TEXT);
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Montserrat");
    headerRange.setFontSize(11);
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Auto-fit column widths
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
      // Ensure generous minimum width
      if (sheet.getColumnWidth(col) < 130) {
        sheet.setColumnWidth(col, 140);
      }
    }
  } else {
    // If sheet already exists, ensure "Gender" column exists
    var lastCol = sheet.getLastColumn();
    var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var hasGender = false;
    for (var i = 0; i < existingHeaders.length; i++) {
      if (String(existingHeaders[i]).trim().toLowerCase() === "gender") {
        hasGender = true;
        break;
      }
    }
    // If missing, automatically insert Gender column after Column 3 (Delegate Full Name)
    if (!hasGender) {
      sheet.insertColumnAfter(3);
      var genderCell = sheet.getRange(1, 4);
      genderCell.setValue("Gender");
      genderCell.setBackground(CONFIG.HEADER_BG);
      genderCell.setFontColor(CONFIG.HEADER_TEXT);
      genderCell.setFontWeight("bold");
      genderCell.setFontFamily("Montserrat");
      genderCell.setFontSize(11);
      genderCell.setVerticalAlignment("middle");
      sheet.setColumnWidth(4, 120);
    }
  }
}
