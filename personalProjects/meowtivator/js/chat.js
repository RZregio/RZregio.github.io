const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// --- STATE MANAGEMENT ---
let currentMode = "initial";
let lastQuoteCategory = null;

// --- DYNAMIC DATA CONTAINERS ---
let moodResponses = {};
let quotesDB = {};
let portfolioDB = {};

// --- FETCH DATA JSON ---
async function loadMeowData() {
    try {
        const response = await fetch('json/meowtivator.json');
        const data = await response.json();

        moodResponses = data.moodResponses;
        quotesDB = data.quotesDB;
        portfolioDB = data.portfolioDB;

        setTimeout(() => {
            sendBotMessage("Meow there! 🐾 I am Meowtivator. How can I help you today?", [
                "I want to be motivated",
                "I want to know the person behind this"
            ]);
        }, 500);

    } catch (error) {
        console.error("Failed to load Meowtivator data:", error);
        sendBotMessage("Oops! My database is taking a cat nap. Please check your connection.");
    }
}

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

// --- SPECIFIC QUOTE SEARCHER (NEW) ---
function findSpecificQuote(msg) {
    let matchedQuotes = [];
    const lowerMsg = msg.toLowerCase().trim();

    if (lowerMsg.length < 4) return null;

    for (const cat in quotesDB) {
        for (const q of quotesDB[cat]) {
            const authorLower = q.a.toLowerCase();
            const quoteTextLower = q.q.toLowerCase();

            // 1. Match by Author Name (Full name or Last name)
            if (authorLower !== "unknown") {
                const cleanLastName = authorLower.split(" ").pop().replace(/[^a-z]/gi, '');
                if (contains(lowerMsg, [authorLower]) || (cleanLastName.length > 3 && contains(lowerMsg, [cleanLastName]))) {
                    matchedQuotes.push({ quote: q, category: cat });
                    continue; // Skip the text check if we already matched the author
                }
            }

            // 2. Match by Quote Substring (e.g. user typed "harm to the vessel")
            // Requires at least 10 characters to prevent accidental single-word triggers
            if (lowerMsg.length >= 10 && quoteTextLower.includes(lowerMsg)) {
                matchedQuotes.push({ quote: q, category: cat });
            }
        }
    }
    if (matchedQuotes.length > 0) return randomFrom(matchedQuotes);
    return null;
}

// --- MOOD & CONTEXT ANALYZER ---
function getMoodData(msg) {
    if (contains(msg, ["angry", "mad", "galit", "inis", "irita", "frustrated", "annoyed"])) return { reply: randomFrom(moodResponses.angry), type: "angry" };
    if (contains(msg, ["sad", "down", "cry", "iyak", "malungkot", "depressed", "lonely"])) return { reply: randomFrom(moodResponses.sad), type: "sad" };
    if (contains(msg, ["tired", "lazy", "demotivated", "antok", "exhausted", "burnout", "give up"])) return { reply: randomFrom(moodResponses.demotivated), type: "demotivated" };
    if (contains(msg, ["help", "lost", "problem", "tulong", "stuck", "confused"])) return { reply: randomFrom(moodResponses.help), type: "help" };
    if (contains(msg, ["love", "in love", "falling", "crush", "mahal", "heart"])) return { reply: randomFrom(moodResponses.love), type: "love" };
    if (contains(msg, ["happy", "glad", "great", "saya", "masaya", "joy", "good"])) return { reply: randomFrom(moodResponses.happy), type: "happy" };
    if (contains(msg, ["joke", "lol", "haha", "xd", "lutang", "funny", "lmao"])) return { reply: randomFrom(moodResponses.humorous), type: "happy" };
    if (contains(msg, ["laban", "besh", "push", "wala gana", "pagod"])) return { reply: randomFrom(moodResponses.slangy), type: "demotivated" };

    if (contains(msg, ["sorry", "pasensya", "apologize", "my bad", "mb"])) return { reply: randomFrom(moodResponses.apology), type: "neutral" };
    if (contains(msg, ["thank you", "thanks", "ty", "salamat", "tysm"])) return { reply: randomFrom(moodResponses.thankyou), type: "neutral" };
    if (contains(msg, ["okay", "fine", "alright", "ayos lang", "sure", "ok"])) return { reply: randomFrom(moodResponses.okay), type: "neutral" };
    if (contains(msg, ["hi", "hello", "hey", "yo", "good morning", "morning", "evening"])) return { reply: randomFrom(moodResponses.greeting), type: "neutral" };

    return null;
}

