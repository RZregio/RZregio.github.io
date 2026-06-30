import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue, set, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { firebaseConfig } from "./config.js";
import { shopConfig } from "./shopConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser = null;

// DOM Elements
const fileInput = document.querySelector('input[name="document"]');
const pagesInput = document.getElementById('pagesInput');
const pdfCanvas = document.getElementById('pdfCanvas');
const paperWrapper = document.getElementById('paperWrapper');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const previewSpecs = document.getElementById('previewSpecs');
const viewFullBtn = document.getElementById('viewFullBtn');
const mixedColorContainer = document.getElementById('mixedColorContainer');
const colorPagesInput = document.getElementById('colorPagesInput');
const paperSizeSelect = document.getElementById('paperSizeSelect');
const marginSelect = document.getElementById('marginSelect');
const orientationSelect = document.getElementById('orientationSelect');
const colorModeSelect = document.getElementById('colorMode');
const printForm = document.getElementById('printForm');
const submitBtn = document.getElementById('submitBtn');
const sessionQueueContainer = document.getElementById('sessionQueueContainer');
const reqNameInput = document.getElementById('reqName');

// Auth DOM Elements
const authForm = document.getElementById('authForm');
const toggleAuthModeBtn = document.getElementById('toggleAuthMode');
const authModalTitle = document.getElementById('authModalTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const nameFieldContainer = document.getElementById('nameFieldContainer');
const authNameInput = document.getElementById('authName');
const loginBtn = document.getElementById('loginBtn');
const userProfile = document.getElementById('userProfile');
const userNameDisplay = document.getElementById('userNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

let isRegisterMode = false;

// State Variables
let originalPdfBytes = null;
let modifiedPdfBlob = null;
let currentTotalPages = 0;

const dimensions = {
    "A4": { w: 595.28, h: 841.89 },
    "Letter": { w: 612, h: 792 },
    "Legal": { w: 612, h: 936 }
};
const margins = { "None": 0, "Normal": 72, "Narrow": 36, "Wide": 108 };

const { PDFDocument } = PDFLib;
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


/* =========================================
   FUNCTIONS
   ========================================= */

function parseColorPageString(pageString, maxPages) {
    if (!pageString || !pageString.trim()) return 0;
    let count = 0;
    const parts = pageString.split(',');

    for (let part of parts) {
        part = part.trim();
        if (part.includes('-')) {
            let [start, end] = part.split('-').map(n => parseInt(n));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                start = Math.max(1, start);
                end = Math.min(maxPages, end);
                if (start <= end) count += (end - start + 1);
            }
        } else {
            let page = parseInt(part);
            if (!isNaN(page) && page >= 1 && page <= maxPages) {
                count += 1;
            }
        }
    }
    return count;
}

function calculateLiveCost() {
    if (currentTotalPages === 0) return "0.00";

    const copies = parseInt(document.getElementById('copiesInput').value) || 1;
    const mode = document.getElementById('colorMode').value;
    const paperSize = document.getElementById('paperSizeSelect').value;

    const sizePricing = shopConfig.pricing[paperSize] || shopConfig.pricing["A4"];
    let costForOneCopy = 0;

    if (mode === "Color") {
        costForOneCopy = currentTotalPages * sizePricing.color;
    } else if (mode === "B&W") {
        costForOneCopy = currentTotalPages * sizePricing.bw;
    } else if (mode === "Mixed") {
        const colorString = colorPagesInput.value;
        let colorPageCount = parseColorPageString(colorString, currentTotalPages);
        if (colorPageCount > currentTotalPages) colorPageCount = currentTotalPages;
        const bwPageCount = currentTotalPages - colorPageCount;
        costForOneCopy = (colorPageCount * sizePricing.color) + (bwPageCount * sizePricing.bw);
    }

    let totalCost = costForOneCopy * copies;
    const totalPagesToPrint = currentTotalPages * copies;

    const promo = shopConfig.pricing.promo;
    if (totalPagesToPrint >= promo.threshold) {
        if (promo.discountType === 'percent') {
            totalCost = totalCost - (totalCost * promo.discountValue);
        } else if (promo.discountType === 'fixed') {
            totalCost = totalPagesToPrint * promo.discountValue;
        }
    }
    return totalCost.toFixed(2);
}

async function renderPreview(pdfBlob) {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    await page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport: viewport }).promise;

    const isBW = colorModeSelect.value === "B&W";
    pdfCanvas.style.filter = isBW ? 'grayscale(100%)' : 'none';

    const liveCost = calculateLiveCost();
    previewSpecs.innerText = `${paperSizeSelect.value} | ${currentTotalPages} Pages | ₱${liveCost}`;
    submitBtn.innerText = `Send to Queue (₱${liveCost})`;

    if (document.getElementById('marginOverlay')) {
        document.getElementById('marginOverlay').style.display = 'none';
    }

    paperWrapper.style.display = 'inline-block';
    previewPlaceholder.style.display = 'none';
    viewFullBtn.disabled = false;
}

