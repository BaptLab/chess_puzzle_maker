<?php
class PuzzleRepository {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findRandomPuzzles($themes, $minRating, $maxRating, $count) {
        $query = "SELECT * FROM puzzle_craft_db WHERE rating >= :minRating AND rating <= :maxRating";
    
        if ($themes) {
            foreach ($themes as $index => $theme) {
                $query .= " AND themes LIKE :theme$index";
            }
        }
        $query .= " ORDER BY RAND() LIMIT :count";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":minRating", $minRating, PDO::PARAM_INT);
        $stmt->bindParam(":maxRating", $maxRating, PDO::PARAM_INT);
        $stmt->bindParam(":count", $count, PDO::PARAM_INT);
    
        if ($themes) {
            foreach ($themes as $index => $theme) {
                $stmt->bindValue(":theme$index", "%$theme%", PDO::PARAM_STR);
            }
        }
    
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    
}
