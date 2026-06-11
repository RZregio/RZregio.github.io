// Handles copying text to clipboard for contact info
function copyToClipboard(btn) {
    // Find the text target relative to the clicked button
    const targetElement = btn.parentElement.querySelector('.copy-target');
    if (!targetElement) return;

    const textToCopy = targetElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback: Change icon to checkmark temporarily
        const icon = btn.querySelector('i');
        const originalClass = icon.className;

        icon.className = 'bi bi-check-lg';
        btn.classList.add('copied');

        setTimeout(() => {
            icon.className = originalClass;
            btn.classList.remove('copied');
        }, 2000); // Revert after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}