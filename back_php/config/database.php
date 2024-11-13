<?php

class Database {
    private $conn;

    public function loadEnv() {
        // Read the .env file line by line
        $lines = file(__DIR__ . '/../.env');
        foreach ($lines as $line) {
            // Skip empty lines and lines that start with a comment (#)
            if (!empty($line) && strpos(trim($line), '#') !== 0) {
                // Parse the line into key and value
                list($key, $value) = explode('=', trim($line), 2);
                // Store in PHP environment
                putenv("$key=$value");
            }
        }
    }

    public function connect() {
        // Load environment variables
        $this->loadEnv();
    
        // Use environment variables
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbName = getenv('DB_NAME');
        $username = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');
    
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=$host;port=$port;dbname=$dbName", $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Remove any output here to ensure clean JSON responses
        } catch (PDOException $e) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Connection error: ' . $e->getMessage()
            ]);
            exit; // Stop further execution if the connection fails
        }
        return $this->conn;
    }
    
}
