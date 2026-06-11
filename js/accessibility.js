/* -----
Accessibility Island Controller
Injects and handles the floating scrollwheel menu, Theme Logic, Meowtivator Iframe, and Translate.
----- */
document.addEventListener('DOMContentLoaded', () => {

    // SVG Cat Icon (Theme responsive because fill="currentColor")
    const catSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5H2.5V12ZM11 12a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5H11V12Zm.5-9.5A1.5 1.5 0 0 0 10 1h-4a1.5 1.5 0 0 0-1.5 1.5v2A1.5 1.5 0 0 0 6 6h4a1.5 1.5 0 0 0 1.5-1.5v-2Zm-1.5 6h-4a2.5 2.5 0 0 1-2.5-2.5v-2A2.5 2.5 0 0 1 6 0h4a2.5 2.5 0 0 1 2.5 2.5v2A2.5 2.5 0 0 1 10 8.5Zm-4 5h4v-1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1.5ZM4 6.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 13h-1A3.5 3.5 0 0 1 4 9.5v-3Z"/></svg>`;

    // 1. Inject the Island HTML, Iframe Popup, & Google Translate Target
    const islandHTML = `
        <div class="access-island-container" id="access-island">
            <button class="island-btn-main" id="island-toggle" title="Accessibility Menu">
                <i class="bi bi-laptop"></i>
            </button>
            <div class="island-menu">
                <button class="island-child-btn" id="btn-theme" title="Toggle Theme">
                    <i class="bi bi-palette-fill"></i>
                </button>
                <button class="island-child-btn" id="btn-translate" title="Translate Page (En/Tl)">
                    <i class="bi bi-translate"></i>
                </button>
                <button class="island-child-btn" id="btn-meow" title="Open Meowtivator">
                    ${catSvg}
                </button>
                <button class="island-child-btn" id="btn-top" title="Back to Top">
                    <i class="bi bi-chevron-up"></i>
                </button>
            </div>
        </div>
        
        <div class="meowtivator-popup" id="meow-popup">
            <div class="meowtivator-header">
                <span>Meowtivator Chat</span>
                <button class="meowtivator-close" id="close-meow"><i class="bi bi-x-lg"></i></button>
            </div>
            <iframe src="schoolProjects/A07/index.html" class="meowtivator-iframe"></iframe>
        </div>

        <div id="google_translate_element"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', islandHTML);

    // 2. Element References (Make sure these are captured AFTER injection)
    const islandContainer = document.getElementById('access-island');
    const toggleBtn = document.getElementById('island-toggle');
    const btnTop = document.getElementById('btn-top');
    const btnTheme = document.getElementById('btn-theme');
    const btnTranslate = document.getElementById('btn-translate');

    // Meowtivator References
    const btnMeow = document.getElementById('btn-meow');
    const meowPopup = document.getElementById('meow-popup');
    const closeMeowBtn = document.getElementById('close-meow');

    // 3. Toggle Menu Logic
    toggleBtn.addEventListener('click', () => {
        islandContainer.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');

        if (islandContainer.classList.contains('active')) {
            icon.classList.replace('bi-laptop', 'bi-x-lg');
        } else {
            icon.classList.replace('bi-x-lg', 'bi-laptop');
        }
    });

    // 4. Back to Top Logic (Custom Smooth Animation Fix)
    btnTop.addEventListener('click', () => {
        const startPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        const duration = 600; // Animation duration in milliseconds
        let startTime = null;

        const easeOutCubic = (t) => { return (--t) * t * t + 1; };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const newPosition = startPosition * (1 - easeOutCubic(progress));

            window.scrollTo(0, newPosition);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);

        if (islandContainer.classList.contains('active')) {
            toggleBtn.click();
        }
    });

    // 5. Theme Toggler Logic
    const themes = ['default', 'dark', 'purple', 'green'];
    let currentTheme = localStorage.getItem('rz_theme') || 'default';

    const applyTheme = (theme) => {
        const htmlElement = document.documentElement;
        if (theme === 'default') {
            htmlElement.removeAttribute('data-theme');
        } else {
            htmlElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('rz_theme', theme);
    };

    applyTheme(currentTheme);

    btnTheme.addEventListener('click', () => {
        let currentIndex = themes.indexOf(currentTheme);
        let nextIndex = (currentIndex + 1) % themes.length;
        currentTheme = themes[nextIndex];
        applyTheme(currentTheme);
    });

    // 6. Meowtivator Popup Logic
    btnMeow.addEventListener('click', (e) => {
        e.preventDefault();
        meowPopup.classList.add('active'); // Add active class to show popup

        if (islandContainer.classList.contains('active')) {
            toggleBtn.click(); // Close island menu
        }
    });

    closeMeowBtn.addEventListener('click', () => {
        meowPopup.classList.remove('active');
    });

    // Close Meowtivator and Island when clicking completely outside
    document.addEventListener('click', (e) => {
        // If clicking outside the island, close island
        if (!islandContainer.contains(e.target) && islandContainer.classList.contains('active')) {
            // Exclude closing the island if they are just interacting with the meow popup
            if (!meowPopup.contains(e.target)) {
                toggleBtn.click();
            }
        }
    });

    // 7. Google Translate 1-Click Toggle Hack
    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,tl',
            autoDisplay: false
        }, 'google_translate_element');
    };

    let isTranslated = false;
    let isTranslating = false; // Prevent multiple clicks

    btnTranslate.addEventListener('click', () => {
        if (isTranslating) return; // Ignore if already processing

        const select = document.querySelector('.goog-te-combo');
        if (!select) {
            console.log("Translator not fully loaded yet.");
            return;
        }

        isTranslating = true;

        // Change icon to spinner
        const icon = btnTranslate.querySelector('i');
        icon.className = 'bi bi-arrow-repeat'; // Use a refresh/sync icon
        btnTranslate.classList.add('btn-loading'); // Apply spin animation via CSS

        // Determine target language
        const targetLang = !isTranslated ? 'tl' : 'en';

        // Apply translation
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));

        // Since Google Translate doesn't offer a clean callback when translation is "done",
        // we use a timeout to revert the UI state smoothly.
        setTimeout(() => {
            isTranslated = !isTranslated;
            isTranslating = false;

            // Revert icon and remove spin class
            btnTranslate.classList.remove('btn-loading');
            icon.className = 'bi bi-translate';

            // Optional: Close island menu after successful translation
            if (islandContainer.classList.contains('active')) {
                toggleBtn.click();
            }
        }, 1200); // 1.2 seconds provides a solid visual cue
    });
});