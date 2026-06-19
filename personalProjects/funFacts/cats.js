/* ============================================================
   FUN FACTS: CAT ENTHUSIAST EASTER EGG
   Spawns 25+ cute line-art cats and plays a distinct meow.
   ============================================================ */

// 1. Pre-load the audio OUTSIDE the function so the browser has it ready instantly
const meowAudio = new Audio('main-res/cat.mp3');
meowAudio.volume = 0.8;

window.triggerCatEvent = function () {
    // 2. Prevent spamming
    if (document.getElementById('cat-easter-egg-container')) return;

    // 3. Play Sound (Reset time to 0 so it plays every time you click)
    meowAudio.currentTime = 0;
    meowAudio.play().catch(e => console.log("Browser still blocked audio. Try clicking anywhere on the page first!", e));

    // 4. Create Container
    const container = document.createElement('div');
    container.id = 'cat-easter-egg-container';
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '200px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // 5. Inject Perfect Cute Cat Outline SVG 
    const catSVG = `
        <svg viewBox="0 0 100 100" style="width: 80px; height: 80px; overflow: visible; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5));">
            <g stroke="var(--accent-yellow)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="#101A30">
                <path d="M 20,45 Q 20,85 50,85 Q 80,85 80,45 Q 80,30 75,15 L 90,10 L 68,28 Q 50,20 32,28 L 10,10 L 25,15 Q 20,30 20,45 Z" />
            </g>
            <g fill="var(--accent-yellow)">
                <circle cx="35" cy="50" r="4.5" />
                <circle cx="65" cy="50" r="4.5" />
                <path d="M 47,59 L 53,59 L 50,63 Z" />
            </g>
            <path d="M 45,65 Q 47.5,69 50,63 Q 52.5,69 55,65" stroke="var(--accent-yellow)" stroke-width="3" stroke-linecap="round" fill="none" />
            <g stroke="var(--accent-yellow)" stroke-width="3" stroke-linecap="round">
                <line x1="18" y1="52" x2="2" y2="48" />
                <line x1="16" y1="58" x2="0" y2="58" />
                <line x1="18" y1="64" x2="2" y2="68" />
                <line x1="82" y1="52" x2="98" y2="48" />
                <line x1="84" y1="58" x2="100" y2="58" />
                <line x1="82" y1="64" x2="98" y2="68" />
            </g>
        </svg>
    `;

    // 6. Build and Animate the Cats
    const createCat = (leftPos, delay, scale) => {
        const cat = document.createElement('div');
        cat.innerHTML = catSVG;
        cat.style.position = 'absolute';
        cat.style.bottom = '-120px';
        cat.style.left = leftPos;
        cat.style.transform = `scale(${scale})`;
        cat.style.transition = 'bottom 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        container.appendChild(cat);

        const popHeight = -5 + Math.random() * -20;

        setTimeout(() => {
            cat.style.bottom = `${popHeight}px`;
        }, delay);

        setTimeout(() => {
            cat.style.bottom = '-120px';
        }, delay + 2500);
    };

    // 7. Spawn 25+ Cats 
    const totalCats = 28;
    for (let i = 0; i < totalCats; i++) {
        const randomLeft = Math.random() * 95 + '%';
        const randomDelay = Math.random() * 1500;
        const randomScale = 0.6 + Math.random() * 0.7;

        createCat(randomLeft, randomDelay, randomScale);
    }

    // 8. Cleanup
    setTimeout(() => {
        container.remove();
    }, 5500);
};