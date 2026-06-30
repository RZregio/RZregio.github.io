<?php
header("Content-Type: application/json; charset=UTF-8");
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate inputs
    $requesterName = trim($_POST['requester']);
    $printCopies = filter_input(INPUT_POST, 'copies', FILTER_VALIDATE_INT);
    $colorMode = trim($_POST['color']);
    $pagesToPrint = trim($_POST['pages']);
    $paperSize = trim($_POST['paperSize']);
    $margins = trim($_POST['margins']);

    if (empty($requesterName) || !$printCopies || empty($colorMode) || empty($pagesToPrint)) {
        echo json_encode(["success" => false, "message" => "Invalid form submission."]);
        exit();
    }

    $serverUploadDirectory = "../uploads/";
    $databaseFilePath = "uploads/";

    if (!file_exists($serverUploadDirectory)) {
        mkdir($serverUploadDirectory, 0777, true);
    }

    $fileExtension = strtolower(pathinfo($_FILES["document"]["name"], PATHINFO_EXTENSION));

    if ($fileExtension !== "pdf") {
        echo json_encode(["success" => false, "message" => "Only PDF files are allowed."]);
        exit();
    }

    $uniqueFileName = time() . "_" . basename($_FILES["document"]["name"]);
    $serverTargetFile = $serverUploadDirectory . $uniqueFileName;
    $databaseTargetFile = $databaseFilePath . $uniqueFileName;

    if (move_uploaded_file($_FILES["document"]["tmp_name"], $serverTargetFile)) {

        /* -----
        Updated Insert Query with paper_size and margins
        ----- */
        $insertQuery = "INSERT INTO queue (requester_name, file_path, pages, paper_size, margins, copies, color) VALUES (?, ?, ?, ?, ?, ?, ?)";

        if ($stmt = $conn->prepare($insertQuery)) {
            // Bind parameters: sssssis (5 strings, 1 integer, 1 string)
            $stmt->bind_param("sssssis", $requesterName, $databaseTargetFile, $pagesToPrint, $paperSize, $margins, $printCopies, $colorMode);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "id" => $stmt->insert_id, "filePath" => $databaseTargetFile]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error."]);
            }
            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Statement preparation failed."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "File upload failed."]);
    }
}
?>