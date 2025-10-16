// Конфигурация API

// Базовый URL API (одинаковый для всех окружений)
export const API_BASE_URL = "https://test-domain.su/To-Do/api";

// URL фронтенда в зависимости от окружения
export const getFrontendUrl = () => {
  const mode = import.meta.env.MODE;

  if (mode === "development") {
    return "http://localhost:3000";
  }
  return "https://natan2511.github.io/Advanced-ToDo-app";
};

// Функция для получения базового URL API
export const getApiBaseUrl = () => API_BASE_URL;
