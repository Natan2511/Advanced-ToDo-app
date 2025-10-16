import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  useTaskStore,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from "../store/useTaskStore";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  Grid,
  Text,
  GhostButton,
} from "../styles/styled";

const StatsModal = () => {
  const { getStats, getAllCategories } = useTaskStore();
  const stats = getStats();

  const closeModal = () => {
    const modal = document.getElementById("stats-modal");
    if (modal) {
      modal.classList.remove("active");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const getCompletionPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getOverduePercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.overdue / stats.total) * 100);
  };

  return (
    <AnimatePresence>
      <div
        id="stats-modal"
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
                <BarChart3 size={20} style={{ color: "var(--primary-600)" }} />
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
                  Статистика
                </h2>
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  Обзор ваших задач
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

          {/* Content */}
          <ModalBody>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Overview Stats */}
              <Grid $columns="repeat(auto-fit, minmax(200px, 1fr))" $gap="1rem">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    background: "var(--primary-50)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--primary-200)",
                  }}
                >
                  <Flex $align="center" $gap="0.75rem">
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        background: "var(--primary-500)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BarChart3 size={16} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "var(--primary-600)",
                          margin: 0,
                        }}
                      >
                        {stats.total}
                      </p>
                      <Text $size="0.875rem" $color="var(--primary-600)">
                        Всего задач
                      </Text>
                    </div>
                  </Flex>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: "var(--success-50)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--success-200)",
                  }}
                >
                  <Flex $align="center" $gap="0.75rem">
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        background: "var(--success-500)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle2 size={16} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "var(--success-600)",
                          margin: 0,
                        }}
                      >
                        {stats.completed}
                      </p>
                      <Text $size="0.875rem" $color="var(--success-600)">
                        Завершено
                      </Text>
                    </div>
                  </Flex>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    background: "var(--warning-50)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--warning-200)",
                  }}
                >
                  <Flex $align="center" $gap="0.75rem">
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        background: "var(--warning-500)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Clock size={16} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "var(--warning-600)",
                          margin: 0,
                        }}
                      >
                        {stats.pending}
                      </p>
                      <Text $size="0.875rem" $color="var(--warning-600)">
                        В процессе
                      </Text>
                    </div>
                  </Flex>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    background: "var(--danger-50)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--danger-200)",
                  }}
                >
                  <Flex $align="center" $gap="0.75rem">
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        background: "var(--danger-500)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AlertTriangle size={16} style={{ color: "white" }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "var(--danger-600)",
                          margin: 0,
                        }}
                      >
                        {stats.overdue}
                      </p>
                      <Text $size="0.875rem" $color="var(--danger-600)">
                        Просрочено
                      </Text>
                    </div>
                  </Flex>
                </motion.div>
              </Grid>

              {/* Progress Bars */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  Прогресс
                </h3>

                {/* Completion Progress */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Flex $justify="space-between" $align="center">
                    <Text $size="0.875rem" $color="var(--text-secondary)">
                      Завершение задач
                    </Text>
                    <Text $size="0.875rem" $weight="500">
                      {getCompletionPercentage()}%
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
                      animate={{ width: `${getCompletionPercentage()}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      style={{
                        background:
                          "linear-gradient(to right, var(--success-500), var(--success-600))",
                        height: "0.5rem",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                </div>

                {/* Overdue Progress */}
                {stats.overdue > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <Flex $justify="space-between" $align="center">
                      <Text $size="0.875rem" $color="var(--text-secondary)">
                        Просроченные задачи
                      </Text>
                      <Text
                        $size="0.875rem"
                        $weight="500"
                        $color="var(--danger-600)"
                      >
                        {getOverduePercentage()}%
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
                        animate={{ width: `${getOverduePercentage()}%` }}
                        transition={{
                          delay: 0.6,
                          duration: 1,
                          ease: "easeOut",
                        }}
                        style={{
                          background:
                            "linear-gradient(to right, var(--danger-500), var(--danger-600))",
                          height: "0.5rem",
                          borderRadius: "9999px",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  По категориям
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {Object.entries(stats.byCategory).map(
                    ([category, count], index) => {
                      const allCategories = getAllCategories();
                      const categoryInfo = allCategories[category] || {
                        label: category || "Неизвестно",
                        color: "gray",
                        icon: "❓",
                      };
                      const percentage =
                        stats.total > 0
                          ? Math.round((count / stats.total) * 100)
                          : 0;

                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem",
                            background: "var(--bg-secondary)",
                            borderRadius: "0.75rem",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          <Flex $align="center" $gap="1rem">
                            <div
                              style={{
                                width: "3rem",
                                height: "3rem",
                                background: `var(--${categoryInfo.color}-100)`,
                                borderRadius: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid var(--${categoryInfo.color}-200)`,
                              }}
                            >
                              {categoryInfo.icon && (
                                <span style={{ fontSize: "1.5rem" }}>
                                  {categoryInfo.icon}
                                </span>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <Text
                                $weight="600"
                                $size="1rem"
                                style={{
                                  marginBottom: "0.25rem",
                                  display: "block",
                                }}
                              >
                                {categoryInfo.label}
                              </Text>
                              <Text
                                $size="0.75rem"
                                $color="var(--text-muted)"
                                style={{ display: "block" }}
                              >
                                {percentage}% от общего количества
                              </Text>
                            </div>
                          </Flex>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: "0.5rem",
                            }}
                          >
                            <Text
                              $size="1.5rem"
                              $weight="700"
                              style={{
                                color: `var(--${categoryInfo.color}-600)`,
                                lineHeight: 1,
                              }}
                            >
                              {count}
                            </Text>
                            <div
                              style={{
                                width: "5rem",
                                height: "0.5rem",
                                background: "var(--bg-tertiary)",
                                borderRadius: "9999px",
                                overflow: "hidden",
                              }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                  delay: 0.8 + index * 0.1,
                                  duration: 0.8,
                                }}
                                style={{
                                  height: "100%",
                                  background: `var(--${categoryInfo.color}-500)`,
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Priority Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    margin: 0,
                  }}
                >
                  По приоритетам
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {Object.entries(stats.byPriority).map(
                    ([priority, count], index) => {
                      const priorityInfo = TASK_PRIORITIES[priority] || {
                        label: priority || "Неизвестно",
                        color: "gray",
                        icon: "❓",
                      };
                      const percentage =
                        stats.total > 0
                          ? Math.round((count / stats.total) * 100)
                          : 0;

                      return (
                        <motion.div
                          key={priority}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem",
                            background: "var(--bg-secondary)",
                            borderRadius: "0.75rem",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          <Flex $align="center" $gap="1rem">
                            <div
                              style={{
                                width: "3rem",
                                height: "3rem",
                                background: `var(--${priorityInfo.color}-100)`,
                                borderRadius: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid var(--${priorityInfo.color}-200)`,
                                boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
                              }}
                            >
                              <div
                                style={{
                                  width: "2rem",
                                  height: "2rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{ fontSize: "1rem", color: "white" }}
                                >
                                  {priorityInfo.icon}
                                </span>
                              </div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <Text
                                $weight="600"
                                $size="1rem"
                                style={{
                                  marginBottom: "0.25rem",
                                  display: "block",
                                }}
                              >
                                {priorityInfo.label}
                              </Text>
                              <Text
                                $size="0.75rem"
                                $color="var(--text-muted)"
                                style={{ display: "block" }}
                              >
                                {percentage}% от общего количества
                              </Text>
                            </div>
                          </Flex>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: "0.5rem",
                            }}
                          >
                            <Text
                              $size="1.5rem"
                              $weight="700"
                              style={{
                                color: `var(--${priorityInfo.color}-600)`,
                                lineHeight: 1,
                              }}
                            >
                              {count}
                            </Text>
                            <div
                              style={{
                                width: "5rem",
                                height: "0.5rem",
                                background: "var(--bg-tertiary)",
                                borderRadius: "9999px",
                                overflow: "hidden",
                              }}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                  delay: 1.0 + index * 0.1,
                                  duration: 0.8,
                                }}
                                style={{
                                  height: "100%",
                                  background: `var(--${priorityInfo.color}-500)`,
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </div>
    </AnimatePresence>
  );
};

export default StatsModal;
