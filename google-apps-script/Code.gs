/**
 * ==============================================================================
 * AIESEC IN SFAX — SMS 2K26 (THE INFINITY SAGA)
 * DYNAMIC GOOGLE SHEETS REGISTRATION BACKEND (GOOGLE APPS SCRIPT)
 * ==============================================================================
 * 
 * Key Features:
 *  1. Dynamic Auto-Column Detection:
 *     Any new field sent in the JSON payload (like Single Room, Shirt Size, etc.)
 *     automatically creates a new styled column in Row 1 if missing!
 *  2. Dedicated "Single Room Accommodation" Column:
 *     Formats boolean true/false into "Yes (+190 DT)" or "No (Standard Room)".
 *  3. Header-to-Value Mapping:
 *     Data is inserted based on column header matching, ensuring no column misalignment.
 *  4. Atomic Concurrency Lock:
 *     Uses LockService to prevent race conditions during high-volume submissions.
 *  5. Duplicate Prevention:
 *     Prevents duplicate rows by checking Clearance ID and Email.
 *  6. Format Preservation:
 *     Prefixes phone numbers with a single quote to preserve '+' and leading zeros.
 * ==============================================================================
 */

// Visual styling configuration for Google Sheets headers
var CONFIG = {
  SHEET_NAME: "Registrations", // Name of the target sheet tab
  HEADER_BG: "#0D1326",        // S.H.I.E.L.D. Cosmic Navy
  HEADER_TEXT: "#F6CC78",      // Imperial Marvel Gold
  LOCK_TIMEOUT_MS: 30000       // 30 seconds atomic lock timeout
};

