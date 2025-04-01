<?php
class User {
    public $id;
    public $email;
    public $password;
    public $role;

    // Конструктор за създаване на потребителски обект
    public function __construct($id, $email, $password, $role) {
        $this->id = $id;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
    }

    // Функция за създаване на потребител в базата данни
    public static function create($email, $password, $role) {
        global $pdo;
        $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (:email, :password, :role)");
        $stmt->execute(['email' => $email, 'password' => password_hash($password, PASSWORD_DEFAULT), 'role' => $role]);
        return $pdo->lastInsertId();
    }

    // Функция за намиране на потребител по email
    public static function findByEmail($email) {
        global $pdo;
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            return new self($user['id'], $user['email'], $user['password'], $user['role']);
        }
        return null;
    }

    // Функция за проверка на паролата
    public static function verifyPassword($inputPassword, $hashedPassword) {
        return password_verify($inputPassword, $hashedPassword);
    }
}
