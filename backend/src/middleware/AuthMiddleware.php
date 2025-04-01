<?php
require_once __DIR__ . '/../jwt.php';

class AuthMiddleware {
    // Проверява дали заявката съдържа валиден JWT токен
    public function checkAuth() {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            return ["message" => "Token не е предоставен.", "status" => 401];
        }

        $authHeader = $headers['Authorization'];
        $jwt = str_replace('Bearer ', '', $authHeader);

        $decoded = verifyJWT($jwt);

        if ($decoded == null) {
            return ["message" => "Невалиден или изтекъл токен.", "status" => 401];
        }

        return $decoded;  // Връща декодираната информация за потребителя
    }
}
