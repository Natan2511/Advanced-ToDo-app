import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Key, ArrowLeft, CheckCircle } from "lucide-react";
import {
  Card,
  Input,
  PrimaryButton,
  SecondaryButton,
  Flex,
  Text,
} from "../styles/styled";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState("request"); // 'request' или 'reset'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetData, setResetData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitRequest = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://test-domain.su/To-Do/api/auth/forgot_password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setResetData({
          email: data.email,
        });
        reset({ code: "", new_password: "", confirm_password: "" }); // Сбрасываем форму
        setStep("reset");
      } else {
        setError(result.message || "Ошибка отправки запроса");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitReset = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://test-domain.su/To-Do/api/auth/reset_password.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reset_code: data.code,
            email: resetData.email,
            new_password: data.new_password,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("Пароль успешно изменен! Теперь вы можете войти в систему.");
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setError(result.message || "Ошибка сброса пароля");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRequest = () => {
    setStep("request");
    setResetData(null);
    setError("");
    setSuccess("");
  };

  if (step === "reset") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "1rem",
          background: "var(--bg-primary)",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: "4rem",
              height: "4rem",
              background: "var(--danger-100)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Key size={24} style={{ color: "var(--danger-600)" }} />
          </motion.div>

          <Text
            $size="1.5rem"
            $weight="700"
            $color="var(--text-primary)"
            style={{ marginBottom: "0.5rem" }}
          >
            Сброс пароля <br />
          </Text>

          <Text
            $size="0.875rem"
            $color="var(--text-muted)"
            style={{ marginBottom: "2rem", lineHeight: "1.5" }}
          >
            Введите код подтверждения и новый пароль для завершения сброса.
          </Text>

          <form
            onSubmit={handleSubmit(onSubmitReset)}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div>
              <Text
                $size="0.875rem"
                $weight="500"
                $color="var(--text-primary)"
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                Код подтверждения
              </Text>
              <Input
                {...register("code", {
                  required: "Введите код подтверждения",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Код должен содержать 6 цифр",
                  },
                })}
                placeholder="000000"
                maxLength="6"
                style={{
                  textAlign: "center",
                  fontSize: "1.25rem",
                  letterSpacing: "0.5rem",
                }}
              />
              {errors.code && (
                <Text
                  $color="var(--danger-500)"
                  $size="0.75rem"
                  style={{ marginTop: "0.5rem", display: "block" }}
                >
                  {errors.code.message}
                </Text>
              )}
            </div>

            <div>
              <Text
                $size="0.875rem"
                $weight="500"
                $color="var(--text-primary)"
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                Новый пароль
              </Text>
              <Input
                {...register("new_password", {
                  required: "Введите новый пароль",
                  minLength: {
                    value: 6,
                    message: "Пароль должен содержать минимум 6 символов",
                  },
                })}
                type="password"
                placeholder="Введите новый пароль"
              />
              {errors.new_password && (
                <Text
                  $color="var(--danger-500)"
                  $size="0.75rem"
                  style={{ marginTop: "0.5rem", display: "block" }}
                >
                  {errors.new_password.message}
                </Text>
              )}
            </div>

            <div>
              <Text
                $size="0.875rem"
                $weight="500"
                $color="var(--text-primary)"
                style={{ marginBottom: "0.5rem", display: "block" }}
              >
                Подтвердите пароль
              </Text>
              <Input
                {...register("confirm_password", {
                  required: "Подтвердите пароль",
                  validate: (value) => {
                    const newPassword = document.querySelector(
                      'input[name="new_password"]'
                    ).value;
                    return value === newPassword || "Пароли не совпадают";
                  },
                })}
                type="password"
                placeholder="Подтвердите новый пароль"
              />
              {errors.confirm_password && (
                <Text
                  $color="var(--danger-500)"
                  $size="0.75rem"
                  style={{ marginTop: "0.5rem", display: "block" }}
                >
                  {errors.confirm_password.message}
                </Text>
              )}
            </div>

            {error && (
              <Text
                $color="var(--danger-500)"
                $size="0.875rem"
                style={{ textAlign: "center" }}
              >
                {error}
              </Text>
            )}

            {success && (
              <Text
                $color="var(--success-500)"
                $size="0.875rem"
                style={{ textAlign: "center" }}
              >
                {success}
              </Text>
            )}

            <PrimaryButton
              type="submit"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Сброс пароля..." : "Сбросить пароль"}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={handleBackToRequest}
              style={{ width: "100%" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
              Назад
            </SecondaryButton>
          </form>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",
        background: "var(--bg-primary)",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: "4rem",
            height: "4rem",
            background: "var(--warning-100)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Mail size={24} style={{ color: "var(--warning-600)" }} />
        </motion.div>

        <Text
          $size="1.5rem"
          $weight="700"
          $color="var(--text-primary)"
          style={{ marginBottom: "0.5rem" }}
        >
          Забыли пароль? <br />
        </Text>

        <Text
          $size="0.875rem"
          $color="var(--text-muted)"
          style={{ marginBottom: "2rem", lineHeight: "1.5" }}
        >
          Введите ваш email адрес, и мы отправим инструкции по восстановлению
          пароля.
        </Text>

        <form
          onSubmit={handleSubmit(onSubmitRequest)}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div>
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Email адрес
            </Text>
            <Input
              {...register("email", {
                required: "Введите email адрес",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Введите корректный email адрес",
                },
              })}
              type="email"
              placeholder="Введите ваш email"
            />
            {errors.email && (
              <Text
                $color="var(--danger-500)"
                $size="0.75rem"
                style={{ marginTop: "0.5rem", display: "block" }}
              >
                {errors.email.message}
              </Text>
            )}
          </div>

          {error && (
            <Text
              $color="var(--danger-500)"
              $size="0.875rem"
              style={{ textAlign: "center" }}
            >
              {error}
            </Text>
          )}

          {success && (
            <Text
              $color="var(--success-500)"
              $size="0.875rem"
              style={{ textAlign: "center" }}
            >
              {success}
            </Text>
          )}

          <PrimaryButton
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Отправка..." : "Отправить инструкции"}
          </PrimaryButton>

          <SecondaryButton
            type="button"
            onClick={onBackToLogin}
            style={{ width: "100%" }}
          >
            <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
            Назад к входу
          </SecondaryButton>
        </form>
      </Card>
    </motion.div>
  );
};

export default ForgotPassword;
