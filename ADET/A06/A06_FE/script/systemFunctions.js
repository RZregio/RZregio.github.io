var total = 0;
var receiptItems = {};
var categories = [];
var products = [];

const getAllCategories = async () => {
    fetch(
        'http://localhost/RZregio.github.io/ADET/A06/A06_BE/categories.php'
    )
        .then(response => response.json())
        .then(data => {
            categories = data;
            loadCategories();
        });
}

const getAllProducts = async (categoryID, categoryName) => {
    const categoryData = {
        categoryID: categoryID
    };

    fetch(
        'http://localhost/RZregio.github.io/ADET/A06/A06_BE/products.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
    })
        .then(response => response.json())
        .then(data => {
            products = data;
            loadProducts(categoryName);
        });
}


function loadCategories() {
    var categoriesContainer = document.getElementById("categories");

    categoriesContainer.innerHTML = 
                '<img src="res/home.png"' +
                  'style="max-height: 50px; max-width: 100%; object-fit: contain; padding-right: 10px;">' +
                '<a href="../../index.html" class="my-auto">' +
                '<h1 class="title">CatEnFur</h1>' +
                '</a>';
    categories.forEach(function (category, index) {
        categoriesContainer.innerHTML +=
            '<div onclick="getAllProducts(' + category.categoryID +', \'' + category.name + '\')" class="card d-flex align-items-center flex-row mx-1 custom-button p-2">' +
            '<img src="res/' + category.image + '.png" alt="' + category.name + '" style="width: 30px; height: 30px; object-fit: contain; margin-right: 10px;">' +
            '<small>' + category.name + '</small>' +
            '</div>';
    });
}



function loadProducts(categoryName) {
    var maincontainer = document.getElementById("maincontainer");
    maincontainer.innerHTML =
        '<h2 class="text-center mb-4">'+ categoryName +'</h2>' +
        '<div class="row justify-content-center"></div>';
    var row = maincontainer.querySelector(".row");

    if (products.length === 0) {
        row.innerHTML = '<div class="text-center text-muted">No products available.</div>';
        return;
    }

    products.forEach(function (content) {
        var productHTML =
            '<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">' +
            '<div class="itemCard card h-100 text-center p-3" style="background-color: rgb(40, 40, 40);">' +
            (content.image ? '<img src="res/' + content.image + '.png" class="mb-3 mx-auto" style="max-height: 100px; max-width: 100%; object-fit: contain;">' : '') +
            '<h6 class="mb-1 fw-bold">' + content.name + '</h6>' +
            '<p class="text-muted mb-2" style="min-height: 100px;"><small>' + (content.description ? content.description : 'No description available.') + '</small></p>';

        if (content.isAvailable === false || content.isAvailable === "0") {
            productHTML +=
                '<div class="text-danger"><small>Product Unavailable</small></div>';
        } else if (content.sizes) {
            productHTML += '<div class="d-flex justify-content-center flex-wrap gap-2">';
            content.sizes.forEach(function (size) {
                productHTML +=
                    '<button class="btnSize btn btn-sm btn-outline-primary mb-1" onclick="addToReceipt(\'' + size.price + '\', \'' + content.code + size.code + '\')">' +
                    size.code + ' - ₱' + size.price +
                    '</button>';
            });
            productHTML += '</div>';
        } else {
            productHTML +=
                '<button class="btnBuy btn btn-sm btn-primary mt-2" onclick="addToReceipt(\'' + content.price + '\', \'' + content.code + '\')">' +
                'Buy - ₱' + content.price +
                '</button>';
        }

        productHTML += '</div></div>';
        row.innerHTML += productHTML;
    });
}



function addToReceipt(price, code) {
    var receiptContainer = document.getElementById("receipt");
    total = parseFloat(total) + parseFloat(price);

    var totalValueElement = document.getElementById("totalValue");
    totalValueElement.innerHTML = total.toFixed(2);

    receiptContainer.innerHTML +=
        '<div class="d-flex flex-row justify-content-between">' +
        '<div><small>' + code + '</small></div>' +
        '<div><small>₱' + parseFloat(price).toFixed(2) + '</small></div>' +
        '</div>';
}

function resetReceipt() {
    total = 0;
    document.getElementById("totalValue").innerHTML = total.toFixed(2);
    document.getElementById("receipt").innerHTML = '';
    const message = document.getElementById("transactionMessage");
    message.style.display = 'block';

    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}


loadCategories();
getAllCategories();
document.getElementById("maincontainer").innerHTML = '<h2 class="text-center text-muted">Select Category Above</h2>';
