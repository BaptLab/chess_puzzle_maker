<?php

class Database {
    private $conn;

    public function loadEnv() {
        $envPath = __DIR__ . '/../.env';
        error_log("Loading env from: $envPath");

        if (!file_exists($envPath)) {
            error_log("ERROR: .env file not found");
            return;
        }

        $lines = file($envPath);
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || strpos($trimmed, '#') === 0) continue;

            list($key, $value) = explode('=', $trimmed, 2);
            putenv("$key=$value");
            error_log("Set env $key=$value");
        }
    }

    public function connect() {
        $this->loadEnv();

        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbName = getenv('DB_NAME');
        $username = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');

        error_log("Trying DB connection with host=$host, port=$port, db=$dbName, user=$username");

        $this->conn = null;
        try {
            $dsn = "mysql:host=$host;port=$port;dbname=$dbName";
            error_log("DSN: $dsn");
            $this->conn = new PDO($dsn, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            error_log("DB connection successful");
        } catch (PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            echo json_encode([
                'status' => 'error',
                'message' => 'Connection error: ' . $e->getMessage()
            ]);
            exit;
        }
        return $this->conn;
    }
}
