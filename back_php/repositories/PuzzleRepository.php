<?php
class PuzzleRepository {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findRandomPuzzles($themes, $minRating, $maxRating, $count) {
        try {
            // Base query
            $query = "SELECT * FROM puzzle_craft_db WHERE rating >= :minRating AND rating <= :maxRating";

            // Add conditions for themes
            if ($themes) {
                foreach ($themes as $index => $theme) {
                    $query .= " AND themes LIKE :theme$index";
                }
            }
            $query .= " ORDER BY RAND() LIMIT :count";

            // Prepare the statement
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":minRating", $minRating, PDO::PARAM_INT);
            $stmt->bindParam(":maxRating", $maxRating, PDO::PARAM_INT);
            $stmt->bindParam(":count", $count, PDO::PARAM_INT);

            // Bind theme values
            if ($themes) {
                foreach ($themes as $index => $theme) {
                    $stmt->bindValue(":theme$index", "%$theme%", PDO::PARAM_STR);
                }
            }

            // Execute the statement
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Handle case where no puzzles are found
            if (empty($results)) {
                throw new Exception("Can't find problems with these parameters.");
            }

            return $results;

        } catch (PDOException $e) {
            // Handle database access issues
            return [
                'error' => true,
                'message' => "Can't access the database: " . $e->getMessage()
            ];
        } catch (Exception $e) {
            // Handle other issues
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }
}
