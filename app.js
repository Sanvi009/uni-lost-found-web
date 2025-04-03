// Initialize Firebase (use same config as your bot)
firebase.initializeApp({
   apiKey: "AIzaSyD0XqFX58b4n0UI2KprKOhSU3oZDIRtgUE",
  authDomain: "unilostfound.firebaseapp.com",
  databaseURL: "https://unilostfound-default-rtdb.firebaseio.com",
  projectId: "unilostfound",
  storageBucket: "unilostfound.firebasestorage.app",
  messagingSenderId: "568935322973",
  appId: "1:568935322973:web:8aae9cf9ebdc5edf1144b4"
});

// Fetch and display items
firebase.database().ref('items').on('value', (snapshot) => {
  const items = snapshot.val();
  let html = '';
  for (let key in items) {
    const item = items[key];
    html += `
      <div class="item">
        <strong>${item.type.toUpperCase()}:</strong> 
        ${item.description} (${new Date(item.timestamp).toLocaleString()})
      </div>
    `;
  }
  document.getElementById('items').innerHTML = html;
});
// Store user states (temporary memory)
const userStates = {};

// Enhanced /lost handler
bot.onText(/\/lost (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const description = match[1];
  
  // Save description temporarily
  userStates[chatId] = { description, type: 'lost' };
  
  // Ask for location
  bot.sendMessage(chatId, '📍 Where did you lose this? (e.g., "Library Floor 2")');
});

// Handle location response
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Check if user is in "waiting for location" state
  if (userStates[chatId] && !text.startsWith('/')) {
    const { description, type } = userStates[chatId];
    
    // Save to Firebase
    db.ref('items').push({
      type,
      description,
      location: text, // User's location input
      timestamp: admin.database.ServerValue.TIMESTAMP
    });
    
    bot.sendMessage(chatId, `✅ Reported! View: https://sanvi009.github.io/uni-lost-found-web/`);
    delete userStates[chatId]; // Clear state
  }
});
// In your Firebase snapshot handler:
if (!groups[item.category]) groups[item.category] = [];
groups[item.category].push(item);

// Then render as collapsible sections:
for (const category in groups) {
  html += `<details><summary>${category} (${groups[category].length})</summary>`;
  // ... items ...
  html += `</details>`;
}
