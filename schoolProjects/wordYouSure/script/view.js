const urlParams = new URLSearchParams(window.location.search);
const word = urlParams.get('word');

document.addEventListener('DOMContentLoaded', () => {
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => displayWordDetails(data[0]))
            .catch(err => {
                document.getElementById('word-details').innerHTML = `<p class="text-danger text-center fs-4">No details available</p>`;
            });
    }
});

function displayWordDetails(data) {
    const wordDetails = document.getElementById('word-details');
    wordDetails.innerHTML = '';

    // Extract valid phonetics
    const phoneticsHtml = data.phonetics.map(phonetic => {
        if (!phonetic.text && !phonetic.audio) return '';
        return `
            <div class="d-inline-block me-4 mb-3">
                <span class="text-light opacity-75 fs-5 d-block mb-2">${phonetic.text || ''}</span>
                ${phonetic.audio ? `<audio controls class="shadow-sm"><source src="${phonetic.audio}" type="audio/mpeg"></audio>` : ''}
            </div>
        `;
    }).join('');

    // Extract meanings clearly
    const meaningsHtml = data.meanings.map(meaning => {
        const definitionsHtml = meaning.definitions.map(def => `
            <div class="definition-item">
                <p class="mb-1 text-white fs-5"><strong>Definition:</strong> ${def.definition}</p>
                ${def.example ? `<p class="example-text">"${def.example}"</p>` : ''}
                
                <div class="mt-2">
                    ${def.synonyms?.length ? `<p class="mb-1 text-success opacity-75"><i class="bi bi-link-45deg me-1"></i><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</p>` : ''}
                    ${def.antonyms?.length ? `<p class="mb-0 text-danger opacity-75"><i class="bi bi-dash-circle me-1"></i><strong>Antonyms:</strong> ${def.antonyms.join(', ')}</p>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <div class="meaning-block shadow-sm">
                <h4 class="fredoka text-uppercase mb-4 pb-2 border-bottom border-light border-opacity-10">${meaning.partOfSpeech}</h4>
                ${definitionsHtml}
            </div>
        `;
    }).join('');

    // Construct final layout
    wordDetails.innerHTML = `
        <div class="modern-card p-4 p-md-5 mb-5 shadow-lg">
            <h2 class="fredoka accent-text display-3 mb-3">${data.word}</h2>
            <div class="phonetics-container mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                ${phoneticsHtml}
            </div>
            
            <div class="meanings-container mt-4">
                <h4 class="mb-4 text-white opacity-50"><i class="bi bi-book-half me-2"></i> Meanings & Usages</h4>
                ${meaningsHtml}
            </div>
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