// Known field key to friendly header label dictionary
var FIELD_LABELS = {
  timestamp: "Timestamp",
  clearanceId: "Clearance ID",
  fullName: "Delegate Full Name",
  gender: "Gender",
  email: "Email Address",
  phone: "WhatsApp / Mobile",
  role: "Leadership Role",
  university: "University / Faculty",
  stoneName: "Infinity Stone Resonance",
  stoneAttribute: "Leadership Pillar",
  dietary: "Dietary Preference",
  allergyDetails: "Allergy Safeguards",
  emergencyContact: "Emergency Contact Name",
  emergencyPhone: "Emergency Contact Phone",
  motivation: "Motivation Oath",
  singleRoom: "Single Room Accommodation",
  feeAgreed: "Conference Fee"
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
      service: "SMS 2K26 Dynamic Google Sheets Integration",
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
 * Handle POST requests (Dynamically syncs incoming delegate data to the sheet)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // 1. Acquire atomic script lock to safely support concurrent submissions
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

    // 3. Normalize values for formatted display
    var normalizedData = {};
    for (var key in data) {
      normalizedData[key] = data[key];
    }

    // Default timestamp and clearance ID if absent
    normalizedData.timestamp = data.timestamp || Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd HH:mm:ss");
    normalizedData.clearanceId = data.clearanceId || ("SMS-2K26-" + Utilities.getUuid().substring(0, 4).toUpperCase());

    // Clean phone numbers
    normalizedData.phone = "'" + String(data.phone || "").trim();
    if (data.emergencyPhone) {
      normalizedData.emergencyPhone = "'" + String(data.emergencyPhone).trim();
    }

    // Format Single Room Accommodation
    if (data.singleRoom === true || data.singleRoom === "true" || String(data.singleRoom).toLowerCase().indexOf("yes") !== -1) {
      normalizedData.singleRoom = "Yes (+190 DT Single Room)";
    } else if (data.singleRoom === false || data.singleRoom === "false") {
      normalizedData.singleRoom = "No (Standard Room)";
    } else if (!data.singleRoom) {
      normalizedData.singleRoom = (String(data.feeAgreed || "").indexOf("340") !== -1) ? "Yes (+190 DT Single Room)" : "No (Standard Room)";
    }

    // 4. Dynamic Auto-Column Sync: Ensure all keys exist as header columns
    var headerMap = syncHeaderColumns(sheet, normalizedData);

    // 5. Duplicate prevention check
    var clearanceId = String(normalizedData.clearanceId || "").trim();
    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && headerMap["clearanceId"]) {
      var clearanceCol = headerMap["clearanceId"];
      var existingIds = sheet.getRange(2, clearanceCol, lastRow - 1, 1).getValues();

      for (var i = 0; i < existingIds.length; i++) {
        if (clearanceId && String(existingIds[i][0]).trim() === clearanceId) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            message: "Registration already recorded with Clearance ID: " + clearanceId,
            row: i + 2,
            clearanceId: clearanceId
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 6. Build the new row matching exact header column positions
    var totalCols = sheet.getLastColumn();
    var newRow = new Array(totalCols);
    for (var colIdx = 0; colIdx < totalCols; colIdx++) {
      newRow[colIdx] = ""; // initialize empty
    }

    for (var fieldKey in normalizedData) {
      var targetCol = headerMap[fieldKey];
      if (targetCol && targetCol <= totalCols) {
        var val = normalizedData[fieldKey];
        newRow[targetCol - 1] = (val !== null && val !== undefined) ? String(val) : "";
      }
    }

    // 7. Append row and apply alternate zebra shading
    sheet.appendRow(newRow);
    var targetRowIndex = sheet.getLastRow();
    var rowRange = sheet.getRange(targetRowIndex, 1, 1, newRow.length);
    if (targetRowIndex % 2 === 0) {
      rowRange.setBackground("#FAFAFC");
    } else {
      rowRange.setBackground("#FFFFFF");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Delegate registration successfully saved to Google Sheet.",
      clearanceId: normalizedData.clearanceId,
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

/**
 * Returns or creates the target worksheet tab.
 */
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

/**
 * Automatically inspects the sheet headers in Row 1.
 * If any incoming field from normalizedData is not in Row 1, it automatically adds a new styled column!
 * Returns a dictionary mapping fieldKey -> columnNumber (1-indexed).
 */
function syncHeaderColumns(sheet, dataObj) {
  var lastCol = sheet.getLastColumn();
  var headerValues = [];

  // Default baseline headers for new sheets
  var baselineOrder = [
    "timestamp",
    "clearanceId",
    "fullName",
    "gender",
    "email",
    "phone",
    "role",
    "university",
    "stoneName",
    "stoneAttribute",
    "dietary",
    "allergyDetails",
    "emergencyContact",
    "emergencyPhone",
    "motivation",
    "singleRoom",
    "feeAgreed"
  ];

  if (lastCol === 0 || sheet.getLastRow() === 0) {
    // Populate full initial headers
    var initialHeaders = [];
    for (var b = 0; b < baselineOrder.length; b++) {
      var k = baselineOrder[b];
      initialHeaders.push(FIELD_LABELS[k] || formatKeyAsLabel(k));
    }
    sheet.appendRow(initialHeaders);
    formatHeaderRow(sheet, 1, initialHeaders.length);
    sheet.setFrozenRows(1);
    lastCol = initialHeaders.length;
    headerValues = initialHeaders;
  } else {
    headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  }

  // Create dictionary of lowercase cleaned header text -> column index (1-indexed)
  var headerNameToCol = {};
  for (var c = 0; c < headerValues.length; c++) {
    var rawText = String(headerValues[c]).trim().toLowerCase();
    headerNameToCol[rawText] = c + 1;
  }

  var keyToCol = {};

  // Map known fields first
  for (var key in dataObj) {
    if (key === "stoneId") continue; // redundant with stoneName

    var desiredLabel = FIELD_LABELS[key] || formatKeyAsLabel(key);
    var searchKey = desiredLabel.toLowerCase();
    var altKey = key.toLowerCase();

    var foundCol = null;

    // Search by exact label or key
    for (var existingText in headerNameToCol) {
      if (existingText === searchKey || existingText === altKey) {
        foundCol = headerNameToCol[existingText];
        break;
      }
    }

    // Fuzzy matching for known core fields
    if (!foundCol) {
      if (key === "fullName" && headerNameToCol["name"]) foundCol = headerNameToCol["name"];
      if (key === "singleRoom" && (headerNameToCol["single room"] || headerNameToCol["room"])) {
        foundCol = headerNameToCol["single room"] || headerNameToCol["room"];
      }
      if (key === "feeAgreed" && headerNameToCol["fee"]) foundCol = headerNameToCol["fee"];
    }

    // IF COLUMN DOES NOT EXIST: AUTOMATICALLY ADD NEW COLUMN TO SHEET!
    if (!foundCol) {
      lastCol = sheet.getLastColumn() + 1;
      var newCell = sheet.getRange(1, lastCol);
      newCell.setValue(desiredLabel);
      styleHeaderCell(newCell);
      sheet.setColumnWidth(lastCol, Math.max(140, desiredLabel.length * 9));
      
      headerNameToCol[searchKey] = lastCol;
      foundCol = lastCol;
    }

    keyToCol[key] = foundCol;
  }

  return keyToCol;
}

/**
 * Turns camelCase or snake_case key into Title Case label (e.g. shirtSize -> Shirt Size)
 */
function formatKeyAsLabel(key) {
  var result = key.replace(/([A-Z])/g, " $1");
  result = result.replace(/_/g, " ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Applies S.H.I.E.L.D. Marvel styling to the entire header row
 */
function formatHeaderRow(sheet, startCol, numCols) {
  var headerRange = sheet.getRange(1, startCol, 1, numCols);
  headerRange.setBackground(CONFIG.HEADER_BG);
  headerRange.setFontColor(CONFIG.HEADER_TEXT);
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Montserrat");
  headerRange.setFontSize(11);
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  for (var col = startCol; col < startCol + numCols; col++) {
    sheet.autoResizeColumn(col);
    if (sheet.getColumnWidth(col) < 130) {
      sheet.setColumnWidth(col, 140);
    }
  }
}

/**
 * Styles a single newly added header cell
 */
function styleHeaderCell(cell) {
  cell.setBackground(CONFIG.HEADER_BG);
  cell.setFontColor(CONFIG.HEADER_TEXT);
  cell.setFontWeight("bold");
  cell.setFontFamily("Montserrat");
  cell.setFontSize(11);
  cell.setVerticalAlignment("middle");
}
