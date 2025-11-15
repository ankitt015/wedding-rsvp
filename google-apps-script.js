// ===========================
// GOOGLE APPS SCRIPT
// Backend for Wedding RSVP Portal
// ===========================

// Your Spreadsheet ID
const SPREADSHEET_ID = '1-Sa1q21axQDJlWxwHs2UBFRHHpgrklUNFedg6WhuSxM';

// Sheet names
const SHEETS = {
  FRIENDS_LIST: 'Friends list',
  FAMILY_ANKIT: 'Ankits Family Guestlist',
  FAMILY_AASHNA: 'Aashna\'s Family Guestlist',
  RSVP_RESPONSES: 'RSVP Responses'
};

/**
 * Handle GET requests - for guest lookup
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'lookupGuest') {
      const guestName = e.parameter.name;
      const guest = lookupGuest(guestName);
      
      if (guest) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true,
            guest: guest
          }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            message: 'Guest not found'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid action'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests - for RSVP submission
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'submitRSVP') {
      const success = submitRSVP(data.data);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: success,
          message: success ? 'RSVP submitted successfully' : 'Failed to submit RSVP'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid action'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Look up a guest across all guest list sheets
 */
function lookupGuest(guestName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Search in all guest list sheets
  const sheetsToSearch = [
    SHEETS.FRIENDS_LIST,
    SHEETS.FAMILY_ANKIT,
    SHEETS.FAMILY_AASHNA
  ];
  
  for (const sheetName of sheetsToSearch) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) continue;
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find column indices
    const nameCol = headers.indexOf('Full Name');
    const phoneCol = headers.indexOf('Contact Info');
    const groupCol = headers.indexOf('Group');
    const engagementCol = headers.indexOf('Engagement');
    const night1Col = headers.indexOf('Staying Night 1');
    const day2Col = headers.indexOf('Day 2 Event ');
    
    // Search for guest (case-insensitive)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const currentName = String(row[nameCol]).trim();
      
      if (currentName.toLowerCase() === guestName.toLowerCase()) {
        return {
          name: currentName,
          phone: row[phoneCol] || '',
          group: row[groupCol] || '',
          engagement: row[engagementCol] === 'Yes' ? 'Yes' : 'No',
          night1: row[night1Col] === 'Yes' ? 'Yes' : 'No',
          day2: row[day2Col] === 'Yes' ? 'Yes' : 'No',
          rowIndex: i + 1,
          sheetName: sheetName
        };
      }
    }
  }
  
  return null;
}

/**
 * Submit RSVP to the RSVP Responses sheet
 */
function submitRSVP(rsvpData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEETS.RSVP_RESPONSES);
    
    if (!sheet) {
      throw new Error('RSVP Responses sheet not found');
    }
    
    // Prepare row data
    const rowData = [
      new Date(), // Timestamp
      rsvpData.guestName,
      rsvpData.events.engagement || 'N/A',
      rsvpData.events.night1 || 'N/A',
      rsvpData.events.day2 || 'N/A',
      rsvpData.legalName,
      rsvpData.aadhaarNumber,
      rsvpData.panNumber,
      rsvpData.aadhaarUploaded ? 'Yes' : 'No',
      rsvpData.panUploaded ? 'Yes' : 'No',
      rsvpData.dietary || '',
      rsvpData.phone
    ];
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Guest Name',
        'Engagement RSVP',
        'Night 1 RSVP',
        'Day 2 RSVP',
        'Legal Name',
        'Aadhaar Number',
        'PAN Number',
        'Aadhaar Uploaded',
        'PAN Uploaded',
        'Dietary Restrictions',
        'Phone'
      ]);
    }
    
    // Append the data
    sheet.appendRow(rowData);
    
    // Update the master guest list with RSVP status
    updateMasterListRSVPStatus(rsvpData.guestName, rsvpData.events);
    
    return true;
  } catch (error) {
    Logger.log('Error submitting RSVP: ' + error.toString());
    return false;
  }
}

/**
 * Update the master guest list to mark RSVP as received
 */
function updateMasterListRSVPStatus(guestName, events) {
  try {
    const guest = lookupGuest(guestName);
    if (!guest) return;
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(guest.sheetName);
    if (!sheet) return;
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rsvpStatusCol = headers.indexOf('RSVP Status') + 1;
    
    if (rsvpStatusCol > 0) {
      sheet.getRange(guest.rowIndex, rsvpStatusCol).setValue('Received');
    }
    
    // Update individual event RSVP columns if they exist
    if (events.engagement) {
      const engagementRsvpCol = headers.indexOf('RSVP Engagement') + 1;
      if (engagementRsvpCol > 0) {
        sheet.getRange(guest.rowIndex, engagementRsvpCol).setValue(events.engagement);
      }
    }
    
    if (events.night1) {
      const night1RsvpCol = headers.indexOf('RSVP Aryavart') + 1;
      if (night1RsvpCol > 0) {
        sheet.getRange(guest.rowIndex, night1RsvpCol).setValue(events.night1);
      }
    }
    
    if (events.day2) {
      const day2RsvpCol = headers.indexOf('RSVP Day 2') + 1;
      if (day2RsvpCol > 0) {
        sheet.getRange(guest.rowIndex, day2RsvpCol).setValue(events.day2);
      }
    }
    
  } catch (error) {
    Logger.log('Error updating master list: ' + error.toString());
  }
}

/**
 * Test function - run this to test guest lookup
 */
function testLookup() {
  const result = lookupGuest('Avisha');
  Logger.log(result);
}

/**
 * Test function - run this to test RSVP submission
 */
function testSubmit() {
  const testData = {
    guestName: 'Avisha',
    legalName: 'Avisha Kumar',
    aadhaarNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    dietary: 'Vegetarian',
    phone: '+91 95529 24276',
    events: {
      engagement: 'no',
      night1: 'yes',
      day2: 'yes'
    },
    aadhaarUploaded: true,
    panUploaded: true
  };
  
  const result = submitRSVP(testData);
  Logger.log('Submission result: ' + result);
}
