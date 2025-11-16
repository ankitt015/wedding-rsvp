function lookupGuest() {
    console.log('lookupGuest function called');
    
    const guestName = document.getElementById('guestName').value.trim().toLowerCase();
    const errorDiv = document.getElementById('errorMessage');
    const suggestionsDiv = document.getElementById('suggestions');
    
    console.log('Searching for guest:', guestName);
    
    // Clear previous messages
    errorDiv.style.display = 'none';
    suggestionsDiv.style.display = 'none';
    
    if (!guestName) {
        errorDiv.textContent = 'Please enter your name';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Check if GUESTS_DATABASE is loaded
    if (typeof GUESTS_DATABASE === 'undefined') {
        console.error('GUESTS_DATABASE is not defined!');
        errorDiv.textContent = 'System error: Guest database not loaded. Please refresh the page.';
        errorDiv.style.display = 'block';
        return;
    }
    
    console.log('Available guests:', Object.keys(GUESTS_DATABASE));
    
    // Look for exact match
    if (GUESTS_DATABASE[guestName]) {
        console.log('Exact match found:', GUESTS_DATABASE[guestName]);
        // Store guest data and redirect
        sessionStorage.setItem('currentGuest', JSON.stringify(GUESTS_DATABASE[guestName]));
        console.log('Redirecting to rsvp.html');
        window.location.href = 'rsvp.html';
        return;
    }
    
    // Look for partial matches
    const matches = Object.keys(GUESTS_DATABASE).filter(key => 
        key.includes(guestName) || GUESTS_DATABASE[key].fullName.toLowerCase().includes(guestName)
    );
    
    console.log('Partial matches found:', matches);
    
    if (matches.length > 0) {
        // Show suggestions
        suggestionsDiv.innerHTML = `
            <h4>Did you mean:</h4>
            <ul>
                ${matches.map(key => `
                    <li onclick="selectGuest('${key}')">${GUESTS_DATABASE[key].fullName}</li>
                `).join('')}
            </ul>
        `;
        suggestionsDiv.style.display = 'block';
    } else {
        errorDiv.textContent = 'We couldn\'t find your name in our guest list. Please check the spelling or contact us at hello@ankitaashna.com';
        errorDiv.style.display = 'block';
    }
}

function selectGuest(guestKey) {
    console.log('Guest selected:', guestKey);
    sessionStorage.setItem('currentGuest', JSON.stringify(GUESTS_DATABASE[guestKey]));
    window.location.href = 'rsvp.html';
}

// Allow Enter key to trigger lookup
document.getElementById('guestName')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        lookupGuest();
    }
});

// Debug: Log when script loads
console.log('lookup-script.js loaded');
console.log('GUESTS_DATABASE available:', typeof GUESTS_DATABASE !== 'undefined');
