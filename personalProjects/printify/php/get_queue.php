<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

require_once 'connect.php';

$serverResponse = [
    "success" => false,
    "data" => []
];

// FIXED: Added paper_size and margins to the query string
$queueQuery = "SELECT id, requester_name, file_path, pages, paper_size, margins, copies, color, status, created_at 
               FROM queue 
               WHERE status != 'Done' 
               ORDER BY id ASC";

if ($result = $conn->query($queueQuery)) {
    $activeQueueList = [];
    
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['copies'] = (int)$row['copies'];
        
        $activeQueueList[] = $row;
    }
    
    $serverResponse["success"] = true;
    $serverResponse["data"] = $activeQueueList;
    
    $result->free();
} else {
    $serverResponse["message"] = "Database error query execution.";
}

echo json_encode($serverResponse);
?>