/* -----
Contact Form Handler (Simulation)
Validates user input and simulates an asynchronous email dispatch with visual UI feedback.
----- */
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default page reload on submission

        // Validate form inputs using native browser/Bootstrap checking
        if (!contactForm.checkValidity()) {
            event.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Trigger UI loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        // Simulate a network request delay (2000ms)
        setTimeout(() => {
            formFeedback.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-check-circle-fill me-2"></i> Message sent successfully! I'll get back to you soon.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>`;

            // Reset form state and restore the original submit button
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }, 2000);
    });
});