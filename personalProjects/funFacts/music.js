/* ============================================================
   GLOBAL FLOATING MUSIC PLAYER (COMPACT EDITION)
   Features: Mobile Drag, Play/Pause, True Shuffle
   ============================================================ */

// 1. Define Playlist (Lyrics removed completely)
const playlist = [
    { title: "Ikaw Pa Rin Ang Pipiliin Ko", artist: "Cup of Joe", id: "v7M6fGc37cI" },
    { title: "Naiilang", artist: "Le John", id: "WUvD8XAPI4E" },
    { title: "Tahanan", artist: "Adie", id: "51Jn7_lW58o" },
    { title: "Kiss Me", artist: "Ed Sheeran", id: "3IUfGfOK3z0" },
    { title: "The Only Exception", artist: "Paramore", id: "-J7J_IWUhls" },
    { title: "Libo-libong Buwan", artist: "Kyle Raphael", id: "8lbRDzhjqeM" },
    { title: "Balisong", artist: "Rivermaya", id: "rKNYV2RlRKY" },
    { title: "Mata sa Mata", artist: "7th", id: "WP6NWLn02rw" },
    { title: "Everything has Changed", artist: "Taylor Swift ft. Ed Sheeran", id: "w1oM3kQpXRo" },
    { title: "Ikot", artist: "Over October", id: "8yvWcZ8BtrQ" },
    { title: "PDKL", artist: "Arthur Miguel", id: "5vPx6fNQPZg" },
    { title: "Panaginip", artist: "Nicole", id: "HoU1k2oW3W4" },
    { title: "DAISIES", artist: "Justin Bieber", id: "msGuqelopMA" },
    { title: "Bad", artist: "Wave to Earth", id: "6Q5xqNkCk7w" },
    { title: "Blue", artist: "Yung Kai", id: "IpFX2vq8HKw" },
    { title: "Malumanay", artist: "Tatin DC", id: "24LG2ok38E8" },
    { title: "Oh, Irog", artist: "12th Street", id: "SQ2Cl5TgDcM" },
    { title: "Germany & Rome", artist: "The Ridleys", id: "PtG15tYQss8" },
    { title: "Your Universe", artist: "Rico Blanco", id: "m-fNVB-fAjk" },
    { title: "Accidentally in Love", artist: "Counting Crows", id: "vnBec1gpXSM" },
    { title: "Red", artist: "Taylor Swift", id: "R_rUYuFtNO4" },
    { title: "Buhay", artist: "Magiliw Street", id: "o-EYfaE7_14" },
    { title: "Settled", artist: "The Ransom Collective", id: "SuGywDkftmA" },
    { title: "Nahuhulog", artist: "Jeb Baruelo", id: "RWH4c9nHHdQ" },
    { title: "Science & Faith", artist: "The Script", id: "S2YXqgZTWu4" },
    { title: "Wi$h Li$t", artist: "Taylor Swift", id: "wqgUzLHgNMI" },
    { title: "Makasama", artist: "Lumi", id: "eXh9WrI2CXs" },
    { title: "Ating Dalawa", artist: "Over October", id: "nCQyjbobAjc" }
];

let ytPlayer;
let timeTrackerInterval;

// True Shuffle State
let isShuffle = false;
let shuffleQueue = [];
let shufflePos = 0;

