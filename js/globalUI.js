/* -----
Global UI Controller
Handles the full-page loading spinner and scroll-triggered animations.
----- */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for Scroll Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before it hits the bottom
    });

    // Target all elements with the animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => animationObserver.observe(el));

    // --- Image Modal Toggle Controls (Dynamic Event Delegation) ---
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'fullscreen-image-target') {
            controlsVisible = !controlsVisible;
            updateViewerControls();
        }
    });

    // Reset controls visibility whenever the modal is reopened
    document.addEventListener('show.bs.modal', (e) => {
        if (e.target && e.target.id === 'imageViewerModal') {
            controlsVisible = true;

            // Ensure the cursor is set to pointer once it's loaded into the DOM
            const imgTarget = document.getElementById('fullscreen-image-target');
            if (imgTarget) imgTarget.style.cursor = 'pointer';
        }
    });
});

// 2. Hide Loading Spinner (With Safety Fallback)
function hideGlobalLoader() {
    const globalLoader = document.getElementById('global-loader');
    if (globalLoader && globalLoader.style.visibility !== 'hidden') {
        globalLoader.style.opacity = '0';
        setTimeout(() => {
            globalLoader.style.visibility = 'hidden';
            globalLoader.style.display = 'none';
        }, 600);
    }
}

// Attempt to hide when all assets are fully loaded
window.addEventListener('load', hideGlobalLoader);

// SAFETY FALLBACK: Force hide the loader after 2 seconds no matter what.
setTimeout(hideGlobalLoader, 2000);


/* =========================================
   IMAGE VIEWER LOGIC (Advanced & Centralized)
   ========================================= */
let currentGalleryImages = [];
let currentImageIndex = 0;
let controlsVisible = true;

// Sleek Base64 SVG Fallback for broken/missing images
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23131B2E'/%3E%3Cpath d='M150 100l30-30 40 40 30-20 40 40V200H150z' fill='none' stroke='%23D48C1C' stroke-width='2' stroke-linejoin='round'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23ffffff80'%3ENot Available%3C/text%3E%3C/svg%3E";

function ensureViewerElements() {
    const modalBody = document.querySelector('#imageViewerModal .modal-body');
    if (!modalBody) return;

    // Inject loader if missing
    if (!document.getElementById('viewer-loader')) {
        const loader = document.createElement('div');
        loader.id = 'viewer-loader';
        loader.className = 'spinner-ring position-absolute top-50 start-50 translate-middle';
        loader.style.zIndex = '20';
        loader.style.display = 'none';
        modalBody.appendChild(loader);
    }

    // Inject dots container if missing
    if (!document.getElementById('viewer-dots')) {
        const dots = document.createElement('div');
        dots.id = 'viewer-dots';

        dots.className = 'd-flex justify-content-center align-items-center flex-nowrap gap-2 mx-auto mt-3 px-3 py-2 shadow';

        dots.style.cssText = `
            z-index: 20;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            max-width: 90%;
        `;

        modalBody.appendChild(dots);
    }
}

window.openImageViewer = function (imagesStringOrArray, startIndex = 0) {
    ensureViewerElements();

    // Handle both stringified JSON and raw arrays
    try {
        if (typeof imagesStringOrArray === 'string') {
            currentGalleryImages = JSON.parse(decodeURIComponent(imagesStringOrArray));
        } else {
            currentGalleryImages = Array.isArray(imagesStringOrArray) ? imagesStringOrArray : [imagesStringOrArray];
        }
    } catch (e) {
        currentGalleryImages = [imagesStringOrArray];
    }

    currentImageIndex = startIndex;
    updateViewerImage();
    updateViewerControls();

    const viewerModalEl = document.getElementById('imageViewerModal');
    if (viewerModalEl) {
        const viewerModal = bootstrap.Modal.getInstance(viewerModalEl) || new bootstrap.Modal(viewerModalEl);
        viewerModal.show();
    }
};

function updateViewerImage() {
    const imgTarget = document.getElementById('fullscreen-image-target');
    const loader = document.getElementById('viewer-loader');

    if (!imgTarget) return;

    // 1. Show loader, hide image temporarily
    if (loader) loader.style.display = 'block';
    imgTarget.style.opacity = '0';

    // 2. Handle successful load
    imgTarget.onload = function () {
        if (loader) loader.style.display = 'none';
        imgTarget.style.opacity = '1';
    };

    // 3. Handle broken image (Fallback)
    imgTarget.onerror = function () {
        if (loader) loader.style.display = 'none';
        imgTarget.src = FALLBACK_IMAGE; // Trigger fallback
        imgTarget.style.opacity = '1';
    };

    // Trigger load
    imgTarget.src = currentGalleryImages[currentImageIndex] || FALLBACK_IMAGE;

    renderDots();
}

