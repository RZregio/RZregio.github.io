/* -----
Index Page Dynamic Renderer
Fetches and injects Services and Featured Projects.
Links the project carousel state to the dynamic description container.
----- */
document.addEventListener('DOMContentLoaded', () => {

    /* ----- Render Timeline Services ----- */
    async function loadServices() {
        const timelineContainer = document.getElementById('services-timeline-container');
        const detailsPane = document.getElementById('service-details-pane');
        if (!timelineContainer || !detailsPane) return;

        try {
            const fetchResponse = await fetch('json/services.json');
            const servicesDataList = await fetchResponse.json();

            // Render Timeline UI
            timelineContainer.innerHTML = servicesDataList.map((service, index) => `
            <div class="timeline-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <h6 class="fredoka mb-0">${service.serviceTitle}</h6>
            </div>
        `).join('');

            // Function to update the Left Pane
            function updateServiceDetails(index) {
                const service = servicesDataList[index];
                detailsPane.innerHTML = `
                <i class="bi ${service.iconClass} fs-1 text-accent mb-3 d-block"></i>
                <h3 class="fredoka mb-3">${service.serviceTitle}</h3>
                <p class="opacity-75 mb-4">${service.serviceDescription}</p>
                <h6 class="fredoka small text-accent">Notable Experience:</h6>
                <p class="small opacity-75">${service.notableExperience}</p>
                
                <div class="mt-4 pt-3 border-top border-secondary">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="small fw-bold">Proficiency</span>
                        <span class="small text-accent">${service.experienceLevel}</span>
                    </div>
                    <div class="progress bg-dark" style="height: 6px;">
                        <div class="progress-bar bg-warning" role="progressbar" style="width: ${service.proficiencyLevel}%"></div>
                    </div>
                </div>
            `;
            }

            // Set Default
            if (servicesDataList.length > 0) updateServiceDetails(0);

            // Attach Click Listeners to Timeline
            const timelineNodes = timelineContainer.querySelectorAll('.timeline-item');
            timelineNodes.forEach(node => {
                node.addEventListener('click', (e) => {
                    // Clear active states
                    timelineNodes.forEach(n => n.classList.remove('active'));
                    // Set new active state
                    const targetNode = e.currentTarget;
                    targetNode.classList.add('active');
                    updateServiceDetails(targetNode.getAttribute('data-index'));
                });
            });

        } catch (error) {
            console.error('Failed to load services:', error);
        }
    }

    /* ----- Render Featured Projects Carousel & Details ----- */
    async function loadFeaturedProjects() {
        const carouselInnerContainer = document.getElementById('featured-carousel-inner');
        const projectDetailsContainer = document.getElementById('featured-project-details');

        if (!carouselInnerContainer || !projectDetailsContainer) return;

        try {
            const fetchResponse = await fetch('json/featuredProjects.json');
            const featuredProjectsList = await fetchResponse.json();

            let compiledCarouselHTML = '';

            // 1. Build the Carousel Images (Now with modal trigger)
            featuredProjectsList.forEach((projectItem, index) => {
                const isActiveClass = index === 0 ? 'active' : '';
                compiledCarouselHTML += `
                    <div class="carousel-item ${isActiveClass}">
                        <img src="${projectItem.previewImageUrl}" class="d-block w-100 rounded bg-dark" style="object-fit: contain; height: 350px; cursor: zoom-in;" alt="${projectItem.projectTitle}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="document.getElementById('fullscreen-image-target').src=this.src">
                    </div>
                `;
            });
            carouselInnerContainer.innerHTML = compiledCarouselHTML;

            // 2. Helper function to update the text details
            function updateProjectDetails(projectIndex) {
                const activeProject = featuredProjectsList[projectIndex];

                const techStackBadges = activeProject.techStack.map(tech =>
                    `<span class="badge bg-secondary me-1 mb-1">${tech}</span>`
                ).join('');

                // Added Live Preview Button
                projectDetailsContainer.innerHTML = `
                    <span class="text-accent fw-bold text-uppercase small">${activeProject.projectCategory}</span>
                    <h3 class="fredoka mt-1 mb-3">${activeProject.projectTitle}</h3>
                    <p class="opacity-75 mb-4">${activeProject.projectContext}</p>
                    <div class="mb-4">
                        <h6 class="fredoka small">Tech Stack:</h6>
                        ${techStackBadges}
                    </div>
                    <div>
                        <a href="${activeProject.projectLinkUrl || '#'}" target="_blank" class="btn btn-sm btn-outline-warning rounded-pill px-4 py-2 interactive-card">
                            <i class="bi bi-box-arrow-up-right me-2"></i>Live Preview
                        </a>
                    </div>
                `;
            }

            // Set initial text for the first project
            updateProjectDetails(0);

            // 3. Listen for Bootstrap carousel slide events to update text
            const featuredCarouselElement = document.getElementById('featuredProjectsCarousel');
            featuredCarouselElement.addEventListener('slid.bs.carousel', function (event) {
                // event.to is the index of the newly active slide
                updateProjectDetails(event.to);
            });

        } catch (networkError) {
            console.error('Failed to load featured projects:', networkError);
        }
    }

    /* ----- Render Interactive Dual Tabs (Unified JSON Architecture) ----- */
    async function loadDualTabRecognitions() {
        const certButtonsContainer = document.getElementById('certificate-buttons-container');
        const awardButtonsContainer = document.getElementById('award-buttons-container');
        const certDetailsCard = document.getElementById('cert-details-card');
        const awardDetailsCard = document.getElementById('award-details-card');

        // --- Helper: Highlight Active Button (Forces text/icon to white) ---
        const highlightActiveButton = (container, activeIndex) => {
            container.querySelectorAll('button').forEach((btn, idx) => {
                const icon = btn.querySelector('.indicator-icon');
                const mainIcon = btn.querySelector('.bi:not(.indicator-icon)');
                if (idx == activeIndex) {
                    btn.style.borderColor = "var(--accent-yellow)";
                    btn.style.background = "rgba(212, 140, 28, 0.1)";
                    btn.style.color = "white";
                    if (icon) { icon.classList.remove('bi-chevron-right', 'opacity-50'); icon.classList.add('bi-check-circle-fill', 'text-white'); }
                    if (mainIcon) { mainIcon.classList.remove('text-accent'); mainIcon.classList.add('text-white'); }
                } else {
                    btn.style.borderColor = "rgba(255,255,255,0.1)";
                    btn.style.background = "rgba(255,255,255,0.05)";
                    btn.style.color = "rgba(255,255,255,0.3)"; // Revert to default CSS
                    if (icon) { icon.classList.remove('bi-check-circle-fill', 'text-white'); icon.classList.add('bi-chevron-right', 'opacity-50'); }
                    if (mainIcon) { mainIcon.classList.remove('text-white'); mainIcon.classList.add('text-accent'); }
                }
            });
        };

        try {
            // Fetch the unified JSON once
            const response = await fetch('json/recognitions.json');
            const allRecognitions = await response.json();

            // Filter into respective categories
            const certsList = allRecognitions.filter(item => item.category === 'certificate');
            const awardsList = allRecognitions.filter(item => item.category === 'award');

            // --- Tab 1: Certificates Logic ---
            let activeCertIndex = 0;

            certButtonsContainer.innerHTML = certsList.map((cert, index) => `
            <button class="btn btn-custom w-100 mb-3 text-start d-flex align-items-center justify-content-between interactive-card" 
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;" 
                    data-cert-index="${index}">
                <span><i class="bi ${cert.iconClass} text-accent me-2"></i> ${cert.title}</span>
                <i class="bi bi-chevron-right opacity-50 indicator-icon"></i>
            </button>
        `).join('');

            // Inside Certificates Logic
            const updateCertDisplay = (index) => {
                const certData = certsList[index];
                if (!certData) return;
                certDetailsCard.innerHTML = `
                <img src="${certData.imageUrl}" class="img-fluid rounded mb-4 interactive-card" style="max-height: 220px; object-fit: contain; background: rgba(0,0,0,0.2); padding: 10px; cursor: zoom-in;" alt="${certData.title}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="document.getElementById('fullscreen-image-target').src=this.src">
                <h3 class="fredoka mb-1">${certData.title}</h3>
                <p class="text-accent small fw-bold mb-3">${certData.context} &bull; ${certData.date}</p>
                <p class="opacity-75 mb-0">${certData.description}</p>
            `;
            };
            if (certsList.length > 0) {
                updateCertDisplay(0);
                highlightActiveButton(certButtonsContainer, 0);
            }

            certButtonsContainer.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('mouseenter', (e) => updateCertDisplay(e.currentTarget.getAttribute('data-cert-index')));
                btn.addEventListener('mouseleave', () => updateCertDisplay(activeCertIndex));
                btn.addEventListener('click', (e) => {
                    activeCertIndex = e.currentTarget.getAttribute('data-cert-index');
                    updateCertDisplay(activeCertIndex);
                    highlightActiveButton(certButtonsContainer, activeCertIndex);
                });
            });

            // --- Tab 2: Awards Logic ---
            let activeAwardIndex = 0;

            awardButtonsContainer.innerHTML = awardsList.map((award, index) => `
            <button class="btn btn-custom w-100 mb-3 text-start d-flex align-items-center justify-content-between interactive-card" 
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;" 
                    data-award-index="${index}">
                <span><i class="bi ${award.iconClass} text-accent me-2"></i> ${award.title}</span>
                <i class="bi bi-chevron-right opacity-50 indicator-icon"></i>
            </button>
        `).join('');

            // Inside Awards Logic
            const updateAwardDisplay = (index) => {
                const awardData = awardsList[index];
                if (!awardData) return;
                awardDetailsCard.innerHTML = `
                <img src="${awardData.imageUrl}" class="img-fluid rounded mb-4 interactive-card" style="max-height: 220px; object-fit: contain; background: rgba(0,0,0,0.2); padding: 10px; cursor: zoom-in;" alt="${awardData.title}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="document.getElementById('fullscreen-image-target').src=this.src">
                <h3 class="fredoka mb-1">${awardData.title}</h3>
                <p class="text-accent small fw-bold mb-3">${awardData.context} &bull; ${awardData.date}</p>
                <p class="opacity-75 mb-0">${awardData.description}</p>
            `;
            };

            if (awardsList.length > 0) {
                updateAwardDisplay(0);
                highlightActiveButton(awardButtonsContainer, 0);
            }

            awardButtonsContainer.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('mouseenter', (e) => updateAwardDisplay(e.currentTarget.getAttribute('data-award-index')));
                btn.addEventListener('mouseleave', () => updateAwardDisplay(activeAwardIndex));
                btn.addEventListener('click', (e) => {
                    activeAwardIndex = e.currentTarget.getAttribute('data-award-index');
                    updateAwardDisplay(activeAwardIndex);
                    highlightActiveButton(awardButtonsContainer, activeAwardIndex);
                });
            });

        } catch (networkError) {
            console.error('Failed to load recognitions data:', networkError);
        }
    }


    /* ----- Render Paginated Testimonials (2 per slide) ----- */
    async function loadTestimonials() {
        const carouselInner = document.getElementById('testimonials-carousel-inner');
        if (!carouselInner) return;

        try {
            const fetchResponse = await fetch('json/testimonials.json');
            const testimonialsDataList = await fetchResponse.json();
            let compiledHTML = '';

            // Loop array in steps of 2 to create carousel rows
            for (let i = 0; i < testimonialsDataList.length; i += 2) {
                const testimonialChunk = testimonialsDataList.slice(i, i + 2);
                const isActive = i === 0 ? 'active' : '';

                let rowHTML = '<div class="row">';
                testimonialChunk.forEach(item => {
                    rowHTML += `
                    <div class="col-lg-6 mb-3">
                        <div class="card-style p-4 h-100" style="background: rgba(255,255,255,0.05); border-radius: 10px">
                            <i class="bi bi-quote fs-1 text-accent opacity-50"></i>
                            <p class="fst-italic opacity-75 mb-4">"${item.testimonialMessage}"</p>
                            <div class="d-flex align-items-center mt-auto">
                                <div class="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary" style="width: 50px; height: 50px;">
                                    <i class="bi bi-person-fill fs-3 text-secondary"></i>
                                </div>
                                <div class="ms-3">
                                    <h6 class="fredoka mb-0">${item.reviewerName}</h6>
                                    <small class="text-accent">${item.reviewerRole}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                });
                rowHTML += '</div>';
                compiledHTML += `<div class="carousel-item ${isActive}">${rowHTML}</div>`;
            }

            carouselInner.innerHTML = compiledHTML;

            // --- Smart Pagination Logic for Testimonials ---
            const testCarousel = document.getElementById('testimonialsCarousel');
            const btnPrev = document.getElementById('test-btn-prev');
            const btnNext = document.getElementById('test-btn-next');

            if (testCarousel && btnPrev && btnNext) {
                // Check initial state (in case there's only 1 page of testimonials)
                const totalSlides = testCarousel.querySelectorAll('.carousel-item').length;
                if (totalSlides <= 1) btnNext.disabled = true;

                // Listen for slide transitions
                testCarousel.addEventListener('slid.bs.carousel', function (e) {
                    btnPrev.disabled = e.to === 0; // Disable if on the first slide
                    btnNext.disabled = e.to === totalSlides - 1; // Disable if on the last slide
                });
            }
        } catch (networkError) {
            console.error('Failed to load testimonials:', networkError);
        }
    }

    // Initialize all fetching functions
    loadServices();
    loadFeaturedProjects();
    loadDualTabRecognitions();
    loadTestimonials();
});