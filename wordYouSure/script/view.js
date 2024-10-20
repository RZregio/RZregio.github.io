const urlParams = new URLSearchParams(window.location.search);
const word = urlParams.get('word');

document.addEventListener('DOMContentLoaded', () => {
    if (word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => displayWordDetails(data[0]))
            .catch(err => document.getElementById('word-details').innerHTML = `<p class="text-danger">No details available</p>`);
    }
});

function displayWordDetails(data) {
    const wordDetails = document.getElementById('word-details');
    wordDetails.innerHTML = '';

    const phonetics = data.phonetics.map(phonetic => `
        <div class="phonetic">
            <span>${phonetic.text || ''}</span>
            ${phonetic.audio ? `<audio controls><source src="${phonetic.audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>` : ''}
        </div>
    `).join('');

    const meanings = data.meanings.map(meaning => {
        const definitions = meaning.definitions.map(def => `
            <div class="definition bg-body-tertiary">
                <p><strong>Definition:</strong> ${def.definition}</p>
                ${def.example ? `<p class="example">"${def.example}"</p>` : ''}
                ${def.synonyms && def.synonyms.length > 0 ? `<p class="synonyms"><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</p>` : ''}
                ${def.antonyms && def.antonyms.length > 0 ? `<p class="antonyms"><strong>Antonyms:</strong> ${def.antonyms.join(', ')}</p>` : ''}
            </div>
        `).join('');

        return `
            <div class="meaning bg-body-tertiary">
                <h5>${meaning.partOfSpeech}</h5>
                ${definitions}
            </div>
        `;
    }).join('');

    wordDetails.innerHTML = `
        <h3>${data.word}</h3>
        ${phonetics}
        ${meanings}
    `;
}
