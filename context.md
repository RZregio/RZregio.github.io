**CONTEXT INITIALIZATION: Roland Z. Regio's Personal Portfolio**

**1. Tech Stack & Architecture**
* **Core:** Pure HTML5, CSS3, Vanilla JavaScript, and HTML5 Canvas API. No frameworks like React or Next.js.
* **Libraries:** Bootstrap 5.3 (CSS & JS), Bootstrap Icons.
* **Hybrid Data Flow & Component Injection:** HTML files act as structural shells. 
  * JSON Data (`/json/*.json`) is fetched via `render*.js` files to build dynamic page content.
  * Reusable UI Components (Footer, Global Modals) are dynamically fetched and injected via `js/componentLoader.js` to ensure a DRY (Don't Repeat Yourself) architecture, while the Navbar remains static to preserve mobile sticky behaviors.

**2. Design System & UI/UX**
* **Themes (7 Total):** Default (Yellow/Dark), Dark, Purple, Green, Blue, Brown, and Pink. Controlled via data attributes (`data-theme`) on the `html` tag.
* **Accent Colors:** Primary elements, dynamic scrollbar gradients, and custom SVG cursors adapt instantly to the active theme.
* **Typography:** 'Fredoka One' (Headings/Accents) and 'Poppins' (Body text).
* **Global CSS Behaviors:** * `overscroll-behavior-y: none` is globally applied to stop mobile white-bounce.
  * Mobile typography and padding dynamically shrink using CSS `clamp()` and media queries.
  * Interactive components feature standard `.custom-yellow-close` and dynamic `drop-shadow` hover glows based on the active theme.
  * Tall modals (like the Quiz) utilize `modal-dialog-scrollable` to preserve fixed action footers on mobile screens.

**3. File Structure & Routing**
* **Pages:** `index.html`, `about.html`, `experience.html`, `contact.html`.
* **Components:** `components/footer.html`, `components/modals.html` (Centralized templates).
* **CSS:** `navFoot.css` (Global styles), `accessibility.css` (Themes, custom cursors, scrollbars, floating menus), plus page-specific CSS (`home.css`, `about.css`, etc.).
* **JavaScript:** * `componentLoader.js` (Fetches global HTML components and manages dynamic active footer links).
  * `globalUI.js` (Handles loaders, scroll animations, clipboard copying for tips, and navbar logic).
  * `accessibility.js` (Theme toggling, Meowtivator popup, Google Translate).
  * `quiz.js` (State management, array shuffling, strict sequence validation, and Canvas generation).
  * `renderIndex.js`, `renderAbout.js`, `renderExperience.js`, `renderContact.js` (Fetch/Render logic for JSON data).
  * `sendEmail.js`, `sendTestimonial.js` (Web3Forms API logic with limiters).

**4. Key Features & Page Logic**
* **Accessibility Island:** A global floating FAB menu containing a theme toggler, an English/Tagalog Google Translate toggler, a back-to-top button, and a "Meowtivator" chat popup. Features a smart z-index (`1035`) to sit behind modals, CSS pointer-event fixes to prevent phantom blocking, and dynamic footer-collision avoidance (moves up and drops opacity when the footer enters the viewport).
* **Support / Tip Modal:** A dedicated modal accessed via a coffee icon in the navbar. Features responsive GCash and PayPal sections with 1-click clipboard copying and QR codes that dynamically pipe into the Global Image Viewer.
* **Global Image Modal:** A centralized `<div id="imageViewerModal">` injected via `modals.html` that supports arrays of multiple images with dynamic Prev/Next arrows.
* **Forms (Web3Forms):** Contact and Testimonial forms have strict Regex email validation and LocalStorage quota tracking (max 2 per month).
* **Dynamic Project Actions:** Projects conditionally render "Live Demo", "Source Code", and "View Images" buttons based strictly on available JSON data.
* **Experience Page:** Features a Tech Stack grid and a "Split-Pane" Project Viewer. The left column is a vertical list (horizontal swipe on mobile) capped at 5 visible items with scroll hints.
* **About Page:** Features an expandable Career Map and a Dual-Tab Recognitions engine with desktop numbered pagination that converts to a horizontal swipeable row on mobile screens.
* **Knowledge Test Engine (Contact Page):** A robust vanilla JS quiz system featuring a 30-question bank (MCQ & Fill-in-the-blank). It pulls 10 random questions per session, enforces answer submission before navigating, provides a "Review Answers" modal, guards against accidental closure via a custom Quit Confirmation modal, and uses the HTML5 Canvas API to generate a personalized, downloadable Certificate of Appreciation (Score >= 7/10).

**5. JSON Data Structures (Strict Schemas)**
When generating or modifying data, adhere strictly to these object schemas:

* **`recognitions.json`:** `[{ "category": "certificate" | "award", "title": "", "context": "", "date": "", "description": "", "iconClass": "", "images": ["url1", "url2"] }]`
* **`projects.json`:** `[{ "title": "", "category": "school" | "personal" | "company" | "other", "description": "", "techStack": ["HTML", "CSS"], "liveLink": "", "sourceCode": "", "mediaType": "image" | "iframe", "mediaSource": ["url1", "url2"] }]`
* **`featuredProjects.json`:** `[{ "projectTitle": "", "projectCategory": "", "projectContext": "", "techStack": [""], "projectLinkUrl": "", "sourceCode": "", "images": ["url1"] }]`
* **`services.json`:** `[{ "serviceTitle": "", "serviceDescription": "", "iconClass": "", "notableExperience": "", "experienceLevel": "Expert", "proficiencyLevel": 90 }]`
* **`techStack.json`:** `[{ "category": "frontend" | "backend" | "programming" | "tools", "title": "", "description": "", "iconClass": "", "stars": 5, "linkUrl": "" }]`
* **`career.json`:** `[{ "title": "", "subtitle": "", "dateRange": "", "description": "", "iconClass": "", "isCurrent": true }]`
* **`testimonials.json`:** `[{ "reviewerName": "", "reviewerRole": "", "testimonialMessage": "" }]`
* **`funFacts.json`:** `[{ "factTitle": "", "factDescription": "", "iconClass": "" }]`