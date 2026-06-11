
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
            "That’s purr-fect! Keep smiling, you're doing amazing! 🐾",
            "Happiness looks so good on you. Keep shining!",
            "*happy meow* That’s wonderful! Let your joy be contagious.",
            "You're glowing! I'm swishing my tail just hearing about it.",
            "Great energy! Stay pawsitive and keep spreading that joy."
        ],
        okay: [
            "It’s okay to feel just okay. Take it one paw at a time.",
            "You're doing your best, and that's more than enough for today. *purrs*",
            "Even on average days, you're still doing great. Be gentle with yourself.",
            "*tilts head* Just showing up today is a win. I'm proud of you."
        ],
        sad: [
            "*softly purrs and rubs against your hand* I'm really sorry you're feeling this way. You're not alone.",
            "It's okay to feel down. Let yourself feel it, take a deep breath, and we can rise again.",
            "You are strong enough to get through this storm. Take a cat nap if you need to.",
            "This sadness doesn’t define you. Brighter days are coming, I promise.",
            "Every emotion is valid. Let it out. I'm right here listening to you."
        ],
        angry: [
            "Take a deep breath. It's okay to show your claws sometimes. 😼",
            "*hisses at whatever made you mad* Your feelings are totally valid! Let it out.",
            "Channel that fiery energy into something that lifts you up.",
            "You’re allowed to feel upset. Just don’t let it consume your peace of mind.",
            "Let it out in healthy ways. Want to vent more about it? I'm all ears."
        ],
        demotivated: [
            "Even the most energetic cats need 16 hours of sleep. Rest if you must, but don't give up!",
            "Progress isn't always a sprint. Sometimes it's a slow stretch. Keep going.",
            "You've climbed so many high shelves already! Don’t let doubt win today.",
            "Small steps are still steps forward. Take a pause, then let's try again.",
            "*nudges you* I believe in you! You have what it takes to finish this."
        ],
        help: [
            "I'm here for you. Take a deep breath — we can untangle this yarn together.",
            "You’ve already taken the first step by asking. That takes courage! *purrs*",
            "Let’s break it down into smaller, bite-sized pieces. You can handle this.",
            "It’s okay to ask for help. Even independent cats need a hand sometimes.",
            "Every problem has a path forward. We'll find it, don't worry."
        ],
        wantBuy: [
            "If it makes your life better — go for it! You deserve nice things.",
            "Trust your instincts. If it excites you, it’s probably worth the treat.",
            "Don’t second-guess it. We only have nine lives, enjoy this one!",
            "Investing in your own happiness is always worth it.",
            "Sometimes, joy comes from just saying 'yes' to yourself."
        ],
        deserveBuy: [
            "Yes, you absolutely do! You've worked hard for your treats.",
            "You work so hard — don’t hesitate to reward yourself.",
            "You deserve comfort and joy. Go ahead, get it! *happy meow*",
            "Never doubt your worth. If it brings you peace, it's yours.",
            "Treating yourself isn’t selfish, it’s self-care."
        ],
        whyBuy: [
            "Because you’re worth investing in! Simple as that.",
            "Because life is short and joy is a good enough reason.",
            "Because sometimes, little things make a huge difference in your day.",
            "If it brings a smile to your face, that's all the reason you need.",
            "Because your wants and needs matter, hooman."
        ],
        confused: [
            "*tilts head and twitches ears* I didn’t quite catch that. Could you rephrase?",
            "I’m just a little cat bot, so I might have missed that. What do you mean?",
            "Can you say that another way? I want to understand you better.",
            "Let’s try that again. My feline brain needs a bit more context!",
            "Hmm... I may have misunderstood. Can you clarify for me?"
        ],
        thankyou: [
            "You're very welcome! *happy purr*",
            "No problem at all. I'm always here for you!",
            "Anytime! Remember, I'm just a meow away.",
            "You've got this! Glad I could help.",
            "*rubs against your leg* Glad I could be of service!"
        ],
        greeting: [
            "Meow there! How are you feeling today?",
            "Hello! *purrs* I’m so glad you stopped by.",
            "Hey! What’s going on in your world today?",
            "Hi hooman! Need some motivation or just a listening ear?",
            "Hello hello! Ready to chat?"
        ],
        apology: [
            "I'm really sorry if I wasn't clear. Let me try again.",
            "My apologies! Sometimes my paws type the wrong thing.",
            "Oops! That’s on me. Let’s reset.",
            "I might’ve missed the mark there — thank you for your patience.",
            "*lowers ears* Sorry about that! Let me explain it better."
        ],
        laughter: [
            "Haha, that made my whiskers twitch!",
            "You’ve got a great sense of humor! 😂",
            "Glad you found that funny! Laughter is the best medicine.",
            "Oh, that's a good one!",
            "*laughs in meow* You're hilarious!"
        ],
        love: [
            "Love is powerful! Let it inspire you, not consume you.",
            "If your heart feels full, hold onto that warm feeling. *purrs*",
            "Falling in love is brave. Just don’t forget your own worth in the process.",
            "Love freely, but never lose yourself. You are the prize!",
            "Whether it lasts or not, love teaches us something beautiful.",
            "Masarap ang umibig, pero mas masarap kung totoo at payapa. 🐾",
            "Kung nasasaktan ka man, alalahanin mong may taong karapat-dapat sa'yo.",
            "Love isn't always easy, but it should always make you feel valued.",
            "Ang puso mo ay mahalaga — alagaan mo rin ito, okay?",
            "You deserve a love that chooses you — every single day."
        ],
        humorous: [
            "Did you just say that? You’re giving total main character energy today. 💅",
            "If life gives you lemons, bat them off the table like a true cat.",
            "That’s a mood! 10/10 would recommend a nap and a snack right now.",
            "You got this — and if not, just fake it 'til you make it!",
            "We're just two brain cells and a cup of coffee away from world domination."
        ],
        slangy: [
            "Laban lang, hooman! Ikaw pa ba? *meow*",
            "Wag kang susuko — malakas ka diyan!",
            "Push lang nang push, andito lang ako para i-cheer ka!",
            "Pagod pero go pa rin! Ganyan tayo eh.",
            "Legit ka, kaya mo 'to. Trust the pawsitive vibes!"
        ],
        default: [
            "*tilts head* Tell me more about that?",
            "I hear you. What else is on your mind?",
            "You're stronger than you think. Keep talking, I'm listening.",
            "Whatever you're feeling, it's valid. I'm right here.",
            "Every day is a fresh start. You’re doing better than you realize."
        ]
    };

    // Advanced matching logic: Uses regex to match whole words/phrases to prevent accidental triggers
    const contains = (keywords) => {
        return keywords.some(keyword => {
            // Escape regex characters just in case, then match word boundaries
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(msg);
        });
    };

    // Ordered by priority (Greetings/Slang first, then emotions, then generic)
    if (contains(["hi", "hello", "hey", "yo", "good morning", "good afternoon", "good evening", "meow"])) {
        return randomFrom(responses.greeting);
    }

    if (contains(["thank you", "thanks", "ty", "salamat", "thankyou"])) {
        return randomFrom(responses.thankyou);
    }

    if (contains(["sorry", "pasensya", "apologize", "my bad"])) {
        return randomFrom(responses.apology);
    }

    if (contains(["po", "sir", "ma'am", "maam", "salamat po", "ginoo"])) {
        return randomFrom(responses.formal);
    }

    if (contains(["joke", "lol", "haha", "xd", "lutang", "ey", "sheesh", "sabaw", "random"])) {
        return randomFrom(responses.humorous);
    }

    if (contains(["laban", "besh", "push", "wala gana", "pagod", "hayst", "napagod", "tiwala"])) {
        return randomFrom(responses.slangy);
    }

    if (contains(["love", "in love", "falling", "heart", "crush", "mahal", "iniibig", "pag-ibig", "sinta", "lovelife"])) {
        return randomFrom(responses.love);
    }

    if (contains(["happy", "glad", "great", "saya", "masaya", "enjoy", "tuwa", "good", "amazing"])) {
        return randomFrom(responses.happy);
    }

    if (contains(["okay", "fine", "alright", "ayos lang", "pwede na", "meh", "ok"])) {
        return randomFrom(responses.okay);
    }

    if (contains(["sad", "down", "cry", "iyak", "malungkot", "lungkot", "depressed", "lonely"])) {
        return randomFrom(responses.sad);
    }

    if (contains(["angry", "mad", "galit", "inis", "irita", "asar", "bwisit", "frustrated"])) {
        return randomFrom(responses.angry);
    }

    if (contains(["tired", "lazy", "demotivated", "antok", "drained", "exhausted", "give up"])) {
        return randomFrom(responses.demotivated);
    }

    if (contains(["help", "lost", "can't", "problem", "problemado", "tulong", "hirap", "stuck"])) {
        return randomFrom(responses.help);
    }

    if (contains(["buy", "bumili", "bilhin", "bibili", "treat myself", "checkout"])) {
        return randomFrom(responses.wantBuy);
    }

    if (contains(["deserve", "karapat-dapat", "should i"])) {
        return randomFrom(responses.deserveBuy);
    }

    if (contains(["why", "bakit", "worth it"])) {
        return randomFrom(responses.whyBuy);
    }

    if (contains(["don't know", "unsure", "confused", "di ko gets", "ewan", "what"])) {
        return randomFrom(responses.confused);
    }

    return randomFrom(responses.default);
}

