
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function scrollChatToBottom() {
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    const responses = {
        happy: [
            "I'm so glad to hear that! Keep smiling, you're doing amazing!",
            "Happiness looks good on you. Keep shining!",
            "That’s wonderful! Let your joy be contagious."
        ],
        okay: [
            "It’s okay to feel just okay. Brighter days are on the way!",
            "You're doing your best and that's more than enough.",
            "Even on average days, you're still worthy and valuable."
        ],
        help: [
            "I'm here for you. Take a deep breath, and let’s take it one step at a time.",
            "You’re not alone. Every challenge has a solution — we’ll figure it out.",
            "It’s brave to ask for help. You’re already on the right path."
        ],
        undecided: [
            "It’s okay to not have it all figured out yet.",
            "Take your time. Clarity comes with patience.",
            "Listen to your heart — sometimes, silence leads to answers."
        ],
        default: [
            "You're stronger than you think. One step at a time.",
            "Whatever you're feeling, it's valid. I'm here with you.",
            "You matter. You’re doing better than you realize."
        ]
    };

    if (msg.includes("happy") || msg.includes("glad") || msg.includes("great")) {
        return randomFrom(responses.happy);
    } else if (msg.includes("okay") || msg.includes("fine") || msg.includes("alright")) {
        return randomFrom(responses.okay);
    } else if (msg.includes("help") || msg.includes("lost") || msg.includes("tired")) {
        return randomFrom(responses.help);
    } else if (msg.includes("don't know") || msg.includes("unsure") || msg.includes("undecided") || msg.includes("confused")) {
        return randomFrom(responses.undecided);
    } else {
        return randomFrom(responses.default);
    }
}

function sendUserMessage(message) {
    const userMsg = document.createElement("div");
    userMsg.className = "align-self-end bg-primary text-white p-2 rounded";
    userMsg.style.maxWidth = "70%";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);
    scrollChatToBottom();
}

function sendBotMessage(message) {
    const botMsg = document.createElement("div");
    botMsg.className = "align-self-start bg-light text-dark p-2 rounded";
    botMsg.style.maxWidth = "70%";
    botMsg.innerText = message;
    chatBox.appendChild(botMsg);
    scrollChatToBottom();
}

function showSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "align-self-start spinner-border text-secondary";
    spinner.id = "loadingSpinner";
    chatBox.appendChild(spinner);
    scrollChatToBottom();
}

function removeSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.remove();
}

function handleChat() {
    const message = userInput.value.trim();
    if (message === "") return;

    sendUserMessage(message);
    userInput.value = "";

    showSpinner();

    setTimeout(() => {
        removeSpinner();
        const response = getBotResponse(message);
        sendBotMessage(response);
    }, 1000);
}

sendBtn.addEventListener("click", handleChat);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleChat();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    sendBotMessage("Hello there! I'm Meowtivator. How are you feeling today?");
});
