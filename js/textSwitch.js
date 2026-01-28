
const roles = ['Digital Artisan', 'System Whisperer', 'Tech Trailblazer', 'Code Alchemist', 'Creative Strategist', 'Solution Seeker', 'Thought Weaver', 'Vision Architect', 'Collaboration Maestro'];
const roleText = document.getElementById('role-text');
const shuffleBtn = document.getElementById('shuffle-btn');

shuffleBtn.addEventListener('click', () => {
    roleText.classList.add('role-flipping');

    setTimeout(() => {
        let newRole;
        do {
            newRole = roles[Math.floor(Math.random() * roles.length)];
        } while (newRole === roleText.innerText);

        roleText.innerText = newRole;

        roleText.classList.remove('role-flipping');
    }, 400);
});
