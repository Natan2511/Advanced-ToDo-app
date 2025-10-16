import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, User, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  Input,
  PrimaryButton,
  Text,
  GhostButton,
} from "../styles/styled";

const Register = ({ onSwitchToLogin }) => {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Состояние формы
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Состояние ошибок
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Валидация имени пользователя
    if (!formData.username) {
      newErrors.username = "Введите имя пользователя";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Имя пользователя должно содержать минимум 3 символа";
    } else if (formData.username.length > 30) {
      newErrors.username = "Имя пользователя не должно превышать 30 символов";
    } else if (!/^[а-яёА-ЯЁa-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Имя пользователя может содержать только буквы, цифры, дефисы и подчеркивания";
    }

    // Валидация email
    if (!formData.email) {
      newErrors.email = "Введите email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Введите корректный email адрес";
    }

    // Валидация пароля
    if (!formData.password) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    // Валидация подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (result && result.success && result.verification_token) {
        // Сохраняем данные пользователя для последующей авторизации
        localStorage.setItem(
          "pending_user_data",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
            username: formData.username,
          })
        );

        // Переключаемся на форму входа
        onSwitchToLogin();
      }
    } catch (error) {
      // Ошибка регистрации
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <Card
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: "4rem",
              height: "4rem",
              background: "var(--primary-100)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <UserPlus size={24} style={{ color: "var(--primary-600)" }} />
          </motion.div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: "0 0 0.5rem 0",
            }}
          >
            Регистрация
          </h1>
          <Text $color="var(--text-secondary)">
            Создайте аккаунт в To-Do Pro
          </Text>
        </div>

        <form
          onSubmit={handleFormSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Username */}
          <div>
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Имя пользователя
            </Text>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Введите имя пользователя"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
            {errors.username && (
              <Text
                $color="var(--danger-500)"
                $size="0.75rem"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {errors.username}
              </Text>
            )}
          </div>

          {/* Email */}
          <div>
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Email
            </Text>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите email"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
            {errors.email && (
              <Text
                $color="var(--danger-500)"
                $size="0.75rem"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {errors.email}
              </Text>
            )}
          </div>

          {/* Password */}
          <div>
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Пароль
            </Text>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите пароль"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              />
              <GhostButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0.25rem",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </GhostButton>
            </div>
            {errors.password && (
              <Text
                $color="var(--danger-500)"
                $size="0.75rem"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {errors.password}
              </Text>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Подтвердите пароль
            </Text>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Подтвердите пароль"
                style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
              />
              <GhostButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "0.25rem",
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </GhostButton>
            </div>
            {errors.confirmPassword && (
              <Text
                $color="var(--danger-500)"
                $size="0.75rem"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {errors.confirmPassword}
              </Text>
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={loading || isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "500",
              opacity: loading || isSubmitting ? 0.7 : 1,
            }}
          >
            {loading || isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </PrimaryButton>
        </form>

        {/* Switch to Login */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Text $color="var(--text-secondary)" $size="0.875rem">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-600)",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
            >
              Войти
            </button>
          </Text>
        </div>
      </Card>
    </motion.div>
  );
};

export default Register;