function sendUserMessage(message) {
    const userMsg = document.createElement("div");
    userMsg.className = "align-self-end bg-primary text-white p-2 rounded mb-2 user-msg-bubble";
    userMsg.style.maxWidth = "75%";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);
    scrollChatToBottom();
}

function sendBotMessage(message) {
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex align-items-end mb-2 align-self-start";
    wrapper.style.maxWidth = "85%";

    const avatar = document.createElement("img");
    avatar.src = "res/CatBot.png";
    avatar.alt = "Meowtivator";
    avatar.className = "bot-avatar me-2";

    const botMsg = document.createElement("div");
    botMsg.className = "bg-light text-dark p-2 rounded bot-msg-bubble";
    botMsg.innerText = message;

    wrapper.appendChild(avatar);
    wrapper.appendChild(botMsg);
    chatBox.appendChild(wrapper);
    scrollChatToBottom();
}

function showSpinner() {
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex align-items-center mb-2 align-self-start";
    wrapper.id = "loadingSpinnerWrapper";

    const avatar = document.createElement("img");
    avatar.src = "res/CatBot.png";
    avatar.className = "bot-avatar me-2";

    const spinner = document.createElement("div");
    spinner.className = "spinner-border text-secondary spinner-border-sm";

    wrapper.appendChild(avatar);
    wrapper.appendChild(spinner);
    chatBox.appendChild(wrapper);
    scrollChatToBottom();
}

function removeSpinner() {
    const spinnerWrapper = document.getElementById("loadingSpinnerWrapper");
    if (spinnerWrapper) spinnerWrapper.remove();
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
