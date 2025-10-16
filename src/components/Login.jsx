import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";
import {
  Card,
  Input,
  PrimaryButton,
  SecondaryButton,
  Flex,
  Text,
  GhostButton,
} from "../styles/styled";

const Login = ({ onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login({
      username: data.username,
      password: data.password,
    });
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Если показываем форму восстановления пароля
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

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
            <LogIn size={24} style={{ color: "var(--primary-600)" }} />
          </motion.div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: "0 0 0.5rem 0",
            }}
          >
            Вход в систему
          </h1>
          <Text $color="var(--text-secondary)">
            Войдите в свой аккаунт To-Do Pro
          </Text>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
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
                {...register("username", {
                  required: "Введите имя пользователя",
                  minLength: {
                    value: 3,
                    message:
                      "Имя пользователя должно содержать минимум 3 символа",
                  },
                })}
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
                {errors.username.message}
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
                {...register("password", {
                  required: "Введите пароль",
                  minLength: {
                    value: 6,
                    message: "Пароль должен содержать минимум 6 символов",
                  },
                })}
                type={showPassword ? "text" : "password"}
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
                {errors.password.message}
              </Text>
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: "500",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </PrimaryButton>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-600)",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
            >
              Забыли пароль?
            </button>
          </div>
        </form>

        {/* Switch to Register */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Text $color="var(--text-secondary)" $size="0.875rem">
            Нет аккаунта?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-600)",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "0.875rem",
              }}
            >
              Зарегистрироваться
            </button>
          </Text>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
