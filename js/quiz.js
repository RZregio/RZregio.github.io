/* ============================================================
   KNOWLEDGE TEST QUIZ ENGINE (RZ Regio Portfolio)
   ============================================================ */

// Question Bank (Questions: Mix of MCQ and Fill-in-the-blanks)
const questionBank = [
    { type: "mcq", q: "What is Roland's primary professional title?", options: ["Data Scientist", "Full Stack Developer", "Network Engineer", "UI/UX Designer"], a: 1 },
    { type: "mcq", q: "What is one of my favorite hobbies?", options: ["Playing Chess", "Solving Rubik's Cube", "Reading Books", "Playing Guitar"], a: 1 },
    { type: "mcq", q: "Where do I go to college?", options: ["Batangas State University", "Polytechnic University of the Philippines", "University of Santo Tomas", "De La Salle University"], a: 1 },
    { type: "mcq", q: "What is the name of our group in the mini hackathon that gained 3rd place?", options: ["Tech Titans", "Byzness Minds", "Code Crafters", "InnovateX"], a: 1 },
    { type: "fill", q: "What is the title of my Capstone project?", a: "Landas" },
    { type: "mcq", q: "What is the title of my parallax project poem?", options: ["The Ocean and the Sky", "The Alps and the Seeker", "Echoes of the Mountain", "Wanderlust"], a: 1 },
    { type: "mcq", q: "What programming language was primarily used in Landas?", options: ["Java", "Python", "C#", "C++"], a: 2 },
    { type: "fill", q: "What is the name of the LMS portal that I built in Arktech Philippines?", a: "Arkteach" },
    { type: "fill", q: "What is my working email address?", a: "regioroland011@gmail.com" },
    { type: "fill", q: "Fill in the blank: 'Pause for Clarity. Build with _______'", a: "Purpose" },
    { type: "mcq", q: "What CSS framework is primarily used throughout this portfolio?", options: ["Tailwind CSS", "Bootstrap 5", "Bulma", "Materialize"], a: 1 },
    { type: "mcq", q: "What is the name of Roland's cat-care e-commerce frontend project?", options: ["PurrFect", "MeowMart", "CatEnFur", "FelineFinds"], a: 2 },
    { type: "fill", q: "What is the primary accent color (name) used in this portfolio's dark mode?", a: "Yellow" },
    { type: "mcq", q: "Which of these is NOT a role Roland specializes in?", options: ["QA", "Project Management", "Full Stack Development", "Game Engine Physics"], a: 3 },
    { type: "mcq", q: "What is the maximum number of featured recognitions shown on the index page?", options: ["4", "6", "8", "10"], a: 1 },
    { type: "fill", q: "Fill in the blank: The name of the floating accessibility menu mascot is ____tivator.", a: "Meow" },
    { type: "mcq", q: "What database language does Roland frequently use alongside PHP?", options: ["MongoDB", "NoSQL", "SQL", "Firebase"], a: 2 },
    { type: "fill", q: "Complete the slogan for the City of Santo Tomas: 'A city where heritage meets _________'", a: "progress" },
    { type: "mcq", q: "What happens when you hover over the main interactive cards in the portfolio?", options: ["They fade out", "They rotate 2 degrees and glow", "They turn black and white", "They shrink"], a: 1 },
    { type: "mcq", q: "Which of the following is an actual theme available in the accessibility menu?", options: ["Midnight Green", "Cyberpunk Red", "Solar Flare", "Arctic White"], a: 0 },
    { type: "mcq", q: "Which font family is primarily used for the bold headings in this portfolio?", options: ["Roboto", "Inter", "Fredoka One", "Montserrat"], a: 2 },
    { type: "mcq", q: "What icon is used for the default interactive mouse cursor?", options: ["A magnifying glass", "A yellow hand", "A blue arrow", "A white crosshair"], a: 1 },
    { type: "mcq", q: "What type of layout do the 'Tech Stack' tabs convert to on mobile devices?", options: ["A dropdown menu", "An accordion", "A horizontal swipeable row", "A vertical list"], a: 2 },
    { type: "mcq", q: "When an image array only contains one image, what happens to the global image viewer modal?", options: ["It loops the image", "It hides the prev/next arrows", "It crashes", "It shows a placeholder"], a: 1 },
    { type: "mcq", q: "Which of these technologies is NOT listed in the frontend tech stack requirements?", options: ["HTML5", "CSS3", "React", "Vanilla JS"], a: 2 },
    { type: "mcq", q: "In the CatEnFur app, what color is used for the primary accent buttons?", options: ["Neon Pink", "Caramel/Orange", "Ocean Blue", "Success Green"], a: 1 },
    { type: "mcq", q: "How many times can a user submit a testimonial per month?", options: ["1", "2", "5", "Unlimited"], a: 1 },
];

