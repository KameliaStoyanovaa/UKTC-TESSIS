<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Дебъг – виж какво получаваш като action
file_put_contents('debug.log', print_r($_GET, true), FILE_APPEND);

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/jwt.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$requestMethod = $_SERVER["REQUEST_METHOD"];
//if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//    http_response_code(200);
//    exit();
//}

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
    // Във файла auth.php

if ($_GET['action'] == 'update_status') {
    if (!empty($data->userId) && !empty($data->status)) {

        $lastStatus = $user->getLastStatus($data->userId);

        if ($lastStatus === 'enrolled' && $data->status === 'enrolled') {
            echo json_encode(["message" => "Вече сте записани."]);
            exit;
        }

        if ($lastStatus === 'unenrolled' && $data->status === 'unenrolled') {
            echo json_encode(["message" => "Вече сте отписани."]);
            exit;
        }

        // Ако отписваш, локацията е задължителна
        $location = $data->status === 'unenrolled' ? trim($data->location ?? '') : null;

        if ($data->status === 'unenrolled' && empty($location)) {
            echo json_encode(["message" => "Моля, въведете локация при отписване."]);
            exit;
        }

        if ($user->updateStudentStatus($data->userId, $data->status, $location)) {
            echo json_encode(["message" => "Статусът е успешно актуализиран."]);
        } else {
            echo json_encode(["message" => "Грешка при записване."]);
        }
    } else {
        echo json_encode(["message" => "Всички полета са задължителни."]);
    }
}
elseif ($_GET['action'] === 'get_status_lists') {

    $students = $user->getLatestStatuses();

    file_put_contents('debug.log', print_r($students, true), FILE_APPEND);

    $enrolled = [];
    $unenrolled = [];

    foreach ($students as $s) {
        if ($s['status'] === 'enrolled') {
            $enrolled[] = $s;
        } elseif ($s['status'] === 'unenrolled') {
            $unenrolled[] = $s;
        }
    }

    echo json_encode([
        "enrolled" => $enrolled,
        "unenrolled" => $unenrolled
    ]);
    exit;

}

}
?>
    
