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

if (!isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Валидация данных
if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Все поля обязательны']);
    exit;
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Неверный формат email']);
    exit;
}

if (strlen($input['password']) < 6) {
    echo json_encode(['success' => false, 'message' => 'Пароль должен содержать минимум 6 символов']);
    exit;
}

// Валидация имени пользователя (русские и английские буквы, цифры, дефисы, подчеркивания)
if (!preg_match('/^[а-яёА-ЯЁa-zA-Z0-9_-]+$/u', $input['username'])) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя может содержать только буквы, цифры, дефисы и подчеркивания']);
    exit;
}

if (strlen($input['username']) < 3 || strlen($input['username']) > 30) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя должно содержать от 3 до 30 символов']);
    exit;
}

// Подключение к базе данных
require_once '../config/database.php';

try {
    
    // Проверка существования пользователя
    $existingUser = fetchOne("SELECT id FROM users WHERE username = ? OR email = ?", [$input['username'], $input['email']]);
    
    if ($existingUser) {
        echo json_encode(['success' => false, 'message' => 'Пользователь уже существует']);
        exit;
    }
    
    // Создание пользователя
    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Генерация токена подтверждения email
    $verificationToken = bin2hex(random_bytes(32));
    
    // Создаем пользователя с неактивированным email
    executeQuery("INSERT INTO users (username, email, password_hash, email_verified, email_verification_token) VALUES (?, ?, ?, 0, ?)", 
        [$input['username'], $input['email'], $passwordHash, $verificationToken]);
    
    // Отправка email со ссылкой подтверждения
    $verificationUrl = "https://test-domain.su/verify-email.html?token=" . $verificationToken;
    
    $subject = 'Подтверждение регистрации в To-Do Pro';
    $message = "
    <html>
    <head>
        <title>Подтверждение регистрации</title>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { 
                background: #4f46e5; 
                color: #fff !important; 
                padding: 15px 30px; 
                text-decoration: none; 
                border-radius: 8px; 
                display: inline-block; 
                font-weight: bold; 
                margin: 20px 0;
                font-size: 16px;
            }
            .button:hover { background: #3730a3; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Добро пожаловать в To-Do Pro!</h1>
            </div>
            <div class='content'>
                <p>Здравствуйте, <strong>{$input['username']}</strong>!</p>
                <p>Спасибо за регистрацию в To-Do Pro. Для завершения регистрации нажмите на кнопку ниже:</p>
                <div style='text-align: center;'>
                    <a href='{$verificationUrl}' class='button'>Подтвердить аккаунт</a>
                </div>
                <p>Эта ссылка действительна в течение 24 часов.</p>
                <p>Если вы не регистрировались в To-Do Pro, просто проигнорируйте это письмо.</p>
            </div>
            <div class='footer'>
                <p>© 2024 To-Do Pro. Все права защищены.</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Отправка email с улучшенными заголовками
    $headers = [
        'From: To-Do Pro <noreply@test-domain.su>',
        'Reply-To: support@test-domain.su>',
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit'
    ];
    
    // Попытка отправки email
    $emailSent = false;
    try {
        $emailSent = mail($input['email'], $subject, $message, implode("\r\n", $headers));
    } catch (Exception $e) {
        // Логируем ошибку, но не прерываем выполнение
        error_log("Email sending error: " . $e->getMessage());
    }
    
    // Всегда возвращаем успех, даже если email не отправился
    // Пользователь может подтвердить аккаунт через прямую ссылку
    echo json_encode([
        'success' => true, 
        'message' => $emailSent ? 
            'Пользователь зарегистрирован. Ссылка подтверждения отправлена на email.' :
            'Пользователь зарегистрирован. Проверьте email или используйте ссылку подтверждения.',
        'verification_token' => $verificationToken,
        'verification_url' => $verificationUrl
    ]);
    
} catch (PDOException $e) {
    // Логируем ошибку для отладки
    error_log("Database error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Ошибка базы данных. Попробуйте позже.']);
} catch (Exception $e) {
    // Логируем общие ошибки
    error_log("General error in register.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Произошла ошибка. Попробуйте позже.']);
}
?>
