/* ============================================================
   FUN FACTS: ANIME AFICIONADO EASTER EGG
   Creates a sleek, Bento-style showcase with faded posters.
   ============================================================ */

window.triggerAnimeEvent = function () {
    // 1. Check if modal already exists
    if (document.getElementById('animeBentoModal')) {
        const existingModal = new bootstrap.Modal(document.getElementById('animeBentoModal'));
        existingModal.show();
        return;
    }

    // 2. Inject CSS for the Bento Grid & Faded Posters
    const style = document.createElement('style');
    style.innerHTML = `
        /* DVH Fit & Modal Styling */
        #animeBentoModal .modal-content {
            background-color: #060913;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            max-height: 90dvh; /* Ensures it perfectly fits the screen height */
        }
        
        /* Bento Grid Layout */
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 140px;
            gap: 15px;
            padding: 5px;
            grid-auto-flow: dense; /* Fills empty holes automatically on mobile */
        }

        @media (max-width: 768px) {
            .bento-grid {
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: 130px;
            }
        }

        /* Base Bento Card */
        .bento-card {
            background-color: #111827;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        
        .bento-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent-yellow);
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        /* The Faded Poster Overlay Gradient - DEFINITIVE FIX */
        .bento-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0; /* Anchors to all 4 corners flawlessly */
            background: linear-gradient(to top, rgba(6, 9, 19, 1) 0%, rgba(6, 9, 19, 0.8) 55%, rgba(6, 9, 19, 0.0) 100%);
            z-index: 1;
            transition: background 0.3s ease;
            pointer-events: none; /* Ensures the card is still clickable */
            padding: 10px;
        }
        
        /* Reveal poster slightly more on hover */
        .bento-card:hover::before {
            background: linear-gradient(to top, rgba(6, 9, 19, 0.95) 0%, rgba(6, 9, 19, 0.6) 55%, rgba(6, 9, 19, 0.0) 100%);
        }
        
        /* Dynamic Theme Tint Glow */
        .bento-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--accent-yellow);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 2;
            pointer-events: none;
            mix-blend-mode: overlay;
        }
        .bento-card:hover::after {
            opacity: 0.15;
        }

        .bento-content {
            position: relative;
            z-index: 3;
        }

        /* Grid Sizing Classes */
        .bento-large { grid-column: span 2; grid-row: span 2; }
        .bento-wide  { grid-column: span 2; grid-row: span 1; }
        .bento-tall  { grid-column: span 1; grid-row: span 2; }
        .bento-small { grid-column: span 1; grid-row: span 1; }

        @media (max-width: 768px) {
            .bento-large { grid-column: span 2; grid-row: span 2; }
            .bento-wide  { grid-column: span 2; grid-row: span 1; }
            .bento-tall  { grid-column: span 1; grid-row: span 2; }
            .bento-small { grid-column: span 1; grid-row: span 1; }
        }

        /* Stats Card specific styling (No poster) */
        .bg-stats { 
            background: rgba(255,255,255,0.02); 
            border: 1px dashed rgba(255,255,255,0.2); 
        }
        .bg-stats::before { display: none; } /* Removes gradient overlay */

        .anime-title {
            font-family: 'Fredoka One', cursive;
            font-size: 1.2rem;
            color: white;
            margin-bottom: 5px;
            line-height: 1.2;
            text-shadow: 0 2px 5px rgba(0,0,0,0.8);
        }
        .bento-large .anime-title { font-size: 2rem; }
        
        .anime-genre {
            font-size: 0.75rem;
            color: var(--accent-yellow);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }
    `;
    document.head.appendChild(style);

    // 3. Inject Modal HTML
    // Note: modal-dialog-scrollable added to ensure it scrolls internally without breaking the page height
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <div class="modal fade" id="animeBentoModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                    
                    <!-- Header -->
                    <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-start">
                        <div class="d-flex align-items-center flex-wrap gap-3">
                            <h4 class="modal-title fredoka d-flex align-items-center mb-0 text-white">
                                <i class="bi bi-tv fs-3 me-3" style="color: var(--accent-yellow);"></i> 
                                Anime Showcase
                            </h4>
                        </div>
                        <button type="button" class="btn-close btn-close-white ms-auto mt-1" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <!-- Body (Bento Grid) -->
                    <div class="modal-body p-4 pt-3">
                        <p class="opacity-75 mb-4 small text-white">A curated look at my 179+ completed series. These masterpieces heavily influence my perspective on narrative pacing, UI aesthetics, and creative problem-solving.</p>
                        
                        <div class="bento-grid">
                            
                            <!-- 1. Large Card: Frieren -->
                            <div class="bento-card bento-large" style="background-image: url('https://cdn.myanimelist.net/images/anime/1015/138006l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Fantasy / Masterpiece</div>
                                    <div class="anime-title">Frieren: Beyond Journey's End</div>
                                    <p class="text-white opacity-75 small mb-0 d-none d-md-block mt-2">A beautiful exploration of time, legacy, and the quiet moments that define a lifetime. Flawless pacing and breathtaking aesthetics.</p>
                                </div>
                            </div>

                            <!-- 2. Wide Card: Attack on Titan -->
                            <div class="bento-card bento-wide" style="background-image: url('https://cdn.myanimelist.net/images/anime/10/47347l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Action / Dark Fantasy</div>
                                    <div class="anime-title">Attack on Titan</div>
                                    <p class="text-white opacity-75 small mb-0 mt-1 d-none d-md-block">Unparalleled foreshadowing and narrative architecture.</p>
                                </div>
                            </div>

                            <!-- 3. Stats Card (Small) -->
                            <div class="bento-card bento-small bg-stats align-items-center justify-content-center text-center">
                                <div class="bento-content w-100">
                                    <i class="bi bi-collection-play fs-1" style="color: var(--accent-yellow);"></i>
                                    <div class="fredoka text-white mt-2" style="font-size: 1.5rem;">179+</div>
                                    <div class="opacity-50 small text-white">Series Completed</div>
                                </div>
                            </div>

                            <!-- 4. Tall Card: Monster -->
                            <div class="bento-card bento-tall" style="background-image: url('https://cdn.myanimelist.net/images/anime/10/18793l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Psychological Thriller</div>
                                    <div class="anime-title">Monster</div>
                                    <p class="text-white opacity-75 small mb-0 mt-2">A slow-burn masterpiece exploring the duality of human nature.</p>
                                </div>
                            </div>

                            <!-- 5. Large Card: Naruto -->
                            <div class="bento-card bento-large" style="background-image: url('https://cdn.myanimelist.net/images/anime/1565/111305l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Shonen / Adventure</div>
                                    <div class="anime-title">Naruto Shippuden</div>
                                    <p class="text-white opacity-75 small mb-0 mt-2 d-none d-md-block">The ultimate foundation of perseverance, intricate world-building, and high-stakes character development.</p>
                                </div>
                            </div>

                            <!-- 6. Small Card: Death Note -->
                            <div class="bento-card bento-small" style="background-image: url('https://cdn.myanimelist.net/images/anime/1079/138100l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Mystery</div>
                                    <div class="anime-title">Death Note</div>
                                </div>
                            </div>

                            <!-- 7. Wide Card: Mob Psycho 100 -->
                            <div class="bento-card bento-wide" style="background-image: url('https://cdn.myanimelist.net/images/anime/8/80356l.jpg');">
                                <div class="bento-content">
                                    <div class="anime-genre">Supernatural / Action</div>
                                    <div class="anime-title">Mob Psycho 100</div>
                                    <p class="text-white opacity-75 small mb-0 mt-1 d-none d-md-block">A masterclass in visual storytelling, fluid animation, and profound emotional growth.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // 4. Show the Modal
    const animeModal = new bootstrap.Modal(document.getElementById('animeBentoModal'));
    animeModal.show();
};