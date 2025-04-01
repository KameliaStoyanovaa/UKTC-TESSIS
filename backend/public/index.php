<?php

// Зареждаме autoload за Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Зареждаме променливите от .env файла
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Проверяваме дали променливите са заредени правилно (можеш да премахнеш тези редове след теста)
echo 'DB_HOST: ' . getenv('DB_HOST') . '<br>';
echo 'DB_NAME: ' . getenv('DB_NAME') . '<br>';
echo 'JWT_SECRET: ' . getenv('JWT_SECRET') . '<br>';

// Пример за рутинг с .htaccess и index.php:
// Тук можеш да добавиш логика за обработка на различни URL заявки
// Пример:
// if ($_SERVER['REQUEST_METHOD'] === 'POST') { ... }
// if ($_SERVER['REQUEST_METHOD'] === 'GET') { ... }

// Ако добавяш API заявки, можеш да използваш библиотеки като Slim или просто ръчно да обработваш URL

