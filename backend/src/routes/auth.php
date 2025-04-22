<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../middleware/jwtCheckToken.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$requestMethod = $_SERVER["REQUEST_METHOD"];

// === POST заявки ===
if ($requestMethod == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    // РЕГИСТРАЦИЯ
    if ($_GET['action'] == 'register') {
        if (!empty($data->name) && !empty($data->email) && !empty($data->password) && !empty($data->role)) {
            if ($user->createUser($data->name, $data->email, $data->password, $data->role)) {
                $userData = $user->getUserByEmail($data->email);
                $token = JwtHandler::generateToken($userData['id']);
                echo json_encode(["message" => "Регистрацията е успешна.", "token" => $token]);
            } else {
                echo json_encode(["message" => "Грешка при регистрация."]);
            }
        } else {
            echo json_encode(["message" => "Всички полета са задължителни."]);
        }
        exit;
    }

    // ВХОД
    if ($_GET['action'] == 'login') {
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
        exit;
    }

    // Актуализация на статус
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
        exit;
    }
}

// === GET заявки ===
if ($requestMethod == "GET" && $_GET['action'] == 'get_week_records') {
    $user_id = authenticate(); // проверка на токен

    $startOfWeek = date("Y-m-d 00:00:00", strtotime("monday this week"));
    $endOfWeek = date("Y-m-d 23:59:59", strtotime("sunday this week"));

    $sql = "
    SELECT u.id, u.full_name, u.email, ss.status, ss.timestamp, ss.location
    FROM student_status ss
    INNER JOIN (
        SELECT student_id, MAX(timestamp) AS latest_time
        FROM student_status
        WHERE timestamp BETWEEN '$startOfWeek' AND '$endOfWeek'
        GROUP BY student_id
    ) latest ON ss.student_id = latest.student_id AND ss.timestamp = latest.latest_time
    INNER JOIN users u ON u.id = ss.student_id
    ORDER BY ss.timestamp DESC
";

    $stmt = $db->query($sql);

    if (!$stmt) {
        $error = $db->errorInfo();
        echo json_encode(["error" => $error[2] ?? "SQL грешка."]);
        exit;
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}
