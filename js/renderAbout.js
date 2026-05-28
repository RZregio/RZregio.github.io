/* -----
Fetch and render the Fun Facts grid dynamically.
Extracts hardcoded content into a configurable JSON structure.
----- */
async function loadFunFacts() {
    const funFactsContainer = document.getElementById('fun-facts-container');
    if (!funFactsContainer) return;

    try {
        const fetchResponse = await fetch('json/funFacts.json');
        const funFactsDataList = await fetchResponse.json();
        let compiledFactsHTML = '';

        funFactsDataList.forEach(factItem => {
            compiledFactsHTML += `
                <div class="col">
                    <div class="card-style p-3 h-100 text-center">
                        <div class="fact-icon mb-2"><i class="bi ${factItem.iconClass}"></i></div>
                        <p class="fredoka mb-1">${factItem.factTitle}</p>
                        <p class="tiny-text opacity-75">${factItem.factDescription}</p>
                    </div>
                </div>
            `;
        });
        funFactsContainer.innerHTML = compiledFactsHTML;
    } catch (networkError) {
        console.error('Failed to load fun facts data:', networkError);
        funFactsContainer.innerHTML = '<p class="text-white text-center w-100">Unable to load fun facts at this time.</p>';
    }
}

/* -----
Reusable function to fetch and render slider items (Awards, Certifications)
Prevents code duplication for similar UI components.
----- */
async function loadAndRenderSliderItems(jsonFilePath, targetContainerId) {
    const targetContainer = document.getElementById(targetContainerId);
    if (!targetContainer) return;

    try {
        const fetchResponse = await fetch(jsonFilePath);
        const sliderDataList = await fetchResponse.json();
        let compiledCardsHTML = '';

        sliderDataList.forEach(itemData => {
            compiledCardsHTML += `
                <div class="slider-card card-style p-3">
                    <div class="d-flex align-items-center gap-3">
                        <i class="bi ${itemData.iconClass} text-accent fs-4"></i>
                        <div>
                            <p class="fredoka mb-0 small">${itemData.awardTitle}</p>
                            <p class="tiny-text opacity-75 mb-0">${itemData.awardContext}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        targetContainer.innerHTML = compiledCardsHTML;
    } catch (networkError) {
        console.error(`Failed to load data from ${jsonFilePath}:`, networkError);
        targetContainer.innerHTML = '<p class="text-white p-3">Unable to load content at this time.</p>';
    }
}

// Initialize all fetch requests when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadFunFacts();
    loadAndRenderSliderItems('json/affiliationsAwards.json', 'aff-slider');
    loadAndRenderSliderItems('json/certificationsWorkshops.json', 'cert-slider');      
});