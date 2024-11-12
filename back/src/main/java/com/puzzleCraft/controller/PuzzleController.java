package com.puzzleCraft.controller;

import com.puzzleCraft.models.Puzzle;
import com.puzzleCraft.services.PuzzleService; // Import your service

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired; // Ensure you have this import
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/puzzles")
@CrossOrigin(origins = "http://localhost:3000") // Allow CORS for this controller
public class PuzzleController {

    private final PuzzleService puzzleService;
    private static final Logger logger = LoggerFactory.getLogger(PuzzleController.class);


    @Autowired
    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping
    public List<Puzzle> getRandomPuzzles(
            @RequestParam(required = false) String theme,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(defaultValue = "5") int count) {
        
        logger.info("Received parameters - Theme: {}, Min Rating: {}, Max Rating: {}, Count: {}", theme, minRating, maxRating, count);
        return puzzleService.getRandomPuzzles(theme, minRating, maxRating, count);
    }

}
