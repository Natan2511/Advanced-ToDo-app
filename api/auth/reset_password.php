<?php
// Подключаем CORS заголовки
require_once '../config/cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['reset_code']) || !isset($input['email']) || !isset($input['new_password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

if (strlen($input['new_password']) < 6) {
    echo json_encode(['success' => false, 'message' => 'Пароль должен содержать минимум 6 символов']);
    exit;
}

if (!preg_match('/^\d{6}$/', $input['reset_code'])) {
    echo json_encode(['success' => false, 'message' => 'Неверный формат кода']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    
    // Поиск пользователя по email
    $user = fetchOne("SELECT id, username, email FROM users WHERE email = ?", [$input['email']]);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Пользователь не найден']);
        exit;
    }
    
    // Проверка кода сброса пароля
    $resetRecord = fetchOne("SELECT reset_code, expires_at, used FROM password_resets WHERE email = ? AND expires_at > NOW() AND used = FALSE ORDER BY created_at DESC LIMIT 1", [$input['email']]);
    
    if (!$resetRecord) {
        echo json_encode(['success' => false, 'message' => 'Код сброса пароля не найден или истек']);
        exit;
    }
    
    // Проверка правильности кода (простое сравнение, так как код не хешируется)
    if ($input['reset_code'] !== $resetRecord['reset_code']) {
        echo json_encode(['success' => false, 'message' => 'Неверный код сброса пароля']);
        exit;
    }
    
    // Хеширование нового пароля
    $newPasswordHash = password_hash($input['new_password'], PASSWORD_DEFAULT);
    
    // Начинаем транзакцию
    $pdo = getDatabaseConnection();
    $pdo->beginTransaction();
    
    try {
        // Обновление пароля
        executeQuery("UPDATE users SET password_hash = ? WHERE id = ?", [$newPasswordHash, $user['id']]);
        
        // Отмечаем код как использованный
        executeQuery("UPDATE password_resets SET used = TRUE WHERE email = ? AND reset_code = ?", [$input['email'], $input['reset_code']]);
        
        // Подтверждаем транзакцию
        $pdo->commit();
    } catch (Exception $e) {
        // Откатываем транзакцию в случае ошибки
        $pdo->rollBack();
        throw $e;
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Пароль успешно изменен! Теперь вы можете войти в систему с новым паролем.',
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
