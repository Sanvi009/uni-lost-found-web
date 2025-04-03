// Initialize Firebase
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
const database = firebase.database();

// DOM elements
const lostContainer = document.getElementById('lost-container');
const foundContainer = document.getElementById('found-container');
const searchInput = document.getElementById('search');

// Real-time listener
database.ref('items').orderByChild('timestamp').on('value', (snapshot) => {
  const items = snapshot.val();
  lostContainer.innerHTML = '';
  foundContainer.innerHTML = '';

  if (!items) {
    lostContainer.innerHTML = '<p class="no-items">No lost items reported yet.</p>';
    foundContainer.innerHTML = '<p class="no-items">No found items reported yet.</p>';
    return;
  }

  Object.entries(items).forEach(([id, item]) => {
    if (item.status !== 'active') return;
    
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-image">
        ${item.imageUrl ? 
          `<img src="${item.imageUrl}" alt="${item.description}">` : 
          '<div>📷 No Image</div>'}
      </div>
      <div class="item-details">
        <div class="item-type ${item.type}">${item.type.toUpperCase()}</div>
        <p>${item.description}</p>
        <div class="item-meta">
          <span>📍 ${item.location}</span>
          <span>🕒 ${formatTime(item.timestamp)}</span>
        </div>
      </div>
    `;

    if (item.type === 'lost') {
      lostContainer.prepend(card);
    } else {
      foundContainer.prepend(card);
    }
  });
});

// Helper functions
function formatTime(timestamp) {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds/60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds/3600)} hours ago`;
  return `${Math.floor(seconds/86400)} days ago`;
}

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.item-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? 'block' : 'none';
  });
});
