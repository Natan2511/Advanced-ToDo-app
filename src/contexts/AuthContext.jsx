import React, { createContext, useContext, useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  verifyToken,
  getUserTasks,
  saveUserTasks,
  updateUsername,
  updatePassword,
} from "../api/auth";
import { useTaskStore } from "../store/useTaskStore";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { tasks, setTasks } = useTaskStore();

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");
      const sessionExpiry = localStorage.getItem("auth_expiry");

      // Проверяем, не истекла ли сессия
      if (sessionExpiry && new Date().getTime() > parseInt(sessionExpiry)) {
        // Сессия истекла, очищаем данные
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_expiry");
        setLoading(false);
        return;
      }

      if (savedToken && savedUser) {
        try {
          // Проверяем валидность токена на сервере
          const response = await verifyToken(savedToken);

          if (response.success) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);

            // Обновляем время истечения сессии (добавляем 30 дней)
            const newExpiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("auth_expiry", newExpiry.toString());

            // Загружаем данные пользователя
            await loadUserData(savedToken);
          } else {
            // Токен невалиден, очищаем localStorage
            clearAuthData();
          }
        } catch (error) {
          // При ошибке сети не очищаем данные, возможно это временная проблема
          // Пользователь останется авторизованным локально
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);

          // Загружаем данные пользователя даже при ошибке верификации
          await loadUserData(savedToken);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Функция для очистки данных авторизации
  const clearAuthData = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expiry");
  };

  // Загрузка данных пользователя
  const loadUserData = async (userToken) => {
    if (!userToken) {
      return;
    }

    try {
      // Загружаем задачи
      const tasksResponse = await getUserTasks(userToken);
      if (tasksResponse.success && tasksResponse.tasks) {
        // Валидируем и исправляем даты в задачах
        const validatedTasks = tasksResponse.tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt
            ? new Date(task.createdAt).toISOString()
            : new Date().toISOString(),
          updatedAt: task.updatedAt
            ? new Date(task.updatedAt).toISOString()
            : new Date().toISOString(),
          completedAt: task.completedAt
            ? new Date(task.completedAt).toISOString()
            : undefined,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString()
            : undefined,
        }));
        setTasks(validatedTasks);
      }
    } catch (error) {
      // Ошибка загрузки данных
    }
  };

  // Регистрация
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData);

      if (response && typeof response === "object" && response.success) {
        toast.success(
          "Регистрация успешна! Ссылка подтверждения отправлена на email."
        );
        return {
          success: true,
          verification_token: response.verification_token,
        };
      } else {
        const errorMessage =
          (response && response.message) || "Ошибка регистрации";
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMessage = error?.message || "Ошибка регистрации";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Авторизация
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);

      if (response.success && response.token) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);

        // Сохраняем в localStorage с временем истечения (30 дней)
        const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("auth_user", JSON.stringify(response.user));
        localStorage.setItem("auth_expiry", expiryTime.toString());

        // Загружаем данные пользователя
        await loadUserData(response.token);

        toast.success(`Добро пожаловать, ${response.user.username}!`);
        return { success: true };
      } else {
        toast.error(response.message || "Ошибка авторизации");
        return { success: false, message: response.message };
      }
    } catch (error) {
      toast.error(error.message || "Ошибка авторизации");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Очищаем все данные авторизации
    clearAuthData();

    // Очищаем данные в store
    setTasks([]);

    toast.success("Вы вышли из системы");
  };

  // Смена имени пользователя
  const changeUsername = async (newUsername) => {
    if (!token) {
      toast.error("Необходимо войти в систему");
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await updateUsername(token, newUsername);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem("auth_user", JSON.stringify(response.user));
        toast.success("Имя пользователя успешно изменено");
        return { success: true };
      } else {
        toast.error(response.message || "Ошибка изменения имени");
        return { success: false, message: response.message };
      }
    } catch (error) {
      toast.error(error.message || "Ошибка изменения имени");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Смена пароля
  const changePassword = async (currentPassword, newPassword) => {
    if (!token) {
      toast.error("Необходимо войти в систему");
      return { success: false };
    }

    try {
      setLoading(true);
      const response = await updatePassword(
        token,
        currentPassword,
        newPassword
      );

      if (response.success) {
        toast.success("Пароль успешно изменен");
        return { success: true };
      } else {
        toast.error(response.message || "Ошибка изменения пароля");
        return { success: false, message: response.message };
      }
    } catch (error) {
      toast.error(error.message || "Ошибка изменения пароля");
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Сохранение задач на сервер
  const saveTasksToServer = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await saveUserTasks(token, tasks);
      if (!response.success) {
        // Ошибка сохранения задач на сервере
      }
    } catch (error) {
      // Ошибка сохранения задач
    }
  };

  // Сохранение кастомных категорий на сервер

  // Автоматическое сохранение задач при их изменении
  useEffect(() => {
    if (isAuthenticated && token && tasks.length > 0) {
      saveTasksToServer();
    }
  }, [tasks, isAuthenticated, token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    changeUsername,
    changePassword,
    saveTasksToServer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
