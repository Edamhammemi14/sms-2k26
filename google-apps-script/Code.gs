/**
 * ==============================================================================
 * AIESEC IN SFAX — SMS 2K26 (THE INFINITY SAGA)
 * OFFICIAL GOOGLE SHEETS LIVE REGISTRATION BACKEND (GOOGLE APPS SCRIPT)
 * ==============================================================================
 * 
 * Exact 18-Column Sheet Alignment:
 *  1: Timestamp
 *  2: Clearance ID
 *  3: Delegate Full Name
 *  4: Email Address
 *  5: WhatsApp / Mobile
 *  6: Leadership Role
 *  7: University / Faculty
 *  8: Infinity Stone Resonance
 *  9: Leadership Pillar
 * 10: Dietary Preference
 * 11: Allergy Safeguards
 * 12: Emergency Contact Name
 * 13: Emergency Contact Phone
 * 14: Motivation Oath
 * 15: Gender
 * 16: Single Room Accommodation
 * 17: Conference Fee
 * 18: Status Check
 * ==============================================================================
 */

var CONFIG = {
  SHEET_NAME: "Registrations",
  HEADER_BG: "#0D1326",
  HEADER_TEXT: "#F6CC78",
  LOCK_TIMEOUT_MS: 30000
};

var HEADERS = [
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
  "Motivation Oath",
  "Gender",
  "Single Room Accommodation",
  "Conference Fee",
  "Status Check"
];

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);
    var count = countRegistrations(sheet);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      spreadsheetName: ss.getName(),
      spreadsheetUrl: ss.getUrl(),
      totalRegistrations: count,
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
      message: "Server busy. Please retry."
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

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);

    var cid = String(data.clearanceId || ("SMS-2K26-" + Utilities.getUuid().substring(0, 4).toUpperCase())).trim();
    var time = data.timestamp || Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    var fullName = String(data.fullName || "Delegate").trim();
    var email = String(data.email || "").trim();
    var phone = "'" + String(data.phone || "").trim();
    var emergencyPhone = data.emergencyPhone ? ("'" + String(data.emergencyPhone).trim()) : "";

    var isSingle = data.singleRoom === true || 
                   data.singleRoom === "true" || 
                   String(data.feeAgreed || "").indexOf("340") !== -1 ||
                   String(data.singleRoom || "").toLowerCase().indexOf("yes") !== -1;
    var roomText = isSingle ? "Yes (+190 DT Single Room)" : "No (Standard Room)";
    var feeText = String(data.feeAgreed || (isSingle ? "340 DT (Confirmed)" : "150 DT (Confirmed)")).trim();

    // Prevent duplicate registration by clearance ID
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var clearanceCol = 2;
      var existingIds = sheet.getRange(2, clearanceCol, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingIds.length; i++) {
        if (cid && String(existingIds[i][0]).trim() === cid) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            message: "Registration already recorded with Clearance ID: " + cid,
            row: i + 2,
            clearanceId: cid
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Exact 18-column row matching your sheet
    var newRow = [
      time,                                                           // 1. Timestamp
      cid,                                                            // 2. Clearance ID
      fullName,                                                       // 3. Delegate Full Name
      email,                                                          // 4. Email Address
      phone,                                                          // 5. WhatsApp / Mobile
      String(data.role || "Delegate / Member").trim(),                 // 6. Leadership Role
      String(data.university || "").trim(),                           // 7. University / Faculty
      String(data.stoneName || data.stoneId || "Mind Stone").trim(),  // 8. Infinity Stone Resonance
      String(data.stoneAttribute || "").trim(),                       // 9. Leadership Pillar
      String(data.dietary || "Standard / Halal").trim(),              // 10. Dietary Preference
      (data.allergyDetails && String(data.allergyDetails).trim()) ? String(data.allergyDetails).trim() : "None", // 11. Allergy Safeguards
      String(data.emergencyContact || "").trim(),                     // 12. Emergency Contact Name
      emergencyPhone,                                                 // 13. Emergency Contact Phone
      String(data.motivation || "").trim(),                           // 14. Motivation Oath
      String(data.gender || "Unspecified").trim(),                    // 15. Gender
      roomText,                                                       // 16. Single Room Accommodation
      feeText,                                                        // 17. Conference Fee
      "OK"                                                            // 18. Status Check
    ];

    var targetRow = findNextAvailableRow(sheet);
    sheet.getRange(targetRow, 1, 1, newRow.length).setValues([newRow]);

    var rowRange = sheet.getRange(targetRow, 1, 1, newRow.length);
    rowRange.setBackground(targetRow % 2 === 0 ? "#FAFAFC" : "#FFFFFF");
    rowRange.setVerticalAlignment("middle");
    sheet.setRowHeight(targetRow, 26);

    // Safe Email Notification (Wrapped in try/catch so it never crashes registration)
    try {
      if (email && email.indexOf("@") !== -1) {
        MailApp.sendEmail({
          to: email,
          subject: "SMS 2K26 - Delegate Registration Confirmed (" + cid + ")",
          body: "Hello " + fullName + ",\n\nYour registration for SMS 2K26 has been successfully confirmed!\nClearance ID: " + cid + "\nRole: " + (data.role || "Delegate") + "\n\nSee you at the assembly!\nAIESEC in Sfax"
        });
      }
    } catch (mailError) {
      // Safe fallback - row is already saved in sheet
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Delegate registration successfully saved to Google Sheet.",
      clearanceId: cid,
      row: targetRow
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

function findNextAvailableRow(sheet) {
  var colB = sheet.getRange("B:B").getValues();
  for (var i = 1; i < colB.length; i++) {
    if (!colB[i][0] || String(colB[i][0]).trim() === "") {
      return i + 1;
    }
  }
  return sheet.getLastRow() + 1;
}

function countRegistrations(sheet) {
  var colB = sheet.getRange("B:B").getValues();
  var count = 0;
  for (var i = 1; i < colB.length; i++) {
    if (colB[i][0] && String(colB[i][0]).trim() !== "") {
      count++;
    }
  }
  return count;
}

function getOrCreateTargetSheet(ss) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    var active = ss.getActiveSheet();
    if (ss.getSheets().length === 1 && active.getLastRow() <= 1) {
      active.setName(CONFIG.SHEET_NAME);
      return active;
    }
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  return sheet;
}
