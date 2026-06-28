import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { firebaseConfig } from "./config.js";
import { shopConfig } from "./shopConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* -----
Initialization: Populate dynamic UI elements from config
----- */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('navShopName').innerText = shopConfig.shopName;
    document.getElementById('footerShopName').innerText = shopConfig.shopName;
    document.getElementById('heroTitle').innerText = shopConfig.heroTitle;
    document.getElementById('heroSubtitle').innerText = shopConfig.heroSubtitle;
    document.getElementById('currentYear').innerText = new Date().getFullYear();

    const reminderList = document.getElementById('reminderList');
    shopConfig.reminders.forEach(reminder => {
        const li = document.createElement('li');
        li.innerText = reminder;
        reminderList.appendChild(li);
    });
});

const printForm = document.getElementById('printForm');
const submitBtn = document.getElementById('submitBtn');
const sessionQueueContainer = document.getElementById('sessionQueueContainer');

/* -----
Generate dynamic UI tracker for a specific job and attach Firebase listener
----- */
function addJobToSessionUI(queueId, fileName) {
    // Remove the placeholder text if it's the first item
    if (sessionQueueContainer.querySelector('p')) {
        sessionQueueContainer.innerHTML = '';
    }

    // Create the tracker card
    const trackerCard = document.createElement('div');
    trackerCard.className = 'status-card';
    trackerCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <strong class="text-truncate" style="max-width: 150px;">${fileName}</strong>
            <span class="badge bg-secondary" id="statusBadge-${queueId}">Setting up...</span>
        </div>
    `;
    sessionQueueContainer.prepend(trackerCard);

    // Listen to Firebase for this specific Job ID
    const statusRef = ref(db, `queue/${queueId}/status`);
    onValue(statusRef, (snapshot) => {
        const liveStatus = snapshot.val();
        if (liveStatus) {
            const badge = document.getElementById(`statusBadge-${queueId}`);
            badge.innerText = liveStatus;

            // Dynamic styling based on status string
            if (liveStatus.includes("Printing")) {
                badge.className = 'badge bg-primary';
            } else if (liveStatus === "Done") {
                badge.className = 'badge bg-success';
            }
        }
    });
}

/* -----
True Client-Side PDF Editor & Preview Engine
Uses pdf-lib to modify the file, and pdf.js to preview it.
----- */
const { PDFDocument } = PDFLib;
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// DOM Elements
const fileInput = document.querySelector('input[name="document"]');
const pagesInput = document.getElementById('pagesInput');
const pdfCanvas = document.getElementById('pdfCanvas');
const paperWrapper = document.getElementById('paperWrapper');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewSpecs = document.getElementById('previewSpecs');
const viewFullBtn = document.getElementById('viewFullBtn');

// Setup Controls
const paperSizeSelect = document.getElementById('paperSizeSelect');
const marginSelect = document.getElementById('marginSelect');
const orientationSelect = document.getElementById('orientationSelect');
const colorModeSelect = document.getElementById('colorMode');

// State Variables
let originalPdfBytes = null;
let modifiedPdfBlob = null; // We will upload THIS, not the original
let currentTotalPages = 0;

// Base Measurements in Points (1 inch = 72 points)
const dimensions = {
    "A4": { w: 595.28, h: 841.89 },
    "Letter": { w: 612, h: 792 },
    "Legal": { w: 612, h: 1008 }
};
const margins = { "None": 0, "Normal": 72, "Narrow": 36, "Wide": 108 };

/* ----- Core Modification Engine ----- */
async function generateModifiedPDF() {
    if (!originalPdfBytes) return;

    previewPlaceholder.innerText = "Applying changes...";
    previewPlaceholder.style.display = 'block';
    paperWrapper.style.display = 'none';
    viewFullBtn.disabled = true;

    try {
        // 1. Create a brand new empty PDF
        const newPdfDoc = await PDFDocument.create();

        // 2. Load the original PDF to extract its pages
        const embeddedPages = await newPdfDoc.embedPdf(originalPdfBytes);

        // Setup target dimensions based on user selection
        const size = dimensions[paperSizeSelect.value];
        const isLandscape = orientationSelect.value === "Landscape";
        const targetWidth = isLandscape ? size.h : size.w;
        const targetHeight = isLandscape ? size.w : size.h;
        const marginPts = margins[marginSelect.value];

        // Process requested pages (e.g., "1-3" or "All")
        let pagesToProcess = [];
        const pageReq = pagesInput.value.trim().toLowerCase();

        if (pageReq === 'all' || pageReq === '') {
            pagesToProcess = embeddedPages.map((_, i) => i);
        } else {
            const parts = pageReq.split('-');
            if (parts.length === 2) {
                let start = parseInt(parts[0]) - 1;
                let end = parseInt(parts[1]) - 1;
                for (let i = start; i <= end; i++) {
                    if (i >= 0 && i < embeddedPages.length) pagesToProcess.push(i);
                }
            } else {
                const p = parseInt(parts[0]) - 1;
                if (p >= 0 && p < embeddedPages.length) pagesToProcess.push(p);
            }
        }

        // Safety fallback if invalid pages are typed
        if (pagesToProcess.length === 0) pagesToProcess = [0];

        // 3. Draw the old pages onto the new perfectly sized pages
        for (const pageIndex of pagesToProcess) {
            const embeddedPage = embeddedPages[pageIndex];
            const newPage = newPdfDoc.addPage([targetWidth, targetHeight]);

            const availableWidth = targetWidth - (marginPts * 2);
            const availableHeight = targetHeight - (marginPts * 2);

            const scale = Math.min(
                availableWidth / embeddedPage.width,
                availableHeight / embeddedPage.height
            );

            newPage.drawPage(embeddedPage, {
                x: (targetWidth - (embeddedPage.width * scale)) / 2,
                y: (targetHeight - (embeddedPage.height * scale)) / 2,
                width: embeddedPage.width * scale,
                height: embeddedPage.height * scale,
            });
        }

        // 4. Save to Blob
        const pdfBytes = await newPdfDoc.save();
        modifiedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        currentTotalPages = pagesToProcess.length;

        // 5. Trigger the visual preview
        await renderPreview(modifiedPdfBlob);

    } catch (e) {
        console.error("PDF Modification Error:", e);
        previewPlaceholder.innerText = "Error applying changes.";
    }
}

/* ----- PDF.js Visual Preview ----- */
async function renderPreview(pdfBlob) {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    // Render Page 1 for the thumbnail
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    await page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport: viewport }).promise;

    // Apply B&W filter CSS (We use CSS for B&W because stripping color profiles in PDFs is highly volatile)
    const isBW = colorModeSelect.value === "B&W";
    pdfCanvas.style.filter = isBW ? 'grayscale(100%)' : 'none';

    // Update UI
    previewSpecs.innerText = `${paperSizeSelect.value} | ${currentTotalPages} Pages`;

    // Remove the CSS margin overlay box (since pdf-lib physically added margins)
    if (document.getElementById('marginOverlay')) {
        document.getElementById('marginOverlay').style.display = 'none';
    }

    paperWrapper.style.display = 'inline-block';
    previewPlaceholder.style.display = 'none';
    viewFullBtn.disabled = false;
}

/* ----- Event Listeners ----- */
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
        previewPlaceholder.innerText = "Reading file...";
        previewPlaceholder.style.display = 'block';

        const arrayBuffer = await file.arrayBuffer();
        originalPdfBytes = arrayBuffer;

        // Determine total original pages to set default input
        const tempDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });
        pagesInput.value = `1-${tempDoc.getPageCount()}`;

        generateModifiedPDF();
    }
});

// Re-build the PDF if they change ANY setting
const controls = [paperSizeSelect, marginSelect, orientationSelect, colorModeSelect];
controls.forEach(ctrl => ctrl.addEventListener('change', generateModifiedPDF));
pagesInput.addEventListener('blur', generateModifiedPDF); // Use blur so it doesn't build while typing

/* ----- Modal Logic (Viewing the Modified PDF) ----- */
const pdfModal = document.getElementById('pdfModal');
const modalBody = document.getElementById('pdfModalBody');
const modalLoadingText = document.getElementById('modalLoadingText');

pdfModal.addEventListener('show.bs.modal', async () => {
    if (!modifiedPdfBlob) return;

    modalBody.innerHTML = '';
    modalBody.appendChild(modalLoadingText);
    modalLoadingText.style.display = 'block';
    modalLoadingText.innerText = `Loading ${currentTotalPages} modified pages...`;

    const isBW = colorModeSelect.value === "B&W";

    // Read our newly generated blob
    const arrayBuffer = await modifiedPdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    for (let i = 1; i <= currentTotalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.className = 'mb-4 shadow-lg bg-white';
        canvas.style.maxWidth = '100%';
        canvas.style.filter = isBW ? 'grayscale(100%)' : 'none';
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        modalBody.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
    }

    modalLoadingText.style.display = 'none';
});

/* ----- Intercept Form Submission ----- */
printForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!modifiedPdfBlob) return alert("Please wait for the PDF to finish processing.");

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading Processed File...";

    // Build form data manually to include our modified PDF instead of the original file
    const formData = new FormData(printForm);
    formData.set('document', modifiedPdfBlob, `modified_${Date.now()}.pdf`);

    try {
        const response = await fetch('php/upload.php', { method: 'POST', body: formData });
        const result = await response.json();

        if (result.success) {
            addJobToSessionUI(result.id, "Processed Document");
            printForm.reset();
            paperWrapper.style.display = 'none';
            previewPlaceholder.style.display = 'block';
            previewPlaceholder.innerText = "No file selected";
            originalPdfBytes = null;
            modifiedPdfBlob = null;
            viewFullBtn.disabled = true;
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Upload failed.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send to Queue";
    }
});