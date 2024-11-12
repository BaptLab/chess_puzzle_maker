package com.puzzleCraft.repositories;

import com.puzzleCraft.models.Puzzle;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuzzleRepository extends JpaRepository<Puzzle, String> {

    @Query("SELECT p FROM Puzzle p WHERE " +
           "(:theme IS NULL OR p.themes LIKE %:theme%) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:maxRating IS NULL OR p.rating <= :maxRating) " +
           "ORDER BY RAND()")
    List<Puzzle> findRandomPuzzles(
            @Param("theme") String theme,
            @Param("minRating") Integer minRating,
            @Param("maxRating") Integer maxRating,
            Pageable pageable); // Use Pageable for limiting results
}
