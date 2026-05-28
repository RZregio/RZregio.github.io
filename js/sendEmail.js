/* -----
Contact Form Handler (Smart Web3Forms Integration)
Validates input, tracks monthly submission timestamps per email via LocalStorage, 
and handles Web3Forms global quota limits.
----- */
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('form-feedback');
    const emailInput = document.getElementById('senderEmail');

    // Modal DOM Elements
    const limitModalElement = document.getElementById('limitModal');
    const submissionLimitModal = new bootstrap.Modal(limitModalElement);
    const limitModalTitleText = document.getElementById('limitModalTitleText');
    const limitMessageBody = document.getElementById('limitMessageBody');

    // Success Modal Element
    const successModalElement = document.getElementById('successModal');
    const messageSuccessModal = new bootstrap.Modal(successModalElement);

    // Configuration
    const WEB3FORMS_ACCESS_KEY = "80c86908-8074-419d-bdef-c96958404f22";
    const MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER = 2; // Updated to 2

    /* -----
    Helper Function: Trigger Modal with Dynamic Content
    ----- */
    function displayLimitModal(title, message) {
        limitModalTitleText.innerText = title;
        limitMessageBody.innerHTML = message;
        submissionLimitModal.show();
    }

    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Native Bootstrap validation
        if (!contactForm.checkValidity()) {
            event.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const senderEmailAddress = emailInput.value.trim().toLowerCase();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Retrieve and parse existing submission history from browser storage
        let storedSubmissionHistory = JSON.parse(localStorage.getItem('formSubmissionTimestamps')) || {};
        let userTimestamps = storedSubmissionHistory[senderEmailAddress] || [];

        // Filter timestamps to only keep submissions from the current month and year
        let currentMonthTimestamps = userTimestamps.filter(timestampString => {
            const pastDate = new Date(timestampString);
            return pastDate.getMonth() === currentMonth && pastDate.getFullYear() === currentYear;
        });

        // Block submission if the user exceeded their personal monthly limit
        if (currentMonthTimestamps.length >= MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER) {
            displayLimitModal(
                "Monthly Limit Reached",
                `The email <strong>${senderEmailAddress}</strong> has already sent ${MAXIMUM_MONTHLY_SUBMISSIONS_PER_USER} messages this month.<br><br>To prevent spam, please wait until next month to send another message.`
            );
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Trigger UI loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        // Compile payload
        const formDataPayload = new FormData(contactForm);
        formDataPayload.append("access_key", WEB3FORMS_ACCESS_KEY);

        try {
            const networkResponse = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formDataPayload
            });

            const parsedData = await networkResponse.json();

            if (networkResponse.ok && parsedData.success) {
                // Add new timestamp, update storage, and save
                currentMonthTimestamps.push(currentDate.toISOString());
                storedSubmissionHistory[senderEmailAddress] = currentMonthTimestamps;
                localStorage.setItem('formSubmissionTimestamps', JSON.stringify(storedSubmissionHistory));

                // Clear previous alerts and show success modal
                formFeedback.innerHTML = '';
                messageSuccessModal.show();

                contactForm.reset();
                contactForm.classList.remove('was-validated');

            } else {
                // Detect Web3Forms Global Quota Limit or generic errors
                if (parsedData.message.toLowerCase().includes("limit") || parsedData.message.toLowerCase().includes("quota")) {
                    displayLimitModal(
                        "System Quota Reached",
                        "My portfolio's monthly messaging limit (250 emails) has been reached.<br><br>Please try again next month, or reach out to me directly via LinkedIn or Facebook!"
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
                    <i class="bi bi-x-circle-fill me-2"></i> Something went wrong. Please check your network connection and try again.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>`;
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});