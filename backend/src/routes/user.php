<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/jwtCheckToken.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Токенът се верифицира в middleware (jwtCheckToken.php), така че тук просто взимаме потребителското ID.
$user_id = authenticate();  // Проверява токена и връща user_id

if (!$user_id) {
    echo json_encode(["message" => "Грешка при удостоверяване."]);
    exit;
}

// Получаваме данни за потребителя от базата, като премахваме паролата от отговора.
$userData = $user->getUserById($user_id);
unset($userData['password_hash']); // Премахваме паролата от отговора

// Връщаме данните за потребителя.
echo json_encode(["user" => $userData]);

