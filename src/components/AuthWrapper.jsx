import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'

  // Показываем загрузку пока проверяем авторизацию
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-primary)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: "3rem",
              height: "3rem",
              border: "3px solid var(--border-color)",
              borderTop: "3px solid var(--primary-500)",
              borderRadius: "50%",
              margin: "0 auto 1rem",
            }}
          />
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Загрузка...
          </p>
        </motion.div>
      </div>
    );
  }

  // Если пользователь авторизован, показываем основное приложение
  if (isAuthenticated) {
    return children;
  }

  // Показываем формы авторизации
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <AnimatePresence mode="wait">
        {authMode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Login onSwitchToRegister={() => setAuthMode("register")} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Register onSwitchToLogin={() => setAuthMode("login")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthWrapper;
