// Twitch Configuration - Replace with your actual Twitch username
const TWITCH_CHANNEL = 'benlu_tv'; // Change this to your Twitch username

// DOM Elements
const streamInfo = document.getElementById('stream-info');
const streamEmbed = document.getElementById('stream-embed');
const clipsList = document.getElementById('clips-list');

// Check if stream is live
function checkLiveStream() {
    // Embed the Twitch player
    streamEmbed.innerHTML = `
        <iframe
            src="https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${window.location.hostname}&muted=false"
            height="100%"
            width="100%"
            allowfullscreen>
        </iframe>
    `;

    // Check stream status using Twitch's API (requires client ID, but we'll use a simple check)
    fetch(`https://api.twitch.tv/helix/streams?user_login=${TWITCH_CHANNEL}`, {
        headers: {
            'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' // Public client ID for basic info
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            const stream = data.data[0];
            streamInfo.textContent = `🔴 LIVE: ${stream.title} - ${stream.viewer_count} Zuschauer`;
            streamInfo.classList.add('live');
        } else {
            streamInfo.textContent = 'Stream ist offline - Schau später vorbei!';
            streamInfo.classList.remove('live');
        }
    })
    .catch(error => {
        console.log('Could not check stream status:', error);
        streamInfo.textContent = 'Stream-Status konnte nicht überprüft werden';
    });
}

// Load clips from Twitch
function loadClips() {
    // For now, show a link to clips and embed a sample clip
    clipsList.innerHTML = `
        <div class="clip-item">
            <a href="https://www.twitch.tv/${TWITCH_CHANNEL}/clips" target="_blank" style="display:block;padding:40px;text-decoration:none;color:#9146ff;text-align:center;background:#1a1a2e;border-radius:10px;">
                <h3>📺 Alle Clips ansehen</h3>
                <p>Klicke hier um alle Clips auf Twitch zu sehen</p>
            </a>
        </div>
        <div class="clip-item">
            <iframe
                src="https://clips.twitch.tv/embed?clip=PopularClip&parent=${window.location.hostname}&autoplay=false"
                height="300"
                width="100%"
                allowfullscreen>
            </iframe>
            <div class="clip-title">Beispiel Clip</div>
        </div>
    `;

    // Try to load real clips using Twitch API
    fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${getUserId(TWITCH_CHANNEL)}&first=3`, {
        headers: {
            'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            clipsList.innerHTML = '';
            data.data.forEach(clip => {
                const clipItem = document.createElement('div');
                clipItem.className = 'clip-item';
                clipItem.innerHTML = `
                    <iframe
                        src="https://clips.twitch.tv/embed?clip=${clip.id}&parent=${window.location.hostname}&autoplay=false"
                        height="300"
                        width="100%"
                        allowfullscreen>
                    </iframe>
                    <div class="clip-title">${clip.title}</div>
                `;
                clipsList.appendChild(clipItem);
            });
        }
    })
    .catch(error => {
        console.log('Could not load clips:', error);
    });
}

// Helper function to get user ID (simplified)
function getUserId(username) {
    // This would need a proper API call, for now return a placeholder
    return '123456789'; // Replace with actual user ID lookup
}

// Setup live notifications (basic polling)
function setupLiveNotifications() {
    let wasLive = false;

    setInterval(() => {
        fetch(`https://api.twitch.tv/helix/streams?user_login=${TWITCH_CHANNEL}`, {
            headers: {
                'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
            }
        })
        .then(response => response.json())
        .then(data => {
            const isLive = data.data && data.data.length > 0;
            if (isLive && !wasLive) {
                // Stream just went live
                showNotification('Stream ist live!', 'Schau jetzt bei BenLU TV vorbei!');
            }
            wasLive = isLive;
        })
        .catch(error => console.log('Notification check failed:', error));
    }, 60000); // Check every minute
}

// Show notification
function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body, icon: 'img/benlu_tv_logo.png' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: body, icon: 'img/benlu_tv_logo.png' });
            }
        });
    }
}

// Request notification permission on page load
if ('Notification' in window) {
    Notification.requestPermission();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLiveStream();
    loadClips();
    setupLiveNotifications();
});
