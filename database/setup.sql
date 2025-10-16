-- Создание базы данных и таблиц для To-Do Pro
-- Используйте эти команды в phpMyAdmin или MySQL Workbench
-- 
-- ВАЖНО: 
-- 1. Сначала создайте базу данных в phpMyAdmin
-- 2. Выберите созданную базу данных
-- 3. Выполните этот скрипт
-- 4. Все команды безопасны для повторного выполнения (используют IF NOT EXISTS)

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Создание таблицы задач
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'general',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Создание таблицы для кодов сброса пароля
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    reset_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_email (email),
    INDEX idx_reset_code (reset_code),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- Создание дополнительных индексов для таблицы password_resets
CREATE INDEX IF NOT EXISTS idx_password_resets_created_at ON password_resets(created_at);

-- Создание индекса для поиска по категории задач
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Создание индекса для поиска по приоритету задач
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Создание индекса для поиска по дате выполнения
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Создание индекса для поиска по статусу выполнения
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);