<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler
{
    private static $secret_key = "f2d4c95ec095862af68ae607be05ae45556aa2ae2b87a9306185cac71295bae2"; // Смени го с по-сигурен ключ
    private static $algorithm = "HS256";

    public static function generateToken($user_id)
    {
        $payload = [
            "iss" => "localhost",
            "iat" => time(),
            "exp" => time() + (14400), // x часa валидност
            "sub" => $user_id
        ];

        return JWT::encode($payload, self::$secret_key, self::$algorithm);
    }

    public static function verifyToken($token)
    {
        try {
            return JWT::decode($token, new Key(self::$secret_key, self::$algorithm));
        } catch (Exception $e) {
            echo json_encode(["message" => "Грешка при декодиране на токена: " . $e->getMessage()]);
            exit;
        }
    }
}

?>
