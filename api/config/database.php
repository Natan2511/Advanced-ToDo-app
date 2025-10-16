<?php
/**
 * Централизованное подключение к базе данных для To-Do Pro
 * 
 * Этот файл содержит настройки подключения к базе данных.
 * Для изменения настроек отредактируйте значения ниже.
 */

// Настройки подключения к базе данных
define('DB_HOST', 'localhost');
define('DB_NAME', 'u3292465_to-do');
define('DB_USER', 'u3292465_root1');
define('DB_PASS', 'nI4qP6yB6jiE3jY2');
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// Глобальная переменная для хранения подключения
$GLOBALS['pdo_connection'] = null;

/**
 * Создает подключение к базе данных
 * 
 * @return PDO Объект подключения к базе данных
 * @throws PDOException При ошибке подключения
 */
function getDatabaseConnection() {
    // Если подключение уже существует, возвращаем его
    if ($GLOBALS['pdo_connection'] !== null) {
        return $GLOBALS['pdo_connection'];
    }
    
    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => false, // Отключаем постоянные подключения для стабильности
        ]);
        
        // Сохраняем подключение в глобальной переменной
        $GLOBALS['pdo_connection'] = $pdo;
        
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Ошибка подключения к базе данных'
        ]);
        exit;
    }
}

/**
 * Проверяет подключение к базе данных
 * 
 * @return bool true если подключение успешно, false в противном случае
 */
function testDatabaseConnection() {
    try {
        $pdo = getDatabaseConnection();
        return true;
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Закрывает подключение к базе данных
 */
function closeDatabaseConnection() {
    $GLOBALS['pdo_connection'] = null;
}

/**
 * Выполняет SQL запрос с параметрами
 * 
 * @param string $sql SQL запрос
 * @param array $params Параметры для запроса
 * @return PDOStatement Результат выполнения запроса
 */
function executeQuery($sql, $params = []) {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt;
}

/**
 * Получает одну запись из базы данных
 * 
 * @param string $sql SQL запрос
 * @param array $params Параметры для запроса
 * @return array|false Результат запроса или false
 */
function fetchOne($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    return $stmt->fetch();
}

/**
 * Получает все записи из базы данных
 * 
 * @param string $sql SQL запрос
 * @param array $params Параметры для запроса
 * @return array Массив результатов
 */
function fetchAll($sql, $params = []) {
    $stmt = executeQuery($sql, $params);
    return $stmt->fetchAll();
}
?>