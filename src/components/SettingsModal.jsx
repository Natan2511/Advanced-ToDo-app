import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  X,
  Settings,
  Palette,
  Bell,
  Database,
  Download,
  Upload,
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Grid,
  Text,
  GhostButton,
  PrimaryButton,
  SecondaryButton,
  Input,
  Select,
} from "../styles/styled";

const SettingsModal = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, changeUsername, changePassword, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("appearance");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: errorsUsername },
    reset: resetUsername,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch("new_password");

  const onSubmitUsername = async (data) => {
    if (data.username === user?.username) {
      return;
    }

    const result = await changeUsername(data.username);
    if (result.success) {
      resetUsername({ username: data.username });
    }
  };

  const onSubmitPassword = async (data) => {
    const result = await changePassword(
      data.current_password,
      data.new_password
    );
    if (result.success) {
      resetPassword();
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleExportData = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem("tasks", JSON.stringify(data));
            window.location.reload();
          } catch (error) {
            alert("Ошибка при импорте файла. Проверьте формат данных.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (
      confirm(
        "Вы уверены, что хотите удалить все данные? Это действие нельзя отменить."
      )
    ) {
      localStorage.removeItem("tasks");
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div
        id="settings-modal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          opacity: 0,
          visibility: "hidden",
          transition: "all 0.3s ease",
        }}
        onClick={handleBackdropClick}
      >
        <ModalContent
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ maxWidth: "600px" }}
        >
          {/* Header */}
          <ModalHeader>
            <Flex $align="center" $gap="0.75rem">
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  background: "var(--primary-100)",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Settings size={20} style={{ color: "var(--primary-600)" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Настройки
                </h2>
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  Управление приложением
                </Text>
              </div>
            </Flex>
            <GhostButton
              onClick={closeModal}
              className="p-2 hover:bg-[var(--bg-tertiary)]"
            >
              <X size={20} />
            </GhostButton>
          </ModalHeader>

          {/* Navigation Tabs */}
          <div
            style={{
              padding: "0 1.5rem",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <Flex $gap="0.5rem" style={{ flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("appearance")}
                style={{
                  padding: "0.75rem 1rem",
                  border: "none",
                  background: "none",
                  color:
                    activeTab === "appearance"
                      ? "var(--primary-600)"
                      : "var(--text-secondary)",
                  fontWeight: activeTab === "appearance" ? "600" : "500",
                  borderBottom:
                    activeTab === "appearance"
                      ? "2px solid var(--primary-600)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Flex $align="center" $gap="0.5rem">
                  <Palette size={16} />
                  Внешний вид
                </Flex>
              </button>
              <button
                onClick={() => setActiveTab("user")}
                style={{
                  padding: "0.75rem 1rem",
                  border: "none",
                  background: "none",
                  color:
                    activeTab === "user"
                      ? "var(--primary-600)"
                      : "var(--text-secondary)",
                  fontWeight: activeTab === "user" ? "600" : "500",
                  borderBottom:
                    activeTab === "user"
                      ? "2px solid var(--primary-600)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Flex $align="center" $gap="0.5rem">
                  <User size={16} />
                  Пользователь
                </Flex>
              </button>
              <button
                onClick={() => setActiveTab("data")}
                style={{
                  padding: "0.75rem 1rem",
                  border: "none",
                  background: "none",
                  color:
                    activeTab === "data"
                      ? "var(--primary-600)"
                      : "var(--text-secondary)",
                  fontWeight: activeTab === "data" ? "600" : "500",
                  borderBottom:
                    activeTab === "data"
                      ? "2px solid var(--primary-600)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Flex $align="center" $gap="0.5rem">
                  <Database size={16} />
                  Данные
                </Flex>
              </button>
            </Flex>
          </div>

          {/* Content */}
          <ModalBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              {/* Appearance Section */}
              {activeTab === "appearance" && (
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "1rem" }}
                  >
                    <Palette
                      size={18}
                      style={{ color: "var(--primary-600)" }}
                    />
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      Внешний вид
                    </h3>
                  </Flex>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      padding: "1rem",
                      background: "var(--bg-secondary)",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div>
                      <Text
                        $size="0.875rem"
                        $weight="500"
                        style={{ marginBottom: "0.5rem", display: "block" }}
                      >
                        Тема
                      </Text>
                      <Flex $gap="0.5rem">
                        <SecondaryButton
                          onClick={() => {
                            if (theme !== "light") toggleTheme();
                          }}
                          style={{
                            background:
                              theme === "light"
                                ? "var(--primary-500)"
                                : "var(--bg-primary)",
                            color:
                              theme === "light"
                                ? "white"
                                : "var(--text-primary)",
                            border:
                              theme === "light"
                                ? "1px solid var(--primary-500)"
                                : "1px solid var(--border-color)",
                            fontWeight: theme === "light" ? "600" : "500",
                          }}
                        >
                          ☀️ Светлая
                        </SecondaryButton>
                        <SecondaryButton
                          onClick={() => {
                            if (theme !== "dark") toggleTheme();
                          }}
                          style={{
                            background:
                              theme === "dark"
                                ? "var(--primary-500)"
                                : "var(--bg-primary)",
                            color:
                              theme === "dark"
                                ? "white"
                                : "var(--text-primary)",
                            border:
                              theme === "dark"
                                ? "1px solid var(--primary-500)"
                                : "1px solid var(--border-color)",
                            fontWeight: theme === "dark" ? "600" : "500",
                          }}
                        >
                          🌙 Темная
                        </SecondaryButton>
                      </Flex>
                    </div>
                  </div>
                </div>
              )}

              {/* User Settings Section */}
              {activeTab === "user" && (
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "1rem" }}
                  >
                    <User size={18} style={{ color: "var(--primary-600)" }} />
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      Настройки пользователя
                    </h3>
                  </Flex>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                      padding: "1rem",
                      background: "var(--bg-secondary)",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {/* Username Change */}
                    <div>
                      <Flex
                        $align="center"
                        $gap="0.5rem"
                        style={{ marginBottom: "0.75rem" }}
                      >
                        <User
                          size={16}
                          style={{ color: "var(--primary-600)" }}
                        />
                        <Text
                          $size="0.875rem"
                          $weight="500"
                          $color="var(--text-primary)"
                        >
                          Имя пользователя
                        </Text>
                      </Flex>
                      <form onSubmit={handleSubmitUsername(onSubmitUsername)}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Input
                            {...registerUsername("username", {
                              required: "Введите имя пользователя",
                              minLength: {
                                value: 3,
                                message: "Минимум 3 символа",
                              },
                              maxLength: {
                                value: 30,
                                message: "Максимум 30 символов",
                              },
                              pattern: {
                                value: /^[а-яёА-ЯЁa-zA-Z0-9_-]+$/,
                                message:
                                  "Только буквы, цифры, дефисы и подчеркивания",
                              },
                            })}
                            placeholder="Введите новое имя пользователя"
                            style={{ flex: 1 }}
                          />
                          <PrimaryButton
                            type="submit"
                            disabled={loading}
                            style={{ padding: "0.75rem 1rem" }}
                          >
                            <Save size={16} />
                          </PrimaryButton>
                        </div>
                        {errorsUsername.username && (
                          <Text
                            $color="var(--danger-500)"
                            $size="0.75rem"
                            style={{ marginTop: "0.5rem", display: "block" }}
                          >
                            {errorsUsername.username.message}
                          </Text>
                        )}
                      </form>
                    </div>

                    {/* Password Change */}
                    <div>
                      <Flex
                        $align="center"
                        $gap="0.5rem"
                        style={{ marginBottom: "0.75rem" }}
                      >
                        <Lock
                          size={16}
                          style={{ color: "var(--primary-600)" }}
                        />
                        <Text
                          $size="0.875rem"
                          $weight="500"
                          $color="var(--text-primary)"
                        >
                          Смена пароля
                        </Text>
                      </Flex>
                      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <Input
                              {...registerPassword("current_password", {
                                required: "Введите текущий пароль",
                              })}
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Текущий пароль"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "0.75rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                              }}
                            >
                              {showCurrentPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          <div style={{ position: "relative" }}>
                            <Input
                              {...registerPassword("new_password", {
                                required: "Введите новый пароль",
                                minLength: {
                                  value: 6,
                                  message: "Минимум 6 символов",
                                },
                              })}
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Новый пароль"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "0.75rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                              }}
                            >
                              {showNewPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          <div style={{ position: "relative" }}>
                            <Input
                              {...registerPassword("confirm_password", {
                                required: "Подтвердите пароль",
                                validate: (value) =>
                                  value === newPassword ||
                                  "Пароли не совпадают",
                              })}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Подтвердите новый пароль"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{
                                position: "absolute",
                                right: "0.75rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                              }}
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                          <PrimaryButton
                            type="submit"
                            disabled={loading}
                            style={{ width: "100%" }}
                          >
                            <Save size={16} style={{ marginRight: "0.5rem" }} />
                            {loading ? "Сохранение..." : "Сохранить пароль"}
                          </PrimaryButton>
                        </div>
                        {errorsPassword.current_password && (
                          <Text
                            $color="var(--danger-500)"
                            $size="0.75rem"
                            style={{ marginTop: "0.5rem", display: "block" }}
                          >
                            {errorsPassword.current_password.message}
                          </Text>
                        )}
                        {errorsPassword.new_password && (
                          <Text
                            $color="var(--danger-500)"
                            $size="0.75rem"
                            style={{ marginTop: "0.5rem", display: "block" }}
                          >
                            {errorsPassword.new_password.message}
                          </Text>
                        )}
                        {errorsPassword.confirm_password && (
                          <Text
                            $color="var(--danger-500)"
                            $size="0.75rem"
                            style={{ marginTop: "0.5rem", display: "block" }}
                          >
                            {errorsPassword.confirm_password.message}
                          </Text>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management Section */}
              {activeTab === "data" && (
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "1rem" }}
                  >
                    <Database
                      size={18}
                      style={{ color: "var(--primary-600)" }}
                    />
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      Управление данными
                    </h3>
                  </Flex>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      padding: "1rem",
                      background: "var(--bg-secondary)",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <Grid $columns="1fr 1fr" $gap="1rem">
                      <PrimaryButton onClick={handleExportData}>
                        <Download size={16} />
                        Экспорт данных
                      </PrimaryButton>
                      <SecondaryButton onClick={handleImportData}>
                        <Upload size={16} />
                        Импорт данных
                      </SecondaryButton>
                    </Grid>

                    <div
                      style={{
                        padding: "1rem",
                        background: "var(--danger-50)",
                        borderRadius: "0.5rem",
                        border: "1px solid var(--danger-200)",
                      }}
                    >
                      <Text
                        $size="0.875rem"
                        $weight="500"
                        $color="var(--danger-600)"
                        style={{ marginBottom: "0.5rem", display: "block" }}
                      >
                        Опасная зона
                      </Text>
                      <Text
                        $size="0.75rem"
                        $color="var(--danger-600)"
                        style={{ marginBottom: "1rem", display: "block" }}
                      >
                        Это действие удалит все ваши задачи без возможности
                        восстановления.
                      </Text>
                      <SecondaryButton
                        onClick={handleClearData}
                        className="text-[var(--danger-600)] border-[var(--danger-300)] hover:bg-[var(--danger-50)]"
                      >
                        🗑️ Очистить все данные
                      </SecondaryButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
