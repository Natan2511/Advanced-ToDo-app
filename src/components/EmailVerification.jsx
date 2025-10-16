import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import {
  Card,
  Input,
  PrimaryButton,
  SecondaryButton,
  Flex,
  Text,
} from "../styles/styled";
import { useAuth } from "../contexts/AuthContext";

const EmailVerification = ({
  verificationData,
  onVerificationSuccess,
  onBack,
}) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setError("Введите 6-значный код подтверждения");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://test-domain.su/To-Do/api/auth/verify_email.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verification_code: code,
            verification_token: verificationData.verification_token,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        setError("Ошибка сервера. Попробуйте еще раз.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        // Автоматически авторизуем пользователя после успешного подтверждения
        const loginResult = await login({
          email: verificationData.email,
          password: verificationData.password, // Пароль должен быть передан из формы регистрации
        });

        if (loginResult.success) {
          onVerificationSuccess(result.user);
        } else {
          // Если авторизация не удалась, просто показываем успех
          onVerificationSuccess(result.user);
        }
      } else {
        setError(result.message || "Ошибка подтверждения email");
      }
    } catch (error) {
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

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
            background: "var(--primary-100)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Mail size={24} style={{ color: "var(--primary-600)" }} />
        </motion.div>

        <Text
          $size="1.5rem"
          $weight="700"
          $color="var(--text-primary)"
          style={{ marginBottom: "0.5rem" }}
        >
          Подтвердите email
        </Text>

        <Text
          $size="0.875rem"
          $color="var(--text-muted)"
          style={{ marginBottom: "2rem", lineHeight: "1.5" }}
        >
          Мы отправили код подтверждения на ваш email. Введите его ниже для
          завершения регистрации.
        </Text>

        {verificationData.verification_code && (
          <div
            style={{
              background: "var(--primary-50)",
              border: "1px solid var(--primary-200)",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <Text $size="0.75rem" $color="var(--primary-600)" $weight="500">
              Для тестирования используйте код:
            </Text>
            <Text
              $size="1.25rem"
              $weight="700"
              $color="var(--primary-700)"
              style={{ marginTop: "0.5rem" }}
            >
              {verificationData.verification_code}
            </Text>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
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
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              maxLength="6"
              style={{
                textAlign: "center",
                fontSize: "1.25rem",
                letterSpacing: "0.5rem",
              }}
            />
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

          <PrimaryButton
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Подтверждение..." : "Подтвердить email"}
          </PrimaryButton>

          <SecondaryButton
            type="button"
            onClick={onBack}
            style={{ width: "100%" }}
          >
            <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
            Назад к регистрации
          </SecondaryButton>
        </form>
      </Card>
    </motion.div>
  );
};

export default EmailVerification;
