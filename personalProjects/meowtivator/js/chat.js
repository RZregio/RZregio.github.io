const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// --- STATE MANAGEMENT ---
let currentMode = "initial"; // Modes: 'initial', 'motivation', 'portfolio'
let lastQuoteCategory = null;
let lastQuoteAuthor = null;

// --- DATABASE: THE CAT's PERSONALITY (MOODS & SLANG) ---
const moodResponses = {
    happy: ["That’s purr-fect! Keep smiling, you're doing amazing! 🐾", "Happiness looks so good on you. Keep shining!", "*happy meow* That’s wonderful! Let your joy be contagious.", "You're glowing! I'm swishing my tail just hearing about it.", "Great energy! Stay pawsitive and keep spreading that joy."],
    okay: ["It’s okay to feel just okay. Take it one paw at a time.", "You're doing your best, and that's more than enough for today. *purrs*", "Even on average days, you're still doing great. Be gentle with yourself.", "*tilts head* Just showing up today is a win. I'm proud of you."],
    sad: ["*softly purrs and rubs against your hand* I'm really sorry you're feeling this way. You're not alone.", "It's okay to feel down. Let yourself feel it, take a deep breath, and we can rise again.", "You are strong enough to get through this storm. Take a cat nap if you need to.", "This sadness doesn’t define you. Brighter days are coming, I promise.", "Every emotion is valid. Let it out. I'm right here listening to you."],
    angry: ["Take a deep breath. It's okay to show your claws sometimes. 😼", "*hisses at whatever made you mad* Your feelings are totally valid! Let it out.", "Channel that fiery energy into something that lifts you up.", "You’re allowed to feel upset. Just don’t let it consume your peace of mind.", "Let it out in healthy ways. Want to vent more about it? I'm all ears."],
    demotivated: ["Even the most energetic cats need 16 hours of sleep. Rest if you must, but don't give up!", "Progress isn't always a sprint. Sometimes it's a slow stretch. Keep going.", "You've climbed so many high shelves already! Don’t let doubt win today.", "Small steps are still steps forward. Take a pause, then let's try again.", "*nudges you* I believe in you! You have what it takes to finish this."],
    help: ["I'm here for you. Take a deep breath — we can untangle this yarn together.", "You’ve already taken the first step by asking. That takes courage! *purrs*", "Let’s break it down into smaller, bite-sized pieces. You can handle this.", "It’s okay to ask for help. Even independent cats need a hand sometimes.", "Every problem has a path forward. We'll find it, don't worry."],
    thankyou: ["You're very welcome! *happy purr*", "No problem at all. I'm always here for you!", "Anytime! Remember, I'm just a meow away.", "You've got this! Glad I could help.", "*rubs against your leg* Glad I could be of service!"],
    greeting: ["Meow there! How are you feeling today?", "Hello! *purrs* I’m so glad you stopped by.", "Hey! What’s going on in your world today?", "Hi hooman! Need some motivation or just a listening ear?", "Hello hello! Ready to chat?"],
    apology: ["I'm really sorry if I wasn't clear. Let me try again.", "My apologies! Sometimes my paws type the wrong thing.", "Oops! That’s on me. Let’s reset.", "I might’ve missed the mark there — thank you for your patience.", "*lowers ears* Sorry about that! Let me explain it better."],
    laughter: ["Haha, that made my whiskers twitch!", "You’ve got a great sense of humor! 😂", "Glad you found that funny! Laughter is the best medicine.", "Oh, that's a good one!", "*laughs in meow* You're hilarious!"],
    love: ["Love is powerful! Let it inspire you, not consume you.", "If your heart feels full, hold onto that warm feeling. *purrs*", "Falling in love is brave. Just don’t forget your own worth in the process.", "Love freely, but never lose yourself. You are the prize!", "Masarap ang umibig, pero mas masarap kung totoo at payapa. 🐾", "Love isn't always easy, but it should always make you feel valued."],
    humorous: ["Did you just say that? You’re giving total main character energy today. 💅", "If life gives you lemons, bat them off the table like a true cat.", "That’s a mood! 10/10 would recommend a nap and a snack right now.", "We're just two brain cells and a cup of coffee away from world domination."],
    slangy: ["Laban lang, hooman! Ikaw pa ba? *meow*", "Wag kang susuko — malakas ka diyan!", "Push lang nang push, andito lang ako para i-cheer ka!", "Pagod pero go pa rin! Ganyan tayo eh.", "Legit ka, kaya mo 'to. Trust the pawsitive vibes!"]
};

