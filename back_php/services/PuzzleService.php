<?php
require_once '../repositories/PuzzleRepository.php';

class PuzzleService {
    private $puzzleRepository;

    public function __construct($db) {
        $this->puzzleRepository = new PuzzleRepository($db);
    }

    public function getRandomPuzzles($theme, $minRating, $maxRating, $count) {
        // Additional business logic can go here if needed.
        if ($theme === "Divers") {
            $theme = null; // Apply the same logic you had in Spring Boot
        }

        // Call the repository to fetch puzzles
        return $this->puzzleRepository->findRandomPuzzles($theme, $minRating, $maxRating, $count);
    }
}
