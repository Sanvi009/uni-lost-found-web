// Initialize Firebase (REPLACE WITH YOUR CONFIG)
const firebaseConfig = {
    apiKey: "AIzaSyD0XqFX58b4n0UI2KprKOhSU3oZDIRtgUE",
  authDomain: "unilostfound.firebaseapp.com",
  databaseURL: "https://unilostfound-default-rtdb.firebaseio.com",
  projectId: "unilostfound",
  storageBucket: "unilostfound.firebasestorage.app",
  messagingSenderId: "568935322973",
  appId: "1:568935322973:web:8aae9cf9ebdc5edf1144b4"
};
firebase.initializeApp(firebaseConfig);

// DOM elements
const itemsContainer = document.getElementById('items-container');

// Real-time data listener
firebase.database().ref('items').orderByChild('timestamp').on('value', (snapshot) => {
    itemsContainer.innerHTML = ''; // Clear old items
    
    const items = snapshot.val();
    if (!items) {
        itemsContainer.innerHTML = '<p>No lost/found items reported yet.</p>';
        return;
    }

    // Convert object to array and sort by timestamp (newest first)
    const itemsArray = Object.entries(items).map(([id, item]) => ({ id, ...item }));
    itemsArray.sort((a, b) => b.timestamp - a.timestamp);

    // Render each item
    itemsArray.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item-card';
        itemEl.innerHTML = `
            <div class="item-type">${item.type.toUpperCase()} • ${item.category}</div>
            <div>${item.description}</div>
            <div class="item-location">${item.location || 'Location not specified'}</div>
            <div class="item-time">${formatTime(item.timestamp)}</div>
        `;
        itemsContainer.appendChild(itemEl);
    });
});

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}
