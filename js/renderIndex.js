/* -----
Index Page Dynamic Renderer
Fetches and injects Services and Featured Projects.
Links the project carousel state to the dynamic description container.
----- */
document.addEventListener('DOMContentLoaded', () => {

    async function loadServices() {
        const timelineContainer = document.getElementById('services-timeline-container');
        const detailsPane = document.getElementById('service-details-pane');
        if (!timelineContainer || !detailsPane) return;

        try {
            const fetchResponse = await fetch('json/services.json');
            const servicesDataList = await fetchResponse.json();
            const totalServiceCount = servicesDataList.length;

            // Render Timeline UI
            timelineContainer.innerHTML = servicesDataList.map((service, index) => `
                <div class="timeline-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <h6 class="fredoka mb-0">${service.serviceTitle}</h6>
                </div>
            `).join('');

            // Function to update the Left Pane
            function updateServiceDetails(index) {
                const service = servicesDataList[index];
                const expText = service.experienceText || service.experienceLevel || "";
                const expBadgeHTML = expText ? `<span class="badge bg-dark border border-secondary text-warning small ms-3" style="font-size: 0.8rem;"><i class="bi bi-clock-history me-1"></i>${expText}</span>` : '';

                detailsPane.innerHTML = `
                    <i class="bi ${service.iconClass} fs-1 text-accent mb-3 d-block"></i>
                    <div class="d-flex align-items-center mb-3">
                        <h3 class="fredoka mb-0">${service.serviceTitle}</h3>
                        ${expBadgeHTML}
                    </div>
                    <p class="opacity-75 mb-4">${service.serviceDescription}</p>
                    <h6 class="fredoka small text-accent">Notable Experience:</h6>
                    <p class="small opacity-75 mb-0" style="text-align: justify;">${service.notableExperience}</p>
                `;
            }

            // Set Default
            if (totalServiceCount > 0) updateServiceDetails(0);

            // Inject mobile dots scaled precisely to the data length
            if (!document.getElementById('service-mobile-dots')) {
                const $serviceDotsHTML = servicesDataList.map((_, idx) => `<div class="dot ${idx === 0 ? 'active' : ''}"></div>`).join('');

                timelineContainer.insertAdjacentHTML('afterend', `
                    <div id="service-mobile-dots" class="mobile-scroll-dots d-mobile-flex mt-3">
                        ${$serviceDotsHTML}
                    </div>
                `);
            }

            // Click Event Delegation
            timelineContainer.onclick = (e) => {
                const clickedItem = e.target.closest('.timeline-item');
                if (!clickedItem) return;

                timelineContainer.querySelectorAll('.timeline-item').forEach(n => n.classList.remove('active'));
                clickedItem.classList.add('active');

                const index = parseInt(clickedItem.getAttribute('data-index'));
                updateServiceDetails(index);

                // --- NEW LOGIC: Center clicked item on mobile ---
                if (window.innerWidth <= 991) {
                    const containerRect = timelineContainer.getBoundingClientRect();
                    const itemRect = clickedItem.getBoundingClientRect();
                    const offset = itemRect.left - containerRect.left - (containerRect.width / 2) + (itemRect.width / 2);
                    timelineContainer.scrollBy({ left: offset, behavior: 'smooth' });
                }

                // Sync clicked item to dots
                const mobileDots = document.getElementById('service-mobile-dots');
                if (mobileDots) {
                    const dots = mobileDots.querySelectorAll('.dot');
                    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
                }
            };

            // ADD SCROLL LISTENER 
            const mobileDotsContainer = document.getElementById('service-mobile-dots');
            timelineContainer.addEventListener('scroll', () => {
                window.updateScrollDots(timelineContainer, mobileDotsContainer, totalServiceCount);
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

            let compiledIndicatorsHTML = '<div class="carousel-indicators">';

            // 1. Build the Carousel Images & Indicators
            featuredProjectsList.forEach((projectItem, index) => {
                const isActiveClass = index === 0 ? 'active' : '';

                // Add the dynamic dot indicator
                compiledIndicatorsHTML += `<button type="button" data-bs-target="#featuredProjectsCarousel" data-bs-slide-to="${index}" class="${isActiveClass}" aria-label="Slide ${index + 1}"></button>`;

                const hasPreview = projectItem.previewImageUrl && projectItem.previewImageUrl !== "";
                let innerContent = "";

                if (hasPreview) {
                    const imageString = encodeURIComponent(JSON.stringify([projectItem.previewImageUrl]));
                    innerContent = `
                        <img src="${projectItem.previewImageUrl}" 
                             class="d-block w-100 rounded bg-dark featured-proj-img" 
                             alt="${projectItem.projectTitle}" 
                             data-bs-toggle="modal" 
                             data-bs-target="#imageViewerModal" 
                             onclick="if(window.openImageViewer) window.openImageViewer('${imageString}')" 
                             loading="lazy">
                    `;
                } else {
                    innerContent = `
                        <div class="image-unavailable-placeholder w-100 d-flex flex-column justify-content-center align-items-center rounded featured-proj-img" style="border: 1px dashed rgba(255,255,255,0.15); background: rgba(255,255,255,0.03);">
                            <i class="bi bi-image mb-2" style="font-size: 2rem; opacity: 0.5;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Not Available</span>
                        </div>
                    `;
                }

                compiledCarouselHTML += `
                    <div class="carousel-item ${isActiveClass}">
                        ${innerContent}
                    </div>
                `;
            });

            compiledIndicatorsHTML += '</div>';
            carouselInnerContainer.innerHTML = compiledCarouselHTML;

            const carouselWrapper = document.getElementById('featuredProjectsCarousel');
            if (carouselWrapper) {
                // Inject indicators
                carouselWrapper.insertAdjacentHTML('afterbegin', compiledIndicatorsHTML);

                // IMPORTANT: Tell Bootstrap to re-initialize or update the indicators
                const carouselInstance = new bootstrap.Carousel(carouselWrapper);
            }

            // 2. Helper function to update the text details
            function updateProjectDetails(projectIndex) {
                const activeProject = featuredProjectsList[projectIndex];

                const techStackBadges = activeProject.techStack.map(tech =>
                    `<span class="badge bg-secondary me-1 mb-1">${tech}</span>`
                ).join('');

                let actionButton = '<div class="d-flex flex-wrap gap-2 mt-3">';

                if (activeProject.projectLinkUrl && activeProject.projectLinkUrl !== "") {
                    actionButton += `<a href="${activeProject.projectLinkUrl}" target="_blank" class="btn btn-sm btn-outline-warning rounded-pill px-3 py-2 interactive-card"><i class="bi bi-box-arrow-up-right me-2"></i>Live Preview</a>`;
                }
                if (activeProject.sourceCode && activeProject.sourceCode !== "") {
                    actionButton += `<a href="${activeProject.sourceCode}" target="_blank" class="btn btn-sm btn-outline-light rounded-pill px-3 py-2 interactive-card"><i class="bi bi-github me-2"></i>Source</a>`;
                }

                const images = activeProject.mediaSource || [activeProject.previewImageUrl];
                if (images && images.length > 0 && images[0] !== "") {
                    const arrayData = encodeURIComponent(JSON.stringify(images));
                    actionButton += `<button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 interactive-card" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')"><i class="bi bi-images me-2"></i>View Images (${images.length})</button>`;
                }
                actionButton += '</div>';

                // NEW: Date Formatter Helper
                const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';

                // NEW: Generate Date HTML safely
                const dateHtml = (activeProject.createdDate || activeProject.updatedDate) ? `
                    <div class="opacity-50 mb-3 d-flex align-items-center gap-3" style="font-size: 0.8rem;">
                        <span><i class="bi bi-calendar3 me-1"></i> Created: ${formatDate(activeProject.createdDate)}</span>
                        <span><i class="bi bi-clock-history me-1"></i> Updated: ${formatDate(activeProject.updatedDate)}</span>
                    </div>
                ` : '';

                // Inject into the layout
                projectDetailsContainer.innerHTML = `
                    <div class="text-start d-flex flex-column h-100 justify-content-center w-100">
                        <span class="text-accent fw-bold text-uppercase small mb-1 d-block">${activeProject.projectCategory} Project</span>
                        <h3 class="fredoka mb-1">${activeProject.projectTitle}</h3>
                        
                        ${dateHtml} <p class="opacity-75 flex-grow-1" style="font-size: 0.95rem; text-align: justify;">${activeProject.projectContext}</p>
                        <div class="mt-2 mb-4">
                            <h6 class="fredoka small">Tech Stack:</h6>
                            <div class="d-flex flex-wrap gap-1 justify-content-start">
                                ${techStackBadges}
                            </div>
                        </div>
                        ${actionButton}
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

    /* ----- Render Interactive Dual Tabs (Filtered Certificates) ----- */
    async function loadDualTabRecognitions() {
        const certButtonsContainer = document.getElementById('certificate-buttons-container');
        const awardButtonsContainer = document.getElementById('award-buttons-container');
        const certDetailsCard = document.getElementById('cert-details-card');
        const awardDetailsCard = document.getElementById('award-details-card');

        // ... highlightActiveButton function remains the same ...
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
                    btn.style.color = "rgba(255,255,255,0.3)";
                    if (icon) { icon.classList.remove('bi-check-circle-fill', 'text-white'); icon.classList.add('bi-chevron-right', 'opacity-50'); }
                    if (mainIcon) { mainIcon.classList.remove('text-white'); mainIcon.classList.add('text-accent'); }
                }
            });
        };

        try {
            const response = await fetch('json/recognitions.json');
            const allRecognitions = await response.json();

            // Simply filter by category and grab the first 6 items for the Index preview
            const certsList = allRecognitions.filter(item => item.category === 'certificate').slice(0, 6);
            const awardsList = allRecognitions.filter(item => item.category === 'award').slice(0, 6);

            // --- Certificates Logic ---
            let activeCertIndex = 0;
            if (certButtonsContainer) {
                certButtonsContainer.innerHTML = certsList.map((cert, index) => `
                <button class="btn btn-custom awardCertButton w-100 mb-3 text-start d-flex align-items-center justify-content-between interactive-card" 
                        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;" 
                        data-cert-index="${index}">
                    <span class="text-truncate me-2"><i class="bi ${cert.iconClass} text-accent me-2"></i> ${cert.title}</span>
                    <i class="bi bi-chevron-right opacity-50 indicator-icon flex-shrink-0"></i>
                </button>
                `).join('');

                // Inject mobile dots scaled precisely to the data length
                if (!document.getElementById('cert-mobile-dots')) {
                    const $certDotsHTML = certsList.map((_, idx) => `<div class="dot ${idx === 0 ? 'active' : ''}"></div>`).join('');
                    certButtonsContainer.insertAdjacentHTML('afterend', `
                        <div id="cert-mobile-dots" class="mobile-scroll-dots d-mobile-flex mt-3 mb-4">
                            ${$certDotsHTML}
                        </div>
                    `);
                }

                // ... updateCertDisplay function remains the same ...
                const updateCertDisplay = (index) => {
                    const certData = certsList[index];
                    if (!certData) return;

                    const images = certData.images || (certData.imageUrl ? [certData.imageUrl] : []);
                    const hasImages = images.length > 0 && images[0] !== "";

                    let imageHTML = "";

                    if (hasImages) {
                        const primaryImg = images[0];
                        const imgCountHTML = images.length > 1 ? `<span class="badge bg-dark position-absolute bottom-0 end-0 m-2">+${images.length - 1} Images</span>` : '';
                        const arrayData = encodeURIComponent(JSON.stringify(images));

                        imageHTML = `
                        <div class="position-relative d-inline-block w-100 mb-4 text-center">
                            <img src="${primaryImg}" class="img-fluid rounded interactive-card w-100" style="max-height: 220px; object-fit: contain; background: rgba(0,0,0,0.2); padding: 10px; cursor: zoom-in;" alt="${certData.title}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')" loading="lazy">
                            ${imgCountHTML}
                        </div>`;
                    } else {
                        // Secure Placeholder for missing images
                        imageHTML = `
                        <div class="image-unavailable-placeholder w-100 mb-4 rounded d-flex flex-column justify-content-center align-items-center" style="height: 220px; border: 1px dashed rgba(255,255,255,0.15); background: rgba(255,255,255,0.03);">
                            <i class="bi bi-image mb-2" style="font-size: 2rem; opacity: 0.5;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Not Available</span>
                        </div>`;
                    }

                    certDetailsCard.innerHTML = `
                    ${imageHTML}
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
                    btn.addEventListener('mouseenter', (e) => {
                        if (window.innerWidth > 991) updateCertDisplay(e.currentTarget.getAttribute('data-cert-index'));
                    });
                    btn.addEventListener('mouseleave', () => {
                        if (window.innerWidth > 991) updateCertDisplay(activeCertIndex);
                    });
                    btn.addEventListener('click', (e) => {
                        activeCertIndex = e.currentTarget.getAttribute('data-cert-index');
                        updateCertDisplay(activeCertIndex);
                        highlightActiveButton(certButtonsContainer, activeCertIndex);

                        // --- NEW LOGIC: Center clicked item on mobile ---
                        if (window.innerWidth <= 991) {
                            const containerRect = certButtonsContainer.getBoundingClientRect();
                            const itemRect = e.currentTarget.getBoundingClientRect();
                            const offset = itemRect.left - containerRect.left - (containerRect.width / 2) + (itemRect.width / 2);
                            certButtonsContainer.scrollBy({ left: offset, behavior: 'smooth' });
                        }

                        // Sync clicked item to dots
                        const mobileDots = document.getElementById('cert-mobile-dots');
                        if (mobileDots) {
                            const dots = mobileDots.querySelectorAll('.dot');
                            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === parseInt(activeCertIndex)));
                        }
                    });
                });

                // ADD SCROLL LISTENER 
                const mobileDotsContainer = document.getElementById('cert-mobile-dots');
                certButtonsContainer.addEventListener('scroll', () => {
                    window.updateScrollDots(certButtonsContainer, mobileDotsContainer, certsList.length);
                });
            }

            // --- Awards Logic ---
            let activeAwardIndex = 0;
            if (awardButtonsContainer) {
                awardButtonsContainer.innerHTML = awardsList.map((award, index) => `
                <button class="btn btn-custom awardCertButton w-100 mb-3 text-start d-flex align-items-center justify-content-between interactive-card" 
                        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: 0.3s;" 
                        data-award-index="${index}">
                    <span class="text-truncate me-2"><i class="bi ${award.iconClass} text-accent me-2"></i> ${award.title}</span>
                    <i class="bi bi-chevron-right opacity-50 indicator-icon flex-shrink-0"></i>
                </button>
                `).join('');

                // Inject mobile dots scaled precisely to the data length
                if (!document.getElementById('award-mobile-dots')) {
                    const $awardDotsHTML = awardsList.map((_, idx) => `<div class="dot ${idx === 0 ? 'active' : ''}"></div>`).join('');
                    awardButtonsContainer.insertAdjacentHTML('afterend', `
                        <div id="award-mobile-dots" class="mobile-scroll-dots d-mobile-flex mt-3 mb-4">
                            ${$awardDotsHTML}
                        </div>
                    `);
                }


                // ... updateAwardDisplay function remains the same ...
                const updateAwardDisplay = (index) => {
                    const awardData = awardsList[index];
                    if (!awardData) return;

                    const images = awardData.images || (awardData.imageUrl ? [awardData.imageUrl] : []);
                    const hasImages = images.length > 0 && images[0] !== "";

                    let imageHTML = "";

                    if (hasImages) {
                        const primaryImg = images[0];
                        const imgCountHTML = images.length > 1 ? `<span class="badge bg-dark position-absolute bottom-0 end-0 m-2">+${images.length - 1} Images</span>` : '';
                        const arrayData = encodeURIComponent(JSON.stringify(images));

                        imageHTML = `
                        <div class="position-relative d-inline-block w-100 mb-4 text-center">
                            <img src="${primaryImg}" class="img-fluid rounded interactive-card w-100" style="max-height: 220px; object-fit: contain; background: rgba(0,0,0,0.2); padding: 10px; cursor: zoom-in;" alt="${awardData.title}" data-bs-toggle="modal" data-bs-target="#imageViewerModal" onclick="if(window.openImageViewer) window.openImageViewer('${arrayData}')" loading="lazy">
                            ${imgCountHTML}
                        </div>`;
                    } else {
                        // Secure Placeholder for missing images
                        imageHTML = `
                        <div class="image-unavailable-placeholder w-100 mb-4 rounded d-flex flex-column justify-content-center align-items-center" style="height: 220px; border: 1px dashed rgba(255,255,255,0.15); background: rgba(255,255,255,0.03);">
                            <i class="bi bi-image mb-2" style="font-size: 2rem; opacity: 0.5;"></i>
                            <span style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">Not Available</span>
                        </div>`;
                    }

                    awardDetailsCard.innerHTML = `
                    ${imageHTML}
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
                    btn.addEventListener('mouseenter', (e) => {
                        if (window.innerWidth > 991) updateAwardDisplay(e.currentTarget.getAttribute('data-award-index'));
                    });
                    btn.addEventListener('mouseleave', () => {
                        if (window.innerWidth > 991) updateAwardDisplay(activeAwardIndex);
                    });
                    btn.addEventListener('click', (e) => {
                        activeAwardIndex = e.currentTarget.getAttribute('data-award-index');
                        updateAwardDisplay(activeAwardIndex);
                        highlightActiveButton(awardButtonsContainer, activeAwardIndex);

                        // --- NEW LOGIC: Center clicked item on mobile ---
                        if (window.innerWidth <= 991) {
                            const containerRect = awardButtonsContainer.getBoundingClientRect();
                            const itemRect = e.currentTarget.getBoundingClientRect();
                            const offset = itemRect.left - containerRect.left - (containerRect.width / 2) + (itemRect.width / 2);
                            awardButtonsContainer.scrollBy({ left: offset, behavior: 'smooth' });
                        }

                        // Sync clicked item to dots
                        const mobileDots = document.getElementById('award-mobile-dots');
                        if (mobileDots) {
                            const dots = mobileDots.querySelectorAll('.dot');
                            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === parseInt(activeAwardIndex)));
                        }
                    });
                });

                // ADD SCROLL LISTENER 
                const mobileDotsContainer = document.getElementById('award-mobile-dots');
                awardButtonsContainer.addEventListener('scroll', () => {
                    window.updateScrollDots(awardButtonsContainer, mobileDotsContainer, awardsList.length);
                });
            }
        } catch (networkError) { console.error('Failed to load recognitions data:', networkError); }
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

                // Add 'd-flex flex-column' to the card-style div
                let rowHTML = '<div class="row">';
                testimonialChunk.forEach(item => {
                    rowHTML += `
                    <div class="col-lg-6 mb-3">
                        <div class="card-style p-4 h-100 d-flex flex-column" style="background: rgba(255,255,255,0.05); border-radius: 10px">
                            <i class="bi bi-quote fs-1 text-accent opacity-50"></i>
                            <p class="fst-italic opacity-75 mb-4">"${item.testimonialMessage}"</p>
                            
                            <div class="d-flex align-items-center mt-auto">
                                <div class="humanIcon bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary" style="width: 50px; height: 50px;">
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