/* -----
Testimonial Form Handler (Smart Web3Forms Integration)
Validates input, tracks monthly submission timestamps per email via LocalStorage, 
and handles Web3Forms global quota limits.
----- */
document.addEventListener('DOMContentLoaded', function () {
    const testimonialForm = document.getElementById('testimonialSubmitForm');
    const formFeedback = document.getElementById('testimonial-form-feedback');
    const emailInput = document.querySelector('input[name="email"]');

    // Modal DOM Elements
    const testimonialInputModalEl = document.getElementById('submitTestimonialModal');
    const testimonialInputModal = bootstrap.Modal.getInstance(testimonialInputModalEl) || new bootstrap.Modal(testimonialInputModalEl);

    const limitModalElement = document.getElementById('limitModal');
    const submissionLimitModal = new bootstrap.Modal(limitModalElement);
    const limitModalTitleText = document.getElementById('limitModalTitleText');
    const limitMessageBody = document.getElementById('limitMessageBody');

    const successModalElement = document.getElementById('successModal');
    const messageSuccessModal = new bootstrap.Modal(successModalElement);

    // Configuration
    const WEB3FORMS_ACCESS_KEY = "80c86908-8074-419d-bdef-c96958404f22";
    const MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER = 2;

    function displayLimitModal(title, message) {
        // Hide the input modal first so they don't stack awkwardly
        testimonialInputModal.hide();
        setTimeout(() => {
            limitModalTitleText.innerText = title;
            limitMessageBody.innerHTML = message;
            submissionLimitModal.show();
        }, 400); // Wait for transition
    }

    if (!testimonialForm) return;

    testimonialForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // --- NEW: Strict Email Format Validation ---
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            testimonialInputModal.hide();
            const invalidEmailModalEl = document.getElementById('invalidEmailModal');
            const invalidEmailModal = new bootstrap.Modal(invalidEmailModalEl);
            setTimeout(() => invalidEmailModal.show(), 400);
            return; // Stops the submission process immediately
        }

        if (!testimonialForm.checkValidity()) {
            event.stopPropagation();
            testimonialForm.classList.add('was-validated');
            return;
        }

        const senderEmailAddress = emailInput.value.trim().toLowerCase();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Retrieve and parse existing submission history
        let storedSubmissionHistory = JSON.parse(localStorage.getItem('testimonialSubmissionTimestamps')) || {};
        let userTimestamps = storedSubmissionHistory[senderEmailAddress] || [];

        // Filter timestamps for current month
        let currentMonthTimestamps = userTimestamps.filter(timestampString => {
            const pastDate = new Date(timestampString);
            return pastDate.getMonth() === currentMonth && pastDate.getFullYear() === currentYear;
        });

        // Block if limit reached
        if (currentMonthTimestamps.length >= MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER) {
            displayLimitModal(
                "Monthly Limit Reached",
                `The email <strong>${senderEmailAddress}</strong> has already submitted ${MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER} testimonials this month.<br><br>Please wait until next month to submit another one.`
            );
            return;
        }

        const submitButton = testimonialForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        const formDataPayload = new FormData(testimonialForm);
        formDataPayload.append("access_key", WEB3FORMS_ACCESS_KEY);
        formDataPayload.append("subject", "New Testimonial Submission for Portfolio!");

        try {
            const networkResponse = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formDataPayload
            });

            const parsedData = await networkResponse.json();

            if (networkResponse.ok && parsedData.success) {
                // Update Storage
                currentMonthTimestamps.push(currentDate.toISOString());
                storedSubmissionHistory[senderEmailAddress] = currentMonthTimestamps;
                localStorage.setItem('testimonialSubmissionTimestamps', JSON.stringify(storedSubmissionHistory));

                formFeedback.innerHTML = '';
                testimonialForm.reset();
                testimonialForm.classList.remove('was-validated');

                // Swap Modals
                testimonialInputModal.hide();
                setTimeout(() => messageSuccessModal.show(), 400);

            } else {
                if (parsedData.message.toLowerCase().includes("limit") || parsedData.message.toLowerCase().includes("quota")) {
                    displayLimitModal(
                        "System Quota Reached",
                        "My portfolio's monthly form limit has been reached.<br><br>Please try again next month!"
                    );
                } else {
                    formFeedback.innerHTML = `
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i> Error: ${parsedData.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>`;
                }
            }
        } catch (networkError) {
            formFeedback.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="bi bi-x-circle-fill me-2"></i> Network error. Please try again later.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>`;
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});