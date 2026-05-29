/* -----
Experience Page Dynamic Renderer
Handles Tech Stack pagination, Project cards, and Dynamic Modals.
----- */
document.addEventListener('DOMContentLoaded', () => {

    let globalProjectsData = [];

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

    /* ----- Render Tech Stack ----- */
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

            Object.values(containers).forEach(c => { if(c) c.innerHTML = ''; });

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
                tab.addEventListener('shown.bs.tab', () => {
                    setTimeout(updateTechNavButtons, 150); 
                });
            });

            setTimeout(updateTechNavButtons, 200);

        } catch (e) { console.error("Error loading tech stack:", e); }
    }

    /* ----- Render Projects ----- */
    async function loadProjects() {
        const containers = {
            school: document.getElementById('proj-school'),
            personal: document.getElementById('proj-personal'),
            company: document.getElementById('proj-company'),
            other: document.getElementById('proj-other')
        };

        try {
            const response = await fetch('json/projects.json');
            globalProjectsData = await response.json(); 
            
            Object.values(containers).forEach(c => { if(c) c.innerHTML = ''; });

            globalProjectsData.forEach((proj, index) => {
                const targetContainer = containers[proj.category];
                if (!targetContainer) return;

                let mediaHTML = '';
                let contentHTML = '';

                const btnLaunch = proj.liveLink ? `<a href="${proj.liveLink}" target="_blank" class="btn-view text-center flex-grow-1"><i class="bi bi-box-arrow-up-right me-1"></i> Launch</a>` : '';
                const btnDetails = `<button onclick="openProjectModal(${index})" class="btn-view flex-grow-1" style="background: rgba(255,255,255,0.05);"><i class="bi bi-info-circle me-1"></i> Details</button>`;

                if (proj.mediaType === 'iframe') {
                    // --- IFRAME LAYOUT: Iframe Grows, Text Box Shrinks ---
                    const iframeSrc = proj.mediaSource[0] ? `src="${proj.mediaSource[0]}"` : '';
                    
                    // Added !important overrides to force the iframe to stretch and fill the space
                    mediaHTML = `<div class="project-thumb live-embed" style="flex: 1 1 auto !important; height: 100% !important; min-height: 220px !important;"><iframe ${iframeSrc} loading="lazy" onerror="this.style.display='none'"></iframe><div class="embed-overlay"></div></div>`;
                    
                    contentHTML = `
                        <div class="project-content d-flex flex-column" style="flex: 0 0 auto !important; padding-top: 25px !important;">
                            <h3 class="mb-4">${proj.title}</h3>
                            <div class="d-flex gap-2 w-100">
                                ${btnLaunch}
                                ${btnDetails}
                            </div>
                        </div>
                    `;
                } else {
                    // --- IMAGE LAYOUT: Image is Fixed Height, Text Box Grows ---
                    const isMulti = proj.mediaSource.length > 1;
                    const cursorStyle = isMulti ? 'cursor: pointer;' : '';
                    const tooltip = isMulti ? 'title="Click to see next image"' : '';
                    const arrayData = encodeURIComponent(JSON.stringify(proj.mediaSource));
                    
                    mediaHTML = `
                        <div class="project-thumb overflow-hidden d-flex align-items-center justify-content-center bg-dark" style="flex: 0 0 200px !important; height: 200px !important;">
                            <img src="${proj.mediaSource[0] || 'main-res/profile.jpg'}" class="img-fluid project-cycler-img" 
                                 style="${cursorStyle} width: 100%; height: 100%; object-fit: cover;" 
                                 ${tooltip}
                                 data-media-array="${arrayData}" 
                                 data-current-index="0"
                                 onclick="cycleProjectImage(this)"
                                 onerror="this.src='main-res/profile.jpg'; this.style.objectFit='contain';">
                        </div>`;

                    const techStackBadges = (proj.techStack && Array.isArray(proj.techStack)) 
                        ? proj.techStack.map(tech => `<span class="badge bg-secondary me-1 mb-2" style="font-size: 0.75rem;">${tech}</span>`).join('')
                        : '';

                    contentHTML = `
                        <div class="project-content d-flex flex-column" style="flex: 1 1 auto !important;">
                            <h3 class="mb-3">${proj.title}</h3>
                            <p class="mb-auto">${proj.description}</p>
                            <div class="mt-4 mb-3">${techStackBadges}</div>
                            <div class="d-flex gap-2 w-100 mt-2">
                                ${btnLaunch}
                                ${btnDetails}
                            </div>
                        </div>
                    `;
                }

                targetContainer.innerHTML += `
                    <div class="project-card d-flex flex-column" style="flex: 0 0 350px;">
                        ${mediaHTML}
                        ${contentHTML}
                    </div>
                `;
            });
        } catch (e) { console.error("Error loading projects:", e); }
    }

    loadTechStack();
    loadProjects();

    window.openProjectModal = function(index) {
        const proj = globalProjectsData[index];
        if (!proj) return;

        const modalTitle = document.getElementById('modalProjTitle');
        const modalDesc = document.getElementById('modalProjDesc');
        const modalTech = document.getElementById('modalProjTech');
        const modalMedia = document.getElementById('modalProjMedia');
        const modalFooter = document.getElementById('modalProjFooter');

        modalTitle.innerText = proj.title;
        modalDesc.innerText = proj.description;

        modalTech.innerHTML = (proj.techStack || []).map(tech => `<span class="badge bg-secondary me-1 mb-1">${tech}</span>`).join('');

        if (proj.mediaType === 'iframe') {
            const iframeSrc = proj.mediaSource[0] ? `src="${proj.mediaSource[0]}"` : '';
            modalMedia.innerHTML = `<iframe ${iframeSrc} loading="lazy" class="w-100 h-100 border-0"></iframe>`;
        } else {
            if (proj.mediaSource.length > 1) {
                let indicators = '';
                let items = '';
                proj.mediaSource.forEach((src, i) => {
                    indicators += `<button type="button" data-bs-target="#projCarousel" data-bs-slide-to="${i}" class="${i===0?'active':''}"></button>`;
                    items += `
                        <div class="carousel-item ${i===0?'active':''} h-100">
                            <img src="${src}" class="d-block w-100 h-100" style="object-fit: contain;" alt="Slide ${i}">
                        </div>`;
                });
                modalMedia.innerHTML = `
                    <div id="projCarousel" class="carousel slide h-100 w-100" data-bs-ride="carousel">
                        <div class="carousel-indicators">${indicators}</div>
                        <div class="carousel-inner h-100">${items}</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#projCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true" style="filter: drop-shadow(0 0 5px #000);"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#projCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true" style="filter: drop-shadow(0 0 5px #000);"></span>
                        </button>
                    </div>`;
            } else {
                modalMedia.innerHTML = `<img src="${proj.mediaSource[0]}" class="w-100 h-100" style="object-fit: contain;">`;
            }
        }

        modalFooter.innerHTML = proj.liveLink 
            ? `<a href="${proj.liveLink}" target="_blank" class="btn btn-custom btn-explore w-100"><i class="bi bi-box-arrow-up-right me-2"></i>Launch Live Site</a>`
            : `<button class="btn btn-secondary w-100" disabled>No Live Preview</button>`;

        const projectModal = new bootstrap.Modal(document.getElementById('projectDetailsModal'));
        projectModal.show();
    };

    window.scrollActiveTechStack = function(direction) {
        const activeTab = document.querySelector('.tab-pane.active .tech-slider');
        if (!activeTab) return;
        activeTab.scrollBy({ left: 260 * direction, behavior: 'smooth' });
    };
});

window.cycleProjectImage = function(imgElement) {
    try {
        const mediaArray = JSON.parse(decodeURIComponent(imgElement.getAttribute('data-media-array')));
        if (mediaArray.length <= 1) return; 
        let currentIndex = parseInt(imgElement.getAttribute('data-current-index'), 10);
        currentIndex = (currentIndex + 1) % mediaArray.length; 
        
        imgElement.style.opacity = 0;
        setTimeout(() => {
            imgElement.src = mediaArray[currentIndex];
            imgElement.setAttribute('data-current-index', currentIndex);
            imgElement.style.opacity = 1;
        }, 150);
    } catch(e) { console.error('Image cycle error', e); }
};