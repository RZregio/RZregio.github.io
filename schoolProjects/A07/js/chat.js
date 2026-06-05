
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
            "That’s wonderful! Let your joy be contagious.",
            "You're glowing — keep spreading that joy!",
            "Great energy! Your good vibes are inspiring."
        ],
        okay: [
            "It’s okay to feel just okay. Brighter days are on the way!",
            "You're doing your best and that's more than enough.",
            "Even on average days, you're still worthy and valuable.",
            "Just showing up today is a win. Be gentle with yourself."
        ],
        sad: [
            "I'm really sorry you're feeling this way. You're not alone.",
            "It's okay to feel down — allow yourself to feel, then rise again.",
            "You are strong enough to get through this. One moment at a time.",
            "This sadness doesn’t define you. Brighter days are coming.",
            "Every emotion is valid. Let it out — then heal forward."
        ],
        angry: [
            "Take a deep breath. Your feelings are valid.",
            "It's okay to feel angry — it's part of being human.",
            "Channel that fire into something that lifts you.",
            "You’re allowed to feel upset. Just don’t let it consume you.",
            "Let it out in healthy ways — your peace matters."
        ],
        demotivated: [
            "Every great journey has slow days. Keep going.",
            "Rest if you must, but don’t give up. You’ve got this.",
            "Progress isn't always visible — trust the process.",
            "You've come so far. Don’t let doubt win today.",
            "Small steps are still steps forward."
        ],
        help: [
            "I'm here for you. Take a deep breath — you're not alone.",
            "You’ve already taken the first step by asking. You’re doing great.",
            "Let’s break it down together — you can handle this.",
            "It’s okay to ask for help. That’s strength, not weakness.",
            "Every problem has a path forward. Let’s find it slowly."
        ],
        wantBuy: [
            "If it makes your life better — go for it. You deserve good things.",
            "Trust your instincts. If it excites you, it’s probably worth it.",
            "Don’t second-guess it — treat yourself.",
            "Investing in yourself is always worth it.",
            "Sometimes, joy comes from saying yes to yourself."
        ],
        deserveBuy: [
            "Yes, you do. You've earned it.",
            "You work hard — don’t hesitate to reward yourself.",
            "You deserve comfort, joy, and things that make life easier.",
            "Never doubt your worth — go ahead and enjoy what you love.",
            "Treating yourself isn’t selfish — it’s self-love."
        ],
        whyBuy: [
            "Because you’re worth investing in.",
            "Because joy is a good enough reason.",
            "Because sometimes, little things make a big difference.",
            "If it improves your day, that's more than enough reason.",
            "Because your needs and wants matter."
        ],
        confused: [
            "Hmm... I didn’t quite get that. Could you say it another way?",
            "I’m not sure what you mean, but I’m here to listen.",
            "Can you rephrase that? I want to understand you better.",
            "Let’s try that again together. What’s on your mind?",
            "I may have missed your point — can you clarify?"
        ],

        thankyou: [
            "You're very welcome!",
            "No problem at all. I'm here for you!",
            "Always happy to help!",
            "Anytime. You've got this!",
            "Glad I could be of help!"
        ],

        greeting: [
            "Hi there! How are you feeling today?",
            "Hello! I’m glad you stopped by.",
            "Hey! What’s going on in your world today?",
            "Hi! I’m here if you want to talk.",
            "Hello hello! Ready to chat?"
        ],

        apology: [
            "I'm really sorry if I wasn't clear.",
            "My apologies if that confused you — let's try again.",
            "Sorry about that! Let me explain it better.",
            "I might’ve missed the mark — thank you for your patience.",
            "Oops! That’s on me. Let’s make it right."
        ],

        laughter: [
            "Haha, that gave me a good laugh too!",
            "You’ve got a great sense of humor!",
            "Glad you found that funny!",
            "Laughter really is the best medicine!",
            "That’s a good one!"
        ],

        what: [
            "Sorry if I wasn’t clear — want me to explain it another way?",
            "I didn’t mean to confuse you. Let me try again.",
            "Oh! I may not have explained that well. My bad.",
            "Sorry if that was hard to follow. Let's go over it slowly.",
            "Apologies! Let me clarify things for you."
        ],

        love: [
            "Love is powerful — let it inspire, not consume.",
            "If your heart feels full, hold onto that feeling.",
            "Falling in love is brave — don’t forget your worth in the process.",
            "Love freely, but never lose yourself.",
            "Whether it lasts or not, love teaches us something beautiful.",
            "Masarap ang umibig, pero mas masarap kung totoo at payapa.",
            "Kung nasasaktan ka man, alalahanin mong may taong karapat-dapat sa'yo.",
            "Love isn't always easy, but it should always make you feel valued.",
            "Ang puso mo ay mahalaga — alagaan mo rin ito.",
            "You deserve a love that chooses you — every day, without doubt."
        ],

        formal: [
            "Thank you for sharing. Please let me know how I can support you.",
            "Your message is acknowledged. I'm here to assist if needed.",
            "Feel free to express more — your voice is important.",
            "I appreciate your openness. Let's navigate this together.",
            "If there's anything you wish to clarify, I'm listening attentively."
        ],
        humorous: [
            "Did you just say that? You’re giving main character energy.",
            "If life gives you lemons, trade them for coffee and carry on.",
            "That’s mood! 10/10 would recommend a nap and a snack.",
            "You got this — and if not, fake it 'til you do!",
            "We're just two brain cells and a coffee away from world domination."
        ],
        slangy: [
            "Laban lang, besh. Ikaw pa ba?",
            "Wag kang susuko — malakas ka diyan!",
            "Push lang nang push, walang aatrasan!",
            "Pagod pero go pa rin, kasi ikaw 'yan.",
            "Legit ka, kaya mo 'to. Trust the vibes!"
        ],
        default: [
            "You're stronger than you think. One step at a time.",
            "Whatever you're feeling, it's valid. I'm here with you.",
            "You matter. You’re doing better than you realize.",
            "Keep going. You've already come so far.",
            "Every day is a fresh start — and you’re showing up."
        ]
    };

    const contains = (keywords) => keywords.some(k => msg.includes(k));

    if (contains(["po", "sir", "ma'am", "maam", "salamat po", "nais ko", "ginoo"])) {
        return randomFrom(responses.formal);
    } else if (contains(["joke", "lol", "haha", "xd", "lutang", "ey", "sheesh", "gutom ako", "sabaw", "napaka-random"])) {
        return randomFrom(responses.humorous);
    } else if (contains(["laban", "besh", "push", "wala gana", "pagod na ako", "hayst", "napagod", "tiwala lang"])) {
        return randomFrom(responses.slangy);
    }

    if (contains(["thank you", "thanks", "ty", "salamat"])) {
        return randomFrom(responses.thankyou);
    } else if (contains(["hi", "hello", "hey", "yo", "good morning", "good evening"])) {
        return randomFrom(responses.greeting);
    } else if (contains(["haha", "hahaha", "lmao", "lolz", "hehe", "rofl", "😂"])) {
        return randomFrom(responses.laughter);
    } else if (contains(["what", "ano", "what’s this", "anong meron", "ano to", "ano 'to", "nudaw"])) {
        return randomFrom(responses.what);
    } else if (contains(["sorry", "pasensya", "i apologize", "my bad"])) {
        return randomFrom(responses.apology);
    }


    if (contains(["love", "in love", "falling", "heart", "soulmate", "crush", "mahal", "iniibig", "naiinlove", "umiibig", "pag-ibig", "sinta", "lovelife"])) {
        return randomFrom(responses.love);
    }
    else if (contains(["happy", "glad", "great", "saya", "masaya", "enjoy", "tuwa", "satisfied"])) {
        return randomFrom(responses.happy);
    } else if (contains(["okay", "fine", "alright", "ayos lang", "pwede na", "medyo okay", "meh"])) {
        return randomFrom(responses.okay);
    } else if (contains(["sad", "down", "cry", "iyak", "malungkot", "lungkot", "depressed"])) {
        return randomFrom(responses.sad);
    } else if (contains(["angry", "mad", "galit", "inis", "irita", "asar", "bwisit", "yawa"])) {
        return randomFrom(responses.angry);
    } else if (contains(["tired", "lazy", "demotivated", "pagod", "wala gana", "antok", "drained"])) {
        return randomFrom(responses.demotivated);
    } else if (contains(["help", "lost", "can't", "problem", "problemado", "tulong", "di ko alam", "hirap", "need help"])) {
        return randomFrom(responses.help);
    } else if (contains(["buy new", "gusto bumili", "bilhin", "bibili ako", "want to buy", "bumili"])) {
        return randomFrom(responses.wantBuy);
    } else if (contains(["deserve bumili", "karapat-dapat", "dapat ko bang bilhin", "deserve ko ba bumili", "should i buy"])) {
        return randomFrom(responses.deserveBuy);
    } else if (contains(["why buy", "bakit bibilhin", "bakit ko bibilhin", "worth it ba"])) {
        return randomFrom(responses.whyBuy);
    } else if (contains(["don't know", "unsure", "confused", "di ko gets", "ano to", "?", "ewan"])) {
        return randomFrom(responses.confused);
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