// --- DATABASE: MOTIVATION QUOTES ---
const quotesDB = {
    love: [
        { q: "Love is not about possession, it's about appreciation.", a: "Osho", b: "Remember, true love gives freedom and peace, hooman. 🐾" },
        { q: "We are most alive when we're in love.", a: "John Updike", b: "Let that warm feeling inspire your day!" },
        { q: "The best thing to hold onto in life is each other.", a: "Audrey Hepburn", b: "Cherish the people who make you purr with happiness." }
    ],
    success: [
        { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill", b: "Every step you take matters. Don't give up! 🚀" },
        { q: "The secret of getting ahead is getting started.", a: "Mark Twain", b: "Take that first step today. I believe in you!" },
        { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson", b: "Time is on your side if you keep moving forward." }
    ],
    study: [
        { q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela", b: "Your hard work today is building your future. Keep studying!" },
        { q: "The beautiful thing about learning is that no one can take it away from you.", a: "B.B. King", b: "Fill your brain with knowledge! It's the best treat." }
    ],
    life: [
        { q: "Life is what happens when you're busy making other plans.", a: "John Lennon", b: "Don't forget to enjoy the present moment. Take a deep breath." },
        { q: "In three words I can sum up everything I've learned about life: it goes on.", a: "Robert Frost", b: "No matter what happens, tomorrow is a fresh start." }
    ]
};

// --- DATABASE: PORTFOLIO CONCIERGE ---
const portfolioDB = {
    about: "*Purrs* My hooman, Roland, is an IT student at PUP-STC and a passionate Full-Stack Developer! He recently finished his OJT at Arktech Philippines building enterprise systems. 🎓",
    skills: "He's a tech whiz! His main stack includes **HTML5, CSS3, Vanilla JS, PHP, MySQL, and Bootstrap**. He also builds games using **C# and Unity**! *swishes tail* 💻",
    projects: "He has built some amazing things! From an award-winning 2D Android game called **LANDAS**, to an AI e-learning platform called **Arkteach**. Check out the <a target='_parent' href='index.html#projects' class='text-primary fw-bold'>Projects section</a>! 🚀",
    resume: "You can view and download his updated resume directly from the <a target='_parent' href='about.html' class='text-primary fw-bold'>About page</a>! 📄",
    contact: "You can email him at **regioroland011@gmail.com** or use the form on the <a target='_parent' href='contact.html' class='text-primary fw-bold'>Contact page</a>. He's currently open for project-based roles! *happy meow* 🤝",
    achievements: "He recently led his Capstone project to strict ISO/IEC 25010 compliance and won 'Best in Capstone'! 🏆"
};

// --- HELPERS ---
function scrollChatToBottom() {
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const contains = (msg, keywords) => {
    return keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(msg));
};

// --- MOOD FALLBACK CHECKER ---
function getMoodResponse(msg) {
    if (contains(msg, ["hi", "hello", "hey", "yo", "good morning"])) return randomFrom(moodResponses.greeting);
    if (contains(msg, ["thank you", "thanks", "ty", "salamat"])) return randomFrom(moodResponses.thankyou);
    if (contains(msg, ["sorry", "pasensya", "apologize", "my bad"])) return randomFrom(moodResponses.apology);
    if (contains(msg, ["joke", "lol", "haha", "xd", "lutang"])) return randomFrom(moodResponses.humorous);
    if (contains(msg, ["laban", "besh", "push", "wala gana", "pagod"])) return randomFrom(moodResponses.slangy);
    if (contains(msg, ["love", "in love", "falling", "crush", "mahal"])) return randomFrom(moodResponses.love);
    if (contains(msg, ["happy", "glad", "great", "saya", "masaya"])) return randomFrom(moodResponses.happy);
    if (contains(msg, ["okay", "fine", "alright", "ayos lang"])) return randomFrom(moodResponses.okay);
    if (contains(msg, ["sad", "down", "cry", "iyak", "malungkot"])) return randomFrom(moodResponses.sad);
    if (contains(msg, ["angry", "mad", "galit", "inis", "irita"])) return randomFrom(moodResponses.angry);
    if (contains(msg, ["tired", "lazy", "demotivated", "antok"])) return randomFrom(moodResponses.demotivated);
    if (contains(msg, ["help", "lost", "problem", "tulong"])) return randomFrom(moodResponses.help);
    return null;
}

// --- UI GENERATORS ---
function sendUserMessage(message) {
    const userMsg = document.createElement("div");
    userMsg.className = "align-self-end bg-primary text-white p-2 rounded mb-2 user-msg-bubble";
    userMsg.style.maxWidth = "75%";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

    // Remove old option buttons
    const oldOptions = document.querySelectorAll('.chat-options-wrapper');
    oldOptions.forEach(opt => opt.remove());

    scrollChatToBottom();
}

function sendBotMessage(message, options = []) {
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex align-items-end mb-2 align-self-start flex-column";
    wrapper.style.maxWidth = "85%";

    const msgRow = document.createElement("div");
    msgRow.className = "d-flex align-items-end w-100";

    const avatar = document.createElement("img");
    avatar.src = "res/CatBot.png";
    avatar.className = "bot-avatar me-2";
    avatar.alt = "Bot";

    const botMsg = document.createElement("div");
    botMsg.className = "bg-light text-dark p-2 rounded bot-msg-bubble";
    botMsg.innerHTML = message;

    msgRow.appendChild(avatar);
    msgRow.appendChild(botMsg);
    wrapper.appendChild(msgRow);

    if (options.length > 0) {
        const optionsRow = document.createElement("div");
        optionsRow.className = "d-flex flex-wrap gap-2 mt-2 ms-5 chat-options-wrapper";

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm btn-outline-secondary rounded-pill fw-bold";
            btn.style.fontSize = "0.75rem";
            btn.innerText = opt;
            btn.onclick = () => handleUserAction(opt);
            optionsRow.appendChild(btn);
        });
        wrapper.appendChild(optionsRow);
    }

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
    const spinner = document.getElementById("loadingSpinnerWrapper");
    if (spinner) spinner.remove();
}

// --- LOGIC ROUTER ---
function processMessage(rawMsg) {
    const msg = rawMsg.toLowerCase();

    // 1. Global Escape Hatch
    if (contains(msg, ["menu", "go back", "exit", "restart", "start"])) {
        currentMode = "initial";
        return sendBotMessage("Returning to the main menu. How can I help you today?", ["I want to be motivated", "I want to know the person behind this"]);
    }

    // 2. Initial State Routing
    if (currentMode === "initial") {
        // FIX: Added 'motivated', 'person', 'behind' to ensure buttons and typing work perfectly
        if (contains(msg, ["motivate", "motivated", "motivation", "quote", "inspire"])) {
            currentMode = "motivation";
            return sendBotMessage("Motivation mode activated! 🐾 What kind of quotes do you want to hear? (Available: Love, Success, Study, Life)", ["Love", "Success", "Study", "Life", "Go Back"]);
        }
        if (contains(msg, ["know", "person", "behind", "creator", "portfolio", "about", "resume", "skills"])) {
            currentMode = "portfolio";
            return sendBotMessage("Awesome! I am your portfolio concierge. What would you like to know about my hooman, Roland?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        // Check Cat Mood Personality
        let moodReply = getMoodResponse(msg);
        if (moodReply) {
            return sendBotMessage(moodReply + "<br><br>So, how can I help you today?", ["I want to be motivated", "I want to know the person behind this"]);
        }

        return sendBotMessage("I'm not sure I caught that. *tilts head* Please choose one of the options below to get started!", ["I want to be motivated", "I want to know the person behind this"]);
    }

    // 3. Motivation Mode Logic
    if (currentMode === "motivation") {
        const categories = Object.keys(quotesDB);

        if (contains(msg, ["category", "categories", "what do you have", "list"])) {
            return sendBotMessage(`I have quotes about: **${categories.join(", ")}**. Which one would you like?`, categories);
        }

        if (contains(msg, ["who", "author", "said that"])) {
            if (lastQuoteAuthor) return sendBotMessage(`That quote was by **${lastQuoteAuthor}**.`, ["Give me more", "Change Topic"]);
            return sendBotMessage("I haven't given you a quote yet! Pick a category first.", categories);
        }

        if (contains(msg, ["more", "another", "again"]) && lastQuoteCategory) {
            const quoteObj = randomFrom(quotesDB[lastQuoteCategory]);
            lastQuoteAuthor = quoteObj.a;
            return sendBotMessage(`"${quoteObj.q}" <br><br><i>${quoteObj.b}</i>`, ["Who said that?", "Give me more", "Change Topic"]);
        }

        if (contains(msg, ["change", "different"])) {
            return sendBotMessage("Sure thing! Pick a new category:", categories);
        }

        let foundCategory = categories.find(cat => contains(msg, [cat]));
        if (foundCategory) {
            lastQuoteCategory = foundCategory;
            const quoteObj = randomFrom(quotesDB[foundCategory]);
            lastQuoteAuthor = quoteObj.a;
            return sendBotMessage(`"${quoteObj.q}" <br><br><i>${quoteObj.b}</i>`, ["Who said that?", "Give me more", "Change Topic"]);
        }

        // Check Cat Mood Personality
        let moodReply = getMoodResponse(msg);
        if (moodReply) {
            return sendBotMessage(moodReply + "<br><br>Would you like to hear a quote?", ["Love", "Success", "Study", "Life", "Go Back"]);
        }

        return sendBotMessage("I don't have a quote for that specific word yet. *twitches ears* But here are the categories I do have:", ["Love", "Success", "Study", "Life", "Go Back"]);
    }

    // 4. Portfolio Mode Logic
    if (currentMode === "portfolio") {
        let reply = "";

        if (contains(msg, ["about", "who"])) reply = portfolioDB.about;
        else if (contains(msg, ["skill", "stack", "tech", "tools"])) reply = portfolioDB.skills;
        else if (contains(msg, ["project", "projects", "work", "game"])) reply = portfolioDB.projects;
        else if (contains(msg, ["resume", "cv"])) reply = portfolioDB.resume;
        else if (contains(msg, ["contact", "email", "hire"])) reply = portfolioDB.contact;
        else if (contains(msg, ["achievement", "award", "win"])) reply = portfolioDB.achievements;

        if (reply) {
            return sendBotMessage(reply, ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        // Check Cat Mood Personality
        let moodReply = getMoodResponse(msg);
        if (moodReply) {
            return sendBotMessage(moodReply + "<br><br>What else would you like to know about him?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        return sendBotMessage("I can tell you about his Skills, Projects, Resume, or Contact info. *purrs* What are you looking for?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
    }
}

// --- INPUT HANDLING ---
function handleUserAction(text) {
    if (text === "") return;
    sendUserMessage(text);
    userInput.value = "";
    showSpinner();

    setTimeout(() => {
        removeSpinner();
        processMessage(text);
    }, 800);
}

sendBtn.addEventListener("click", () => handleUserAction(userInput.value.trim()));

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleUserAction(userInput.value.trim());
    }
});

// --- INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
    currentMode = "initial";
    setTimeout(() => {
        sendBotMessage("Meow there! 🐾 I am Meowtivator. How can I help you today?", [
            "I want to be motivated",
            "I want to know the person behind this"
        ]);
    }, 500);
});