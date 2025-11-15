// ===========================
// CONFIGURATION FILE
// ===========================

// Google Sheets Configuration
const CONFIG = {
    // Your Google Sheets Web App URL (from Apps Script deployment)
    // Instructions to get this URL are in the setup guide
    SHEETS_WEB_APP_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
    
    // Spreadsheet ID
    SPREADSHEET_ID: '1-Sa1q21axQDJlWxwHs2UBFRHHpgrklUNFedg6WhuSxM',
    
    // Sheet names
    SHEETS: {
        FRIENDS_LIST: 'Friends list',
        FAMILY_ANKIT: 'Ankits Family Guestlist',
        FAMILY_AASHNA: 'Aashna\'s Family Guestlist',
        RSVP_RESPONSES: 'RSVP Responses'
    },
    
    // Event definitions
    EVENTS: {
        ENGAGEMENT: {
            id: 'engagement',
            name: 'Engagement Ceremony',
            icon: '💍',
            date: 'Saturday, 1st February 2025',
            time: 'Evening',
            venue: 'The Aryavart Escape, Nhavi',
            columnName: 'Engagement'
        },
        NIGHT1: {
            id: 'night1',
            name: 'Mehendi & Sangeet',
            icon: '🎨',
            date: 'Sunday, 9th February 2025',
            time: '5:00 PM onwards',
            venue: 'The Aryavart Escape, Nhavi',
            columnName: 'Staying Night 1'
        },
        DAY2: {
            id: 'day2',
            name: 'Wedding Ceremony',
            icon: '👰',
            date: 'Monday, 10th February 2025',
            time: '12:00 PM onwards',
            venue: 'The Aryavart Escape, Nhavi',
            columnName: 'Day 2 Event '
        }
    },
    
    // Contact information
    CONTACT: {
        phone: '+91 XXXXX XXXXX',
        email: 'contact@example.com'
    },
    
    // Company branding
    COMPANY: {
        name: 'Your Event Management Company',
        website: 'https://yourcompany.com'
    }
};

// Helper function to get query parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Helper function to store data in sessionStorage
function storeGuestData(data) {
    sessionStorage.setItem('guestData', JSON.stringify(data));
}

// Helper function to retrieve data from sessionStorage
function getGuestData() {
    const data = sessionStorage.getItem('guestData');
    return data ? JSON.parse(data) : null;
}
