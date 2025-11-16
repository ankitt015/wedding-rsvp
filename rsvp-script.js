// Load guest data on page load
window.addEventListener('DOMContentLoaded', function() {
    const guestData = sessionStorage.getItem('currentGuest');
    
    if (!guestData) {
        window.location.href = 'lookup.html';
        return;
    }
    
    const guest = JSON.parse(guestData);
    
    // Set greeting
    document.getElementById('guestGreeting').textContent = `Welcome, ${guest.fullName}! ✨`;
    
    // Pre-fill email if available
    if (guest.email) {
        document.getElementById('email').value = guest.email;
    }
    
    // Display only invited events
    const eventsList = document.getElementById('eventsList');
    guest.events.forEach(eventKey => {
        const event = EVENTS[eventKey];
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-checkbox';
        eventDiv.innerHTML = `
            <label>
                <input type="checkbox" name="event" value="${eventKey}">
                <div>
                    <strong>${event.name}</strong><br>
                    <small>${event.date} at ${event.time}</small><br>
                    <small>${event.venue}</small>
                </div>
            </label>
        `;
        eventsList.appendChild(eventDiv);
    });
    
    // Handle plus one toggle
    document.getElementById('plusOne').addEventListener('change', function() {
        const plusOneDetails = document.getElementById('plusOneDetails');
        plusOneDetails.style.display = this.value === 'yes' ? 'block' : 'none';
    });
});

// Handle form submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const guestData = JSON.parse(sessionStorage.getItem('currentGuest'));
    
    // Get selected events
    const selectedEvents = Array.from(document.querySelectorAll('input[name="event"]:checked'))
        .map(cb => cb.value);
    
    if (selectedEvents.length === 0) {
        alert('Please select at least one event to attend!');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        guestId: guestData.id,
        guestName: guestData.fullName,
        events: selectedEvents,
        fullName: document.getElementById('fullName').value,
        govIdType: document.getElementById('govIdType').value,
        govIdNumber: document.getElementById('govIdNumber').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dietary: document.getElementById('dietary').value,
        plusOne: document.getElementById('plusOne').value,
        plusOneName: document.getElementById('plusOneName').value,
        specialRequests: document.getElementById('specialRequests').value,
        timestamp: new Date().toISOString()
    };
    
    // Your Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYh2GLZf7VSQRJlovvbRY4J21FWmG-ygw6dvkVJNRmWYun9p0zRoxClsp96kTYfzs/exec';
    
    // Send to Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // Store for thank you page
        sessionStorage.setItem('rsvpData', JSON.stringify(formData));
        
        // Redirect to thank you page
        window.location.href = 'thankyou.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your RSVP. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});
