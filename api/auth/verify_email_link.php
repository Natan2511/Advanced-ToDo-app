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

if (!isset($input['verification_token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing verification token']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    
    // Поиск пользователя по токену
    $user = fetchOne("SELECT id, username, email FROM users WHERE email_verification_token = ? AND email_verified = FALSE", [$input['verification_token']]);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Неверная или истекшая ссылка подтверждения']);
        exit;
    }
    
    // Подтверждение email
    executeQuery("UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE id = ?", [$user['id']]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Email успешно подтвержден!',
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
