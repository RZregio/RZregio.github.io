document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Fetch Footer
    const loadFooter = fetch('components/footer.html')
        .then(res => res.text())
        .then(html => {
            const placeholder = document.getElementById('footer-placeholder');
            if(placeholder) placeholder.outerHTML = html;
        });

    // 2. Fetch Modals
    const loadModals = fetch('components/modals.html')
        .then(res => res.text())
        .then(html => {
            const modalContainer = document.createElement('div');
            modalContainer.id = "global-modals-container";
            modalContainer.innerHTML = html;
            document.body.appendChild(modalContainer);
        });

    // 3. After everything loads, run dependent logic
    Promise.all([loadFooter, loadModals]).then(() => {
        
        // --- A. Active Link Logic for the Footer ---
        let currentPath = window.location.pathname.split("/").pop();
        if (currentPath === "") currentPath = "index.html"; 

        const links = document.querySelectorAll('footer .dynamic-link');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });

        // --- B. Smart Footer Collision Logic ---
        const footerElement = document.querySelector('footer');
        const islandContainer = document.querySelector('.access-island-container');
        
        if (footerElement && islandContainer) {
            window.addEventListener('scroll', () => {
                const footerRect = footerElement.getBoundingClientRect();
                
                if (footerRect.top <= window.innerHeight) {
                    islandContainer.classList.add('at-footer');
                } else {
                    islandContainer.classList.remove('at-footer');
                }
            });
            // Trigger once on load just in case the page is short
            window.dispatchEvent(new Event('scroll'));
        }

    }).catch(err => console.error("Error loading components: ", err));
});