/* -----
Fetch and render the Tech Stack grid dynamically.
Handles anchor tag grid structures rather than slider cards.
----- */
async function loadAndRenderTechStack(jsonFilePath, targetContainerId) {
    const targetContainer = document.getElementById(targetContainerId);

    // Guard clause: Prevent execution if container is missing
    if (!targetContainer) return;

    try {
        const fetchResponse = await fetch(jsonFilePath);
        const techStackDataList = await fetchResponse.json();

        let compiledCardsHTML = '';

        // Iterate through each tech item and build the anchor tag structure
        techStackDataList.forEach(techItem => {
            compiledCardsHTML += `
                <a href="${techItem.techLinkUrl}" class="stack-card text-decoration-none" target="_blank">
                    <i class="bi ${techItem.iconClass}"></i>
                    <h4>${techItem.techTitle}</h4>
                    <p>${techItem.techDescription}</p>
                </a>
            `;
        });

        // Inject the compiled HTML into the DOM
        targetContainer.innerHTML = compiledCardsHTML;

    } catch (networkError) {
        console.error(`Failed to load data from ${jsonFilePath}:`, networkError);
        targetContainer.innerHTML = '<p class="text-white p-3">Unable to load tech stack at this time.</p>';
    }
}

/* -----
Fetch and render project sliders dynamically.
Uses a centralized reusable function to avoid duplicated code blocks for multiple sliders.
----- */

async function loadAndRenderProjects(jsonFilePath, targetContainerId) {
    const targetContainer = document.getElementById(targetContainerId);

    // Guard clause: Prevent execution if container is missing on the current page
    if (!targetContainer) return;

    try {
        const fetchResponse = await fetch(jsonFilePath);
        const projectDataList = await fetchResponse.json();

        let compiledCardsHTML = '';

        // Iterate through each project and build the HTML structure
        projectDataList.forEach(projectItem => {
            const thumbnailHTML = projectItem.isLiveAvailable 
                ? `<div class="project-thumb live-embed"><iframe src="${projectItem.previewIframeUrl}" loading="lazy"></iframe><div class="embed-overlay"></div></div>`
                : `<div class="project-thumb"></div>`;

            const buttonHTML = projectItem.isLiveAvailable 
                ? `<a href="${projectItem.projectLinkUrl}" class="btn-view">Launch</a>` 
                : `<button onclick="alert('Still under development')" class="btn-view">Coming Soon</button>`;

            compiledCardsHTML += `
                <div class="project-card">
                    ${thumbnailHTML}
                    <div class="project-content">
                        <h3>${projectItem.projectTitle}</h3>
                        <p>${projectItem.projectDescription}</p>
                        ${buttonHTML}
                    </div>
                </div>
            `;
        });

        // Inject the compiled HTML into the DOM
        targetContainer.innerHTML = compiledCardsHTML;

    } catch (networkError) {
        console.error(`Failed to load project data from ${jsonFilePath}:`, networkError);
        targetContainer.innerHTML = '<div class="card-style p-4 text-center w-100"><p class="text-white mb-0">Unable to load projects at this time.</p></div>';
    }
}

// Initialize rendering when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderProjects('json/webProjects.json', 'web-projects-track');
    loadAndRenderProjects('json/adetProjects.json', 'adet-projects-track');
    loadAndRenderTechStack('json/techStack.json', 'tech-stack-container');
});