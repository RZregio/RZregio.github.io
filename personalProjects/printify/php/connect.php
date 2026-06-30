<?php
$dbhost = "sql307.infinityfree.com";
$dbuser = "if0_41619039";
$dbpass = "JNTQugLEk2GV";
$db = "if0_41619039_printdb"; // Ensure you run the CREATE TABLE query inside this database

$conn = new mysqli($dbhost, $dbuser, $dbpass, $db);

if ($conn->connect_error) {
    die("Connect failed: " . $conn->connect_error);
}

try {
    $pdo = new PDO("mysql:host=$dbhost;dbname=$db", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

function executeQuery($query)
{
    $conn = $GLOBALS['conn'];
    return mysqli_query($conn, $query);
}
?>