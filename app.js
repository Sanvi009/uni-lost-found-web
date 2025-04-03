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
