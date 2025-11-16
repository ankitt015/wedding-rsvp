// Sample Guest Database (simulating your Google Sheet)
const GUESTS_DATABASE = {
    'avisha': {
        id: 'G001',
        fullName: 'Avisha Sharma',
        events: ['mehendi', 'wedding'],
        group: 'Friends',
        email: 'avisha@example.com'
    },
    'divya': {
        id: 'G002',
        fullName: 'Divya Patel',
        events: ['wedding'],
        group: 'Friends',
        email: 'divya@example.com'
    },
    'roshni': {
        id: 'G003',
        fullName: 'Roshni Kumar',
        events: ['mehendi', 'wedding', 'reception'],
        group: 'Family',
        email: 'roshni@example.com'
    },
    'amit': {
        id: 'G004',
        fullName: 'Amit Verma',
        events: ['wedding', 'reception'],
        group: 'Friends',
        email: 'amit@example.com'
    },
    'priya': {
        id: 'G005',
        fullName: 'Priya Mehta',
        events: ['mehendi', 'wedding', 'reception'],
        group: 'Family',
        email: 'priya@example.com'
    }
};

// Event Details
const EVENTS = {
    'mehendi': {
        name: '🎨 Mehendi Ceremony',
        date: 'February 9, 2026',
        time: '6:00 PM',
        venue: 'The Aryavart Escape, Nhavi'
    },
    'wedding': {
        name: '💒 Wedding Ceremony',
        date: 'February 10, 2026',
        time: '7:00 PM',
        venue: 'The Aryavart Escape, Nhavi'
    },
    'reception': {
        name: '🎊 Reception',
        date: 'February 10, 2026',
        time: '9:00 PM',
        venue: 'The Aryavart Escape, Nhavi'
    }
};
