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
$themes = isset($_GET['theme']) ? explode(",", $_GET['theme']) : null;
$minRating = $_GET['minRating'] ?? 1;
$maxRating = $_GET['maxRating'] ?? 3000;
$count = $_GET['count'] ?? 5;

try {
    // Fetch puzzles with multiple themes
// Nouveau : on récupère tout (puzzles + themes) en une seule variable
$responseData = $puzzleService->getRandomPuzzles($themes, $minRating, $maxRating, $count);

echo json_encode([
    'status' => 'success',
    'data' => [
        'puzzles' => $responseData['puzzles'],
        'themes'  => $responseData['themes']
    ]
]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
