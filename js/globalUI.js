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