// State Variables
let playerName = "";
let selectedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizModals = {};

document.addEventListener("DOMContentLoaded", () => {
    quizModals.intro = new bootstrap.Modal(document.getElementById('quizIntroModal'));
    quizModals.main = new bootstrap.Modal(document.getElementById('quizMainModal'));
    quizModals.result = new bootstrap.Modal(document.getElementById('quizResultModal'));
    quizModals.quit = new bootstrap.Modal(document.getElementById('quizQuitModal'));
    quizModals.review = new bootstrap.Modal(document.getElementById('quizReviewModal'));

    window.addEventListener('beforeunload', (e) => {
        if (document.getElementById('quizMainModal').classList.contains('show')) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});

// --- Utility: Shuffle Array ---
function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// --- Quiz Flow Functions ---
function startQuiz() {
    const nameInput = document.getElementById('quizPlayerName').value.trim();
    if (nameInput === "") {
        document.getElementById('quizNameError').style.display = 'block';
        return;
    }
    document.getElementById('quizNameError').style.display = 'none';
    playerName = nameInput;

    // Select 10 random questions
    selectedQuestions = shuffleArray(questionBank).slice(0, 10);
    userAnswers = new Array(10).fill(null);
    currentQuestionIndex = 0;

    quizModals.intro.hide();

    // Slight delay to allow intro modal to fade out
    setTimeout(() => {
        renderQuestion();
        quizModals.main.show();
    }, 400);
}

function renderQuestion() {
    const q = selectedQuestions[currentQuestionIndex];
    document.getElementById('quizProgressBadge').innerText = `Question ${currentQuestionIndex + 1} / 10`;
    document.getElementById('quizQuestionText').innerText = q.q;

    const optionsContainer = document.getElementById('quizOptionsContainer');
    optionsContainer.innerHTML = '';

    if (q.type === "mcq") {
        q.options.forEach((opt, idx) => {
            const isSelected = userAnswers[currentQuestionIndex] === idx ? 'btn-warning text-dark border-warning' : 'btn-outline-light border-secondary';
            const btn = document.createElement('button');
            btn.className = `btn w-100 text-start py-3 px-4 interactive-card mb-2 ${isSelected}`;
            btn.innerHTML = `<span class="fw-bold me-3">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
            btn.onclick = () => selectAnswer(idx);
            optionsContainer.appendChild(btn);
        });
    } else if (q.type === "fill") {
        const val = userAnswers[currentQuestionIndex] || "";
        optionsContainer.innerHTML = `
            <input type="text" id="fillInAnswer" class="form-control custom-input py-3 fs-5 text-center mt-3" 
                   placeholder="Type your answer here..." value="${val}" autocomplete="off" oninput="saveFillAnswer()">
        `;
        setTimeout(() => document.getElementById('fillInAnswer').focus(), 100);
    }

    updateNavigationButtons();
}

function selectAnswer(idx) {
    userAnswers[currentQuestionIndex] = idx;
    renderQuestion(); // Re-render to show selection
}

function saveFillAnswer() {
    userAnswers[currentQuestionIndex] = document.getElementById('fillInAnswer').value.trim();
    updateNavigationButtons(); // Check dynamically without re-rendering everything
}

function updateNavigationButtons() {
    const hasAnswer = userAnswers[currentQuestionIndex] !== null && userAnswers[currentQuestionIndex] !== "";
    const btnNext = document.getElementById('btnNextQuestion');
    const btnSubmit = document.getElementById('btnSubmitQuiz');

    document.getElementById('btnPrevQuestion').disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === 9) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-block'; // Changed to inline-block
        btnSubmit.disabled = !hasAnswer;
    } else {
        btnNext.style.display = 'inline-block';   // Changed to inline-block
        btnSubmit.style.display = 'none';
        btnNext.disabled = !hasAnswer;
    }
}

function navigateQuiz(direction) {
    // If navigating away from a fill-in-the-blank, save it first
    if (selectedQuestions[currentQuestionIndex].type === "fill") {
        saveFillAnswer();
    }

    currentQuestionIndex += direction;
    renderQuestion();
}

function confirmQuitQuiz() {
    quizModals.quit.show(); // Trigger custom modal instead of browser confirm
}

function executeQuit() {
    quizModals.intro.hide();
    quizModals.quit.hide();
    quizModals.main.hide();
    resetQuiz();
}

function submitQuiz() {
    // Save last answer if it's a fill-in
    if (selectedQuestions[currentQuestionIndex].type === "fill") {
        saveFillAnswer();
    }

    // Ensure all questions are answered
    if (userAnswers.includes(null) || userAnswers.includes("")) {
        if (!confirm("You have unanswered questions. Are you sure you want to submit?")) {
            return;
        }
    }

    quizModals.main.hide();

    // Calculate Score
    let score = 0;
    selectedQuestions.forEach((q, idx) => {
        const userAns = userAnswers[idx];
        if (q.type === "mcq") {
            if (userAns === q.a) score++;
        } else if (q.type === "fill") {
            if (userAns) {
                const normalizedAns = userAns.toLowerCase();
                const normalizedCorrect = q.a.toLowerCase();
                // Check if user answer includes the target word or vice versa
                if (normalizedAns === normalizedCorrect || normalizedAns.includes(normalizedCorrect) ||
                    (normalizedCorrect === "yellow" && normalizedAns === "gold")) {
                    score++;
                }
            }
        }
    });

    // Render Results
    document.getElementById('quizFinalScore').innerText = score;
    const iconContainer = document.getElementById('quizResultIcon');
    const title = document.getElementById('quizResultTitle');
    const msg = document.getElementById('quizResultMessage');
    const certBtn = document.getElementById('certificateContainer');

    if (score >= 7) {
        iconContainer.innerHTML = '<i class="bi bi-trophy-fill text-warning mb-3 d-block" style="font-size: 4rem; filter: drop-shadow(0 0 15px rgba(212, 140, 28, 0.6));"></i>';
        title.innerText = "Congratulations!";
        msg.innerText = `You passed the test with flying colors, ${playerName}! You've earned your Certificate of Appreciation.`;
        certBtn.style.display = 'block';
    } else {
        iconContainer.innerHTML = '<i class="bi bi-emoji-frown text-secondary mb-3 d-block" style="font-size: 4rem;"></i>';
        title.innerText = "Almost There!";
        msg.innerText = `Good effort, ${playerName}, but you need at least 7/10 to earn the certificate. Review my portfolio and try again!`;
        certBtn.style.display = 'none';
    }

    setTimeout(() => {
        quizModals.result.show();
    }, 400);
}

function reviewAnswers() {
    quizModals.result.hide();
    const reviewContainer = document.getElementById('quizReviewContainer');
    let html = '';

    selectedQuestions.forEach((q, idx) => {
        const userAns = userAnswers[idx];
        let isCorrect = false;
        let userText = '';
        let correctText = '';

        if (q.type === 'mcq') {
            isCorrect = userAns === q.a;
            userText = q.options[userAns] || "No Answer";
            correctText = q.options[q.a];
        } else if (q.type === 'fill') {
            const normalizedAns = (userAns || "").toLowerCase();
            const normalizedCorrect = q.a.toLowerCase();
            isCorrect = normalizedAns === normalizedCorrect || normalizedAns.includes(normalizedCorrect) ||
                (normalizedCorrect === "yellow" && normalizedAns === "gold");
            userText = userAns || "No Answer";
            correctText = q.a;
        }

        const badge = isCorrect ? `<span class="badge bg-success float-end">Correct</span>` : `<span class="badge bg-danger float-end">Incorrect</span>`;

        html += `
            <div class="p-3 mb-3 text-start rounded" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
                <h6 class="fredoka mb-3" style="line-height: 1.4;">${idx + 1}. ${q.q} ${badge}</h6>
                <p class="small mb-1 opacity-75">Your Answer: <strong class="${isCorrect ? 'text-success' : 'text-danger'}">${userText}</strong></p>
                ${!isCorrect ? `<p class="small mb-0 opacity-75">Correct Answer: <strong class="text-success">${correctText}</strong></p>` : ''}
            </div>
        `;
    });

    reviewContainer.innerHTML = html;
    quizModals.review.show();
}

function resetQuiz() {
    quizModals.result.hide();
    document.getElementById('quizPlayerName').value = '';
}

// --- Canvas Certificate Generation ---
function downloadCertificate() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    ctx.fillStyle = '#101A30';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Add subtle watermark/seal
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.translate(600, 450);
    ctx.rotate(-Math.PI / 6); // slight angle
    ctx.font = 'bold 160px "Fredoka One", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('RZ REGIO', 0, 0);
    ctx.restore();

    // 3. Draw Borders
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#D48C1C';
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // 4. Corner Ornaments (White brackets)
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    // Top Left
    ctx.moveTo(40, 120); ctx.lineTo(40, 40); ctx.lineTo(120, 40);
    // Top Right
    ctx.moveTo(1160, 120); ctx.lineTo(1160, 40); ctx.lineTo(1080, 40);
    // Bottom Left
    ctx.moveTo(40, 680); ctx.lineTo(40, 760); ctx.lineTo(120, 760);
    // Bottom Right
    ctx.moveTo(1160, 680); ctx.lineTo(1160, 760); ctx.lineTo(1080, 760);
    ctx.stroke();

    // 5. Typography Settings
    ctx.textAlign = 'center';

    // Header
    ctx.fillStyle = '#D48C1C';
    ctx.font = 'bold 60px "Arial", sans-serif';
    ctx.fillText('CERTIFICATE OF APPRECIATION', canvas.width / 2, 180);

    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px "Arial", sans-serif';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 300);

    // Player Name
    ctx.fillStyle = '#D48C1C';
    ctx.font = 'bold 70px "Arial", sans-serif';
    ctx.fillText(playerName.toUpperCase(), canvas.width / 2, 400);

    // Underline for name
    const metrics = ctx.measureText(playerName.toUpperCase());
    const textWidth = metrics.width;
    ctx.beginPath();
    ctx.moveTo((canvas.width / 2) - (textWidth / 2) - 50, 420);
    ctx.lineTo((canvas.width / 2) + (textWidth / 2) + 50, 420);
    ctx.strokeStyle = '#D48C1C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Arial", sans-serif';
    ctx.fillText('For successfully passing the RZ Regio Portfolio Knowledge Test.', canvas.width / 2, 500);
    ctx.fillText(`Final Score: ${document.getElementById('quizFinalScore').innerText} / 10`, canvas.width / 2, 550);

    // 6. Signatures / Date Area (MOVED HIGHER)
    ctx.font = '20px "Arial", sans-serif';

    // Date
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(today, 300, 670);
    ctx.beginPath();
    ctx.moveTo(200, 690);
    ctx.lineTo(400, 690);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Date Completed', 300, 720);

    // Signature
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 30px "Times New Roman", serif';
    ctx.fillText('Roland Z. Regio', 900, 660);
    ctx.beginPath();
    ctx.moveTo(800, 690);
    ctx.lineTo(1000, 690);
    ctx.strokeStyle = '#D48C1C';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '20px "Arial", sans-serif';
    ctx.fillText('Full Stack Developer', 900, 720);

    // 7. Generate Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `RZ_Regio_Certificate_${playerName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}