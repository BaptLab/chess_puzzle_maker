<?php
header("Access-Control-Allow-Origin: *"); // Adjust origin for production
header("Content-Type: application/json");

require_once '../config/database.php';
require_once '../services/PuzzleService.php';

// Initialize database connection
$database = new Database();
$db = $database->connect();

// Initialize service
$puzzleService = new PuzzleService($db);

// Retrieve query parameters (with default values if not provided)
$theme = $_GET['theme'] ?? null;
$minRating = $_GET['minRating'] ?? 1;
$maxRating = $_GET['maxRating'] ?? 3000;
$count = $_GET['count'] ?? 5;

try {
    // Fetch puzzles from the service
    $puzzles = $puzzleService->getRandomPuzzles($theme, $minRating, $maxRating, $count);
    
    // Return JSON response
    echo json_encode([
        'status' => 'success',
        'data' => $puzzles
    ]);

} catch (Exception $e) {
    // Handle any errors and return a JSON error message
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
