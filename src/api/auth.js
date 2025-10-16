// API для работы с авторизацией через myAdminPHP
import { getApiBaseUrl } from "../config/api.js";

const API_BASE_URL = getApiBaseUrl();

// Функция для выполнения HTTP запросов
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Правильно объединяем заголовки
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error("Сервер вернул не JSON ответ");
  }

  return response.json();
};

// Регистрация пользователя
export const registerUser = async (userData) => {
  return apiRequest("/auth/register.php", {
    method: "POST",
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    }),
  });
};

// Авторизация пользователя
export const loginUser = async (credentials) => {
  return apiRequest("/auth/login.php", {
    method: "POST",
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });
};

// Проверка токена
export const verifyToken = async (token) => {
  return apiRequest("/auth/verify.php", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};

// Получение задач пользователя
export const getUserTasks = async (token) => {
  return apiRequest("/tasks/get.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token }),
  });
};

// Сохранение задач пользователя
export const saveUserTasks = async (token, tasks) => {
  return apiRequest("/tasks/save.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tasks, token }),
  });
};

// Смена имени пользователя
export const updateUsername = async (token, newUsername) => {
  return apiRequest("/auth/update_username.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ new_username: newUsername, token }),
  });
};

// Смена пароля
export const updatePassword = async (token, currentPassword, newPassword) => {
  return apiRequest("/auth/update_password.php", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      token,
    }),
  });
};
