/* -----
About Page Dynamic Renderer
Handles Fun Facts, Career Map, and Unified Advanced Recognitions Slider
----- */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Load Fun Facts --- */
    async function loadFunFacts() {
        const container = document.getElementById('fun-facts-container');
        if (!container) return;
        try {
            const res = await fetch('json/funFacts.json');
            const data = await res.json();
            container.innerHTML = data.map(fact => `
                <div class="col interactive-card">
                    <div class="card-style p-3 h-100 text-center pointer">
                        <div class="fact-icon mb-2"><i class="bi ${fact.iconClass}"></i></div>
                        <p class="fredoka mb-1">${fact.factTitle}</p>
                        <p class="tiny-text opacity-75">${fact.factDescription}</p>
                    </div>
                </div>
            `).join('');

            // Inject Custom Slider Track instead of dots
            if (!document.getElementById('funfacts-track')) {
                container.insertAdjacentHTML('afterend', `
                    <div id="funfacts-track" class="scroll-progress-track mt-4 mx-auto" style="max-width: 200px; display: none;">
                        <div id="funfacts-thumb" class="scroll-progress-thumb"></div>
                    </div>
                `);
            }

            const cards = container.querySelectorAll('.col');

            // Center on Card Click
            cards.forEach((card) => {
                card.addEventListener('click', () => {
                    const scrollPos = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);
                    container.scrollTo({ left: scrollPos, behavior: 'smooth' });
                });
            });

            // --- FUN FACTS SLIDER LOGIC ---
            const updateFunFactsSlider = () => {
                const track = document.getElementById('funfacts-track');
                const thumb = document.getElementById('funfacts-thumb');
                if (!track || !thumb || !container) return;

                const maxScroll = container.scrollWidth - container.clientWidth;
                if (maxScroll <= 0) {
                    track.style.display = 'none';
                    return;
                } else {
                    track.style.display = 'block';
                }

                const scrollPercentage = container.scrollLeft / maxScroll;
                const maxTranslate = track.clientWidth - thumb.clientWidth;
                thumb.style.transform = `translateX(${scrollPercentage * maxTranslate}px)`;
            };

            container.addEventListener('scroll', updateFunFactsSlider);
            window.addEventListener('resize', updateFunFactsSlider);
            setTimeout(updateFunFactsSlider, 100);

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

        const displayData = careerExpanded ? fullCareerData : fullCareerData.slice(0, 1);

        container.innerHTML = displayData.map(item => {
            const visualAssetHTML = item.logoUrl
                ? `<img src="${item.logoUrl}" alt="${item.title} Logo" class="career-logo" loading="lazy">`
                : `<i class="bi ${item.iconClass || 'bi-briefcase-fill'}"></i>`;

            return `
            <div class="career-node ${item.isCurrent ? 'current-node' : ''}">
                <div class="career-card">
                    <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-2">
                        <div class="edu-icon d-flex justify-content-center align-items-center">${visualAssetHTML}</div>
                        <div>
                            <h4 class="fredoka mb-1 fs-5">${item.title}</h4>
                            <p class="mb-0 text-accent small fw-bold">${item.subtitle}</p>
                        </div>
                    </div>
                    <p class="mb-0 opacity-75 tiny-text mt-2 mt-sm-0">${item.dateRange}</p>
                    ${item.description ? `<p class="mt-2 mb-0 small opacity-75">${item.description}</p>` : ''}
                </div>
            </div>
            `;
        }).join('');

        if (btn) {
            btn.style.display = fullCareerData.length > 1 ? 'inline-block' : 'none';
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
        } catch (e) { console.error('Failed to load career trail:', e); }
    }


    /* --- 3. Unified Recognitions & Awards Slider --- */
    let globalRecognitionsData = [];

    function parseDateForSort(dateString) {
        if (!dateString) return 0;
        const d = new Date(dateString);
        if (!isNaN(d.getTime())) return d.getTime();
        const yearMatch = dateString.match(/\d{4}/);
        return yearMatch ? new Date(yearMatch[0], 0, 1).getTime() : 0;
    }

    function renderFilteredRecognitions() {
        const query = document.getElementById('recog-search').value.toLowerCase();
        const catFilter = document.getElementById('recog-category').value;
        const sortMode = document.getElementById('recog-sort').value;

        // Filter Data
        let filtered = globalRecognitionsData.filter(item => {
            const title = item.title || item.awardTitle || '';
            const context = item.context || item.awardContext || '';

            const matchesSearch = title.toLowerCase().includes(query) ||
                context.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query));

            // Map implicit categories if they aren't explicitly defined in the JSON
            const itemCategory = item.category || (item.awardTitle ? 'award' : 'certificate');
            const matchesCat = catFilter === 'all' || itemCategory === catFilter;

            return matchesSearch && matchesCat;
        });

        // Sort Data
        filtered.sort((a, b) => {
            const titleA = a.title || a.awardTitle || '';
            const titleB = b.title || b.awardTitle || '';
            const dateA = a.date || a.awardContext || '';
            const dateB = b.date || b.awardContext || '';

            if (sortMode === 'top') {
                const aVal = a.value === 'important' ? 1 : 0;
                const bVal = b.value === 'important' ? 1 : 0;
                if (aVal !== bVal) return bVal - aVal; // Push "important" to top
                return parseDateForSort(dateB) - parseDateForSort(dateA); // Fallback to newest
            }
            if (sortMode === 'newest') return parseDateForSort(dateB) - parseDateForSort(dateA);
            if (sortMode === 'oldest') return parseDateForSort(dateA) - parseDateForSort(dateB);
            if (sortMode === 'name-asc') return titleA.localeCompare(titleB);
            if (sortMode === 'name-desc') return titleB.localeCompare(titleA);
            return 0;
        });

        const container = document.getElementById('unified-recognitions-container');
        const dotsContainer = document.getElementById('recognitions-mobile-dots');

        if (filtered.length === 0) {
            container.innerHTML = `<div class="text-center text-white py-5 w-100">No results found matching your criteria.</div>`;
            dotsContainer.innerHTML = '';
            return;
        }

        // Render Slider Content
        container.innerHTML = filtered.map((item, idx) => {
            // Normalize property names dynamically based on which JSON file it came from
            const title = item.title || item.awardTitle || '';
            const context = item.context || item.awardContext || '';
            const dateStr = item.date ? ` &bull; ${item.date}` : ''; // Handle if date is merged into context

            const images = item.images || (item.imageUrl ? [item.imageUrl] : []);
            const primaryImg = images.length > 0 ? images[0] : '';
            const imgCountHTML = images.length > 1 ? `<span class="img-count-badge">+${images.length - 1} Images</span>` : '';
            const arrayData = encodeURIComponent(JSON.stringify(images));

            const imageContainerHTML = primaryImg
                ? `<div class="recog-img-container">
                       <img src="${primaryImg}" alt="${title}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')" loading="lazy">
                       ${imgCountHTML}
                   </div>`
                : `<div class="recog-img-container recog-no-img"><i class="bi ${item.iconClass || 'bi-award-fill'}"></i></div>`;

            // Note: catBadge (category pill) has been completely removed from the h4 tag below
            return `
                <div class="recog-wrapper interactive-card">
                    <div class="card-style p-3 recog-card h-100">
                        ${imageContainerHTML}
                        <h4 class="fredoka fs-5 mb-2 d-flex align-items-center flex-wrap">${title}</h4>
                        <p class="text-accent small fw-bold mb-2">${context}${dateStr}</p>
                        ${item.description ? `<p class="opacity-75 tiny-text mb-0 mt-auto">${item.description}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        const wrappers = container.querySelectorAll('.recog-wrapper');

        // Click Logic (Center Card)
        const centerItem = (idx) => {
            const target = wrappers[idx];
            if (target) {
                const scrollPos = target.offsetLeft - (container.offsetWidth / 2) + (target.offsetWidth / 2);
                container.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        };

        wrappers.forEach((wrap, idx) => {
            wrap.addEventListener('click', () => centerItem(idx));
        });

        // --- RECOGNITIONS SLIDER LOGIC ---
        const updateRecogSlider = () => {
            const track = document.getElementById('recognitions-track');
            const thumb = document.getElementById('recognitions-thumb');
            if (!track || !thumb || !container) return;

            const maxScroll = container.scrollWidth - container.clientWidth;
            if (maxScroll <= 0) {
                track.style.display = 'none';
                return;
            } else {
                track.style.display = 'block';
            }

            const scrollPercentage = container.scrollLeft / maxScroll;
            const maxTranslate = track.clientWidth - thumb.clientWidth;
            thumb.style.transform = `translateX(${scrollPercentage * maxTranslate}px)`;
        };

        container.addEventListener('scroll', updateRecogSlider);
        window.addEventListener('resize', updateRecogSlider);
        setTimeout(updateRecogSlider, 100);
    }

    async function loadRecognitionsData() {
        try {
            // Fetch BOTH JSON files concurrently instead of looking for a single recognitions.json
            const [certsRes, awardsRes] = await Promise.all([
                fetch('json/certificationsWorkshops.json'),
                fetch('json/affiliationsAwards.json')
            ]);

            const certsData = await certsRes.json();
            const awardsData = await awardsRes.json();

            // Safely tag them with categories for the dropdown filter, then merge them into one array
            const taggedCerts = certsData.map(item => ({ ...item, category: 'certificate' }));
            const taggedAwards = awardsData.map(item => ({ ...item, category: 'award' }));

            globalRecognitionsData = [...taggedCerts, ...taggedAwards];

            renderFilteredRecognitions();

            const searchInput = document.getElementById('recog-search');
            const catFilter = document.getElementById('recog-category');
            const sortSelect = document.getElementById('recog-sort');

            if (searchInput) searchInput.addEventListener('input', renderFilteredRecognitions);
            if (catFilter) catFilter.addEventListener('change', renderFilteredRecognitions);
            if (sortSelect) sortSelect.addEventListener('change', renderFilteredRecognitions);

        } catch (e) {
            console.error('Failed to load recognitions and awards data:', e);
        }
    }

    // Initialize Everything
    loadFunFacts();
    loadCareerTrail();
    loadRecognitionsData();
});