// --- DYNAMIC MOOD TRANSITION HELPER ---
function handleMoodTransition(moodData) {
    let suggestionText = "";
    let suggestedOptions = [];

    if (moodData.type === "sad") {
        currentMode = "motivation";
        suggestionText = "<br><br>I noticed you're feeling down. Would you like a comforting quote, or do you just need to vent?";
        suggestedOptions = ["Comfort", "I need to vent", "Go Back"];
    } else if (moodData.type === "angry") {
        currentMode = "motivation";
        suggestionText = "<br><br>I sense some frustration. Would you like a quote to help you find peace, or do you need to vent?";
        suggestedOptions = ["Peace", "I need to vent", "Go Back"];
    } else if (moodData.type === "demotivated") {
        currentMode = "motivation";
        suggestionText = "<br><br>Feeling stuck? Would you like a quote about success, or just someone to listen?";
        suggestedOptions = ["Success", "I need to vent", "Go Back"];
    } else if (moodData.type === "help") {
        currentMode = "motivation";
        suggestionText = "<br><br>Need a hand? Would you like a quote about courage, or do you want to talk about it?";
        suggestedOptions = ["Courage", "I need to vent", "Go Back"];
    } else if (moodData.type === "happy") {
        currentMode = "motivation";
        suggestionText = "<br><br>I love that energy! Would you like a quote that matches your joyous vibes?";
        suggestedOptions = ["Joy", "Love", "Go Back"];
    } else if (moodData.type === "love") {
        currentMode = "motivation";
        suggestionText = "<br><br>Would you like a quote about love and appreciation?";
        suggestedOptions = ["Love", "Life", "Go Back"];
    } else {
        suggestionText = currentMode === "portfolio"
            ? "<br><br>What else would you like to know about him?"
            : "<br><br>So, how can I help you today?";
        suggestedOptions = currentMode === "portfolio"
            ? ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]
            : ["I want to be motivated", "I want to know the person behind this"];
    }

    return sendBotMessage(moodData.reply + suggestionText, suggestedOptions);
}

