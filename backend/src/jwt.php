<?php
use \vendor\Firebase\JWT\JWT;

function createJWT($userId, $role) {
    $key = getenv('JWT_SECRET');
    $issuedAt = time();
    $expirationTime = $issuedAt + 36000000000000;  // 1 час
    $payload = array(
        "userId" => $userId,
        "role" => $role,
        "iat" => $issuedAt,
        "exp" => $expirationTime
    );
    return JWT::encode($payload, $key);
}

function verifyJWT($jwt) {
    try {
        $key = getenv('JWT_SECRET');
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        return null;
    }
}
