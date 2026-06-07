/* -----
Experience Page Dynamic Renderer
Handles Tech Stack pagination, Advanced Project Filtering, and Split-Pane Details Layout.
----- */
document.addEventListener('DOMContentLoaded', () => {

    let globalProjectsData = [];

    window.scrollRow = function (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const generateStars = (rating) => {
        let starsHTML = '<div class="d-flex mt-auto" style="gap: 4px;">';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<i class="bi ${i <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'}" style="font-size: 0.9rem;"></i>`;
        }
        starsHTML += '</div>';
        return starsHTML;
    };

    function updateTechNavButtons() {
        const activeTab = document.querySelector('.tab-pane.active .tech-slider');
        const prevBtn = document.getElementById('tech-btn-prev');
        const nextBtn = document.getElementById('tech-btn-next');

        if (!activeTab || !prevBtn || !nextBtn) return;

        const isAtStart = activeTab.scrollLeft <= 2;
        const isAtEnd = activeTab.scrollLeft + activeTab.clientWidth >= activeTab.scrollWidth - 2;

        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }

    async function loadTechStack() {
        const containers = {
            frontend: document.getElementById('tech-frontend'),
            backend: document.getElementById('tech-backend'),
            programming: document.getElementById('tech-programming'),
            tools: document.getElementById('tech-tools')
        };

        try {
            const response = await fetch('json/techStack.json');
            const techData = await response.json();

            // --- SORTING LOGIC ---
            // Sort by stars descending (b.stars - a.stars)
            techData.sort((a, b) => b.stars - a.stars);

            Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

            techData.forEach(tech => {
                const targetContainer = containers[tech.category];
                if (!targetContainer) return;

                // Check if you added an 'experienceText' field in your JSON, gracefully hide if not
                const expText = tech.experienceText ? `<p class="small text-warning opacity-75 mb-2"><i class="bi bi-clock-history me-1"></i>${tech.experienceText}</p>` : '';

                targetContainer.innerHTML += `
                    <div style="flex: 0 0 calc(33.333% - 14px); min-width: 240px;">
                        <div class="stack-card d-flex flex-column h-100 text-start" style="padding: 1.25rem;">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <i class="bi ${tech.iconClass} text-accent" style="font-size: 2.2rem;"></i>
                                ${generateStars(tech.stars)}
                            </div>
                            <h5 class="fredoka text-white mb-1">${tech.title}</h5>
                            ${expText}
                            <p class="tiny-text opacity-75 mb-4 flex-grow-1">${tech.description}</p>
                            
                            <a href="${tech.linkUrl}" target="_blank" class="btn btn-sm btn-outline-warning rounded-pill mt-auto interactive-card w-100" style="border-width: 1px;">
                                <i class="bi bi-box-arrow-up-right me-2"></i>View Official
                            </a>
                        </div>
                    </div>
                `;
            });

            document.querySelectorAll('.tech-slider').forEach(slider => {
                // 1. Existing Nav Button Listener
                slider.addEventListener('scroll', updateTechNavButtons);

                // 2. Count the number of tech cards injected into this slider
                const techCount = slider.children.length;

                // 3. Only inject dots if there are more than 2 items
                if (techCount > 2) {
                    if (!slider.nextElementSibling || !slider.nextElementSibling.classList.contains('mobile-scroll-dots')) {
                        slider.insertAdjacentHTML('afterend', `
                            <div class="mobile-scroll-dots d-mobile-flex mt-3 mb-4">
                                <div class="dot active"></div><div class="dot"></div><div class="dot"></div>
                            </div>
                        `);
                    }

                    // 4. Attach Scroll Listener to Sync Dots
                    const dotsContainer = slider.nextElementSibling;
                    slider.addEventListener('scroll', () => {
                        window.updateScrollDots(slider, dotsContainer);
                    });

                    // 5. Initialize state on load
                    window.updateScrollDots(slider, dotsContainer);
                }
            });

            const tabElms = document.querySelectorAll('button[data-bs-toggle="tab"], button[data-bs-toggle="pill"]');
            tabElms.forEach(tab => {
                tab.addEventListener('shown.bs.tab', () => { setTimeout(updateTechNavButtons, 150); });
            });

            setTimeout(updateTechNavButtons, 200);

        } catch (e) { console.error("Error loading tech stack:", e); }
    }

    /* ----- Project Filtering & Split-Pane Layout ----- */
    function renderFilteredProjects() {
        const query = document.getElementById('project-search').value.toLowerCase();
        const techFilter = document.getElementById('tech-stack-filter').value;
        const categories = ['school', 'personal', 'company', 'other'];

        const filteredData = globalProjectsData.filter(proj => {
            const matchesSearch = proj.title.toLowerCase().includes(query) ||
                (proj.techStack && proj.techStack.some(t => t.toLowerCase().includes(query)));
            const matchesFilter = techFilter === 'all' ||
                (proj.techStack && proj.techStack.some(t => t.includes(techFilter)));
            return matchesSearch && matchesFilter;
        });

        categories.forEach(cat => {
            const pane = document.getElementById(`pane-${cat}`);
            if (!pane) return;

            const catData = filteredData.filter(p => p.category === cat);

            if (catData.length === 0) {
                pane.innerHTML = '<p class="text-white w-100 mt-5 text-center">No projects found matching your criteria.</p>';
                return;
            }

            // 1. Build the List of Projects
            let listHTML = '';
            catData.forEach((proj, idx) => {
                listHTML += `
                    <button class="btn btn-custom w-100 mb-lg-3 text-start d-flex justify-content-between align-items-center proj-list-btn interactive-card" 
                            data-idx="${idx}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); transition: 0.3s; border-radius: 12px; padding: 15px;">
                        <span class="text-nowrap me-2 fw-small">${proj.title}</span>
                        <i class="bi bi-chevron-right opacity-50 indicator-icon d-none d-lg-block"></i>
                    </button>
                `;
            });

            // 2. Generate Scroll Hints (Now using sleek dots for mobile)
            const scrollHintVertical = catData.length > 5 ? `<div class="text-center mt-1 mb-3 small text-warning opacity-75 vertical-scroll-hint"><i class="bi bi-chevron-down mb-1 d-block"></i>Scroll for more</div>` : '';

            // 3. Inject Layout
            pane.innerHTML = `
                <div class="row g-4 align-items-stretch">
                    <div class="col-lg-4">
                        <div class="project-list-scroll p-2" id="list-${cat}">
                            ${listHTML}
                        </div>
                        ${scrollHintVertical}
                    </div>
                    <div class="col-lg-8">
                        <div class="card-style p-3 p-lg-4 h-100" id="detail-${cat}">
                            </div>
                    </div>
                </div>
            `;

            // 4. Attach Listeners to List Buttons
            const listContainer = document.getElementById(`list-${cat}`);
            const buttons = listContainer.querySelectorAll('.proj-list-btn');

            const activateButton = (target, index) => {
                buttons.forEach(b => {
                    b.style.borderColor = "rgba(255,255,255,0.1)";
                    b.style.background = "rgba(255,255,255,0.05)";
                    b.style.color = "rgba(255,255,255,0.6)";
                    const icon = b.querySelector('.indicator-icon');
                    if (icon) { icon.classList.replace('bi-check-circle-fill', 'bi-chevron-right'); icon.classList.replace('text-white', 'opacity-50'); }
                });
                target.style.borderColor = "var(--accent-yellow)";
                target.style.background = "rgba(212, 140, 28, 0.1)";
                target.style.color = "white";
                const activeIcon = target.querySelector('.indicator-icon');
                if (activeIcon) { activeIcon.classList.replace('bi-chevron-right', 'bi-check-circle-fill'); activeIcon.classList.replace('opacity-50', 'text-white'); }

                renderProjectDetail(catData[index], `detail-${cat}`);
            };

            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    activateButton(e.currentTarget, e.currentTarget.getAttribute('data-idx'));
                });
            });

            // Auto-load first project
            if (buttons.length > 0) activateButton(buttons[0], 0);
        });
    }

    /* ----- New Split-Pane Detail View Renderer ----- */
    function renderProjectDetail(proj, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let mediaHTML = '';

        if (proj.mediaType === 'iframe') {
            const iframeSrc = proj.mediaSource[0] ? `src="${proj.mediaSource[0]}"` : '';
            mediaHTML = `
                <div class="w-100 proj-detail-media position-relative" style="background: #101A30; overflow: hidden; border: 2px solid rgba(255,255,255,0.05); height: 400px;">
                    <iframe ${iframeSrc} 
                            class="scaled-iframe" 
                            loading="lazy" 
                            style="border: none;" 
                            onerror="this.style.display='none'">
                    </iframe>
                </div>`;
        } else {
            const images = proj.mediaSource || [];
            const hasImages = images.length > 0 && images[0] !== "";

            if (hasImages) {
                const primaryImg = images[0];
                const imgCountHTML = images.length > 1 ? `<span class="img-count-badge badge bg-dark position-absolute bottom-0 end-0 m-3 border border-secondary">+${images.length - 1} Images</span>` : '';
                const arrayData = encodeURIComponent(JSON.stringify(images));

                mediaHTML = `
                    <div class="w-100 position-relative proj-detail-media" style="background: #101A30; overflow: hidden; cursor: zoom-in; border: 2px solid rgba(255,255,255,0.05);" 
                         data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')">
                        <img src="${primaryImg}" class="w-100 h-100" style="object-fit: contain;">
                        ${imgCountHTML}
                    </div>`;
            } else {
                // Returns the static placeholder instead of the clickable modal trigger
                mediaHTML = `
                    <div class="w-100 position-relative proj-detail-media image-unavailable-placeholder d-flex flex-column justify-content-center align-items-center" style="background: #101A30; overflow: hidden; border: 2px dashed rgba(255,255,255,0.1); min-height: 250px;">
                        <i class="bi bi-image mb-2" style="font-size: 2.5rem; opacity: 0.5;"></i>
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">Not Available</span>
                    </div>`;
            }
        }

        const techStackBadges = (proj.techStack && Array.isArray(proj.techStack))
            ? proj.techStack.map(tech => `<span class="badge bg-secondary me-1 mb-2">${tech}</span>`).join('')
            : '';

        const btnLaunch = proj.liveLink ? `<a href="${proj.liveLink}" target="_blank" class="btn btn-custom btn-explore mt-auto w-100"><i class="bi bi-box-arrow-up-right me-2"></i> Launch Live Preview</a>` : '';

        // Inject 2-column layout inside the details pane
        container.innerHTML = `
            <div class="row g-4 align-items-stretch h-100">
                <div class="col-lg-6">
                    ${mediaHTML}
                </div>
                <div class="col-lg-6 d-flex flex-column text-start">
                    <span class="text-accent fw-bold text-uppercase small mb-1 d-block">${proj.category} Project</span>
                    <h3 class="fredoka mb-3">${proj.title}</h3>
                    <p class="opacity-75 flex-grow-1" style="font-size: 0.95rem;">${proj.description}</p>
                    <div class="mt-2 mb-4">
                        <h6 class="fredoka small">Tech Stack:</h6>
                        ${techStackBadges}
                    </div>
                    <div>
                        ${btnLaunch}
                    </div>
                </div>
            </div>
        `;
    }

    async function loadProjects() {
        try {
            const response = await fetch('json/projects.json');
            globalProjectsData = await response.json();

            renderFilteredProjects();

            const searchInput = document.getElementById('project-search');
            const techFilter = document.getElementById('tech-stack-filter');

            if (searchInput) searchInput.addEventListener('input', renderFilteredProjects);
            if (techFilter) techFilter.addEventListener('change', renderFilteredProjects);

        } catch (e) { console.error("Error loading projects:", e); }
    }

    window.scrollActiveTechStack = function (direction) {
        const activeTab = document.querySelector('.tab-pane.active .tech-slider');
        if (!activeTab) return;
        activeTab.scrollBy({ left: 260 * direction, behavior: 'smooth' });
    };

    loadTechStack();
    loadProjects();
});