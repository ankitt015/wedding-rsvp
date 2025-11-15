// ===========================
// RSVP FORM SCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Get guest data from session storage
    const guestData = getGuestData();
    
    if (!guestData) {
        // If no guest data, redirect to lookup page
        window.location.href = 'lookup.html';
        return;
    }
    
    // Display guest name
    document.getElementById('guestNameDisplay').textContent = guestData.name;
    document.getElementById('guestName').value = guestData.name;
    
    // Generate event questions based on which events they're invited to
    generateEventQuestions(guestData.events);
    
    // Handle form submission
    const rsvpForm = document.getElementById('rsvpForm');
    rsvpForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    setupValidation();
});

function generateEventQuestions(events) {
    const eventsSection = document.getElementById('eventsSection');
    let html = '';
    
    if (events.engagement) {
        html += createEventQuestion(CONFIG.EVENTS.ENGAGEMENT);
    }
    
    if (events.night1) {
        html += createEventQuestion(CONFIG.EVENTS.NIGHT1);
    }
    
    if (events.day2) {
        html += createEventQuestion(CONFIG.EVENTS.DAY2);
    }
    
    eventsSection.innerHTML = html;
}

function createEventQuestion(event) {
    return `
        <div class="form-group">
            <label style="font-size: 1.2rem; margin-bottom: 15px;">
                ${event.icon} ${event.name}
            </label>
            <div class="event-details" style="margin-bottom: 15px; margin-left: 0;">
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
            </div>
            
            <div class="event-option">
                <label>
                    <input type="radio" name="${event.id}" value="yes" required>
                    ✅ Yes, I'll be there!
                </label>
            </div>
            
            <div class="event-option">
                <label>
                    <input type="radio" name="${event.id}" value="no" required>
                    ❌ No, I can't make it
                </label>
            </div>
        </div>
    `;
}

function setupValidation() {
    // Aadhaar validation
    const aadhaarInput = document.getElementById('aadhaarNumber');
    aadhaarInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 12);
    });
    
    // PAN validation
    const panInput = document.getElementById('panNumber');
    panInput.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase().substring(0, 10);
    });
    
    // File size validation
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.size > 10 * 1024 * 1024) { // 10MB
                alert('File size must be less than 10MB');
                this.value = '';
            }
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formError = document.getElementById('formError');
    const formLoading = document.getElementById('formLoading');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Hide error, show loading
    formError.style.display = 'none';
    formLoading.style.display = 'block';
    submitButton.disabled = true;
    
    try {
        // Collect form data
        const formData = collectFormData();
        
        // Submit to Google Sheets
        const success = await submitRSVP(formData);
        
        if (success) {
            // Store RSVP data for thank you page
            storeRSVPData(formData);
            
            // Redirect to thank you page
            window.location.href = 'thankyou.html';
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        formLoading.style.display = 'none';
        formError.textContent = 'An error occurred. Please try again or contact us for assistance.';
        formError.style.display = 'block';
        submitButton.disabled = false;
    }
}

function collectFormData() {
    const guestData = getGuestData();
    const formData = {
        timestamp: new Date().toISOString(),
        guestName: document.getElementById('guestName').value,
        legalName: document.getElementById('legalName').value,
        aadhaarNumber: document.getElementById('aadhaarNumber').value,
        panNumber: document.getElementById('panNumber').value,
        dietary: document.getElementById('dietary').value,
        phone: document.getElementById('phone').value,
        events: {}
    };
    
    // Collect event responses
    if (guestData.events.engagement) {
        const engagementResponse = document.querySelector('input[name="engagement"]:checked');
        formData.events.engagement = engagementResponse ? engagementResponse.value : '';
    }
    
    if (guestData.events.night1) {
        const night1Response = document.querySelector('input[name="night1"]:checked');
        formData.events.night1 = night1Response ? night1Response.value : '';
    }
    
    if (guestData.events.day2) {
        const day2Response = document.querySelector('input[name="day2"]:checked');
        formData.events.day2 = day2Response ? day2Response.value : '';
    }
    
    // Note: File uploads would need to be handled separately via Google Drive API
    // For now, we'll note that files were uploaded
    formData.aadhaarUploaded = document.getElementById('aadhaarUpload').files.length > 0;
    formData.panUploaded = document.getElementById('panUpload').files.length > 0;
    
    return formData;
}

async function submitRSVP(formData) {
    // For prototype/demo: Simulate successful submission
    console.log('RSVP Data to submit:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return true;
    
    /*
    // PRODUCTION CODE (uncomment when Google Apps Script is ready):
    
    try {
        const response = await fetch(CONFIG.SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'submitRSVP',
                data: formData
            })
        });
        
        // Note: With 'no-cors', we can't read the response
        // So we assume success if no error is thrown
        return true;
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        return false;
    }
    */
}

function storeRSVPData(formData) {
    sessionStorage.setItem('rsvpData', JSON.stringify(formData));
}
