/* -----
Fetch and render web projects dynamically.
Separates UI from data to ensure scalable and clean maintainability.
----- */
document.addEventListener('DOMContentLoaded', async function() {
    // Target the specific track where projects will be injected
    const webProjectsContainer = document.getElementById('web-projects-track');

    // Prevent errors if script runs on a page without this container
    if (!webProjectsContainer) return; 

    try {
        const fetchResponse = await fetch('json/webProjects.json');
        const projectDataList = await fetchResponse.json();

        let compiledCardsHTML = '';

        // Iterate through each project and build the HTML structure
        projectDataList.forEach(projectItem => {
            const thumbnailHTML = projectItem.isLiveAvailable 
                ? `<div class="project-thumb live-embed"><iframe src="${projectItem.previewIframeUrl}" loading="lazy"></iframe><div class="embed-overlay"></div></div>`
                : `<div class="project-thumb"></div>`;

            const buttonHTML = projectItem.isLiveAvailable 
                ? `<a href="${projectItem.projectLinkUrl}" class="btn-view">View Project</a>` 
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
        webProjectsContainer.innerHTML = compiledCardsHTML;

    } catch (networkError) {
        console.error('Failed to load project data:', networkError);
        webProjectsContainer.innerHTML = '<p class="text-white">Unable to load projects at this time.</p>';
    }
});