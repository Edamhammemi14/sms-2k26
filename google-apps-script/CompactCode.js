/**
 * ==============================================================================
 * AIESEC IN SFAX — SMS 2K26 (THE INFINITY SAGA)
 * OFFICIAL GOOGLE SHEETS LIVE REGISTRATION BACKEND (GOOGLE APPS SCRIPT)
 * ==============================================================================
 */

var CONFIG = {
  SHEET_NAME: "Registrations",
  HEADER_BG: "#0D1326",
  HEADER_TEXT: "#F6CC78",
  LOCK_TIMEOUT_MS: 30000
};

var HEADERS = [
  "Timestamp", "Clearance ID", "Delegate Full Name", "Email Address", "WhatsApp / Mobile",
  "Leadership Role", "University / Faculty", "Infinity Stone Resonance", "Leadership Pillar",
  "Dietary Preference", "Allergy Safeguards", "Emergency Contact Name", "Emergency Contact Phone",
  "Motivation Oath", "Gender", "Single Room Accommodation", "Conference Fee", "Status Check"
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
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Busy" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST payload body.");
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateTargetSheet(ss);

    var cid = String(data.clearanceId || ("SMS-2K26-" + Utilities.getUuid().substring(0, 4).toUpperCase())).trim();
    var time = data.timestamp || Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    var fullName = String(data.fullName || "Delegate").trim();
    var email = String(data.email || "").trim();
    var phone = "'" + String(data.phone || "").trim();
    var emergencyPhone = data.emergencyPhone ? ("'" + String(data.emergencyPhone).trim()) : "";

    var isSingle = data.singleRoom === true || data.singleRoom === "true" || String(data.feeAgreed || "").indexOf("340") !== -1;
    var roomText = isSingle ? "Yes (+190 DT Single Room)" : "No (Standard Room)";
    var feeText = String(data.feeAgreed || (isSingle ? "340 DT (Confirmed)" : "150 DT (Confirmed)")).trim();

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

    var newRow = [
      time,
      cid,
      fullName,
      email,
      phone,
      String(data.role || "Delegate / Member").trim(),
      String(data.university || "").trim(),
      String(data.stoneName || data.stoneId || "Mind Stone").trim(),
      String(data.stoneAttribute || "").trim(),
      String(data.dietary || "Standard / Halal").trim(),
      (data.allergyDetails && String(data.allergyDetails).trim()) ? String(data.allergyDetails).trim() : "None",
      String(data.emergencyContact || "").trim(),
      emergencyPhone,
      String(data.motivation || "").trim(),
      String(data.gender || "Unspecified").trim(),
      roomText,
      feeText,
      "OK"
    ];

    var targetRow = findNextAvailableRow(sheet);
    sheet.getRange(targetRow, 1, 1, newRow.length).setValues([newRow]);
    sheet.getRange(targetRow, 1, 1, newRow.length).setBackground(targetRow % 2 === 0 ? "#FAFAFC" : "#FFFFFF");
    sheet.setRowHeight(targetRow, 26);

    try {
      if (email && email.indexOf("@") !== -1) {
        MailApp.sendEmail({
          to: email,
          subject: "SMS 2K26 - Delegate Registration Confirmed (" + cid + ")",
          body: "Hello " + fullName + ",\n\nYour registration for SMS 2K26 has been successfully confirmed!\nClearance ID: " + cid + "\n\nSee you at the conference!\nAIESEC in Sfax"
        });
      }
    } catch (mailErr) {
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Delegate registration successfully saved to Google Sheet.",
      clearanceId: cid,
      row: targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function findNextAvailableRow(sheet) {
  var colB = sheet.getRange("B:B").getValues();
  var lastRow = 1;
  for (var i = 1; i < colB.length; i++) {
    if (colB[i][0] && String(colB[i][0]).trim() !== "") lastRow = i + 1;
  }
  return lastRow + 1;
}

function countRegistrations(sheet) {
  var colB = sheet.getRange("B:B").getValues();
  var count = 0;
  for (var i = 1; i < colB.length; i++) {
    if (colB[i][0] && String(colB[i][0]).trim() !== "") count++;
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
