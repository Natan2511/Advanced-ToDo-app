import React, { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, BarChart3, Settings, LogOut, User } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Flex,
  Text,
  PrimaryButton,
  GhostButton,
  HeaderWrapper,
  Logo,
  Controls,
  ProgressBar,
} from "../styles/styled";
import styled from "styled-components";

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.75rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
    width: 100%;
    justify-content: center;
  }
`;

const Header = () => {
  const { getStats } = useTaskStore();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const stats = getStats();

  const handleStatsClick = () => {
    const modal = document.getElementById("stats-modal");
    if (modal) {
      modal.classList.add("active");
    }
  };

  const handleSettingsClick = () => {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.classList.add("active");
    }
  };

  return (
    <HeaderWrapper
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container>
        <div style={{ padding: "1rem 0" }}>
          <HeaderContent>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Logo>
                <div>
                  <span>✓</span>
                </div>
                <div>
                  <h1>To-Do Pro</h1>
                  <Text $size="0.875rem" $color="var(--text-secondary)">
                    {stats.total} задач
                  </Text>
                </div>
              </Logo>
            </motion.div>

            {/* Controls */}
            <Controls
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ControlsWrapper>
                {/* User Info */}
                {user && (
                  <UserInfo>
                    <User
                      size={16}
                      style={{ color: "var(--text-secondary)" }}
                    />
                    <Text $size="0.875rem" $color="var(--text-secondary)">
                      {user.username}
                    </Text>
                  </UserInfo>
                )}

                {/* Stats Button */}
                <GhostButton onClick={handleStatsClick} title="Статистика">
                  <BarChart3 size={16} />
                </GhostButton>

                {/* Theme Toggle */}
                <GhostButton
                  onClick={toggleTheme}
                  title="Переключить тему"
                  data-shortcut="theme"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </GhostButton>

                {/* Settings Button */}
                <GhostButton onClick={handleSettingsClick} title="Настройки">
                  <Settings size={16} />
                </GhostButton>

                {/* Logout Button */}
                <GhostButton
                  onClick={logout}
                  title="Выйти"
                  style={{
                    color: "var(--danger-500)",
                  }}
                >
                  <LogOut size={16} />
                </GhostButton>
              </ControlsWrapper>
            </Controls>
          </HeaderContent>

          {/* Progress Bar */}
          {stats.total > 0 && (
            <ProgressBar
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Flex
                $justify="space-between"
                $align="center"
                style={{ marginBottom: "0.5rem" }}
              >
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  Прогресс
                </Text>
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </Text>
              </Flex>
              <div
                style={{
                  width: "100%",
                  background: "var(--bg-tertiary)",
                  borderRadius: "9999px",
                  height: "0.5rem",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.completed / stats.total) * 100}%`,
                  }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                    height: "0.5rem",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </ProgressBar>
          )}
        </div>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
