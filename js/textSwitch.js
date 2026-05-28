/* -----
Dynamic Role Text Switcher
Randomly cycles through a list of professional roles with a 3D flip CSS animation.
----- */
const professionalRoles = [
    'Digital Artisan',
    'System Whisperer',
    'Tech Trailblazer',
    'Code Alchemist',
    'Creative Strategist',
    'Solution Seeker',
    'Thought Weaver',
    'Vision Architect',
    'Collaboration Maestro'
];

const dynamicRoleText = document.getElementById('role-text');
const shuffleRoleButton = document.getElementById('shuffle-btn');

shuffleRoleButton.addEventListener('click', () => {
    // Trigger the flip-out CSS animation
    dynamicRoleText.classList.add('role-flipping');

    // Wait for the CSS transition duration before swapping the text
    setTimeout(() => {
        let newlySelectedRole;

        // Ensure the randomly selected role is different from the current one
        do {
            newlySelectedRole = professionalRoles[Math.floor(Math.random() * professionalRoles.length)];
        } while (newlySelectedRole === dynamicRoleText.innerText);

        dynamicRoleText.innerText = newlySelectedRole;

        // Remove the class to trigger the flip-in CSS animation
        dynamicRoleText.classList.remove('role-flipping');
    }, 400);
});