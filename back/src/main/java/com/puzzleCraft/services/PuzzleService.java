package com.puzzleCraft.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.puzzleCraft.controller.PuzzleController;
import com.puzzleCraft.models.Puzzle;
import com.puzzleCraft.repositories.PuzzleRepository;

import java.util.List;

@Service
public class PuzzleService {

    @Autowired
    private PuzzleRepository puzzleRepository;
    private static final Logger logger = LoggerFactory.getLogger(PuzzleController.class);

    public List<Puzzle> getRandomPuzzles(String theme, Integer minRating, Integer maxRating, int count) {
        
        // Set default rating values if parameters are null
        if (minRating == null) {
            minRating = 1;
        }
        if (maxRating == null) {
            maxRating = 3000;
        }
        
        // Set theme to blank if it’s set to "Divers"
        if ("Divers".equals(theme)) {
            theme = "";
        }

        Pageable pageable = PageRequest.of(0, count);

        // Retrieve puzzles
        List<Puzzle> puzzles = puzzleRepository.findRandomPuzzles(theme, minRating, maxRating, pageable);

        // Log the result
        logger.info("Retrieved puzzles: {}", puzzles);

        return puzzles;
    }
}