function renderDots() {
    const dotsContainer = document.getElementById('viewer-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = ''; // Clear existing dots
    const total = currentGalleryImages.length;

    if (total <= 1) return; // Don't show dots for single images

    const maxDots = 10;
    let startIdx = 0;
    let endIdx = total - 1;

    // --- Sliding Window Algorithm ---
    // If there are more than 10 images, create a sliding window of dots!
    if (total > maxDots) {
        startIdx = Math.max(0, currentImageIndex - Math.floor(maxDots / 2));
        endIdx = startIdx + maxDots - 1;

        // Clamp the window if we reach the end of the gallery
        if (endIdx >= total) {
            endIdx = total - 1;
            startIdx = total - maxDots;
        }
    }

    // Create the visible dots
    for (let i = startIdx; i <= endIdx; i++) {
        const dot = document.createElement('button');

        // Inline styles to guarantee it looks perfect on mobile without external CSS conflicts
        dot.style.cssText = `
            width: 10px; height: 10px; border-radius: 50%; border: none; padding: 0;
            background-color: ${i === currentImageIndex ? 'var(--accent-yellow)' : 'rgba(255, 255, 255, 0.2)'};
            transform: ${i === currentImageIndex ? 'scale(1.3)' : 'scale(1)'};
            box-shadow: ${i === currentImageIndex ? '0 0 8px rgba(212, 140, 28, 0.6)' : 'none'};
            transition: all 0.3s ease; flex-shrink: 0;
        `;

        dot.onclick = () => {
            currentImageIndex = i;
            updateViewerImage();
            updateViewerControls();
        };
        dotsContainer.appendChild(dot);
    }

    // --- Creative Overflow Indicator (+X Badge) ---
    if (total > maxDots) {
        const remaining = total - maxDots;
        const badge = document.createElement('div');

        // Sleek styling matching the yellow accent, positioned slightly outside the dots
        badge.className = 'badge rounded-pill shadow-sm d-flex align-items-center justify-content-center ms-2';
        badge.style.cssText = `
            background: rgba(0, 0, 0, 0.8); 
            border: 1px solid var(--accent-yellow); 
            color: var(--accent-yellow); 
            font-size: 0.75rem; 
            padding: 5px 12px; 
            flex-shrink: 0;
            font-family: 'Poppins', sans-serif;
            backdrop-filter: blur(5px);
        `;

        // Displays: 📸 15/30 (+20)
        badge.innerHTML = `
            <i class="bi bi-images me-2"></i> 
            ${currentImageIndex + 1}/${total} 
            <span class="opacity-75 ms-1" style="font-size: 0.65rem;">(+${remaining})</span>
        `;

        dotsContainer.appendChild(badge);
    }
}

window.navigateViewer = function (direction) {
    currentImageIndex += direction;
    // Infinite loop around
    if (currentImageIndex < 0) currentImageIndex = currentGalleryImages.length - 1;
    if (currentImageIndex >= currentGalleryImages.length) currentImageIndex = 0;

    updateViewerImage();
    updateViewerControls();
};

function updateViewerControls() {
    const prevBtn = document.getElementById('viewer-prev');
    const nextBtn = document.getElementById('viewer-next');
    const dotsContainer = document.getElementById('viewer-dots');
    const closeBtn = document.querySelector('#imageViewerModal .btn-close');

    if (!prevBtn || !nextBtn) return;

    if (currentGalleryImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
    } else {
        prevBtn.style.display = controlsVisible ? 'flex' : 'none';
        nextBtn.style.display = controlsVisible ? 'flex' : 'none';
        if (dotsContainer) dotsContainer.style.display = controlsVisible ? 'flex' : 'none';
    }

    // FIX: Override the CSS !important rule using setProperty
    if (closeBtn) {
        if (controlsVisible) {
            closeBtn.style.setProperty('opacity', '1', 'important');
            closeBtn.style.pointerEvents = 'auto';
        } else {
            closeBtn.style.setProperty('opacity', '0', 'important');
            closeBtn.style.pointerEvents = 'none';
        }
    }
}

// Helper to update dynamic indicators based on scroll position percentage
window.updateScrollDots = function (container, dotsContainer, itemsCount) {
    if (!container || !dotsContainer || itemsCount <= 1) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) return;

    // Calculate current index percentage 
    let activeIndex = Math.round((scrollLeft / maxScroll) * (itemsCount - 1));

    // Fallback clamps
    if (activeIndex < 0) activeIndex = 0;
    if (activeIndex >= itemsCount) activeIndex = itemsCount - 1;

    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
};

// --- Helper to copy Tip Details to Clipboard ---
window.copyTipDetails = function (btnElement, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Change icon to a checkmark temporarily
        const icon = btnElement.querySelector('i');
        const originalClass = icon.className;

        icon.className = 'bi bi-check-lg text-success fs-5';

        setTimeout(() => {
            icon.className = originalClass;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};