/* ============================================================
   GLOBAL FLOATING MUSIC PLAYER (YOUTUBE API EDITION)
   Features: LocalStorage Persistence, Auto-Next, and Draggable Icon
   ============================================================ */

// 1. Define the Playlist globally
const playlist = [
    { title: "Ikaw Pa Rin Ang Pipiliin Ko", artist: "Cup of Joe", id: "v7M6fGc37cI" },
    { title: "Naiilang", artist: "Le John", id: "WUvD8XAPI4E" },
    { title: "Tahanan", artist: "Adie", id: "51Jn7_lW58o" },
    { title: "Kiss Me", artist: "Ed Sheeran", id: "3IUfGfOK3z0" },
    { title: "The Only Exception", artist: "Paramore", id: "-J7J_IWUhls" },
    { title: "Libo-libong Buwan", artist: "Kyle Raphael", id: "8lbRDzhjqeM" },
    { title: "Balisong", artist: "Rivermaya", id: "rKNYV2RlRKY" }
];

let ytPlayer;
let timeTrackerInterval;

document.addEventListener('DOMContentLoaded', () => {
    // 2. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Main Floating Player */
        #floating-music-player {
            position: fixed; bottom: 20px; right: 20px; width: 350px;
            background-color: #030303; border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            z-index: 10000; display: none; flex-direction: column; overflow: hidden;
        }
        @media (max-width: 576px) {
            #floating-music-player { width: 90vw; right: 5vw; }
        }
        .ytm-header { background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        
        /* Minimized Floating Icon */
        #minimized-music-icon {
            position: fixed; bottom: 20px; right: 90px; width: 55px; height: 55px;
            background-color: #030303; border: 2px solid var(--accent-yellow); color: var(--accent-yellow);
            border-radius: 50%; display: none; align-items: center; justify-content: center;
            font-size: 1.5rem; cursor: grab; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            transition: background 0.3s ease; user-select: none;
        }
        #minimized-music-icon:active { cursor: grabbing; }
        #minimized-music-icon:hover { background-color: var(--accent-yellow); color: #030303; }
        
        /* Tracklist styling */
        .ytm-track-item {
            display: flex; align-items: center; padding: 8px 12px; border-radius: 8px;
            cursor: pointer; transition: background 0.2s ease; border-left: 3px solid transparent;
        }
        .ytm-track-item:hover { background: rgba(255, 255, 255, 0.05); }
        .ytm-track-item.active { background: rgba(255, 255, 255, 0.08); border-left: 3px solid var(--accent-yellow); }
        .ytm-track-item.active .ytm-title { color: var(--accent-yellow) !important; }
        .ytm-thumb { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; margin-right: 12px; }
    `;
    document.head.appendChild(style);

    // 3. Build HTML Tracklist
    let trackListHTML = playlist.map((song, index) => `
        <div class="ytm-track-item" data-index="${index}">
            <img src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" class="ytm-thumb" alt="Thumbnail">
            <div class="flex-grow-1 overflow-hidden">
                <div class="ytm-title text-white text-truncate fw-bold" style="font-size: 0.9rem;">${song.title}</div>
                <div class="text-secondary text-truncate" style="font-size: 0.75rem;">${song.artist}</div>
            </div>
        </div>
    `).join('');

    const playerHTML = `
        <div id="floating-music-player">
            <div class="ytm-header d-flex justify-content-between align-items-center p-2 px-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-music-note-list fs-5 me-2" style="color: var(--accent-yellow);"></i>
                    <span class="text-white fw-bold" style="font-size: 0.9rem;">Music Explorer</span>
                </div>
                <div>
                    <button id="ytm-minimize-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-dash-lg"></i></button>
                    <button id="ytm-close-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            <div class="p-3 pb-1">
                <div class="position-relative w-100 rounded overflow-hidden" style="padding-top: 56.25%; background: #111;">
                    <div id="ytm-player-frame" class="position-absolute top-0 start-0 w-100 h-100"></div>
                </div>
                <div class="mt-2 text-center">
                    <div id="ytm-np-title" class="text-white fw-bold text-truncate" style="font-size: 1rem;">Select a track</div>
                    <div id="ytm-np-artist" class="text-secondary text-truncate" style="font-size: 0.8rem;">To start listening</div>
                </div>
            </div>
            <div class="p-2" style="max-height: 200px; overflow-y: auto; border-top: 1px solid rgba(255,255,255,0.05);">
                ${trackListHTML}
            </div>
        </div>
        <div id="minimized-music-icon" title="Open Music Player">
            <i class="bi bi-music-note-beamed"></i>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);

    // 4. Load the YouTube Iframe API Script dynamically
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // 5. Logic Variables
    const playerEl = document.getElementById('floating-music-player');
    const minIcon = document.getElementById('minimized-music-icon');
    const tracks = document.querySelectorAll('.ytm-track-item');

    // UI Click Events for Tracks
    tracks.forEach(track => {
        track.addEventListener('click', function () {
            window.playTrack(parseInt(this.getAttribute('data-index')), 0);
        });
    });

    // Toggle States
    window.triggerMusicEvent = function () {
        playerEl.style.display = 'flex';
        minIcon.style.display = 'none';
    };

    document.getElementById('ytm-minimize-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerEl.style.display = 'none';
        minIcon.style.display = 'flex';
    });

    document.getElementById('ytm-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerEl.style.display = 'none';
        minIcon.style.display = 'none';
        localStorage.setItem('ytm_playing', 'false'); // Disable auto-resume
        if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
        document.getElementById('ytm-np-title').innerText = "Select a track";
        document.getElementById('ytm-np-artist').innerText = "To start listening";
        tracks.forEach(t => t.classList.remove('active'));
    });

    // Advanced Dragging Logic for the Minimized Icon
    let isDraggingIcon = false, isDragAction = false, startX, startY, iconLeft, iconTop;
    minIcon.addEventListener('mousedown', (e) => {
        isDraggingIcon = true; isDragAction = false;
        startX = e.clientX; startY = e.clientY;
        const rect = minIcon.getBoundingClientRect();
        iconLeft = rect.left; iconTop = rect.top;
        minIcon.style.bottom = 'auto'; minIcon.style.right = 'auto';
        minIcon.style.left = iconLeft + 'px'; minIcon.style.top = iconTop + 'px';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingIcon) return;
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragAction = true;
        minIcon.style.left = (iconLeft + dx) + 'px';
        minIcon.style.top = (iconTop + dy) + 'px';
    });
    document.addEventListener('mouseup', () => isDraggingIcon = false);
    minIcon.addEventListener('click', (e) => {
        if (isDragAction) { e.preventDefault(); return; }
        window.triggerMusicEvent();
    });
});

