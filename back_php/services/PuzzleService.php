<?php
require_once '../repositories/PuzzleRepository.php';

class PuzzleService {
    private $puzzleRepository;
    private $themeDefinitions;
    private $themeTranslations = [
        "Pion avancé" => "advancedPawn",
        "Avantage" => "advantage",
        "Mat arabe" => "arabianMate",
        "Attaque sur f2 f7" => "attackingF2F7",
        "Attraction" => "attraction",
        "Mat sur la dernière rangée" => "backRankMate",
        "Finale de fou" => "bishopEndgame",
        "Mat de Boden" => "bodenMate",
        "Prise du défenseur" => "capturingDefender",
        "Découverte" => "clearance",
        "Écrasement" => "crushing",
        "Défense" => "defensiveMove",
        "Déviation" => "deflection",
        "Attaque à la découverte" => "discoveredAttack",
        "Mat avec deux fous" => "doubleBishopMate",
        "Échec double" => "doubleCheck",
        "En passant" => "enPassant",
        "Finale" => "endgame",
        "Égalité" => "equality",
        "Roi exposé" => "exposedKing",
        "Fourchette" => "fork",
        "Pièce en prise" => "hangingPiece",
        "Mat du crochet" => "hookMate",
        "Interférence" => "interference",
        "Intermezzo" => "intermezzo",
        "Attaque sur l'aile roi" => "kingsideAttack",
        "Finale de cavalier" => "knightEndgame",
        "Problème long" => "long",
        "Maître" => "master",
        "Maître contre maître" => "masterVsMaster",
        "Mat" => "mate",
        "Mat en 1" => "mateIn1",
        "Mat en 2" => "mateIn2",
        "Mat en 3" => "mateIn3",
        "Mat en 4" => "mateIn4",
        "Milieu de jeu" => "middlegame",
        "Un coup" => "oneMove",
        "Ouverture" => "opening",
        "Finale de pions" => "pawnEndgame",
        "Clouage" => "pin",
        "Promotion" => "promotion",
        "Finale de dames" => "queenEndgame",
        "Finale de dames et tours" => "queenRookEndgame",
        "Attaque sur l'aile dame" => "queensideAttack",
        "Coup silencieux" => "quietMove",
        "Finale de tours" => "rookEndgame",
        "Sacrifice" => "sacrifice",
        "Court" => "short",
        "Enfilade" => "skewer",
        "Mat à l'étouffé" => "smotheredMate",
        "Super grand maître" => "superGM",
        "Pièce enfermée" => "trappedPiece",
        "Très long" => "veryLong",
        "Rayon X" => "xRayAttack",
        "Zugzwang" => "zugzwang"
    ];

    public function __construct($db) {
        $this->puzzleRepository = new PuzzleRepository($db);
        $this->themeDefinitions = require __DIR__ . '/../config/ThemeDefinitions.php';
    }

    public function getRandomPuzzles($themes, $minRating, $maxRating, $count) {
        // Traduire les thèmes
        if (is_array($themes)) {
            $translatedThemes = array_map(function($theme) {
                return $this->themeTranslations[$theme] ?? null;
            }, $themes);
            $translatedThemes = array_filter($translatedThemes);
        } else {
            $translatedThemes = null;
        }

        // Récupérer les puzzles
        $puzzles = $this->puzzleRepository->findRandomPuzzles($translatedThemes, $minRating, $maxRating, $count);

        // Ajouter les définitions pour les thèmes demandés
        $themesInfo = [];
        foreach ($translatedThemes as $key) {
            if (isset($this->themeDefinitions[$key])) {
                $themesInfo[$key] = $this->themeDefinitions[$key];
            }
        }

        return [
            'puzzles' => $puzzles,
            'themes' => $themesInfo
        ];
    }
}
