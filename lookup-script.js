// ===========================
// GUEST LOOKUP SCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const lookupForm = document.getElementById('lookupForm');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    
    lookupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const guestName = document.getElementById('guestName').value.trim();
        
        if (!guestName) {
            showError('Please enter your name');
            return;
        }
        
        // Show loading
        hideError();
        showLoading();
        
        try {
            // Look up guest in the Google Sheet
            const guestData = await lookupGuest(guestName);
            
            if (guestData) {
                // Store guest data and redirect to RSVP form
                storeGuestData(guestData);
                window.location.href = 'rsvp.html';
            } else {
                hideLoading();
                showError();
            }
        } catch (error) {
            console.error('Lookup error:', error);
            hideLoading();
            showError('An error occurred. Please try again or contact us for assistance.');
        }
    });
    
    function showLoading() {
        loadingMessage.style.display = 'block';
    }
    
    function hideLoading() {
        loadingMessage.style.display = 'none';
    }
    
    function showError(customMessage) {
        if (customMessage) {
            errorMessage.innerHTML = `<p>⚠️ ${customMessage}</p>`;
        }
        errorMessage.style.display = 'block';
    }
    
    function hideError() {
        errorMessage.style.display = 'none';
    }
});

// Function to lookup guest in Google Sheets
async function lookupGuest(guestName) {
    // For prototype/demo: Use mock data
    // In production, this will call your Google Apps Script
    
    // MOCK DATA FOR DEMONSTRATION
    const mockGuestData = {
        'Avisha': {
            name: 'Avisha',
            phone: '95529 24276',
            group: 'IDFW',
            events: {
                engagement: false,
                night1: true,
                day2: true
            }
        },
        'Twankly': {
            name: 'Twankly',
            phone: '81290 97425',
            group: 'IDFW',
            events: {
                engagement: false,
                night1: true,
                day2: true
            }
        },
        'Divya': {
            name: 'Divya',
            phone: '77579 09005',
            group: 'IDFW',
            events: {
                engagement: false,
                night1: false,
                day2: true
            }
        },
        'Roshni': {
            name: 'Roshni',
            phone: '98201 22239',
            group: 'IDFW',
            events: {
                engagement: true,
                night1: true,
                day2: true
            }
        }
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Case-insensitive lookup
    const normalizedName = guestName.trim();
    for (const [key, value] of Object.entries(mockGuestData)) {
        if (key.toLowerCase() === normalizedName.toLowerCase()) {
            return value;
        }
    }
    
    return null;
    
    /* 
    // PRODUCTION CODE (uncomment when Google Apps Script is ready):
    
    try {
        const response = await fetch(CONFIG.SHEETS_WEB_APP_URL + '?action=lookupGuest&name=' + encodeURIComponent(guestName));
        const data = await response.json();
        
        if (data.success && data.guest) {
            return {
                name: data.guest.name,
                phone: data.guest.phone,
                group: data.guest.group,
                events: {
                    engagement: data.guest.engagement === 'Yes',
                    night1: data.guest.night1 === 'Yes',
                    day2: data.guest.day2 === 'Yes'
                }
            };
        }
        return null;
    } catch (error) {
        console.error('Error looking up guest:', error);
        throw error;
    }
    */
}
