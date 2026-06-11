// Global State
let cart = {};
let currentItemCode = "";
let currentItemPrice = 0;
let modalQuantity = 1;
let categories = [];
let products = [];
let currentUser = null;

// Initialize System
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadCategories();
    getAllCategories();
});

// Authentication Management
function checkAuth() {
    const userStr = localStorage.getItem("catUser");
    const navAuth = document.getElementById("navAuthSection");

    if (userStr) {
        currentUser = JSON.parse(userStr);
        navAuth.innerHTML = `
            <button class="btn btn-outline-accent btn-sm rounded-pill px-3" onclick="openProfile()"><i class="bi bi-person-fill"></i> ${currentUser.name}</button>
            <button class="btn btn-sm text-muted-cat" onclick="logout()">Logout</button>
        `;
    } else {
        navAuth.innerHTML = `
            <a href="login.html" class="btn btn-accent btn-sm rounded-pill px-4 fw-bold">Login / Sign Up</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("catUser");
    location.reload();
}

// Fetch Data
const getAllCategories = async () => {
    fetch('http://localhost/RZregio.github.io/personalProjects/catEnFur/backend/categories.php')
        .then(response => response.json())
        .then(data => { categories = data; loadCategories(); })
        .catch(err => console.error("Error fetching categories:", err));
}

const getAllProducts = async (categoryID, categoryName) => {
    fetch('http://localhost/RZregio.github.io/personalProjects/catEnFur/backend/products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryID: categoryID })
    })
        .then(response => response.json())
        .then(data => { products = data; loadProducts(categoryName); })
        .catch(err => console.error("Error fetching products:", err));
}

// Render Categories
function loadCategories() {
    const categoriesContainer = document.getElementById("categories");
    let html = ``;
    categories.forEach(category => {
        html += `
            <div onclick="getAllProducts(${category.categoryID}, '${category.name}')" class="category-btn d-flex align-items-center gap-2">
                <img src="res/${category.image}.png" alt="${category.name}" style="width: 25px; height: 25px; object-fit: contain;">
                <span class="fw-medium text-white">${category.name}</span>
            </div>
        `;
    });
    if (categoriesContainer) categoriesContainer.innerHTML = html;
}

// Render Products (Responsive Grid Updated)
function loadProducts(categoryName) {
    const maincontainer = document.getElementById("maincontainer");
    let html = `<h2 class="mb-4 fredoka fw-bold"><i class="bi bi-box2-heart text-accent me-2"></i> ${categoryName}</h2><div class="row g-3">`;

    if (products.length === 0) {
        html += `<div class="col-12 text-center text-muted-cat mt-5"><i class="bi bi-emoji-frown fs-1 mb-2 d-block opacity-50"></i><h5>No products available.</h5></div>`;
    } else {
        products.forEach(content => {
            const desc = content.description || 'No description available.';
            const imgSrc = content.image ? `res/${content.image}.png` : '';
            let actionsHtml = '';

            if (content.isAvailable === false || content.isAvailable === "0") {
                actionsHtml = `<div class="text-danger fw-bold mt-auto"><small><i class="bi bi-x-circle"></i> Out of Stock</small></div>`;
            } else if (content.sizes && content.sizes.length > 0) {
                actionsHtml += `<div class="d-flex justify-content-center flex-wrap gap-2 mt-auto">`;
                content.sizes.forEach(size => {
                    const itemCode = `${content.code} ${size.code}`;
                    actionsHtml += `<button class="btn btn-outline-accent btn-sm rounded-pill flex-grow-1" onclick="openQuantityModal('${size.price}', '${itemCode}')">${size.code} - ₱${size.price}</button>`;
                });
                actionsHtml += `</div>`;
            } else {
                actionsHtml = `<button class="btn btn-accent btn-sm w-100 rounded-pill mt-auto fw-bold" onclick="openQuantityModal('${content.price}', '${content.code}')"><i class="bi bi-cart-plus me-1"></i> Buy - ₱${content.price}</button>`;
            }

            // Fixed grid: 1 card on mobile, 2 on SM, 3 on LG, 4 on XL
            html += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                    <div class="product-card h-100 p-3 d-flex flex-column text-center">
                        <div class="product-img-wrapper">${imgSrc ? `<img src="${imgSrc}">` : `<i class="bi bi-image text-muted fs-1"></i>`}</div>
                        <h6 class="fw-bold mb-2 text-white">${content.name}</h6>
                        <p class="text-muted-cat small mb-3 lh-sm" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${desc}</p>
                        ${actionsHtml}
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;
    maincontainer.innerHTML = html;
}

// === CART & MODAL LOGIC ===

function openQuantityModal(price, code) {
    currentItemCode = code;
    currentItemPrice = parseFloat(price);
    modalQuantity = 1;

    document.getElementById("modalItemName").innerText = code;
    document.getElementById("modalQty").innerText = modalQuantity;

    const qtyModal = new bootstrap.Modal(document.getElementById('quantityModal'));
    qtyModal.show();
}

function adjustModalQty(delta) {
    if (modalQuantity + delta >= 1) {
        modalQuantity += delta;
        document.getElementById("modalQty").innerText = modalQuantity;
    }
}

function confirmAddToCart() {
    if (cart[currentItemCode]) {
        cart[currentItemCode].qty += modalQuantity;
    } else {
        cart[currentItemCode] = { price: currentItemPrice, qty: modalQuantity };
    }

    bootstrap.Modal.getInstance(document.getElementById('quantityModal')).hide();
    renderReceipt();
}

// Receipt Editing
function adjustCartItem(code, delta) {
    if (cart[code]) {
        cart[code].qty += delta;
        if (cart[code].qty <= 0) delete cart[code];
        renderReceipt();
    }
}

function removeCartItem(code) {
    delete cart[code];
    renderReceipt();
}

// Render Receipt
function renderReceipt() {
    const receiptContainer = document.getElementById("receipt");
    const badge = document.getElementById("cartBadge");
    let total = 0;
    let totalQty = 0;
    let html = ``;

    const keys = Object.keys(cart);

    if (keys.length === 0) {
        receiptContainer.innerHTML = `<div id="empty-receipt" class="text-center text-muted-cat mt-5"><i class="bi bi-cart-x fs-1 opacity-50 mb-2 d-block"></i><small>Your cart is empty.</small></div>`;
        document.getElementById("totalValue").innerText = "0.00";
        if (badge) badge.style.display = 'none';
        return;
    }

    keys.forEach(code => {
        const item = cart[code];
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        totalQty += item.qty;

        html += `
            <div class="receipt-item d-flex flex-column mb-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small fw-bold text-truncate pe-2 text-white">${code}</span>
                    <i class="bi bi-trash-fill btn-remove" onclick="removeCartItem('${code}')"></i>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-qty" onclick="adjustCartItem('${code}', -1)">-</button>
                        <span class="small fw-semibold mx-1 text-white">${item.qty}</span>
                        <button class="btn btn-qty" onclick="adjustCartItem('${code}', 1)">+</button>
                    </div>
                    <span class="fw-semibold text-nowrap text-accent">₱${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    receiptContainer.innerHTML = html;
    document.getElementById("totalValue").innerText = total.toFixed(2);
    receiptContainer.scrollTop = receiptContainer.scrollHeight;

    // Update Mobile Badge
    if (badge) {
        badge.innerText = totalQty;
        badge.style.display = 'block';
    }
}

// === CHECKOUT LOGIC ===

function openCheckoutModal() {
    if (Object.keys(cart).length === 0) {
        const emptyModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
        emptyModal.show();
        return;
    }

    if (!currentUser) return alert("Please log in to checkout!");

    document.getElementById("checkoutTotal").innerText = document.getElementById("totalValue").innerText;
    document.getElementById("deliveryAddress").value = currentUser.address || "";

    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Smart simulated GPS Fetch
function autoLocate() {
    const input = document.getElementById("deliveryAddress");
    input.value = "Locating...";
    setTimeout(() => {
        input.value = "Santo Tomas, Batangas, Philippines";
    }, 800);
}

function processPurchase() {
    const address = document.getElementById("deliveryAddress").value;
    if (!address) return alert("Please enter a delivery address.");

    // Save to user history
    const orderRecord = {
        date: new Date().toLocaleDateString(),
        total: document.getElementById("totalValue").innerText,
        items: Object.keys(cart).map(k => `${cart[k].qty}x ${k}`)
    };
    currentUser.history.push(orderRecord);
    localStorage.setItem("catUser", JSON.stringify(currentUser));

    // Reset Cart
    cart = {};
    renderReceipt();

    // Hide checkout, show success
    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
    document.getElementById("successAddress").innerText = "Your items are on the way to " + address;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// === PROFILE LOGIC ===

function openProfile() {
    if (!currentUser) return;

    document.getElementById("profName").innerText = currentUser.name;
    document.getElementById("profEmail").innerText = currentUser.email;
    document.getElementById("profAddress").innerText = currentUser.address;
    document.getElementById("profBirth").innerText = currentUser.birthdate;

    const histContainer = document.getElementById("profHistory");
    if (currentUser.history.length === 0) {
        histContainer.innerHTML = `<p class="text-muted-cat small">No purchases yet.</p>`;
    } else {
        let hHtml = ``;
        [...currentUser.history].reverse().forEach(order => {
            hHtml += `
                <div class="total-box p-3 mb-2 rounded shadow-sm">
                    <div class="d-flex justify-content-between mb-1">
                        <small class="text-muted-cat">${order.date}</small>
                        <strong class="text-accent">₱${order.total}</strong>
                    </div>
                    <small class="d-block text-white opacity-75">${order.items.join(", ")}</small>
                </div>
            `;
        });
        histContainer.innerHTML = hHtml;
    }

    const profModal = new bootstrap.Modal(document.getElementById('profileModal'));
    profModal.show();
}