/* -----
About Page Dynamic Renderer
Handles Fun Facts, Career Map (Expandable), and Advanced Recognitions (Pagination/Sort/Search)
----- */
document.addEventListener('DOMContentLoaded', () => {

    /* --- Global Scroll Helper for Mobile --- */
    window.scrollRow = function (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollBy({ left: 250, behavior: 'smooth' });
        }
    };

    /* --- 1. Load Fun Facts --- */
    async function loadFunFacts() {
        const container = document.getElementById('fun-facts-container');
        if (!container) return;
        try {
            const res = await fetch('json/funFacts.json');
            const data = await res.json();
            container.innerHTML = data.map(fact => `
                <div class="col">
                    <div class="card-style p-3 h-100 text-center">
                        <div class="fact-icon mb-2"><i class="bi ${fact.iconClass}"></i></div>
                        <p class="fredoka mb-1">${fact.factTitle}</p>
                        <p class="tiny-text opacity-75">${fact.factDescription}</p>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            console.error('Failed to load fun facts:', e);
        }
    }

    /* --- 2. Load Career Trail (Expandable) --- */
    let fullCareerData = [];
    let careerExpanded = false;

    function renderCareer() {
        const container = document.getElementById('career-timeline-container');
        const btn = document.getElementById('toggle-career-btn');
        if (!container) return;

        // Limit to 2 items if not expanded
        const displayData = careerExpanded ? fullCareerData : fullCareerData.slice(0, 2);

        container.innerHTML = displayData.map(item => `
            <div class="career-node ${item.isCurrent ? 'current-node' : ''}">
                <div class="career-card">
                    <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-2">
                        <div class="edu-icon"><i class="bi ${item.iconClass || 'bi-briefcase-fill'}"></i></div>
                        <div>
                            <h4 class="fredoka mb-1 fs-5">${item.title}</h4>
                            <p class="mb-0 text-accent small fw-bold">${item.subtitle}</p>
                        </div>
                    </div>
                    <p class="mb-0 opacity-75 tiny-text mt-2 mt-sm-0">${item.dateRange}</p>
                    ${item.description ? `<p class="mt-2 mb-0 small opacity-75">${item.description}</p>` : ''}
                </div>
            </div>
        `).join('');

        if (btn) {
            btn.style.display = fullCareerData.length > 2 ? 'inline-block' : 'none';
            btn.innerHTML = careerExpanded ? 'SHOW LESS <i class="bi bi-chevron-up"></i>' : 'SHOW MORE <i class="bi bi-chevron-down"></i>';
        }
    }

    async function loadCareerTrail() {
        try {
            const res = await fetch('json/career.json');
            fullCareerData = await res.json();
            renderCareer();

            const btn = document.getElementById('toggle-career-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    careerExpanded = !careerExpanded;
                    renderCareer();
                });
            }
        } catch (e) {
            console.error('Failed to load career trail:', e);
        }
    }

    /* --- 3. Advanced Recognitions Engine (Pagination) --- */
    let allCerts = [];
    let allAwards = [];

    // Pagination Configuration
    const ITEMS_PER_PAGE = 6;
    let currentCertsPage = 1;
    let currentAwardsPage = 1;

    // Make page changer globally accessible for the inline onclick handlers
    window.changePage = function (type, newPage) {
        if (type === 'certs') currentCertsPage = newPage;
        if (type === 'awards') currentAwardsPage = newPage;
        filterAndSortData();
        // Scroll slightly up so the user sees the new top row
        document.getElementById('full-recognitions-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    function parseDateForSort(dateString) {
        if (!dateString) return 0;
        const d = new Date(dateString);
        if (!isNaN(d.getTime())) return d.getTime();
        const yearMatch = dateString.match(/\d{4}/);
        return yearMatch ? new Date(yearMatch[0], 0, 1).getTime() : 0;
    }

    function renderRecognitionsCards(dataArray, containerId, page, paginationId, typeString) {
        const container = document.getElementById(containerId);
        const paginationContainer = document.getElementById(paginationId);
        if (!container) return;

        if (dataArray.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-5 w-100">No results found matching your criteria.</div>`;
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        // --- Calculate Pagination ---
        const totalPages = Math.ceil(dataArray.length / ITEMS_PER_PAGE);
        // Safety check if search reduces total pages below current page
        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;

        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const displayData = dataArray.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        // --- Render Cards ---
        container.innerHTML = displayData.map(item => {
            const images = item.images || (item.imageUrl ? [item.imageUrl] : []);
            const primaryImg = images.length > 0 ? images[0] : '';
            const imgCountHTML = images.length > 1 ? `<span class="img-count-badge">+${images.length - 1} Images</span>` : '';

            const imageContainerHTML = primaryImg
                ? `<div class="recog-img-container">
                       <img src="${primaryImg}" alt="${item.awardTitle}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="document.getElementById('fullscreen-image-target').src=this.src">
                       ${imgCountHTML}
                   </div>`
                : `<div class="recog-img-container recog-no-img"><i class="bi ${item.iconClass || 'bi-award-fill'}"></i></div>`;

            return `
                <div class="col">
                    <div class="card-style p-3 recog-card">
                        ${imageContainerHTML}
                        <h4 class="fredoka fs-5 mb-1">${item.awardTitle}</h4>
                        <p class="text-accent small fw-bold mb-2">${item.awardContext}</p>
                        ${item.description ? `<p class="opacity-75 tiny-text mb-0 mt-auto">${item.description}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // --- Render Pagination UI ---
        if (paginationContainer) {
            if (totalPages <= 1) {
                paginationContainer.innerHTML = ''; // Hide if only 1 page
            } else {
                let pagHTML = '';
                // Previous Button
                pagHTML += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
                                <button class="page-link" onclick="changePage('${typeString}', ${page - 1})"><i class="bi bi-chevron-left"></i></button>
                            </li>`;
                // Numbered Buttons
                for (let i = 1; i <= totalPages; i++) {
                    pagHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                    <button class="page-link" onclick="changePage('${typeString}', ${i})">${i}</button>
                                </li>`;
                }
                // Next Button
                pagHTML += `<li class="page-item ${page === totalPages ? 'disabled' : ''}">
                                <button class="page-link" onclick="changePage('${typeString}', ${page + 1})"><i class="bi bi-chevron-right"></i></button>
                            </li>`;

                paginationContainer.innerHTML = pagHTML;
            }
        }
    }

    function filterAndSortData() {
        const query = document.getElementById('recog-search').value.toLowerCase();
        const sortMode = document.getElementById('recog-sort').value;

        const processList = (list) => {
            let processed = list.filter(item =>
                (item.awardTitle && item.awardTitle.toLowerCase().includes(query)) ||
                (item.awardContext && item.awardContext.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query))
            );

            processed.sort((a, b) => {
                if (sortMode === 'newest') return parseDateForSort(b.awardContext) - parseDateForSort(a.awardContext);
                if (sortMode === 'oldest') return parseDateForSort(a.awardContext) - parseDateForSort(b.awardContext);
                if (sortMode === 'name-asc') return (a.awardTitle || '').localeCompare(b.awardTitle || '');
                if (sortMode === 'name-desc') return (b.awardTitle || '').localeCompare(a.awardTitle || '');
                return 0;
            });
            return processed;
        };

        // Pass the updated page numbers and target pagination containers
        renderRecognitionsCards(processList(allCerts), 'full-certs-container', currentCertsPage, 'certs-pagination', 'certs');
        renderRecognitionsCards(processList(allAwards), 'full-awards-container', currentAwardsPage, 'awards-pagination', 'awards');
    }

    // Reset pagination to Page 1 when searching or sorting
    function handleFiltersChanged() {
        currentCertsPage = 1;
        currentAwardsPage = 1;
        filterAndSortData();
    }

    async function loadRecognitionsData() {
        try {
            const [certsRes, awardsRes] = await Promise.all([
                fetch('json/certificationsWorkshops.json'),
                fetch('json/affiliationsAwards.json')
            ]);

            allCerts = await certsRes.json();
            allAwards = await awardsRes.json();

            // Initial Render
            filterAndSortData();

            // Bind Event Listeners
            document.getElementById('recog-search').addEventListener('input', handleFiltersChanged);
            document.getElementById('recog-sort').addEventListener('change', handleFiltersChanged);

        } catch (e) {
            console.error('Failed to load recognitions data:', e);
        }
    }

    // Initialize Everything
    loadFunFacts();
    loadCareerTrail();
    loadRecognitionsData();
});