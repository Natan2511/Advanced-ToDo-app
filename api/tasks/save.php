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

// Получение токена из заголовка
$token = null;

// Попробуем получить токен из разных источников
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    }
} else {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    }
}

if (isset($authHeader) && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
}

// Если токен не найден в заголовке, попробуем получить из тела запроса
if (!$token) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['token'])) {
        $token = $input['token'];
    }
}

if (!$token) {
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'message' => 'Token required',
        'debug' => [
            'auth_header' => isset($authHeader) ? 'set' : 'not set',
            'server_auth' => isset($_SERVER['HTTP_AUTHORIZATION']) ? 'set' : 'not set',
            'redirect_auth' => isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? 'set' : 'not set',
            'input_token' => isset($input['token']) ? 'set' : 'not set'
        ]
    ]);
    exit;
}

// Проверка токена
try {
    $tokenData = json_decode(base64_decode($token), true);
    
    if (!$tokenData || !isset($tokenData['exp']) || $tokenData['exp'] < time()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token expired']);
        exit;
    }
    
    $userId = $tokenData['user_id'];
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['tasks'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tasks data required']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    
    // Начинаем транзакцию
    $pdo = getDatabaseConnection();
    $pdo->beginTransaction();
    
    // Удаляем все существующие задачи пользователя
    executeQuery("DELETE FROM tasks WHERE user_id = ?", [$userId]);
    
    // Вставляем новые задачи
    $stmt = $pdo->prepare("INSERT INTO tasks (id, user_id, text, completed, category, priority, due_date, created_at, updated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($input['tasks'] as $task) {
        $stmt->execute([
            $task['id'],
            $userId,
            $task['text'],
            $task['completed'] ? 1 : 0,
            $task['category'],
            $task['priority'],
            $task['dueDate'] ?? null,
            $task['createdAt'],
            $task['updatedAt'] ?? $task['createdAt'],
            $task['completedAt'] ?? null
        ]);
    }
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Tasks saved successfully'
    ]);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