// Fisher-Yates Shuffle Algorithm to prevent repeating songs
function generateShuffleQueue() {
    let arr = playlist.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffleQueue = arr;
    shufflePos = 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // 2. Inject CSS (Compact Size & Padding)
    const style = document.createElement('style');
    style.innerHTML = `
        #floating-music-player {
            position: fixed; bottom: 20px; right: 20px; width: 300px;
            background-color: #030303; border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            z-index: 10000; display: none; flex-direction: column; overflow: hidden;
        }
        @media (max-width: 576px) { #floating-music-player { width: 90vw; right: 5vw; } }
        .ytm-header { background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        
        /* Compact Audio-Only Poster */
        .poster-container {
            position: relative; width: 100%; height: 180px; 
            background: #111; border-radius: 8px; overflow: hidden; margin-bottom: 10px;
        }
        #ytm-poster {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            object-fit: cover;
        }
        
        #ytm-player-frame { position: absolute; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; z-index: -1; }

        /* Controls */
        .ytm-controls { display: flex; justify-content: center; gap: 25px; align-items: center; padding: 0 15px; margin-top: 10px; }
        .ytm-controls button { background: none; border: none; color: white; font-size: 1.3rem; cursor: pointer; transition: color 0.2s; padding: 5px;}
        .ytm-controls button:hover { color: var(--accent-yellow); }
        .ytm-controls button.active { color: var(--accent-yellow); }
        #ytm-btn-play { font-size: 2rem; color: var(--accent-yellow); } 

        #minimized-music-icon {
            position: fixed; bottom: 20px; right: 90px; width: 55px; height: 55px;
            background-color: #030303; border: 2px solid var(--accent-yellow); color: var(--accent-yellow);
            border-radius: 50%; display: none; align-items: center; justify-content: center;
            font-size: 1.5rem; cursor: grab; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            user-select: none; touch-action: none; 
        }
        #minimized-music-icon:active { cursor: grabbing; }
        
        /* Tracklist styling */
        .ytm-track-item {
            display: flex; align-items: center; padding: 6px 10px; border-radius: 8px;
            cursor: pointer; transition: background 0.2s ease; border-left: 3px solid transparent;
        }
        .ytm-track-item:hover { background: rgba(255, 255, 255, 0.05); }
        .ytm-track-item.active { background: rgba(255, 255, 255, 0.08); border-left: 3px solid var(--accent-yellow); }
        .ytm-track-item.active .ytm-title { color: var(--accent-yellow) !important; }
        .ytm-thumb { width: 35px; height: 35px; border-radius: 4px; object-fit: cover; margin-right: 10px; }
    `;
    document.head.appendChild(style);

    // 3. Build HTML Tracklist
    let trackListHTML = playlist.map((song, index) => `
        <div class="ytm-track-item" data-index="${index}">
            <img src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" class="ytm-thumb" alt="Thumbnail">
            <div class="flex-grow-1 overflow-hidden">
                <div class="ytm-title text-white text-truncate fw-bold" style="font-size: 0.85rem;">${song.title}</div>
                <div class="text-secondary text-truncate" style="font-size: 0.7rem;">${song.artist}</div>
            </div>
        </div>
    `).join('');

    const playerHTML = `
        <div id="floating-music-player">
            <div class="ytm-header d-flex justify-content-between align-items-center p-2 px-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-music-note-list fs-5 me-2" style="color: var(--accent-yellow);"></i>
                    <span class="text-white fw-bold" style="font-size: 0.85rem;">Music Explorer</span>
                </div>
                <div>
                    <button id="ytm-minimize-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-dash-lg"></i></button>
                    <button id="ytm-close-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            
            <div class="p-3 pb-2">
                <div class="poster-container shadow">
                    <img id="ytm-poster" src="res/CatBot.png" alt="Song Poster">
                </div>
                <div id="ytm-player-frame"></div>

                <div class="text-center">
                    <div id="ytm-np-title" class="text-white fw-bold text-truncate" style="font-size: 1rem;">Select a track</div>
                    <div id="ytm-np-artist" class="text-secondary text-truncate" style="font-size: 0.8rem;">To start listening</div>
                </div>

                <div class="ytm-controls">
                    <button id="ytm-btn-shuffle" title="Shuffle"><i class="bi bi-shuffle"></i></button>
                    <button id="ytm-btn-prev" title="Previous"><i class="bi bi-skip-backward-fill"></i></button>
                    <button id="ytm-btn-play" title="Play/Pause"><i class="bi bi-play-fill"></i></button>
                    <button id="ytm-btn-next" title="Next"><i class="bi bi-skip-forward-fill"></i></button>
                </div>
            </div>

            <div class="p-2" style="max-height: 140px; overflow-y: auto; border-top: 1px solid rgba(255,255,255,0.05);">
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
        localStorage.setItem('ytm_playing', 'false');
        if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
        document.getElementById('ytm-btn-play').innerHTML = '<i class="bi bi-play-fill"></i>';
        tracks.forEach(t => t.classList.remove('active'));
    });

    // Control Buttons Logic
    document.getElementById('ytm-btn-prev').addEventListener('click', () => {
        let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
        let prevIndex = (currIndex - 1 + playlist.length) % playlist.length;
        window.playTrack(prevIndex, 0);
    });

    document.getElementById('ytm-btn-next').addEventListener('click', () => {
        if (isShuffle) {
            shufflePos++;
            if (shufflePos >= shuffleQueue.length) generateShuffleQueue(); // Reshuffle when done
            window.playTrack(shuffleQueue[shufflePos], 0);
        } else {
            let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
            let nextIndex = (currIndex + 1) % playlist.length;
            window.playTrack(nextIndex, 0);
        }
    });

    const playBtn = document.getElementById('ytm-btn-play');
    playBtn.addEventListener('click', () => {
        if (ytPlayer && ytPlayer.getPlayerState) {
            if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                ytPlayer.pauseVideo();
            } else {
                ytPlayer.playVideo();
            }
        }
    });

    const shuffleBtn = document.getElementById('ytm-btn-shuffle');
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        if (isShuffle) generateShuffleQueue();
    });

    // 6. Universal Dragging Logic (Mouse & Mobile Touch)
    let isDraggingIcon = false, isDragAction = false, startX, startY, iconLeft, iconTop;

    const getEventX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const getEventY = (e) => e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    const dragStart = (e) => {
        isDraggingIcon = true; isDragAction = false;
        startX = getEventX(e); startY = getEventY(e);
        const rect = minIcon.getBoundingClientRect();
        iconLeft = rect.left; iconTop = rect.top;
        minIcon.style.bottom = 'auto'; minIcon.style.right = 'auto';
        minIcon.style.left = iconLeft + 'px'; minIcon.style.top = iconTop + 'px';
    };

    const dragMove = (e) => {
        if (!isDraggingIcon) return;
        const dx = getEventX(e) - startX;
        const dy = getEventY(e) - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragAction = true;
        if (e.cancelable && e.type.includes('touch')) e.preventDefault();

        minIcon.style.left = (iconLeft + dx) + 'px';
        minIcon.style.top = (iconTop + dy) + 'px';
    };

    const dragEnd = () => isDraggingIcon = false;

    minIcon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    minIcon.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);

    minIcon.addEventListener('click', (e) => {
        if (isDragAction) { e.preventDefault(); return; }
        window.triggerMusicEvent();
    });
});

// 7. YouTube API Ready Global Callback
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytm-player-frame', {
        playerVars: { 'autoplay': 1, 'rel': 0, 'modestbranding': 1, 'controls': 0, 'disablekb': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    const savedIndex = localStorage.getItem('ytm_index');
    const savedTime = localStorage.getItem('ytm_time');
    const isPlaying = localStorage.getItem('ytm_playing');

    if (savedIndex !== null && isPlaying === 'true') {
        window.triggerMusicEvent();
        window.playTrack(parseInt(savedIndex), parseFloat(savedTime) || 0);
    }
}

function onPlayerStateChange(event) {
    const playBtn = document.getElementById('ytm-btn-play');

    if (event.data === YT.PlayerState.PLAYING) {
        playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        localStorage.setItem('ytm_playing', 'true');
        clearInterval(timeTrackerInterval);
        timeTrackerInterval = setInterval(() => {
            if (ytPlayer && ytPlayer.getCurrentTime) {
                localStorage.setItem('ytm_time', ytPlayer.getCurrentTime());
            }
        }, 1000);
    } else {
        playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        clearInterval(timeTrackerInterval);

        if (event.data === YT.PlayerState.PAUSED) {
            localStorage.setItem('ytm_playing', 'false');
        } else if (event.data === YT.PlayerState.ENDED) {
            document.getElementById('ytm-btn-next').click(); // Auto triggers the new Next/Shuffle logic
        }
    }
}

// 8. Global Play Function
window.playTrack = function (index, startTime = 0) {
    const song = playlist[index];

    // Update UI text
    document.getElementById('ytm-np-title').innerText = song.title;
    document.getElementById('ytm-np-artist').innerText = song.artist;

    // Update Poster Image
    document.getElementById('ytm-poster').src = `https://img.youtube.com/vi/${song.id}/hqdefault.jpg`;

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