<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$authMiddleware = new AuthMiddleware();

// Извличане на всички потребители (за администратор)
function getAllUsers() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, email, role FROM users");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

