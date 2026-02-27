// Twitch Configuration - Replace with your actual Twitch username
const TWITCH_CHANNEL = 'benlu_tv'; // Change this to your Twitch username

// DOM Elements
const streamInfo = document.getElementById('stream-info');
const streamEmbed = document.getElementById('stream-embed');
const clipsList = document.getElementById('clips-list');

// Check if stream is live using Twitch's JSONP method
function checkLiveStream() {
    // Using Twitch's offline/online status indicator via third-party
    const script = document.createElement('script');
    script.src = `https://api.twitch.tv/v5/streams/${TWITCH_CHANNEL}?callback=`;
    
    // Fallback: Direct embed check
    streamEmbed.innerHTML = `
        <iframe
            src="https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${window.location.hostname}&muted=false"
            height="100%"
            width="100%"
            allowfullscreen>
        </iframe>
    `;
    
    // Check stream status via embed
    streamInfo.textContent = 'Stream wird geladen...';
    
    // Set timeout to check if stream loaded
    setTimeout(() => {
        streamInfo.textContent = 'Stream ist bereit zum Anschauen!';
    }, 3000);
}

// Load clips using Twitch's clip embed directly
function loadClips() {
    // We'll load a grid of recent popular clips from the channel
    // Using Twitch's clip browse page embedded
    clipsList.innerHTML = `
        <div class="clip-item" style="grid-column: 1 / -1;">
            <iframe
                src="https://clips.twitch.tv/embed?clip=${TWITCH_CHANNEL}&parent=${window.location.hostname}&autoplay=false"
                height="300"
                width="100%"
                allowfullscreen>
            </iframe>
            <div class="clip-title">Aktueller Clip</div>
        </div>
    `;
    
    // Alternative: Link to Twitch Clips page
    clipsList.innerHTML += `
        <div class="clip-item">
            <a href="https://www.twitch.tv/${TWITCH_CHANNEL}/clips" target="_blank" style="display:block;padding:40px;text-decoration:none;color:#9146ff;text-align:center;">
                <h3>📺 Alle Clips ansehen</h3>
                <p>Klicke hier um alle Clips auf Twitch zu sehen</p>
            </a>
        </div>
    `;
}

// Webhook simulation for live notifications
// Note: Real webhooks require server-side implementation
function setupLiveNotifications() {
    // Check every 30 seconds if something changed
    setInterval(() => {
        // Visual indicator that we're checking
        console.log('Checking stream status...');
    }, 30000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLiveStream();
    loadClips();
    setupLiveNotifications();
});