async function generateModifiedPDF() {
    if (!originalPdfBytes) return;

    previewPlaceholder.innerText = "Applying changes...";
    previewPlaceholder.style.display = 'block';
    paperWrapper.style.display = 'none';
    viewFullBtn.disabled = true;

    try {
        const newPdfDoc = await PDFDocument.create();
        const tempDocForCount = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });
        const allPageIndices = tempDocForCount.getPageIndices();
        const embeddedPages = await newPdfDoc.embedPdf(originalPdfBytes, allPageIndices);

        const size = dimensions[paperSizeSelect.value];
        const isLandscape = orientationSelect.value === "Landscape";
        const targetWidth = isLandscape ? size.h : size.w;
        const targetHeight = isLandscape ? size.w : size.h;
        const marginPts = margins[marginSelect.value];

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

        if (pagesToProcess.length === 0) pagesToProcess = [0];

        // 3. Draw the old pages onto the new perfectly sized pages
        for (const pageIndex of pagesToProcess) {
            const embeddedPage = embeddedPages[pageIndex];
            const newPage = newPdfDoc.addPage([targetWidth, targetHeight]);

            // Calculate exact printable area bounds
            const availableWidth = targetWidth - (marginPts * 2);
            const availableHeight = targetHeight - (marginPts * 2);

            const scale = Math.min(
                availableWidth / embeddedPage.width,
                availableHeight / embeddedPage.height
            );

            const scaledWidth = embeddedPage.width * scale;
            const scaledHeight = embeddedPage.height * scale;

            // Center exactly within the printable area, factoring in margins
            newPage.drawPage(embeddedPage, {
                x: marginPts + ((availableWidth - scaledWidth) / 2),
                y: marginPts + ((availableHeight - scaledHeight) / 2),
                width: scaledWidth,
                height: scaledHeight,
            });
        }

        const pdfBytes = await newPdfDoc.save();
        modifiedPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        currentTotalPages = pagesToProcess.length;

        await renderPreview(modifiedPdfBlob);

    } catch (e) {
        console.error("PDF Modification Error:", e);
        previewPlaceholder.innerText = "Error applying changes.";
    }
}

