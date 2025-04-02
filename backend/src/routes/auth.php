<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/jwt.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    if ($_GET['action'] == 'register') {
        if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {
            if ($user->createUser($data->name, $data->email, $data->password, $data->role)) {
                // Взимаме ID на новия потребител
                $userData = $user->getUserByEmail($data->email);
                $token = JwtHandler::generateToken($userData['id']);

                echo json_encode([
                    "message" => "Регистрацията е успешна.",
                    "token" => $token
                ]);
            } else {
                echo json_encode(["message" => "Грешка при регистрация."]);
            }
        } else {
            echo json_encode(["message" => "Всички полета са задължителни."]);
        }
    } elseif ($_GET['action'] == 'login') {
        if (!empty($data->email) && !empty($data->password)) {
            $userData = $user->getUserByEmail($data->email);
            if ($userData && password_verify($data->password, $userData['password_hash'])) {
                $token = JwtHandler::generateToken($userData['id']);
                echo json_encode(["message" => "Входът е успешен.", "token" => $token]);
            } else {
                echo json_encode(["message" => "Грешен email или парола."]);
            }
        } else {
            echo json_encode(["message" => "Всички полета са задължителни."]);
        }
    }
} else {
    echo json_encode(["message" => "Методът не е позволен."]);
}
?>
