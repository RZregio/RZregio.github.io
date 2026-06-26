<?php
// Set headers so your Expo app running on your phone can read localhost securely
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'connect.php';

// Select active print jobs using your database connection
$sql = "SELECT id, requester_name, file_path, copies, color, status FROM queue WHERE status != 'Done' ORDER BY id ASC";
$result = $conn->query($sql);

$queue = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $queue[] = $row;
    }
}

echo json_encode($queue);
$conn->close();
?>