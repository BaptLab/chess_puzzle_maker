<?php
require_once '../repositories/PuzzleRepository.php';

class PuzzleService {
    private $puzzleRepository;

    public function __construct($db) {
        $this->puzzleRepository = new PuzzleRepository($db);
    }

    // Translation map for themes from French to English
    private $themeTranslations = [
        "pion avancé" => "advancedPawn",
        "avantage" => "advantage",
        "mat arabe" => "arabianMate",
        "attaque F2F7" => "attackingF2F7",
        "attraction" => "attraction",
        "mat derrière" => "backRankMate",
        "finale de fou" => "bishopEndgame",
        "mat de Boden" => "bodenMate",
        "prise défenseur" => "capturingDefender",
        "dégagement" => "clearance",
        "écrasement" => "crushing",
        "défense" => "defensiveMove",
        "déviation" => "deflection",
        "attaque découverte" => "discoveredAttack",
        "mat double fou" => "doubleBishopMate",
        "échec double" => "doubleCheck",
        "en passant" => "enPassant",
        "finale" => "endgame",
        "égalité" => "equality",
        "roi exposé" => "exposedKing",
        "fourchette" => "fork",
        "pièce en prise" => "hangingPiece",
        "mat crochet" => "hookMate",
        "interférence" => "interference",
        "intermezzo" => "intermezzo",
        "attaque aile roi" => "kingsideAttack",
        "finale de cavalier" => "knightEndgame",
        "long" => "long",
        "maître" => "master",
        "maître contre maître" => "masterVsMaster",
        "mat" => "mate",
        "mat en 1" => "mateIn1",
        "mat en 2" => "mateIn2",
        "mat en 3" => "mateIn3",
        "mat en 4" => "mateIn4",
        "milieu de jeu" => "middlegame",
        "un coup" => "oneMove",
        "ouverture" => "opening",
        "finale de pions" => "pawnEndgame",
        "clouage" => "pin",
        "promotion" => "promotion",
        "finale de dame" => "queenEndgame",
        "finale de dame et tour" => "queenRookEndgame",
        "attaque aile dame" => "queensideAttack",
        "coup silencieux" => "quietMove",
        "finale de tour" => "rookEndgame",
        "sacrifice" => "sacrifice",
        "court" => "short",
        "enfilade" => "skewer",
        "mat étouffé" => "smotheredMate",
        "super grand maître" => "superGM",
        "pièce piégée" => "trappedPiece",
        "très long" => "veryLong",
        "rayon X" => "xRayAttack",
        "zugzwang" => "zugzwang"
    ];

    public function getRandomPuzzles($themes, $minRating, $maxRating, $count) {
        // Translate each theme if it's provided
        if (is_array($themes)) {
            $translatedThemes = array_map(function($theme) {
                return $this->themeTranslations[$theme] ?? null;
            }, $themes);
            $translatedThemes = array_filter($translatedThemes); // Remove null values
        } else {
            $translatedThemes = null;
        }
    
        // Call the repository to fetch puzzles with multiple themes
        return $this->puzzleRepository->findRandomPuzzles($translatedThemes, $minRating, $maxRating, $count);
    }
    
}
