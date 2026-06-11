document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 1) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(err => {
                document.getElementById('result').innerHTML = `
                    <div class="text-center py-5 fade-in-up">
                        <i class="bi bi-emoji-frown display-1 text-secondary mb-3 d-block"></i>
                        <h4 class="text-white opacity-75">No results found for "${query}"</h4>
                    </div>`;
            });
    } else {
        document.getElementById('result').innerHTML = ''; // Clear if input is empty
    }
});

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!data || data.length === 0) return;

    // 1. Gather all unique parts of speech across ALL entries and ALL meanings
    const allPartsOfSpeech = new Set();
    data.forEach(entry => {
        if (entry.meanings) {
            entry.meanings.forEach(meaning => {
                allPartsOfSpeech.add(meaning.partOfSpeech);
            });
        }
    });

    // 2. Generate HTML for the badges (wrapped nicely)
    const badgesHtml = Array.from(allPartsOfSpeech).map(pos =>
        `<span class="badge border border-warning text-warning fs-6 px-3 py-2 mt-2 me-2 rounded-pill text-uppercase">${pos}</span>`
    ).join('');

    // 3. Find the best phonetic text and audio across all entries
    let bestText = '';
    let bestAudio = '';

    for (const entry of data) {
        if (entry.phonetics) {
            for (const p of entry.phonetics) {
                if (!bestText && p.text) bestText = p.text;
                if (!bestAudio && p.audio) bestAudio = p.audio;
            }
        }
    }

    let audioHtml = '';
    if (bestAudio) {
        audioHtml = `<audio controls class="mt-3 w-100"><source src="${bestAudio}" type="audio/mpeg"></audio>`;
    }

    // 4. Render exactly ONE comprehensive master card
    const word = data[0].word; // Grab the primary word spelling

    resultDiv.innerHTML = `
        <div class="modern-card p-4 p-md-5 mb-4 fade-in-up">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-start border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                <div class="mb-3 mb-md-0">
                    <h2 class="fredoka accent-text mb-1 display-5 text-capitalize">${word}</h2>
                    <span class="text-light opacity-75 fs-5">${bestText}</span>
                </div>
                
                <div class="d-flex flex-wrap justify-content-md-end">
                    ${badgesHtml}
                </div>
            </div>
            
            <div class="mb-4">
                ${audioHtml}
            </div>
            
            <a href="view.html?word=${word}" class="btn btn-custom w-100 w-md-auto d-inline-flex align-items-center justify-content-center gap-2">
                View Full Details <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    `;
}

// =========================================
// Light / Dark Mode Toggle
// =========================================
let colorMode = "dark";

function changeColorMode() {
    const body = document.getElementById("body");
    const btnColor = document.getElementById("btnColor");

    if (!body || !btnColor) return;

    if (colorMode === "light") {
        body.setAttribute("data-bs-theme", "dark");
        btnColor.innerHTML = '<i class="bi bi-sun-fill me-2"></i>Light Mode';
        colorMode = "dark";
    } else {
        body.setAttribute("data-bs-theme", "light");
        btnColor.innerHTML = '<i class="bi bi-moon-fill me-2"></i>Dark Mode';
        colorMode = "light";
    }
}