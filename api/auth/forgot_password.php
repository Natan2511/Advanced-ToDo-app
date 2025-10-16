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

if (!isset($input['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    
    // Поиск пользователя по email
    $user = fetchOne("SELECT id, username, email FROM users WHERE email = ?", [$input['email']]);
    
    if (!$user) {
        // Для безопасности не сообщаем, что пользователь не найден
        echo json_encode(['success' => true, 'message' => 'Если email зарегистрирован, инструкции по восстановлению пароля отправлены на указанный адрес']);
        exit;
    }
    
    // Генерация кода сброса пароля
    $resetCode = sprintf('%06d', mt_rand(100000, 999999));
    
    // Отправка email с кодом восстановления
    $subject = 'Восстановление пароля в To-Do Pro';
    $message = "
    <html>
    <head>
        <title>Восстановление пароля</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .code { background: #dc2626; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Восстановление пароля</h1>
            </div>
            <div class='content'>
                <p>Здравствуйте, <strong>{$user['username']}</strong>!</p>
                <p>Вы запросили восстановление пароля для вашего аккаунта в To-Do Pro.</p>
                <p>Для сброса пароля введите код подтверждения:</p>
                <div class='code'>{$resetCode}</div>
                <div class='warning'>
                    <strong>Важно:</strong> Этот код действителен в течение 15 минут. Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
                </div>
            </div>
            <div class='footer'>
                <p>© 2024 To-Do Pro. Все права защищены.</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Отправка email
    $headers = [
        'From: To-Do Pro <noreply@test-domain.su>',
        'Reply-To: support@test-domain.su',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8'
    ];
    
    $emailSent = mail($user['email'], $subject, $message, implode("\r\n", $headers));
    
    if ($emailSent) {
        // Сохраняем код в базе данных для проверки (без хеширования, так как код временный)
        executeQuery("INSERT INTO password_resets (email, reset_code, created_at, expires_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE)) ON DUPLICATE KEY UPDATE reset_code = VALUES(reset_code), created_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 15 MINUTE)", [$user['email'], $resetCode]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Инструкции по восстановлению пароля отправлены на указанный email'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Ошибка отправки email'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных: ' . $e->getMessage()]);
}
