// ===========================
// THANK YOU PAGE SCRIPT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Get RSVP data from session storage
    const rsvpData = JSON.parse(sessionStorage.getItem('rsvpData'));
    const guestData = getGuestData();
    
    if (!rsvpData || !guestData) {
        // If no data, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    // Display RSVP summary
    displayRSVPSummary(rsvpData, guestData);
    
    // Clear session storage after a delay (so user can refresh if needed)
    setTimeout(() => {
        sessionStorage.removeItem('guestData');
        sessionStorage.removeItem('rsvpData');
    }, 300000); // 5 minutes
});

function displayRSVPSummary(rsvpData, guestData) {
    const summaryContent = document.getElementById('summaryContent');
    
    let html = `
        <div style="padding: 20px;">
            <p><strong>Name:</strong> ${rsvpData.guestName}</p>
            <p><strong>Legal Name:</strong> ${rsvpData.legalName}</p>
            <p><strong>Phone:</strong> ${rsvpData.phone}</p>
            
            <h4 style="margin-top: 25px; margin-bottom: 15px; color: var(--primary-color);">Event Attendance:</h4>
    `;
    
    // Show event responses
    if (guestData.events.engagement) {
        const status = rsvpData.events.engagement === 'yes' ? '✅ Attending' : '❌ Not Attending';
        html += `<p><strong>💍 Engagement:</strong> ${status}</p>`;
    }
    
    if (guestData.events.night1) {
        const status = rsvpData.events.night1 === 'yes' ? '✅ Attending' : '❌ Not Attending';
        html += `<p><strong>🎨 Mehendi & Sangeet:</strong> ${status}</p>`;
    }
    
    if (guestData.events.day2) {
        const status = rsvpData.events.day2 === 'yes' ? '✅ Attending' : '❌ Not Attending';
        html += `<p><strong>👰 Wedding Ceremony:</strong> ${status}</p>`;
    }
    
    if (rsvpData.dietary) {
        html += `
            <h4 style="margin-top: 25px; margin-bottom: 15px; color: var(--primary-color);">Dietary Preferences:</h4>
            <p>${rsvpData.dietary}</p>
        `;
    }
    
    html += `
            <h4 style="margin-top: 25px; margin-bottom: 15px; color: var(--success);">Documents Submitted:</h4>
            <p>✓ Aadhaar Card: ${rsvpData.aadhaarUploaded ? 'Uploaded' : 'Not uploaded'}</p>
            <p>✓ PAN Card: ${rsvpData.panUploaded ? 'Uploaded' : 'Not uploaded'}</p>
        </div>
    `;
    
    summaryContent.innerHTML = html;
}
