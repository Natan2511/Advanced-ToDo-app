<?php
// Подключаем CORS заголовки
require_once '../config/cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Получаем токен из заголовка или тела запроса
$authHeader = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    }
}

$token = null;
if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
} else {
    // Fallback: проверяем тело запроса
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['token'])) {
        $token = $input['token'];
    }
}

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token required']);
    exit;
}

// Декодируем токен
$decoded = base64_decode($token);
$tokenData = json_decode($decoded, true);

if (!$tokenData || !isset($tokenData['user_id']) || !isset($tokenData['exp'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

// Проверяем срок действия токена
if ($tokenData['exp'] < time()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Token expired']);
    exit;
}

$userId = $tokenData['user_id'];

// Получаем данные из запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['new_username']) || empty(trim($input['new_username']))) {
    echo json_encode(['success' => false, 'message' => 'Новое имя пользователя обязательно']);
    exit;
}

$newUsername = trim($input['new_username']);

// Валидация имени пользователя
if (!preg_match('/^[а-яёА-ЯЁa-zA-Z0-9_-]+$/u', $newUsername)) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя может содержать только буквы, цифры, дефисы и подчеркивания']);
    exit;
}

if (strlen($newUsername) < 3 || strlen($newUsername) > 30) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя должно содержать от 3 до 30 символов']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {

    // Проверяем, не занято ли новое имя пользователя
    $existingUser = fetchOne("SELECT id FROM users WHERE username = ? AND id != ?", [$newUsername, $userId]);
    
    if ($existingUser) {
        echo json_encode(['success' => false, 'message' => 'Это имя пользователя уже занято']);
        exit;
    }

    // Обновляем имя пользователя
    $stmt = executeQuery("UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [$newUsername, $userId]);

    if ($stmt->rowCount() > 0) {
        // Получаем обновленные данные пользователя
        $user = fetchOne("SELECT id, username, email, created_at FROM users WHERE id = ?", [$userId]);

        echo json_encode([
            'success' => true,
            'message' => 'Имя пользователя успешно изменено',
            'user' => $user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка обновления имени пользователя']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
