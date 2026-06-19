/* ============================================================
   FUN FACTS: SPEEDCUBER EASTER EGG
   Creates an interactive guide, movelist, and notation tracker.
   ============================================================ */

window.triggerCubeEvent = function() {
    // 1. Check if modal already exists
    if (document.getElementById('cubeGuideModal')) {
        const existingModal = new bootstrap.Modal(document.getElementById('cubeGuideModal'));
        existingModal.show();
        return;
    }

    // 2. CFOP Method Data (Expanded with Notation and lots of algorithms)
    const cfopSteps = [
        {
            title: "Notation Basics",
            icon: "bi-info-square",
            desc: "Before reading algorithms, you must learn the language of the cube. Each letter represents a face to turn 90 degrees.",
            stats: "The Language of Cubing",
            moves: `
                <div class="mb-3">
                    <strong class="text-white opacity-75">Basic Faces:</strong><br>
                    <span class="text-white">R</span> = Right face up (clockwise)<br>
                    <span class="text-white">L</span> = Left face down (clockwise)<br>
                    <span class="text-white">U</span> = Up face left (clockwise)<br>
                    <span class="text-white">D</span> = Down face right (clockwise)<br>
                    <span class="text-white">F</span> = Front face clockwise
                </div>
                <div class="mb-3">
                    <strong class="text-white opacity-75">Modifiers:</strong><br>
                    <span class="text-white">' (Apostrophe/Prime)</span> = Counter-clockwise turn (e.g., R' means Right face down).<br>
                    <span class="text-white">2 (Number Two)</span> = 180-degree turn (e.g., U2 means flick the top layer twice).
                </div>
                <div>
                    <strong class="text-white opacity-75">Slice Moves:</strong><br>
                    <span class="text-white">M</span> = Middle slice down<br>
                    <span class="text-white">M'</span> = Middle slice up
                </div>
            `
        },
        {
            title: "C - The Cross",
            icon: "bi-plus-lg",
            desc: "The foundation. We build a white cross on the bottom of the cube, ensuring the edge pieces perfectly align with the adjacent center colors. Advanced cubers plan this entire step during the 15-second inspection phase.",
            stats: "Avg Moves: 8 | Target Time: ~2s",
            moves: "<strong>Intuitive Phase.</strong><br>There are no strict algorithms here. It relies on understanding how pieces move relative to each other.<br><br><strong>Pro Tip:</strong><br>> Solve the cross on the BOTTOM of the cube. This prevents you from having to rotate the entire puzzle over to start F2L, saving precious milliseconds.<br><br>> Example efficiency: Blue is always opposite Green, and Red is opposite Orange. If you place them relative to each other correctly, you can align all 4 to their centers with one 'D' (Down) move."
        },
        {
            title: "F2L - First Two Layers",
            icon: "bi-layers-fill",
            desc: "Efficiency at its peak. Instead of inserting corners and middle edges separately, we pair them up in the top layer and insert them into their slots simultaneously, completing the first two layers in one fluid motion.",
            stats: "Avg Moves: 30 | Target Time: ~10s",
            moves: "<strong>Standard Insert (Right Slot):</strong><br>> R U R'<br><br><strong>Standard Insert (Left Slot):</strong><br>> L' U' L<br><br><strong>Hide Corner to Pair Edge:</strong><br>> R U' R'<br><br><strong>Hide Edge to Pair Corner:</strong><br>> U R U' R'<br><br><strong>Split a bad pair:</strong><br>> R U2 R'"
        },
        {
            title: "OLL - Orientation of Last Layer",
            icon: "bi-arrow-up-circle-fill",
            desc: "Pattern recognition. We look at the scrambled yellow pieces on the top layer and execute one of 57 specific algorithms to flip all the yellow pieces facing upward, regardless of where they belong on the sides.",
            stats: "Avg Moves: 10 | Target Time: ~3s",
            moves: "<strong>Sune (Fish shape, right):</strong><br>> R U R' U R U2 R'<br><br><strong>Anti-Sune (Fish shape, left):</strong><br>> R U2 R' U' R U' R'<br><br><strong>T-Shape (Cross with two adjacent corners):</strong><br>> F (R U R' U') F'<br><br><strong>Headlights (Cross with two front corners):</strong><br>> F (R U R' U') (R U R' U') F'<br><br><strong>Pi Shape (Cross with two side corners):</strong><br>> R U2 R2 U' R2 U' R2 U2 R"
        },
        {
            title: "PLL - Permutation of Last Layer",
            icon: "bi-arrow-repeat",
            desc: "The final sprint. With the top face completely yellow, we recognize how the pieces need to shift to solve the cube. We execute one of 21 final algorithms to swap the pieces into their perfectly solved state.",
            stats: "Avg Moves: 12 | Target Time: ~4s",
            moves: "<strong>T-Perm (Swap 2 adjacent corners & edges):</strong><br>> R U R' U' R' F R2 U' R' U' R U R' F'<br><br><strong>Ua-Perm (Cycle 3 edges Counter-Clockwise):</strong><br>> M2 U M U2 M' U M2<br><br><strong>Ub-Perm (Cycle 3 edges Clockwise):</strong><br>> M2 U' M U2 M' U' M2<br><br><strong>Y-Perm (Diagonal corner swap):</strong><br>> F R U' R' U' R U R' F' (R U R' U') (R' F R F')<br><br><strong>H-Perm (Swap opposite edges):</strong><br>> M2 U M2 U2 M2 U M2"
        }
    ];

    // 3. Inject Dynamic Theme CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #cubeGuideModal .modal-content {
            background-color: #030303;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            max-height: 90dvh; 
        }
        .cfop-nav-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: white;
            border-radius: 12px;
            padding: 15px;
            text-align: left;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .cfop-nav-btn:hover { background: rgba(255,255,255,0.1); }
        .cfop-nav-btn.active {
            border-color: var(--accent-yellow);
            color: var(--accent-yellow);
            box-shadow: inset 4px 0 0 var(--accent-yellow);
            background: rgba(255,255,255,0.08);
        }
        .cfop-nav-btn.active i { color: var(--accent-yellow) !important; }
        
        /* DYNAMIC TINTED BACKGROUND */
        .cube-visual-box {
            position: relative;
            border-radius: 12px;
            border: 1px dashed rgba(255,255,255,0.15);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            text-align: left;
            padding: 25px;
            overflow: hidden;
            background: #030303;
        }
        /* This pseudo-element grabs your global var(--accent-yellow) and creates a 5% opacity tint over the black background! */
        .cube-visual-box::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--accent-yellow);
            opacity: 0.05; 
            z-index: 0;
            pointer-events: none;
        }
        .cube-visual-box > * { position: relative; z-index: 1; } /* Keeps content above the tint */

        .cube-icon-wrapper {
            font-size: 3.5rem; color: var(--accent-yellow); margin-bottom: 15px;
            text-align: center; animation: floatCube 3s ease-in-out infinite;
        }
        @keyframes floatCube {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        /* SCROLLABLE Movelist Cheat Sheet Styling */
        .movelist-box {
            background: #080808;
            border: 1px solid rgba(255,255,255,0.1);
            border-left: 3px solid var(--accent-yellow);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.85rem;
            color: var(--accent-yellow);
            letter-spacing: 0.5px;
            
            /* Scrollbar Setup */
            max-height: 180px; 
            overflow-y: auto;
        }
        
        /* Custom Theme-Matched Scrollbar for the Movelist */
        .movelist-box::-webkit-scrollbar { width: 6px; }
        .movelist-box::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .movelist-box::-webkit-scrollbar-thumb { background: var(--accent-yellow); border-radius: 4px; }
    `;
    document.head.appendChild(style);

    // 4. Build Navigation Buttons
    const navButtonsHTML = cfopSteps.map((step, index) => `
        <div class="cfop-nav-btn mb-3 ${index === 0 ? 'active' : ''}" data-step="${index}">
            <div class="fw-bold fredoka d-flex align-items-center">
                <i class="bi ${step.icon} me-3 fs-4 text-white opacity-75"></i> 
                ${step.title}
            </div>
        </div>
    `).join('');

    // 5. Inject Modal HTML
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
        <div class="modal fade" id="cubeGuideModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content">
                    <!-- Header -->
                    <div class="modal-header border-bottom-0 pb-0 pt-4 px-4 align-items-start">
                        <div class="d-flex align-items-center flex-wrap gap-3">
                            <h4 class="modal-title fredoka d-flex align-items-center mb-0">
                                <i class="bi bi-box fs-3 me-3" style="color: var(--accent-yellow);"></i> 
                                Speedcuber's Blueprint 
                            </h4>
                            <span class="badge bg-dark border border-secondary mt-1" style="font-size: 0.8rem; font-family: 'Poppins', sans-serif;">PB: 19s</span>
                        </div>
                        <button type="button" class="btn-close btn-close-white ms-auto mt-1" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div class="modal-body p-4 pt-2">
                        <p class="opacity-75 mb-4 small">Solving a Rubik's cube in under 20 seconds requires algorithmic precision. I utilize the <strong>CFOP</strong> method, turning chaos into order through optimized stages.</p>
                        
                        <div class="row g-4 align-items-stretch">
                            <!-- Left: Navigation -->
                            <div class="col-md-5">
                                ${navButtonsHTML}
                            </div>
                            
                            <!-- Right: Dynamic Content Viewer -->
                            <div class="col-md-7">
                                <div class="cube-visual-box">
                                    <div class="cube-icon-wrapper" id="cfop-icon">
                                        <i class="bi ${cfopSteps[0].icon}"></i>
                                    </div>
                                    <h3 class="fredoka text-white mb-2 text-center" id="cfop-title">${cfopSteps[0].title}</h3>
                                    
                                    <div class="text-center mb-3" id="cfop-stats-container">
                                        <span class="badge bg-dark border py-2 px-3" id="cfop-stats" style="color: var(--accent-yellow); border-color: var(--accent-yellow) !important;">
                                            <i class="bi bi-info-circle-fill me-1"></i> ${cfopSteps[0].stats}
                                        </span>
                                    </div>

                                    <p class="opacity-75 small mb-0" id="cfop-desc" style="line-height: 1.7;">
                                        ${cfopSteps[0].desc}
                                    </p>

                                    <!-- Scrollable Movelist Box -->
                                    <div class="movelist-box w-100" id="cfop-moves">
                                        <span class="d-block text-white opacity-50 mb-2" style="font-family: 'Poppins', sans-serif; font-size: 0.7rem; text-transform: uppercase;">Algorithms / Data:</span>
                                        <div id="cfop-moves-text">${cfopSteps[0].moves}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);

    // 6. Interactive Logic
    const buttons = document.querySelectorAll('.cfop-nav-btn');
    const displayTitle = document.getElementById('cfop-title');
    const displayDesc = document.getElementById('cfop-desc');
    const displayStats = document.getElementById('cfop-stats');
    const displayIcon = document.getElementById('cfop-icon');
    const displayMoves = document.getElementById('cfop-moves-text');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const stepIndex = this.getAttribute('data-step');
            const data = cfopSteps[stepIndex];

            const visualBox = document.querySelector('.cube-visual-box');
            visualBox.style.opacity = 0;
            
            setTimeout(() => {
                displayTitle.innerText = data.title;
                displayDesc.innerText = data.desc;
                
                // Swap icon if it's the notation step vs a timed step
                if(stepIndex === "0") {
                    displayStats.innerHTML = `<i class="bi bi-info-circle-fill me-1"></i> ${data.stats}`;
                } else {
                    displayStats.innerHTML = `<i class="bi bi-stopwatch me-1"></i> ${data.stats}`;
                }
                
                displayIcon.innerHTML = `<i class="bi ${data.icon}"></i>`;
                displayMoves.innerHTML = data.moves;
                
                // Reset scroll position to top when changing tabs
                document.getElementById('cfop-moves').scrollTop = 0;
                
                visualBox.style.opacity = 1;
                visualBox.style.transition = 'opacity 0.3s ease';
            }, 150);
        });
    });

    // 7. Show the Modal
    const cubeModal = new bootstrap.Modal(document.getElementById('cubeGuideModal'));
    cubeModal.show();
};