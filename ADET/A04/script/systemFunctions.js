var total = 0;
var receiptItems = {};

function loadCategories() {
    var categoriesContainer = document.getElementById("categories");

    products.forEach(function(product, index) {
        categoriesContainer.innerHTML += 
          '<div onclick="loadProducts(' + index + ')" class="card d-flex align-items-center flex-row mx-1 custom-button p-2">' +
            '<img src="res/' + product.image + '.png" alt="' + product.category + '" style="width: 30px; height: 30px; object-fit: contain; margin-right: 10px;">' +
            '<small>' + product.category + '</small>' +
          '</div>';
    });
}


function loadProducts(categoryIndex) {
    var maincontainer = document.getElementById("maincontainer");
    maincontainer.innerHTML = 
    '<h2 class="text-center mb-4">' + products[categoryIndex].category + '</h2>' +
    '<div class="row justify-content-center"></div>';
    var row = maincontainer.querySelector(".row");

    products[categoryIndex].contents.forEach(function(content) {
        var productHTML = 
        '<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">' + 
            '<div class="itemCard card h-100 text-center p-3" style="background-color: rgb(40, 40, 40);">' +
                (content.image ? '<img src="res/' + content.image + '.png" class="mb-3 mx-auto" style="max-height: 100px; max-width: 100%; object-fit: contain;">' : '') +
                '<h6 class="mb-1 fw-bold">' + content.name + '</h6>' +
                '<p class="text-muted mb-2" style="min-height: 100px;"><small>' + (content.description ? content.description : 'No description available.') + '</small></p>';

        if (content.isAvailable === false) {
            productHTML += 
                '<div class="text-danger"><small>Product Unavailable</small></div>';
        } else if (content.sizes) {
            productHTML += '<div class="d-flex justify-content-center flex-wrap gap-2">';
            content.sizes.forEach(function(size) {
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

    setTimeout(() =>{
        message.style.display = 'none';
    }, 2000);
  }

  
loadCategories();
document.getElementById("maincontainer").innerHTML = '<h2 class="text-center text-muted">Select Category Above</h2>';
