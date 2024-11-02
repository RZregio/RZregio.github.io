document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 1) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(err => document.getElementById('result').innerHTML = `<p class="text-danger" style="font-size: 20px;">No results found</p>`);
    }
});

function displayResults(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    data.forEach(entry => {
        const phonetics = entry.phonetics.map(phonetic => `
            <div class="phonetic">
                <span>${phonetic.text || ''}</span>
                ${phonetic.audio ? `<audio controls><source src="${phonetic.audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>` : ''}
            </div>
        `).join('');

        const partOfSpeech = entry.meanings[0].partOfSpeech;

        resultDiv.innerHTML += `
            <div class="card word-card">
                <div class="card-body">
                    <h3 class="word-title">${entry.word}</h3>
                    ${phonetics}
                    <h5>Part of Speech: ${partOfSpeech}</h5>
                    <a href="view.html?word=${entry.word}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
    });
}
