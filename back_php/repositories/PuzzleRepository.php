<?php
class PuzzleRepository {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findRandomPuzzles($theme, $minRating, $maxRating, $count) {
        $theme = $theme ? "%$theme%" : null; // Adding wildcards for LIKE clause
    
        $query = "SELECT * FROM puzzle_craft_db WHERE 
                  (:theme IS NULL OR themes LIKE :theme) AND
                  (:minRating IS NULL OR rating >= :minRating) AND
                  (:maxRating IS NULL OR rating <= :maxRating)
                  ORDER BY RAND() LIMIT :count";
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':theme', $theme, PDO::PARAM_STR);
        $stmt->bindParam(':minRating', $minRating, PDO::PARAM_INT);
        $stmt->bindParam(':maxRating', $maxRating, PDO::PARAM_INT);
        $stmt->bindParam(':count', $count, PDO::PARAM_INT);
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}
