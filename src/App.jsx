import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useTaskStore } from "./store/useTaskStore";
import { useTheme } from "./contexts/ThemeContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { Container, AppWrapper } from "./styles/styled";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import Filters from "./components/Filters";
import StatsModal from "./components/StatsModal";
import SettingsModal from "./components/SettingsModal";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  const { theme, isDark } = useTheme();
  const { tasks } = useTaskStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <AuthWrapper>
      <Helmet>
        <title>To-Do Pro</title>
        <meta
          name="description"
          content="Современное приложение для управления задачами с красивым дизайном и множеством функций"
        />
        <meta name="theme-color" content={isDark ? "#1f2937" : "#6366f1"} />
      </Helmet>

      <AppWrapper>
        <Header />

        <main style={{ padding: "2rem 0" }}>
          <Container>
            {tasks.length === 0 ? (
              // Empty state - center the AddTask component
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "60vh",
                  gap: "2rem",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    maxWidth: "500px",
                    width: "100%",
                  }}
                >
                  <AddTask showWelcome={true} />
                </motion.div>
              </motion.div>
            ) : (
              // Normal state with tasks
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Add Task Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <AddTask />
                </motion.div>

                {/* Filters Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Filters />
                </motion.div>

                {/* Task List Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <TaskList />
                </motion.div>
              </motion.div>
            )}
          </Container>
        </main>

        {/* Modals */}
        <StatsModal />
        <SettingsModal />
      </AppWrapper>
    </AuthWrapper>
  );
}

export default App;
