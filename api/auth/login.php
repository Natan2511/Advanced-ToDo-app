<?php
// CORS заголовки напрямую (для обхода ограничений InfinityFree)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Credentials: false');

// Обработка preflight запросов (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Дополнительные заголовки для preflight
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    // Поиск пользователя
    $user = fetchOne("SELECT id, username, email, password_hash, email_verified FROM users WHERE username = ?", [$input['username']]);
    
    if (!$user || !password_verify($input['password'], $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Неверные учетные данные']);
        exit;
    }
    
    // Проверка активации аккаунта
    if (!$user['email_verified']) {
        echo json_encode(['success' => false, 'message' => 'Аккаунт не активирован. Проверьте email и нажмите на ссылку подтверждения.']);
        exit;
    }
    
    // Генерация токена (упрощенная версия)
    $token = base64_encode(json_encode([
        'user_id' => $user['id'],
        'username' => $user['username'],
        'exp' => time() + (30 * 24 * 60 * 60) // 30 дней
    ]));
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
