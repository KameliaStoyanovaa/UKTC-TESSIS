<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createUser($name, $email, $password, $role) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $query = "INSERT INTO " . $this->table . " (full_name, email, password_hash, role) VALUES (:name, :email, :password, :role)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":role", $role);

        return $stmt->execute();
    }

    public function getUserByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserById($id) {
        $query = "SELECT * FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // Във файла models/User.php

    public function updateStudentStatus($userId, $status, $location = null) {
        if ($status === 'unenrolled') {
            $query = "INSERT INTO student_status (student_id, status, location) VALUES (:student_id, :status, :location)";
        } else {
            $query = "INSERT INTO student_status (student_id, status) VALUES (:student_id, :status)";
        }
    
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':student_id', $userId);
        $stmt->bindParam(':status', $status);
    
        if ($status === 'unenrolled') {
            $stmt->bindParam(':location', $location);
        }
    
        return $stmt->execute();
    }
    
public function getLastStatus($userId) {
    $stmt = $this->conn->prepare("SELECT status FROM student_status WHERE student_id = :id ORDER BY timestamp DESC LIMIT 1");
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['status'] : null;
}
}
?>