function addJobToSessionUI(queueId, fileName, costStr) {
    if (sessionQueueContainer.querySelector('p')) {
        sessionQueueContainer.innerHTML = '';
    }

    const trackerCard = document.createElement('div');
    trackerCard.className = 'status-card';
    trackerCard.id = `queue-card-${queueId}`;
    trackerCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <strong class="text-truncate" style="max-width: 150px;">${fileName}</strong>
            <span class="badge bg-secondary" id="statusBadge-${queueId}">Setting up...</span>
        </div>
        <div class="text-end small fw-bold text-success">Total: ₱${costStr}</div>
    `;
    sessionQueueContainer.prepend(trackerCard);

    const statusRef = ref(db, `queue/${queueId}/status`);
    onValue(statusRef, (snapshot) => {
        const liveStatus = snapshot.val();
        if (liveStatus) {
            const badge = document.getElementById(`statusBadge-${queueId}`);
            if (!badge) return;
            badge.innerText = liveStatus;

            if (liveStatus.includes("Printing")) {
                badge.className = 'badge bg-primary';
            } else if (liveStatus === "Done") {
                badge.className = 'badge bg-success';

                // NEW: Play a success chime for the user
                const successSound = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
                successSound.play().catch(err => console.log("Browser blocked audio:", err));

                // Clear from LocalStorage once done
                let currentSession = JSON.parse(localStorage.getItem('printify_session')) || [];
                currentSession = currentSession.filter(job => job.id !== queueId);
                localStorage.setItem('printify_session', JSON.stringify(currentSession));

                fetch('php/update_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: queueId, status: 'Done' })
                }).catch(err => console.error("MySQL sync failed:", err));
            }
        }
    });
}


/* =========================================
   EVENT LISTENERS & INITIALIZATION
   ========================================= */

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


// PDF Controls
const controls = [paperSizeSelect, marginSelect, orientationSelect, colorModeSelect];
controls.forEach(ctrl => ctrl.addEventListener('change', generateModifiedPDF));
pagesInput.addEventListener('blur', generateModifiedPDF);

colorModeSelect.addEventListener('change', () => {
    if (colorModeSelect.value === 'Mixed') {
        mixedColorContainer.style.display = 'block';
    } else {
        mixedColorContainer.style.display = 'none';
        colorPagesInput.value = '';
    }
    generateModifiedPDF();
});
colorPagesInput.addEventListener('blur', generateModifiedPDF);

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
        previewPlaceholder.innerText = "Reading file...";
        previewPlaceholder.style.display = 'block';

        const arrayBuffer = await file.arrayBuffer();
        originalPdfBytes = arrayBuffer;

        const tempDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });

        // --- NEW: Auto-detect Paper Size ---
        const firstPage = tempDoc.getPage(0);
        const { width, height } = firstPage.getSize();
        const maxDim = Math.max(width, height); // Handle both Portrait/Landscape

        if (Math.abs(maxDim - 841.89) < 10) {
            paperSizeSelect.value = "A4";
        } else if (Math.abs(maxDim - 1008) < 10) {
            paperSizeSelect.value = "Legal";
        } else {
            paperSizeSelect.value = "Letter"; // Default fallback
        }
        // -----------------------------------

        pagesInput.value = `1-${tempDoc.getPageCount()}`;
        generateModifiedPDF();
    }
});

/* =========================================
   USER HISTORY DASHBOARD
   ========================================= */
const historyModalEl = document.getElementById('historyModal');
const historyTableBody = document.getElementById('historyTableBody');

if (historyModalEl) {
    historyModalEl.addEventListener('show.bs.modal', async () => {
        if (!currentUser) return;

        // Show loading state
        historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading your print history...</td></tr>';

        try {
            // Ask Firebase for ONLY the queue items where uid matches the logged-in user
            const userQueueRef = query(ref(db, 'queue'), orderByChild('uid'), equalTo(currentUser.uid));
            const snapshot = await get(userQueueRef);

            if (snapshot.exists()) {
                historyTableBody.innerHTML = '';
                const data = snapshot.val();

                // Filter out active jobs, then sort by newest first
                const jobs = Object.values(data)
                    .filter(job => job.status === 'Done')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                jobs.forEach(job => {
                    // Clean up the file name to remove the "uploads/" prefix
                    const cleanFileName = job.file_path ? job.file_path.replace('uploads/', '') : 'Unknown File';
                    const printDate = new Date(job.created_at).toLocaleDateString();

                    // Determine badge color using solid colors
                    const badgeClass = job.status === 'Done' ? 'bg-success' : 'bg-primary';

                    const row = `
                        <tr>
                            <td class="text-truncate fw-bold" style="max-width: 200px;" title="${cleanFileName}">${cleanFileName}</td>
                            <td>${printDate}</td>
                            <td class="text-success fw-bold">₱${job.cost || '0.00'}</td>
                            <td><span class="badge ${badgeClass}">${job.status}</span></td>
                        </tr>
                    `;
                    historyTableBody.innerHTML += row;
                });
            } else {
                historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No print history found.</td></tr>';
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            historyTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-danger">Failed to load history.</td></tr>';
        }
    });
}

// Modal Viewer
const pdfModal = document.getElementById('pdfModal');
const modalBody = document.getElementById('pdfModalBody');
const modalLoadingText = document.getElementById('modalLoadingText');

pdfModal.addEventListener('show.bs.modal', async () => {
    if (!modifiedPdfBlob) return;

    modalBody.innerHTML = '';
    modalLoadingText.style.display = 'block';
    modalLoadingText.innerText = `Loading all pages...`;
    modalBody.appendChild(modalLoadingText);

    const isBW = colorModeSelect.value === "B&W";

    try {
        const arrayBuffer = await modifiedPdfBlob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            canvas.className = 'mb-4 shadow-lg bg-white img-fluid';
            canvas.style.maxWidth = '100%';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            canvas.style.filter = isBW ? 'grayscale(100%)' : 'none';
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            modalBody.appendChild(canvas);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
        }
    } catch (error) {
        console.error("Error rendering preview pages:", error);
        modalBody.innerHTML = '<p class="text-danger mt-3">Failed to load document preview.</p>';
    }
    modalLoadingText.style.display = 'none';
});


// Form Submission
printForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader("Sending to Printer...");
    if (!modifiedPdfBlob) return showLoader("Uploading to Print Queue...");

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading Processed File...";

    const formData = new FormData(printForm);
    formData.set('pages', currentTotalPages);

    const originalName = fileInput.files[0].name.replace('.pdf', '');
    formData.set('document', modifiedPdfBlob, `${originalName}_processed.pdf`);

    try {
        const response = await fetch('php/upload.php', { method: 'POST', body: formData });
        const result = await response.json();

        if (result.success) {
            const finalCost = calculateLiveCost();
            const selectedMode = formData.get('color');

            // DUAL WRITE: Push to Firebase using the EXACT path from the server
            await set(ref(db, `queue/${result.id}`), {
                id: result.id,
                requester_name: formData.get('requester'),
                uid: currentUser ? currentUser.uid : 'guest',

                file_path: result.filePath, // <--- CRITICAL FIX: Use the path from PHP

                pages: currentTotalPages,
                paper_size: formData.get('paperSize'),
                margins: formData.get('margins'),
                copies: parseInt(formData.get('copies')),
                color: selectedMode,
                color_pages: selectedMode === "Mixed" ? colorPagesInput.value : "N/A",
                cost: finalCost,
                status: 'In Queue',
                created_at: new Date().toISOString()
            });
            
            const currentSession = JSON.parse(localStorage.getItem('printify_session')) || [];
            currentSession.push({ id: result.id, fileName: `${originalName}.pdf`, cost: finalCost });
            localStorage.setItem('printify_session', JSON.stringify(currentSession));

            addJobToSessionUI(result.id, `${originalName}.pdf`, finalCost);
            printForm.reset();
            paperWrapper.style.display = 'none';
            previewPlaceholder.style.display = 'block';
            previewPlaceholder.innerText = "No file selected";
            originalPdfBytes = null;
            modifiedPdfBlob = null;
            viewFullBtn.disabled = true;
        } else {
            showAlert("Error", result.message, true);
        }
    } catch (error) {
        console.error(error);
        showAlert("Error", result.message, true);
    } finally {
        hideLoader();
        submitBtn.disabled = false;
        submitBtn.innerText = "Send to Queue";
    }
});


/* =========================================
   FIREBASE AUTHENTICATION
   ========================================= */

// Toggle between Login and Register UI
if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        authModalTitle.innerText = isRegisterMode ? "Create Account" : "Sign In";
        authSubmitBtn.innerText = isRegisterMode ? "Register" : "Login";
        toggleAuthModeBtn.innerText = isRegisterMode ? "Already have an account? Login." : "Don't have an account? Register here.";
        nameFieldContainer.style.display = isRegisterMode ? "block" : "none";
        authNameInput.required = isRegisterMode;
    });
}

// Handle Login / Register Submission
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoader("Authenticating...");
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const name = authNameInput.value;

        authSubmitBtn.disabled = true;
        authSubmitBtn.innerText = "Processing...";

        try {
            if (isRegisterMode) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            // Hide Modal on success
            // Note: Make sure bootstrap is loaded in your HTML before this runs
            const modalEl = document.getElementById('authModal');
            if (modalEl && window.bootstrap) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalInstance.hide();
            }
            authForm.reset();

        } catch (error) {
            showAlert("Authentication Failed", error.message, true);
        } finally {
            showLoader("Sending to Printer...");
            authSubmitBtn.disabled = false;
            authSubmitBtn.innerText = isRegisterMode ? "Register" : "Login";
        }
    });
}

// Listen for Login State Changes
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    sessionQueueContainer.innerHTML = ''; // Clear out the session UI

    if (user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (userProfile) userProfile.style.display = "flex";
        if (userNameDisplay) userNameDisplay.innerText = `Hi, ${user.displayName || 'User'}!`;

        if (reqNameInput) {
            reqNameInput.value = user.displayName || user.email.split('@')[0];
            reqNameInput.readOnly = true;
        }

        // CLOUD STATE: Fetch active jobs from Firebase for this specific user
        try {
            const userQueueRef = query(ref(db, 'queue'), orderByChild('uid'), equalTo(user.uid));
            const snapshot = await get(userQueueRef);
            let hasActiveJobs = false;

            if (snapshot.exists()) {
                const data = snapshot.val();
                // Sort oldest to newest
                const jobs = Object.values(data).sort((a, b) => a.id - b.id);

                jobs.forEach(job => {
                    // Only put active jobs in the side session tracker
                    if (job.status !== 'Done') {
                        hasActiveJobs = true;
                        const cleanFileName = job.file_path ? job.file_path.replace('uploads/', '') : 'Document.pdf';
                        addJobToSessionUI(job.id, cleanFileName, job.cost);
                    }
                });
            }

            if (!hasActiveJobs) {
                sessionQueueContainer.innerHTML = '<p class="text-muted small">Your submitted documents will appear here with live status updates.</p>';
            }
        } catch (error) {
            console.error("Failed to load active cloud session:", error);
        }

    } else {
        if (loginBtn) loginBtn.style.display = "block";
        if (userProfile) userProfile.style.display = "none";

        if (reqNameInput) {
            reqNameInput.value = "";
            reqNameInput.readOnly = false;
        }

        // LOCAL STATE: If logged out, load the guest session from device storage
        const savedSession = JSON.parse(localStorage.getItem('printify_session')) || [];
        if (savedSession.length > 0) {
            savedSession.forEach(job => addJobToSessionUI(job.id, job.fileName, job.cost));
        } else {
            sessionQueueContainer.innerHTML = '<p class="text-muted small">Your submitted documents will appear here with live status updates.</p>';
        }
    }
});

function showAlert(title, message, isError = false) {
    document.getElementById('alertModalTitle').innerText = title;
    document.getElementById('alertModalTitle').className = `modal-title fw-bold ${isError ? 'text-danger' : 'text-success'}`;
    document.getElementById('alertModalMessage').innerText = message;
    new bootstrap.Modal(document.getElementById('alertModal')).show();
}

function showLoader(text) {
    document.getElementById('loaderText').innerText = text;
    document.getElementById('globalLoader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('globalLoader').style.display = 'none';
}

// Handle Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        new bootstrap.Modal(document.getElementById('logoutConfirmModal')).show();
    });
}
document.getElementById('confirmLogoutBtn').addEventListener('click', () => {
    signOut(auth);
    bootstrap.Modal.getInstance(document.getElementById('logoutConfirmModal')).hide();
});