// --- UI GENERATORS ---
function sendUserMessage(message) {
    const userMsg = document.createElement("div");
    userMsg.className = "align-self-end bg-primary text-white p-2 rounded mb-2 user-msg-bubble";
    userMsg.style.maxWidth = "75%";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

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
            btn.className = "btn btn-sm rounded-pill fw-bold chat-chip";
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
    if (contains(msg, ["menu", "go back", "exit", "restart", "start", "home"])) {
        currentMode = "initial";
        return sendBotMessage("Returning to the main menu. How can I help you today?", ["I want to be motivated", "I want to know the person behind this"]);
    }

    // 2. Global Venting Trigger
    if (contains(msg, ["vent", "rant", "listen", "talk"])) {
        currentMode = "venting";
        return sendBotMessage("I'm all ears. *settles down comfortably* Let it all out, hooman. I'm right here without any judgment.", ["I'm feeling better", "Portfolio Menu", "Go Back"]);
    }

    // 3. GLOBAL QUOTE DETECTOR & SEARCHER
    if (currentMode !== "venting") {
        // a. Specific Quote/Author search (from previous update)
        const specificQuote = findSpecificQuote(msg);
        if (specificQuote) {
            currentMode = "motivation";
            lastQuoteCategory = specificQuote.category;
            const quoteObj = specificQuote.quote;
            const responseHtml = `"${quoteObj.q}" <br><br>— <a href="https://www.google.com/search?q=${encodeURIComponent(quoteObj.a)}" target="_blank" class="text-primary fw-bold text-decoration-none">${quoteObj.a}</a><br><br><i>${quoteObj.b}</i>`;
            return sendBotMessage(responseHtml, ["Give me more", "Change Topic"]);
        }

        // b. Direct Ask for Quotes (e.g. "give me a quote", "qoute about love", "inspire me")
        // Catches typos like 'qoute' to prevent accidental portfolio triggers
        if (contains(msg, ["quote", "qoute", "quotes", "qoutes", "motivate", ,"motivated", "motivation", "inspire"])) {
            currentMode = "motivation";
            const categories = Object.keys(quotesDB);
            let foundCategory = categories.find(cat => contains(msg, [cat]));

            // If they asked for a quote AND specified a category in the same sentence
            if (foundCategory) {
                lastQuoteCategory = foundCategory;
                const quoteObj = randomFrom(quotesDB[foundCategory]);
                const responseHtml = `"${quoteObj.q}" <br><br>— <a href="https://www.google.com/search?q=${encodeURIComponent(quoteObj.a)}" target="_blank" class="text-primary fw-bold text-decoration-none">${quoteObj.a}</a><br><br><i>${quoteObj.b}</i>`;
                return sendBotMessage("Here is a quote for you:<br><br>" + responseHtml, ["Give me more", "Change Topic"]);
            }
            // If they just asked for a generic quote
            return sendBotMessage("Motivation mode activated! 🐾 What kind of quotes do you want to hear? (Available: Love, Success, Study, Life, Comfort, Peace, Joy, Courage)", ["Love", "Success", "Study", "Life", "Go Back"]);
        }
    }

    // 4. Initial State Routing
    if (currentMode === "initial") {
        if (contains(msg, ["know", "person", "behind", "creator", "portfolio", "about", "resume", "skills"])) {
            currentMode = "portfolio";
            return sendBotMessage("Awesome! I am your portfolio concierge. What would you like to know about my hooman, Roland?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        let moodData = getMoodData(msg);
        if (moodData) return handleMoodTransition(moodData);

        return sendBotMessage("I'm not sure I caught that. *tilts head* Do you want to hear a quote, or learn about my hooman?", ["I want to be motivated", "I want to know the person behind this"]);
    }

    // 5. Motivation Mode Logic
    if (currentMode === "motivation") {
        const categories = Object.keys(quotesDB);

        if (contains(msg, ["no", "nah", "no need", "don't want", "dont want", "pass", "stop", "nevermind", "none"])) {
            currentMode = "venting";
            return sendBotMessage("That's totally fine! We don't have to do quotes. I can just be a listening ear if you want to let things out.", ["I want to vent", "Portfolio Menu", "Go Back"]);
        }

        if (contains(msg, ["category", "categories", "what do you have", "list"])) {
            return sendBotMessage(`I have quotes about: **${categories.join(", ")}**. Which one would you like?`, categories);
        }

        if (contains(msg, ["more", "another", "again", "continue", "next"]) && lastQuoteCategory) {
            const quoteObj = randomFrom(quotesDB[lastQuoteCategory]);
            const responseHtml = `"${quoteObj.q}" <br><br>— <a href="https://www.google.com/search?q=${encodeURIComponent(quoteObj.a)}" target="_blank" class="text-primary fw-bold text-decoration-none">${quoteObj.a}</a><br><br><i>${quoteObj.b}</i>`;
            return sendBotMessage(responseHtml, ["Give me more", "Change Topic"]);
        }

        // --- THE FIX: We check if they typed a specific category FIRST ---
        let foundCategory = categories.find(cat => contains(msg, [cat]));
        if (foundCategory) {
            lastQuoteCategory = foundCategory;
            const quoteObj = randomFrom(quotesDB[foundCategory]);
            const responseHtml = `"${quoteObj.q}" <br><br>— <a href="https://www.google.com/search?q=${encodeURIComponent(quoteObj.a)}" target="_blank" class="text-primary fw-bold text-decoration-none">${quoteObj.a}</a><br><br><i>${quoteObj.b}</i>`;
            return sendBotMessage(responseHtml, ["Give me more", "Change Topic"]);
        }

        // --- THEN we check for generic change requests ---
        if (contains(msg, ["change", "different", "switch", "topic"])) {
            return sendBotMessage("Sure thing! Pick a new category:", categories);
        }

        let moodData = getMoodData(msg);
        if (moodData) return handleMoodTransition(moodData);

        return sendBotMessage("I don't have a quote for that specific word yet. *twitches ears* But here are the categories I do have:", ["Love", "Success", "Study", "Life", "Go Back"]);
    }

    // 6. Portfolio Mode Logic
    if (currentMode === "portfolio") {
        let reply = "";

        if (contains(msg, ["resume", "cv", "document", "file"])) reply = portfolioDB.resume;
        else if (contains(msg, ["contact", "email", "hire", "message", "reach", "touch"])) reply = portfolioDB.contact;
        else if (contains(msg, ["skill", "stack", "tech", "tools", "language", "framework", "code"])) reply = portfolioDB.skills;
        else if (contains(msg, ["project", "projects", "work", "game", "app", "system"])) reply = portfolioDB.projects;
        else if (contains(msg, ["achievement", "award", "win", "prize", "capstone", "cert"])) reply = portfolioDB.achievements;
        else if (contains(msg, ["about", "who", "background", "story", "creator", "him", "roland"])) reply = portfolioDB.about;

        if (reply) {
            return sendBotMessage(reply, ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        let moodData = getMoodData(msg);
        if (moodData) return handleMoodTransition(moodData);

        return sendBotMessage("I didn't quite catch that. I can tell you about his Skills, Projects, Resume, or Contact info. *purrs* What are you looking for?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
    }

    // 7. Venting Mode Logic
    if (currentMode === "venting") {
        if (contains(msg, ["feeling better", "done", "thanks", "thank you", "that's it", "thats it"])) {
            currentMode = "initial";
            return sendBotMessage("I'm so glad. *happy purr* I'm always here if you need me again! What would you like to do now?", ["I want to be motivated", "I want to know the person behind this"]);
        }

        if (contains(msg, ["portfolio", "menu"])) {
            currentMode = "portfolio";
            return sendBotMessage("Switching gears! I am your portfolio concierge. What would you like to know about my hooman, Roland?", ["About Him", "Tech Stack", "Projects", "Resume", "Contact", "Go Back"]);
        }

        let moodData = getMoodData(msg);
        if (moodData) {
            return sendBotMessage(moodData.reply + "<br><br><i>*I'm still here listening if you have more to say.*</i>", ["I'm feeling better", "Go Back"]);
        }

        return sendBotMessage("*Listens attentively and purrs softly* I hear you. Take your time.", ["I'm feeling better", "Go Back"]);
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
window.addEventListener("DOMContentLoaded", loadMeowData);