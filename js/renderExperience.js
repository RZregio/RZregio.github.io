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

            // Clear containers
            Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

            techData.forEach(tech => {
                const targetContainer = containers[tech.category];
                if (!targetContainer) return;

                // Format the experience badge to be smaller and tighter
                const expText = tech.experienceText
                    ? `<span class="badge bg-dark border border-secondary text-warning mb-2 align-self-start" style="font-size: 0.7rem; padding: 5px 8px;"><i class="bi bi-clock-history me-1"></i>${tech.experienceText}</span>`
                    : '';

                // Compact Card Layout: Icon and Title sit side-by-side to save vertical space
                targetContainer.innerHTML += `
                    <div class="tech-item-wrapper" style="flex: 0 0 calc(33.333% - 14px); min-width: 260px;">
                        <div class="stack-card interactive-card d-flex flex-column h-100 text-start p-3">
                            <div class="d-flex align-items-center gap-3 mb-2">
                                <i class="${tech.iconClass} text-accent" style="font-size: 2.2rem; line-height: 1;"></i>
                                <h5 class="fredoka text-white mb-0" style="font-size: 1.1rem; line-height: 1.2;">${tech.title}</h5>
                            </div>
                            ${expText}
                            <p class="opacity-75 mb-3 flex-grow-1" style="font-size: 0.85rem; line-height: 1.6;">${tech.description}</p>
                            
                            <a href="${tech.linkUrl}" target="_blank" class="btn btn-sm rounded-pill mt-auto w-100 tech-link-btn">
                                <i class="bi bi-box-arrow-up-right me-2"></i>Official Docs
                            </a>
                        </div>
                    </div>
                `;
            });

            // Re-apply slider dots and listeners
            document.querySelectorAll('.tech-slider').forEach(slider => {
                slider.addEventListener('scroll', updateTechNavButtons);
                const techCount = slider.children.length;

                if (techCount > 0) {
                    if (!slider.nextElementSibling || !slider.nextElementSibling.classList.contains('mobile-scroll-dots')) {
                        const dotsHTML = Array(techCount).fill('').map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}"></div>`).join('');
                        slider.insertAdjacentHTML('afterend', `
                            <div class="mobile-scroll-dots d-mobile-flex mt-3 mb-4">
                                ${dotsHTML}
                            </div>
                        `);
                    }

                    const dotsContainer = slider.nextElementSibling;
                    slider.addEventListener('scroll', () => {
                        if (window.updateScrollDots) window.updateScrollDots(slider, dotsContainer, techCount);
                    });

                    if (window.updateScrollDots) window.updateScrollDots(slider, dotsContainer, techCount);

                    // Mobile Click-to-center logic
                    const items = slider.querySelectorAll('.tech-item-wrapper');
                    items.forEach((item) => {
                        item.addEventListener('click', () => {
                            if (window.innerWidth <= 991) {
                                const scrollPos = item.offsetLeft - (slider.offsetWidth / 2) + (item.offsetWidth / 2);
                                slider.scrollTo({ left: scrollPos, behavior: 'smooth' });
                            }
                        });
                    });
                }
            });

            const tabElms = document.querySelectorAll('button[data-bs-toggle="tab"], button[data-bs-toggle="pill"]');
            const techTabContainer = document.querySelector('.nav-pills.flex-column');

            tabElms.forEach(tab => {
                tab.addEventListener('shown.bs.tab', (e) => {
                    setTimeout(updateTechNavButtons, 150);
                    if (window.innerWidth <= 991 && techTabContainer) {
                        const targetTab = e.target;
                        const scrollPos = targetTab.offsetLeft - (techTabContainer.offsetWidth / 2) + (targetTab.offsetWidth / 2);
                        techTabContainer.scrollTo({ left: scrollPos, behavior: 'smooth' });
                    }
                });
            });

            setTimeout(updateTechNavButtons, 200);

        } catch (e) { console.error("Error loading tech stack:", e); }
    }

    /* ----- Unified Project Filtering & Split-Pane Layout ----- */
    function renderFilteredProjects() {
        const query = document.getElementById('project-search').value.toLowerCase();
        const techFilter = document.getElementById('tech-stack-filter').value;
        const catFilter = document.getElementById('project-category-filter').value;

        // 1. Filter Data (Fixed Java vs JavaScript overlap bug)
        let filteredData = globalProjectsData.filter(proj => {
            const matchesSearch = proj.title.toLowerCase().includes(query) ||
                (proj.techStack && proj.techStack.some(t => t.toLowerCase().includes(query)));

            // EXACT match ensures "Java" doesn't trigger "JavaScript"
            const matchesTech = techFilter === 'all' ||
                (proj.techStack && proj.techStack.some(t => t.toLowerCase() === techFilter.toLowerCase()));

            let matchesCat = true;
            if (catFilter === 'important') {
                matchesCat = proj.value === 'important';
            } else if (catFilter !== 'all') {
                matchesCat = proj.category === catFilter;
            }

            return matchesSearch && matchesTech && matchesCat;
        });

        // 2. Sort Data (Important projects at the top)
        filteredData.sort((a, b) => {
            const aIsImportant = a.value === 'important' ? 1 : 0;
            const bIsImportant = b.value === 'important' ? 1 : 0;
            return bIsImportant - aIsImportant; // Descending
        });

        const pane = document.getElementById('project-content');

        if (filteredData.length === 0) {
            pane.innerHTML = '<p class="text-white w-100 mt-5 text-center">No projects found matching your criteria.</p>';
            return;
        }

        // 3. Build the Sleek Navigation List
        let listHTML = '';
        filteredData.forEach((proj, idx) => {
            listHTML += `
                <button class="btn w-100 mb-2 text-start d-flex justify-content-between align-items-center proj-list-btn" 
                        data-idx="${idx}" style="color: rgba(255,255,255,0.6); transition: 0.3s; border-radius: 8px; padding: 12px 15px;">
                    <div class="text-truncate me-2 fw-medium" style="font-size: 0.9rem;">${proj.title}</div>
                    <i class="bi bi-chevron-right opacity-50 indicator-icon d-none d-lg-block" style="font-size: 0.8rem;"></i>
                </button>
            `;
        });

        const scrollHintVertical = filteredData.length > 5 ? `<div class="text-center mt-1 mb-3 small text-warning opacity-75 vertical-scroll-hint"><i class="bi bi-chevron-down mb-1 d-block"></i>Scroll for more</div>` : '';

        // 4. Inject Unified Layout (Widescreen UI with New Slider)
        pane.innerHTML = `
            <div class="row g-0 align-items-stretch unified-layout-card">
                <div class="col-lg-3 unified-list-col">
                    <div class="project-list-scroll p-2 py-3" id="unified-list">
                        ${listHTML}
                    </div>
                    <div class="scroll-progress-track d-lg-none mt-0 mb-3 mx-3">
                        <div class="scroll-progress-thumb" id="project-scroll-thumb"></div>
                    </div>
                    ${scrollHintVertical}
                </div>
                <div class="col-lg-9">
                    <div class="p-3 p-lg-4 h-100" id="unified-detail">
                    </div>
                </div>
            </div>
        `;

        // 5. Attach Listeners and Theme-Dynamic Active States
        const listContainer = document.getElementById('unified-list');
        const buttons = listContainer.querySelectorAll('.proj-list-btn');

        const activateButton = (target, index) => {
            buttons.forEach(b => {
                b.classList.remove('active-proj-btn');
                const icon = b.querySelector('.indicator-icon');
                if (icon) { icon.classList.replace('bi-check-circle-fill', 'bi-chevron-right'); }
            });
            
            target.classList.add('active-proj-btn');
            const activeIcon = target.querySelector('.indicator-icon');
            if (activeIcon) { activeIcon.classList.replace('bi-chevron-right', 'bi-check-circle-fill'); }

            renderProjectDetail(filteredData[index], 'unified-detail');
        };

        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-idx');
                activateButton(e.currentTarget, idx);

                if (window.innerWidth <= 991) {
                    const scrollPos = e.currentTarget.offsetLeft - (listContainer.offsetWidth / 2) + (e.currentTarget.offsetWidth / 2);
                    listContainer.scrollTo({ left: scrollPos, behavior: 'smooth' });
                }
            });
        });

        if (buttons.length > 0) activateButton(buttons[0], 0);

        // --- NEW CUSTOM SLIDER LOGIC ---
        const updateSlider = () => {
            const track = document.querySelector('.scroll-progress-track');
            const thumb = document.getElementById('project-scroll-thumb');
            if (!track || !thumb || !listContainer) return;

            // Calculate max scrollable area
            const maxScroll = listContainer.scrollWidth - listContainer.clientWidth;
            
            // Hide slider if there are too few projects to scroll
            if (maxScroll <= 0) {
                track.style.display = 'none'; 
                return;
            } else {
                track.style.display = 'block';
            }

            // Calculate exact scroll percentage and move the thumb
            const scrollPercentage = listContainer.scrollLeft / maxScroll;
            const maxTranslate = track.clientWidth - thumb.clientWidth;
            thumb.style.transform = `translateX(${scrollPercentage * maxTranslate}px)`;
        };

        // Attach the slider update to scroll and resize events
        listContainer.addEventListener('scroll', updateSlider);
        window.addEventListener('resize', updateSlider);
        setTimeout(updateSlider, 100); // Initial calculation after DOM paints
    }

    /* ----- Split-Pane Detail View Renderer (Widescreen Mode) ----- */
    function renderProjectDetail(proj, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let mediaHTML = '';

        if (proj.mediaType === 'iframe') {
            const iframeSrc = proj.mediaSource[0] ? `src="${proj.mediaSource[0]}"` : '';
            mediaHTML = `
                <div class="w-100 proj-detail-media position-relative" style="background: #0B1120; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); height: 400px; border-radius: 12px;">
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
                    <div class="w-100 position-relative proj-detail-media" style="background: #0B1120; overflow: hidden; cursor: zoom-in; border: 1px solid rgba(255,255,255,0.05); height: 400px; border-radius: 12px;" 
                         data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')">
                        <img src="${primaryImg}" class="w-100 h-100" style="object-fit: contain;" loading="lazy">
                        ${imgCountHTML}
                    </div>`;
            } else {
                mediaHTML = `
                    <div class="w-100 position-relative proj-detail-media image-unavailable-placeholder d-flex flex-column justify-content-center align-items-center" style="background: #0B1120; overflow: hidden; border: 2px dashed rgba(255,255,255,0.1); height: 400px; border-radius: 12px;">
                        <i class="bi bi-image mb-2" style="font-size: 2.5rem; opacity: 0.5;"></i>
                        <span style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">Not Available</span>
                    </div>`;
            }
        }

        const techStackBadges = (proj.techStack && Array.isArray(proj.techStack))
            ? proj.techStack.map(tech => `<span class="badge bg-secondary me-1 mb-2 px-2 py-2">${tech}</span>`).join('')
            : '';

        let btnLaunch = '<div class="d-flex flex-wrap gap-2 w-100">';
        if (proj.liveLink && proj.liveLink !== "") {
            btnLaunch += `<a href="${proj.liveLink}" target="_blank" class="btn btn-custom btn-explore flex-grow-1"><i class="bi bi-box-arrow-up-right me-2"></i>Live Demo</a>`;
        }
        if (proj.sourceCode && proj.sourceCode !== "") {
            btnLaunch += `<a href="${proj.sourceCode}" target="_blank" class="btn btn-outline-light flex-grow-1" style="border: 1px solid rgba(255,255,255,0.2);"><i class="bi bi-github me-2"></i>Source Code</a>`;
        }
        btnLaunch += '</div>';

        const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';
        const dateHtml = (proj.createdDate || proj.updatedDate) ? `
            <div class="opacity-50 mt-1 d-flex align-items-center gap-3" style="font-size: 0.85rem;">
                <span><i class="bi bi-calendar3 me-1"></i> Created: ${formatDate(proj.createdDate)}</span>
                <span><i class="bi bi-clock-history me-1"></i> Updated: ${formatDate(proj.updatedDate)}</span>
            </div>
        ` : '';

        // Widescreen Vertical Stack: Media on Top, Content Below
        container.innerHTML = `
            <div class="d-flex flex-column h-100">
                <div class="w-100 mb-4 rounded overflow-hidden" style="flex-shrink: 0;">
                    ${mediaHTML}
                </div>
                <div class="text-start d-flex flex-column flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="text-accent fw-bold text-uppercase small d-block mb-1" style="letter-spacing: 1px;">${proj.category} Project</span>
                            <h3 class="fredoka mb-0" style="font-size: 1.8rem;">${proj.title}</h3>
                            ${dateHtml}
                        </div>
                    </div>
                    <p class="opacity-75 my-3" style="font-size: 0.95rem; text-align: justify; line-height: 1.7;">${proj.description}</p>
                    <div class="mt-auto pt-2">
                        <h6 class="fredoka small mb-2 text-accent">Technologies Used:</h6>
                        <div class="d-flex flex-wrap gap-1 mb-4">
                            ${techStackBadges}
                        </div>
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
            const catFilter = document.getElementById('project-category-filter'); // Bind new category filter

            if (searchInput) searchInput.addEventListener('input', renderFilteredProjects);
            if (techFilter) techFilter.addEventListener('change', renderFilteredProjects);
            if (catFilter) catFilter.addEventListener('change', renderFilteredProjects);

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