// 6. YouTube API Ready Global Callback
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytm-player-frame', {
        playerVars: { 'autoplay': 1, 'rel': 0, 'modestbranding': 1, 'controls': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    // Check LocalStorage to resume playing when navigating across pages
    const savedIndex = localStorage.getItem('ytm_index');
    const savedTime = localStorage.getItem('ytm_time');
    const isPlaying = localStorage.getItem('ytm_playing');

    if (savedIndex !== null && isPlaying === 'true') {
        // Note: Browsers may block autoplaying audio without user interaction.
        // If it gets blocked, it will load paused, ready for the user to hit play.
        window.triggerMusicEvent();
        window.playTrack(parseInt(savedIndex), parseFloat(savedTime) || 0);
    }
}

function onPlayerStateChange(event) {
    // If Playing (1), start saving time to LocalStorage every second
    if (event.data === YT.PlayerState.PLAYING) {
        localStorage.setItem('ytm_playing', 'true');
        clearInterval(timeTrackerInterval);
        timeTrackerInterval = setInterval(() => {
            if (ytPlayer && ytPlayer.getCurrentTime) {
                localStorage.setItem('ytm_time', ytPlayer.getCurrentTime());
            }
        }, 1000);
    }
    // If Paused (2) or Ended (0), stop saving time
    else {
        clearInterval(timeTrackerInterval);
        if (event.data === YT.PlayerState.PAUSED) {
            localStorage.setItem('ytm_playing', 'false');
        }
        else if (event.data === YT.PlayerState.ENDED) {
            // Auto-play NEXT Song
            let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
            let nextIndex = (currIndex + 1) % playlist.length; // Loops back to 0 at the end
            window.playTrack(nextIndex, 0);
        }
    }
}

// 7. Global Play Function
window.playTrack = function (index, startTime = 0) {
    const song = playlist[index];

    // Update UI text
    document.getElementById('ytm-np-title').innerText = song.title;
    document.getElementById('ytm-np-artist').innerText = song.artist;

    // Update active highlight
    const tracks = document.querySelectorAll('.ytm-track-item');
    tracks.forEach(t => t.classList.remove('active'));
    if (tracks[index]) tracks[index].classList.add('active');

    // Save index
    localStorage.setItem('ytm_index', index);

    // Command the YouTube Player
    if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById({ videoId: song.id, startSeconds: startTime });
    }
};