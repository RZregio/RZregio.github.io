/* ============================================================
   GLOBAL FLOATING MUSIC PLAYER (ADVANCED EDITION)
   Features: Mobile Drag, True YT Iframe, External Playlists
============================================================ */

const defaultPlaylist = [
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

let myPlaylist = JSON.parse(localStorage.getItem('rz_my_playlist')) || defaultPlaylist;
let externalPlaylists = JSON.parse(localStorage.getItem('rz_ext_playlists')) || [];
let activeListId = localStorage.getItem('rz_active_list') || 'local';

let ytPlayer;
let timeTrackerInterval;
let isShuffle = false;
let repeatMode = 0; // 0 = off, 1 = all, 2 = one
let shuffleQueue = [];
let shufflePos = 0;
let isListExpanded = false;
let isProgressBarDragging = false;
let hasLoadedInitialPlaylist = false;

function formatYtmTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function generateShuffleQueue() {
    let arr = myPlaylist.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffleQueue = arr;
    shufflePos = 0;
}

function parsePlaylistUrl(url) {
    if (url.includes('spotify.com/playlist/')) {
        const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
        return match ? { type: 'spotify', id: match[1] } : null;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
        return match ? { type: 'youtube', id: match[1] } : null;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        #floating-music-player {
            position: fixed; bottom: 20px; right: 20px; width: 420px; 
            background-color: #030303; border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            z-index: 10000; flex-direction: column; overflow: hidden;
            color: white; font-family: 'Poppins', sans-serif;
            display: flex;
            
            /* FIX: We move it completely off-screen instead of using opacity/visibility. 
               This maintains the iframe's physical dimensions to bypass YouTube's bot detection. */
            transform: translateY(150vh); pointer-events: none;
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        #floating-music-player.show-player {
            transform: translateY(0); pointer-events: auto;
        }

        @media (max-width: 576px) { #floating-music-player { width: 90vw; right: 5vw; } }
        
        .ytm-header { background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
         
        /* Iframe Containers - LOCKED SIZE */
        .ytm-player-frame-container { 
            width: 100%; height: 250px; min-height: 250px; border-radius: 8px; overflow: hidden; 
            background: #000; margin-bottom: 10px; flex-shrink: 0;
        }
        .ytm-player-frame-container iframe { width: 100%; height: 100%; border: none; pointer-events: auto; }

        input[type=range]#ytm-progress-bar { -webkit-appearance: none; width: 100%; background: transparent; margin: 5px 0; }
        input[type=range]#ytm-progress-bar::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
        input[type=range]#ytm-progress-bar::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: var(--accent-yellow); cursor: pointer; margin-top: -4px; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        input[type=range]#ytm-progress-bar:focus { outline: none; }

        .ytm-controls { display: flex; justify-content: center; gap: 18px; align-items: center; padding: 0 10px; margin-top: 5px; } 
        .ytm-controls button { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; padding: 5px;}
        .ytm-controls button:hover, .ytm-controls button.active { color: var(--accent-yellow); }
        #ytm-btn-play { font-size: 2.2rem; color: var(--accent-yellow); } 

        #minimized-music-icon {
            position: fixed; bottom: 20px; right: 90px; width: 65px; height: 65px; 
            background-color: #030303; border: 2px solid var(--accent-yellow); color: var(--accent-yellow);
            border-radius: 50%; display: none; align-items: center; justify-content: center;
            font-size: 1.8rem; cursor: grab; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            user-select: none; touch-action: none; 
        }
        #minimized-music-icon:active { cursor: grabbing; }

        #ytm-btn-expand { background: none; border: none; width: 100%; color: white; opacity: 0.5; font-size: 1.2rem; cursor: pointer; padding: 2px 0; transition: all 0.3s; }
        #ytm-btn-expand:hover { opacity: 1; color: var(--accent-yellow); }
        
        #ytm-tracklist-container { max-height: 140px; transition: max-height 0.4s; overflow-y: auto; overflow-x: hidden; border-top: 1px solid rgba(255,255,255,0.05); padding: 4px 8px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
        #ytm-tracklist-container.expanded { max-height: 300px; }
        
        .ytm-track-item { display: flex; align-items: center; padding: 6px 10px; border-radius: 8px; cursor: pointer; transition: background 0.2s ease; border-left: 3px solid transparent; }
        .ytm-track-item:hover { background: rgba(255, 255, 255, 0.05); }
        .ytm-track-item.active { background: rgba(255, 255, 255, 0.08); border-left: 3px solid var(--accent-yellow); }
        .ytm-track-item.active .ytm-title { color: var(--accent-yellow) !important; }
        
        .manager-list-item { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.8rem; }
    `;
    document.head.appendChild(style);

    const playerHTML = `
        <div id="floating-music-player">
            <div class="ytm-header d-flex justify-content-between align-items-center p-2 px-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-music-note-list fs-5 me-2" style="color: var(--accent-yellow);"></i>
                    <span class="fw-bold" style="font-size: 0.85rem;">Music Explorer</span>
                </div>
                <div>
                    <button id="ytm-btn-settings" class="btn btn-sm text-white opacity-75" title="Manage Library"><i class="bi bi-gear-fill"></i></button>
                    <button id="ytm-minimize-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-dash-lg"></i></button>
                    <button id="ytm-close-btn" class="btn btn-sm text-white opacity-75"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            
            <!-- MAIN PLAYER VIEW -->
            <div id="ytm-main-view" class="d-flex flex-column">
                <div class="p-3 pb-0">
                    <select id="ytm-playlist-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-3"></select>

                    <div id="ytm-media-wrapper" class="w-100 mb-2">
                        <div id="spotify-container" style="display:none; width:100%;"></div>
                        <div id="ytm-player-frame-wrapper" class="ytm-player-frame-container shadow-sm">
                            <div id="ytm-player-frame"></div>
                        </div>
                    </div>

                    <div id="ytm-core-controls">
                        <div class="text-center mt-1">
                            <div id="ytm-np-title" class="fw-bold text-truncate" style="font-size: 1rem;">Select a track</div>
                            <div id="ytm-np-artist" class="text-secondary text-truncate" style="font-size: 0.8rem;">To start listening</div>
                        </div>

                        <div id="ytm-progress-wrapper" class="px-2 mt-2">
                            <div class="d-flex justify-content-between text-secondary mb-1" style="font-size: 0.75rem; font-family: monospace;">
                                <span id="ytm-time-current">0:00</span>
                                <span id="ytm-time-total">0:00</span>
                            </div>
                            <input type="range" id="ytm-progress-bar" value="0" min="0" max="100" step="1">
                        </div>

                        <div class="ytm-controls">
                            <button id="ytm-btn-shuffle" title="Shuffle"><i class="bi bi-shuffle"></i></button>
                            <button id="ytm-btn-prev" title="Previous"><i class="bi bi-skip-backward-fill"></i></button>
                            <button id="ytm-btn-play" title="Play/Pause"><i class="bi bi-play-fill"></i></button>
                            <button id="ytm-btn-next" title="Next"><i class="bi bi-skip-forward-fill"></i></button>
                            <button id="ytm-btn-repeat" title="Repeat"><i class="bi bi-repeat"></i></button>
                        </div>
                    </div>
                </div>

                <button id="ytm-btn-expand" title="Expand/Collapse Playlist"><i class="bi bi-chevron-compact-down"></i></button>

                <div id="ytm-tracklist-container">
                    <div id="ytm-tracklist" class="d-flex flex-column pb-2"></div>
                </div>
            </div>

            <!-- SETTINGS / LIBRARY VIEW -->
            <div id="ytm-manage-view" class="p-3 overflow-auto" style="display:none; max-height: 400px; scrollbar-width: thin;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="text-warning mb-0 fs-6">Local Tracks</h6>
                    <div class="d-flex gap-1">
                        <button id="ytm-btn-export" class="btn btn-sm btn-outline-warning p-1 px-2"><i class="bi bi-download"></i></button>
                        <label class="btn btn-sm btn-outline-info mb-0 p-1 px-2" style="cursor: pointer;">
                            <i class="bi bi-upload"></i><input type="file" id="ytm-file-import" accept=".json" hidden>
                        </label>
                    </div>
                </div>
                <div class="mb-3 p-2 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2);">
                    <input type="text" id="ytm-new-title" placeholder="Song Title" class="form-control form-control-sm custom-input mb-2">
                    <input type="text" id="ytm-new-artist" placeholder="Artist" class="form-control form-control-sm custom-input mb-2">
                    <div class="d-flex gap-2">
                        <input type="text" id="ytm-new-id" placeholder="YT Link or ID" class="form-control form-control-sm custom-input">
                        <button id="ytm-btn-add-track" class="btn btn-sm btn-success px-3"><i class="bi bi-plus-lg"></i></button>
                    </div>
                </div>
                <div id="ytm-local-track-edit-list" class="d-flex flex-column mb-4" style="max-height: 150px; overflow-y: auto;"></div>

                <h6 class="text-warning mb-2 fs-6">External Playlists</h6>
                <div class="mb-3 p-2 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2);">
                    <input type="text" id="ytm-new-pl-name" placeholder="Display Name" class="form-control form-control-sm custom-input mb-2">
                    <div class="d-flex gap-2">
                        <input type="text" id="ytm-new-pl-url" placeholder="Spotify/YT URL" class="form-control form-control-sm custom-input">
                        <button id="ytm-btn-add-pl" class="btn btn-sm btn-success px-3"><i class="bi bi-plus-lg"></i></button>
                    </div>
                </div>
                <div id="ytm-imported-pl-list" class="d-flex flex-column" style="max-height: 150px; overflow-y: auto;"></div>
            </div>
        </div>
        <div id="minimized-music-icon" title="Open Music Player">
            <i class="bi bi-music-note-beamed"></i>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    const playerEl = document.getElementById('floating-music-player');
    const minIcon = document.getElementById('minimized-music-icon');
    const tracklistEl = document.getElementById('ytm-tracklist');
    const tracklistContainer = document.getElementById('ytm-tracklist-container');
    const expandBtn = document.getElementById('ytm-btn-expand');
    const ytPlayerFrameWrapper = document.getElementById('ytm-player-frame-wrapper');
    const spotContainer = document.getElementById('spotify-container');
    const ytCoreControls = document.getElementById('ytm-core-controls');
    const progressBarWrap = document.getElementById('ytm-progress-wrapper');
    const progressBar = document.getElementById('ytm-progress-bar');
    const playBtn = document.getElementById('ytm-btn-play');
    const shuffleBtn = document.getElementById('ytm-btn-shuffle');
    const repeatBtn = document.getElementById('ytm-btn-repeat');

    const mainView = document.getElementById('ytm-main-view');
    const manageView = document.getElementById('ytm-manage-view');
    const btnSettings = document.getElementById('ytm-btn-settings');
    let isManageView = false;

    isListExpanded = localStorage.getItem('ytm_index') === null;
    if (isListExpanded) {
        tracklistContainer.classList.add('expanded');
        expandBtn.innerHTML = '<i class="bi bi-chevron-compact-up"></i>';
    }

    progressBar.addEventListener('mousedown', () => isProgressBarDragging = true);
    progressBar.addEventListener('touchstart', () => isProgressBarDragging = true, { passive: true });
    progressBar.addEventListener('input', (e) => {
        document.getElementById('ytm-time-current').innerText = formatYtmTime(e.target.value);
    });
    progressBar.addEventListener('change', (e) => {
        if (ytPlayer && ytPlayer.seekTo) ytPlayer.seekTo(parseFloat(e.target.value), true);
        isProgressBarDragging = false;
    });

    expandBtn.addEventListener('click', () => {
        isListExpanded = !isListExpanded;
        tracklistContainer.classList.toggle('expanded', isListExpanded);
        expandBtn.innerHTML = isListExpanded ? '<i class="bi bi-chevron-compact-up"></i>' : '<i class="bi bi-chevron-compact-down"></i>';
    });

    btnSettings.addEventListener('click', () => {
        isManageView = !isManageView;
        if (isManageView) {
            mainView.classList.remove('d-flex');
            mainView.classList.add('d-none');
            manageView.style.display = 'block';

            btnSettings.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
            renderManagerDropdown();
            renderLocalEditor();
            renderExternalEditor();
        } else {
            mainView.classList.remove('d-none');
            mainView.classList.add('d-flex');
            manageView.style.display = 'none';

            btnSettings.innerHTML = '<i class="bi bi-gear-fill"></i>';
        }
    });

    function renderTracklist() {
        if (activeListId !== 'local' || !tracklistEl) return;
        tracklistEl.innerHTML = myPlaylist.map((song, index) => `
            <div class="ytm-track-item" data-index="${index}">
                <div class="flex-grow-1 overflow-hidden">
                    <div class="ytm-title text-white text-truncate fw-bold" style="font-size: 0.85rem;">${song.title}</div>
                    <div class="text-secondary text-truncate" style="font-size: 0.7rem;">${song.artist}</div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.ytm-track-item').forEach(track => {
            track.addEventListener('click', function () {
                window.playTrack(parseInt(this.getAttribute('data-index')), 0);
            });
        });
    }

    function renderManagerDropdown() {
        const select = document.getElementById('ytm-playlist-select');
        if (!select) return;
        let html = `<option value="local" ${activeListId === 'local' ? 'selected' : ''}>📍 Local Selection</option>`;
        externalPlaylists.forEach(pl => {
            html += `<option value="${pl.id}" ${activeListId === pl.id ? 'selected' : ''}>${pl.type === 'spotify' ? '🟢' : '🔴'} ${pl.name}</option>`;
        });
        select.innerHTML = html;
    }

    function renderLocalEditor() {
        const list = document.getElementById('ytm-local-track-edit-list');
        if (!list) return;
        list.innerHTML = myPlaylist.map((song, i) => `
            <div class="manager-list-item">
                <span class="text-truncate" style="max-width: 65%;">${song.title}</span>
                <div class="flex-shrink-0">
                    <button class="btn btn-link text-danger p-0" onclick="window.ytmDeleteLocal(${i})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function renderExternalEditor() {
        const list = document.getElementById('ytm-imported-pl-list');
        if (!list) return;
        list.innerHTML = externalPlaylists.map((pl, i) => `
            <div class="manager-list-item">
                <span class="text-truncate text-warning" style="max-width: 65%;">${pl.name}</span>
                <div class="flex-shrink-0">
                    <button class="btn btn-link text-danger p-0" onclick="window.ytmDeleteExternal(${i})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    window.ytmDeleteLocal = (index) => {
        myPlaylist.splice(index, 1);
        localStorage.setItem('rz_my_playlist', JSON.stringify(myPlaylist));
        renderLocalEditor();
        renderTracklist();
        if (activeListId === 'local') generateShuffleQueue();
    };

    window.ytmDeleteExternal = (index) => {
        const pl = externalPlaylists[index];
        externalPlaylists.splice(index, 1);
        localStorage.setItem('rz_ext_playlists', JSON.stringify(externalPlaylists));
        if (activeListId === pl.id) {
            activeListId = 'local';
            localStorage.setItem('rz_active_list', activeListId);
            applyActivePlaylist();
        }
        renderManagerDropdown();
        renderExternalEditor();
    };

    document.getElementById('ytm-btn-add-track').addEventListener('click', () => {
        const title = document.getElementById('ytm-new-title').value.trim();
        const artist = document.getElementById('ytm-new-artist').value.trim();
        let idStr = document.getElementById('ytm-new-id').value.trim();

        if (idStr.includes('v=')) idStr = idStr.split('v=')[1].split('&')[0];
        else if (idStr.includes('youtu.be/')) idStr = idStr.split('youtu.be/')[1].split('?')[0];

        if (title && artist && idStr) {
            myPlaylist.push({ title, artist, id: idStr });
            localStorage.setItem('rz_my_playlist', JSON.stringify(myPlaylist));
            document.getElementById('ytm-new-title').value = '';
            document.getElementById('ytm-new-artist').value = '';
            document.getElementById('ytm-new-id').value = '';
            renderLocalEditor();
            renderTracklist();
            if (activeListId === 'local') generateShuffleQueue();
        }
    });

    document.getElementById('ytm-btn-add-pl').addEventListener('click', () => {
        const name = document.getElementById('ytm-new-pl-name').value.trim();
        const url = document.getElementById('ytm-new-pl-url').value.trim();
        const parsed = parsePlaylistUrl(url);

        if (name && parsed) {
            externalPlaylists.push({ name, type: parsed.type, id: parsed.id });
            localStorage.setItem('rz_ext_playlists', JSON.stringify(externalPlaylists));
            document.getElementById('ytm-new-pl-name').value = '';
            document.getElementById('ytm-new-pl-url').value = '';
            renderManagerDropdown();
            renderExternalEditor();
        } else {
            alert("Invalid URL. Must be a Spotify or YouTube Playlist link.");
        }
    });

    document.getElementById('ytm-playlist-select').addEventListener('change', (e) => {
        activeListId = e.target.value;
        localStorage.setItem('rz_active_list', activeListId);
        isShuffle = false;
        if (shuffleBtn) shuffleBtn.classList.remove('active');
        repeatMode = 0;
        if (repeatBtn) repeatBtn.innerHTML = '<i class="bi bi-repeat"></i>';
        if (ytPlayer && ytPlayer.setShuffle) ytPlayer.setShuffle(false);
        if (ytPlayer && ytPlayer.setLoop) ytPlayer.setLoop(false);
        applyActivePlaylist();
    });

    document.getElementById('ytm-btn-export').addEventListener('click', () => {
        const backupData = { type: 'rz_music_backup', version: 1, local: myPlaylist, external: externalPlaylists };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "rz_music_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    document.getElementById('ytm-file-import').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported.type === 'rz_music_backup') {
                    myPlaylist = imported.local || [];
                    externalPlaylists = imported.external || [];
                } else if (Array.isArray(imported)) {
                    myPlaylist = imported;
                } else throw new Error("Invalid format");
                localStorage.setItem('rz_my_playlist', JSON.stringify(myPlaylist));
                localStorage.setItem('rz_ext_playlists', JSON.stringify(externalPlaylists));
                renderLocalEditor();
                renderExternalEditor();
                renderManagerDropdown();
                renderTracklist();
                if (activeListId === 'local') generateShuffleQueue();
                alert("Database imported successfully!");
            } catch (err) { alert("Invalid JSON file."); }
        };
        reader.readAsText(file);
    });

    // Helper: Safely trigger the initial playback logic
    function initializePlayback() {
        if (hasLoadedInitialPlaylist) return;
        applyActivePlaylist(true);
        hasLoadedInitialPlaylist = true;
        const savedIndex = localStorage.getItem('ytm_index');
        const savedTime = localStorage.getItem('ytm_time');
        const isPlaying = localStorage.getItem('ytm_playing');
        if (activeListId === 'local' && savedIndex !== null && isPlaying === 'true') {
            window.playTrack(parseInt(savedIndex), parseFloat(savedTime) || 0);
        }
    }

    window.triggerMusicEvent = function () {
        playerEl.classList.add('show-player');
        minIcon.style.display = 'none';
        renderManagerDropdown();
        
        // Wait 350ms for the CSS slide animation to complete so YouTube sees the player is fully visible
        setTimeout(() => {
            if (ytPlayer && ytPlayer.getPlayerState) {
                initializePlayback();
            }
        }, 350);
    };

    document.getElementById('ytm-minimize-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerEl.classList.remove('show-player');
        minIcon.style.display = 'flex';
    });

    document.getElementById('ytm-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playerEl.classList.remove('show-player');
        minIcon.style.display = 'none';
        localStorage.setItem('ytm_playing', 'false');
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
        playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    });

    document.getElementById('ytm-btn-prev').addEventListener('click', () => {
        if (activeListId !== 'local') { if (ytPlayer && ytPlayer.previousVideo) ytPlayer.previousVideo(); return; }
        let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
        let prevIndex = (currIndex - 1 + myPlaylist.length) % myPlaylist.length;
        window.playTrack(prevIndex, 0);
    });

    document.getElementById('ytm-btn-next').addEventListener('click', () => {
        if (activeListId !== 'local') { if (ytPlayer && ytPlayer.nextVideo) ytPlayer.nextVideo(); return; }
        if (isShuffle) {
            shufflePos++;
            if (shufflePos >= shuffleQueue.length) generateShuffleQueue();
            window.playTrack(shuffleQueue[shufflePos], 0);
        } else {
            let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
            let nextIndex = (currIndex + 1) % myPlaylist.length;
            window.playTrack(nextIndex, 0);
        }
    });

    playBtn.addEventListener('click', () => {
        if (ytPlayer && ytPlayer.getPlayerState) {
            if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
            else ytPlayer.playVideo();
        }
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        if (activeListId !== 'local') { if (ytPlayer && ytPlayer.setShuffle) ytPlayer.setShuffle(isShuffle); return; }
        if (isShuffle) generateShuffleQueue();
    });

    repeatBtn.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        const pl = externalPlaylists.find(p => p.id === activeListId);
        if (pl && pl.type === 'youtube' && repeatMode === 2) repeatMode = 0;

        if (repeatMode === 0) {
            repeatBtn.innerHTML = '<i class="bi bi-repeat"></i>';
            repeatBtn.classList.remove('active');
            if (ytPlayer && ytPlayer.setLoop) ytPlayer.setLoop(false);
        } else if (repeatMode === 1) {
            repeatBtn.innerHTML = '<i class="bi bi-repeat"></i>';
            repeatBtn.classList.add('active');
            if (activeListId !== 'local' && ytPlayer && ytPlayer.setLoop) ytPlayer.setLoop(true);
        } else {
            repeatBtn.innerHTML = '<i class="bi bi-repeat-1"></i>';
            repeatBtn.classList.add('active');
            if (activeListId !== 'local' && ytPlayer && ytPlayer.setLoop) ytPlayer.setLoop(false);
        }
    });

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

    function applyActivePlaylist(silentLoad = false) {
        spotContainer.innerHTML = '';
        if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();

        if (activeListId === 'local') {
            spotContainer.style.display = 'none';
            ytPlayerFrameWrapper.style.display = 'block';
            ytCoreControls.style.display = 'block';
            tracklistContainer.style.display = 'block';
            progressBarWrap.style.display = 'block';
            expandBtn.style.display = 'block';

            renderTracklist();
            generateShuffleQueue();

            if (!silentLoad) window.playTrack(parseInt(localStorage.getItem('ytm_index')) || 0, 0);
        } else {
            const pl = externalPlaylists.find(p => p.id === activeListId);
            if (!pl) return;
            tracklistContainer.style.display = 'none';
            expandBtn.style.display = 'none';

            if (pl.type === 'spotify') {
                ytPlayerFrameWrapper.style.display = 'none';
                ytCoreControls.style.display = 'none';
                spotContainer.style.display = 'block';
                spotContainer.innerHTML = `<iframe style="border-radius:8px" src="https://open.spotify.com/embed/playlist/${pl.id}?utm_source=generator&theme=0" width="100%" height="350" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
            } else if (pl.type === 'youtube') {
                spotContainer.style.display = 'none';
                ytPlayerFrameWrapper.style.display = 'block';
                ytCoreControls.style.display = 'block';
                progressBarWrap.style.display = 'none';

                document.getElementById('ytm-np-title').innerText = pl.name;
                document.getElementById('ytm-np-artist').innerText = "YouTube Playlist";

                if (ytPlayer && ytPlayer.loadPlaylist) ytPlayer.loadPlaylist({ list: pl.id, listType: 'playlist' });
            }
        }
    }

    window.onYouTubeIframeAPIReady = function () {
        ytPlayer = new YT.Player('ytm-player-frame', {
            // EXACT configuration matched to the old working Segundoko API setup
            playerVars: {
                'autoplay': 1,
                'rel': 0,
                'modestbranding': 1,
                'controls': 1,
                'disablekb': 1
            },
            events: {
                'onReady': () => {
                    // Do NOT auto-load a track if the widget is hidden. 
                    // This bypasses the YouTube "invisible player" block.
                    if (playerEl.classList.contains('show-player')) {
                        initializePlayback();
                    }
                },
                'onStateChange': (event) => {
                    if (activeListId === 'spotify') return;
                    const timeCurrent = document.getElementById('ytm-time-current');
                    const timeTotal = document.getElementById('ytm-time-total');

                    if (event.data === YT.PlayerState.PLAYING) {
                        playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                        localStorage.setItem('ytm_playing', 'true');
                        clearInterval(timeTrackerInterval);

                        const duration = ytPlayer.getDuration();
                        if (duration && progressBar) {
                            progressBar.max = duration;
                            if (timeTotal) timeTotal.innerText = formatYtmTime(duration);
                        }
                        if (activeListId !== 'local' && ytPlayer.getVideoData) {
                            const data = ytPlayer.getVideoData();
                            if (data && data.title) {
                                document.getElementById('ytm-np-title').innerText = data.title;
                                document.getElementById('ytm-np-artist').innerText = data.author || 'YouTube Audio';
                            }
                        }

                        timeTrackerInterval = setInterval(() => {
                            if (ytPlayer && ytPlayer.getCurrentTime && !isProgressBarDragging) {
                                const currTime = ytPlayer.getCurrentTime();
                                if (activeListId === 'local') localStorage.setItem('ytm_time', currTime);
                                if (progressBar) progressBar.value = currTime;
                                if (timeCurrent) timeCurrent.innerText = formatYtmTime(currTime);

                                const newDuration = ytPlayer.getDuration();
                                if (newDuration && progressBar && progressBar.max !== String(newDuration)) {
                                    progressBar.max = newDuration;
                                    if (timeTotal) timeTotal.innerText = formatYtmTime(newDuration);
                                }
                            }
                        }, 1000);
                    } else {
                        playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                        clearInterval(timeTrackerInterval);
                        if (event.data === YT.PlayerState.PAUSED) {
                            localStorage.setItem('ytm_playing', 'false');
                        } else if (event.data === YT.PlayerState.ENDED) {
                            if (repeatMode === 2) {
                                if (activeListId === 'local') window.playTrack(parseInt(localStorage.getItem('ytm_index')) || 0, 0);
                                else if (ytPlayer && ytPlayer.seekTo) { ytPlayer.seekTo(0); ytPlayer.playVideo(); }
                            } else if (activeListId === 'local') {
                                let currIndex = parseInt(localStorage.getItem('ytm_index')) || 0;
                                if (repeatMode === 0 && !isShuffle && currIndex === myPlaylist.length - 1) return;
                                document.getElementById('ytm-btn-next').click();
                            }
                        }
                    }
                }
            }
        });
    };

    window.playTrack = function (index, startTime = 0) {
        if (activeListId !== 'local') return;
        if (index >= myPlaylist.length) index = 0;
        const song = myPlaylist[index];
        if (!song) return;

        if (progressBar) progressBar.value = 0;
        document.getElementById('ytm-time-current').innerText = "0:00";
        document.getElementById('ytm-time-total').innerText = "0:00";
        document.getElementById('ytm-np-title').innerText = song.title;
        document.getElementById('ytm-np-artist').innerText = song.artist;

        if (isListExpanded) {
            isListExpanded = false;
            tracklistContainer.classList.remove('expanded');
            expandBtn.innerHTML = '<i class="bi bi-chevron-compact-down"></i>';
        }

        const trackNodes = document.querySelectorAll('.ytm-track-item');
        trackNodes.forEach(t => t.classList.remove('active'));
        if (trackNodes[index]) {
            trackNodes[index].classList.add('active');
            trackNodes[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        localStorage.setItem('ytm_index', index);
        if (ytPlayer && ytPlayer.loadVideoById) ytPlayer.loadVideoById({ videoId: song.id, startSeconds: startTime });
    };
});