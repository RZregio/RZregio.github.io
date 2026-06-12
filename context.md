**CONTEXT INITIALIZATION: Roland Z. Regio's Personal Portfolio**

**1. Tech Stack & Architecture**
* **Core:** Pure HTML5, CSS3, and Vanilla JavaScript. No frameworks like React or Next.js.
* **Libraries:** Bootstrap 5.3 (CSS & JS), Bootstrap Icons.
* **Data Flow:** Fully dynamic. HTML files act as structural shells. Vanilla JS (`render*.js`) fetches data from modular JSON files (`/json/*.json`) and dynamically injects the HTML components into the DOM.

**2. Design System & UI/UX**
* **Theme:** Deep Dark Mode (Backgrounds: `#060b1a`, `#101A30`, `#162447`).
* **Accent Color:** Yellow/Gold (`--accent-yellow: #D48C1C`).
* **Typography:** 'Fredoka One' (Headings/Accents) and 'Poppins' (Body text).
* **Global CSS Behaviors:** 
  * `overscroll-behavior-y: none` is globally applied to stop mobile white-bounce.
  * Mobile typography and padding dynamically shrink using CSS `clamp()` and media queries (`@media max-width: 768px/991px`).
  * Custom yellow buttons and custom modal close buttons (`.custom-yellow-close`).

**3. File Structure & Routing**
* **Pages:** `index.html`, `about.html`, `experience.html`, `contact.html`.
* **CSS:** `navFoot.css` (Global styles, variables, mobile fixes), plus page-specific CSS (`home.css`, `about.css`, `experience.css`, `contact.css`).
* **JavaScript:** 
  * `globalUI.js` (Handles loaders, scroll animations, navbar active states).
  * `textSwitch.js` (Typing effect on the hero section).
  * `renderIndex.js`, `renderAbout.js`, `renderExperience.js` (Fetch/Render logic).
  * `sendEmail.js`, `sendTestimonial.js` (Web3Forms logic).

**4. Key Features & Page Logic**
* **Global Image Modal:** A unified `<div id="imageViewerModal">` exists on all pages. It supports arrays of multiple images, featuring yellow-themed Prev/Next arrows that auto-hide if an item only has one image.
* **Forms (Web3Forms):** Contact and Testimonial forms have strict Regex email validation triggering an `invalidEmailModal`. They also feature LocalStorage quota tracking (max 2 per month) triggering a `limitModal`.
* **Index Page:** Fetches Services, Featured Projects (Bootstrap Carousel), Testimonials, and specifically filters the first 6 items of `recognitions.json`.
* **Experience Page:** Features a Tech Stack grid and a highly complex "Split-Pane" Project Viewer. The left column is a vertical list (horizontal swipe on mobile) capped at 5 visible items with scroll hints. The right column displays the selected project's media and details.
* **About Page:** Features Fun Facts, an expandable Career Map, and a Dual-Tab Recognitions engine with desktop numbered pagination that converts to a horizontal swipeable row on mobile screens (`max-width: 991px`).

**5. JSON Data Structures (Strict Schemas)**
When generating or modifying data, adhere strictly to these object schemas:

* **`recognitions.json`:** `[{ "category": "certificate" | "award", "title": "", "context": "", "date": "", "description": "", "iconClass": "", "images": ["url1", "url2"] }]`
* **`projects.json`:** `[{ "title": "", "category": "school" | "personal" | "company" | "other", "description": "", "techStack": ["HTML", "CSS"], "liveLink": "", "mediaType": "image" | "iframe", "mediaSource": ["url1", "url2"] }]`
* **`featuredProjects.json`:** `[{ "projectTitle": "", "projectCategory": "", "projectContext": "", "techStack": [""], "projectLinkUrl": "", "images": ["url1"] }]`
* **`services.json`:** `[{ "serviceTitle": "", "serviceDescription": "", "iconClass": "", "notableExperience": "", "experienceLevel": "Expert", "proficiencyLevel": 90 }]`
* **`techStack.json`:** `[{ "category": "frontend" | "backend" | "programming" | "tools", "title": "", "description": "", "iconClass": "", "stars": 5, "linkUrl": "" }]`
* **`career.json`:** `[{ "title": "", "subtitle": "", "dateRange": "", "description": "", "iconClass": "", "isCurrent": true }]`
* **`testimonials.json`:** `[{ "reviewerName": "", "reviewerRole": "", "testimonialMessage": "" }]`
* **`funFacts.json`:** `[{ "factTitle": "", "factDescription": "", "iconClass": "" }]`

**End of Context. Please confirm you understand the architecture, design system, and JSON schemas.**