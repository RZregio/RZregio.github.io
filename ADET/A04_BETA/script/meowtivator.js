const chatToggle = document.getElementById('chatToggle');
const iframeWrapper = document.getElementById('meowtivatorIframeWrapper');
const closeChat = document.getElementById('closeChat');

chatToggle.addEventListener('click', () => {
    iframeWrapper.style.display = (iframeWrapper.style.display === 'none' || iframeWrapper.style.display === '')
        ? 'block'
        : 'none';
});

closeChat.addEventListener('click', () => {
    iframeWrapper.style.display = 'none';
});
