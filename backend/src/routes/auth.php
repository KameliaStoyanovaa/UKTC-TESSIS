<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../jwt.php';  // Файл за работа с JWT

// Регистрация на потребител
function register($email, $password, $role) {
    if (User::findByEmail($email)) {
        return ["message" => "Потребителят вече съществува", "status" => 400];
    }
    $userId = User::create($email, $password, $role);
    return ["message" => "Регистрацията беше успешна", "status" => 201];
}

// Логин на потребител
function login($email, $password) {
    $user = User::findByEmail($email);
    if (!$user || !User::verifyPassword($password, $user->password)) {
        return ["message" => "Невалидни данни за вход", "status" => 401];
    }
    $token = createJWT($user->id, $user->role);
    return ["token" => $token];
}
