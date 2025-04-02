<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/jwtCheckToken.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$user_id = authenticate();
if (!$user_id) {
    echo json_encode(["message" => "Грешка при удостоверяване."]);
    exit;
} // Проверява токена и връща user_id

$userData = $user->getUserById($user_id);;
unset($userData['password_hash']); // Премахваме паролата от отговора

echo json_encode(["user" => $userData]);
?>
