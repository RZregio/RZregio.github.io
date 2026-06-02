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

            Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

            techData.forEach(tech => {
                const targetContainer = containers[tech.category];
                if (!targetContainer) return;

                targetContainer.innerHTML += `
                    <div style="flex: 0 0 calc(33.333% - 14px); min-width: 240px;">
                        <a href="${tech.linkUrl}" target="_blank" class="stack-card text-decoration-none d-flex flex-column h-100 p-4 text-start">
                            <i class="bi ${tech.iconClass} text-accent mb-3" style="font-size: 2.5rem;"></i>
                            <h5 class="fredoka text-white mb-2">${tech.title}</h5>
                            <p class="tiny-text opacity-75 mb-3 flex-grow-1">${tech.description}</p>
                            ${generateStars(tech.stars)}
                        </a>
                    </div>
                `;
            });

            document.querySelectorAll('.tech-slider').forEach(slider => {
                slider.addEventListener('scroll', updateTechNavButtons);
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
                        <span class="text-nowrap me-2 fw-bold" style="font-size: 1.05rem;">${proj.title}</span>
                        <i class="bi bi-chevron-right opacity-50 indicator-icon d-none d-lg-block"></i>
                    </button>
                `;
            });

            // 2. Generate Scroll Hints
            const scrollHintVertical = catData.length > 5 ? `<div class="text-center mt-1 mb-3 small text-warning opacity-75 vertical-scroll-hint"><i class="bi bi-chevron-down mb-1 d-block"></i>Scroll for more</div>` : '';
            const scrollHintHorizontal = catData.length > 1 ? `<div class="text-center mt-1 mb-3 small text-warning opacity-75 horizontal-scroll-hint"><i class="bi bi-arrow-right mb-1 d-inline"></i> Swipe for more</div>` : '';

            // 3. Inject Layout
            pane.innerHTML = `
                <div class="row g-4 align-items-stretch">
                    <div class="col-lg-4">
                        <div class="project-list-scroll p-2" id="list-${cat}">
                            ${listHTML}
                        </div>
                        ${scrollHintVertical}
                        ${scrollHintHorizontal}
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
            // Notice: Removed 'live-embed' class. It now behaves like a native, scrollable iframe!
            mediaHTML = `
                <div class="w-100 proj-detail-media position-relative" style="background: #101A30; overflow: hidden; border: 2px solid rgba(255,255,255,0.05);">
                    <iframe ${iframeSrc} loading="lazy" style="width: 100%; height: 100%; border: none;" onerror="this.style.display='none'"></iframe>
                </div>`;
        } else {
            const images = proj.mediaSource || [];
            const primaryImg = images.length > 0 ? images[0] : 'main-res/profile.jpg';
            const imgCountHTML = images.length > 1 ? `<span class="img-count-badge badge bg-dark position-absolute bottom-0 end-0 m-3 border border-secondary">+${images.length - 1} Images</span>` : '';
            const arrayData = encodeURIComponent(JSON.stringify(images));

            mediaHTML = `
                <div class="w-100 position-relative proj-detail-media" style="background: #101A30; overflow: hidden; cursor: zoom-in; border: 2px solid rgba(255,255,255,0.05);" 
                     data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')">
                    <img src="${primaryImg}" class="w-100 h-100" style="object-fit: contain;" onerror="this.src='main-res/profile.jpg';">
                    ${imgCountHTML}
                </div>`;
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

/* --- Multi-Image Modal Viewer Logic --- */
window.currentViewerImages = [];
window.currentViewerIndex = 0;

window.openImageViewer = function (imagesString) {
    window.currentViewerImages = JSON.parse(decodeURIComponent(imagesString));
    window.currentViewerIndex = 0;
    updateViewerImage();
};

window.navigateViewer = function (direction) {
    window.currentViewerIndex += direction;

    if (window.currentViewerIndex < 0) {
        window.currentViewerIndex = window.currentViewerImages.length - 1;
    }
    if (window.currentViewerIndex >= window.currentViewerImages.length) {
        window.currentViewerIndex = 0;
    }
    updateViewerImage();
};

function updateViewerImage() {
    const img = document.getElementById('fullscreen-image-target');
    const prev = document.getElementById('viewer-prev');
    const next = document.getElementById('viewer-next');

    if (img) img.src = window.currentViewerImages[window.currentViewerIndex];

    if (window.currentViewerImages.length > 1) {
        if (prev) prev.style.display = 'block';
        if (next) next.style.display = 'block';
    } else {
        if (prev) prev.style.display = 'none';
        if (next) next.style.display = 'none';
    }
}