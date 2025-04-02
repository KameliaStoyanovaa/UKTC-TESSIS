<?php
require_once __DIR__ . '/../config/jwt.php';

function authenticate() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $token = str_replace("Bearer ", "", $headers['Authorization']);
        $decoded = JwtHandler::verifyToken($token);

        if ($decoded) {
            return $decoded->sub; // user_id
        } else {
            echo json_encode(["message" => "Невалиден или изтекъл токен."]);
            exit;
        }
    }

    echo json_encode(["message" => "Липсва Authorization хедър."]);
    exit;
}

?>
