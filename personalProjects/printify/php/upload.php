<?php
// Include your standard database connection layout
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $conn->real_escape_string($_POST['requester']);
    $copies = (int)$_POST['copies'];
    $color = $conn->real_escape_string($_POST['color']);
    
    $target_dir = "uploads/";
    
    // Create the uploads folder automatically if it doesn't exist locally yet
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $file_name = time() . "_" . basename($_FILES["document"]["name"]);
    $target_file = $target_dir . $file_name;
    
    if (strtolower(pathinfo($target_file, PATHINFO_EXTENSION)) != "pdf") {
        die("Error: Only PDF files are allowed.");
    }

    if (move_uploaded_file($_FILES["document"]["tmp_name"], $target_file)) {
        // Using your connection's $conn object
        $sql = "INSERT INTO queue (requester_name, file_path, copies, color) VALUES ('$name', '$target_file', $copies, '$color')";
        if ($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id;
            header("Location: index.html?id=" . $last_id);
            exit();
        }
    }
}
?>