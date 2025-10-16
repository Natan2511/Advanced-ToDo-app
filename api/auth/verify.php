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

if (!isset($input['token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing token']);
    exit;
}

try {
    $tokenData = json_decode(base64_decode($input['token']), true);
    
    if (!$tokenData || !isset($tokenData['exp']) || $tokenData['exp'] < time()) {
        echo json_encode(['success' => false, 'message' => 'Token expired']);
        exit;
    }
    
    echo json_encode(['success' => true, 'user_id' => $tokenData['user_id']]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
}
?>
