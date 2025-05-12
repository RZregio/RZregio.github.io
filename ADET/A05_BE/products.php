<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include("connect.php");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        handleGet($pdo, $input);
        break;
    default:
        echo json_encode(['message' => 'Invalid request method']);
        break;
}

function handleGet($pdo, $input)
{
    $sql = "SELECT * FROM products WHERE categoryID = :categoryID";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['categoryID' => $input['categoryID']]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($products as &$product) {
        $sizeStmt = $pdo->prepare("SELECT code, price FROM product_sizes WHERE productID = :productID");
        $sizeStmt->execute(['productID' => $product['productID']]);
        $sizes = $sizeStmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($sizes) > 1) {
            $product['sizes'] = $sizes;
        } else if (count($sizes) === 1) {
            $product['price'] = $sizes[0]['price'];
            $product['sizes'] = null;
        } else {
            $product['sizes'] = null;
        }

        $product['isAvailable'] = strtolower($product['isAvailable']) === '1' || strtolower($product['isAvailable']) === 'true';
    }

    echo json_encode($products);
}
?>