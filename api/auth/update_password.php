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

if (!isset($input['current_password']) || empty(trim($input['current_password']))) {
    echo json_encode(['success' => false, 'message' => 'Текущий пароль обязателен']);
    exit;
}

if (!isset($input['new_password']) || empty(trim($input['new_password']))) {
    echo json_encode(['success' => false, 'message' => 'Новый пароль обязателен']);
    exit;
}

$currentPassword = trim($input['current_password']);
$newPassword = trim($input['new_password']);

// Валидация нового пароля
if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Новый пароль должен содержать минимум 6 символов']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {

    // Получаем текущий пароль пользователя
    $user = fetchOne("SELECT password_hash FROM users WHERE id = ?", [$userId]);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }

    // Проверяем текущий пароль
    if (!password_verify($currentPassword, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Неверный текущий пароль']);
        exit;
    }

    // Хешируем новый пароль
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // Обновляем пароль
    $stmt = executeQuery("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [$newPasswordHash, $userId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Пароль успешно изменен'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка обновления пароля']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
?>
