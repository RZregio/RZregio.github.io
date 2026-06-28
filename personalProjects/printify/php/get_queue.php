<?php
/* -----
Set strict headers for JSON API access
Restricting methods to GET improves security
----- */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

require_once 'connect.php';

// Prepare standardized response array
$serverResponse = [
    "success" => false,
    "data" => []
];

/* -----
Fetch active queue, ordering by oldest first.
We include created_at for potential UI sorting/display.
----- */
$queueQuery = "SELECT id, requester_name, file_path, pages, copies, color, status, created_at 
               FROM queue 
               WHERE status != 'Done' 
               ORDER BY id ASC";

if ($result = $conn->query($queueQuery)) {
    $activeQueueList = [];
    
    while ($row = $result->fetch_assoc()) {
        // Explicitly cast numeric fields to prevent JS strict-type errors in React Native
        $row['id'] = (int)$row['id'];
        $row['copies'] = (int)$row['copies'];
        
        $activeQueueList[] = $row;
    }
    
    $serverResponse["success"] = true;
    $serverResponse["data"] = $activeQueueList;
    
    $result->free();
} else {
    // Return a generic error message; never expose raw SQL errors to the client
    $serverResponse["message"] = "Failed to retrieve the print queue.";
}

$conn->close();

// Output formatted JSON
echo json_encode($serverResponse);
exit();
?>