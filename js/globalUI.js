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
                // Optional: Unobserve after animating once for better performance
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
});

// 2. Hide Loading Spinner on Window Load (Ensures all images/iframes are ready)
window.addEventListener('load', () => {
    const globalLoader = document.getElementById('global-loader');
    if (globalLoader) {
        globalLoader.style.opacity = '0';
        globalLoader.style.visibility = 'hidden';
    }
});


/* =========================================
   IMAGE VIEWER LOGIC (Advanced & Centralized)
   ========================================= */
let currentGalleryImages = [];
let currentImageIndex = 0;

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
        // Placed at the bottom center
        dots.className = 'position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex justify-content-center flex-wrap gap-2 w-100 px-4';
        dots.style.zIndex = '20';
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

    if (currentGalleryImages.length <= 1) return; // Don't show dots for single images

    currentGalleryImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `viewer-dot ${index === currentImageIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentImageIndex = index;
            updateViewerImage();
            updateViewerControls();
        };
        dotsContainer.appendChild(dot);
    });
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

    if (!prevBtn || !nextBtn) return;

    if (currentGalleryImages.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
}

// Helper to update 3-dot indicators based on scroll position
window.updateScrollDots = function (container, dotsContainer) {
    if (!container || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.dot');
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let activeIndex = 0;

    // Threshold: if content isn't scrollable, everything is at the start
    if (maxScroll <= 10) {
        activeIndex = 0;
    }
    // At Start
    else if (scrollLeft <= 10) {
        activeIndex = 0;
    }
    // At End
    else if (scrollLeft >= maxScroll - 10) {
        activeIndex = 2;
    }
    // Somewhere in the middle
    else {
        activeIndex = 1;
    }

    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
};