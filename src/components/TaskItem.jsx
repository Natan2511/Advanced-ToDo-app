import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Edit2,
  Trash2,
  Copy,
  Calendar,
  Clock,
  AlertTriangle,
  Settings,
  Save,
  X,
} from "lucide-react";
import {
  useTaskStore,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from "../store/useTaskStore";
import { formatTaskDate, formatCreatedDate } from "../utils";
import EditTaskModal from "./EditTaskModal";
import {
  Card,
  Flex,
  Text,
  GhostButton,
  DangerButton,
  PrimaryBadge,
  SuccessBadge,
  WarningBadge,
  DangerBadge,
  Checkbox,
} from "../styles/styled";

const TaskItem = ({ task }) => {
  const {
    toggleTask,
    deleteTask,
    duplicateTask,
    updateTask,
    isTaskOverdue,
    getCategoryInfo,
  } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isOverdue = isTaskOverdue(task);
  const categoryInfo = getCategoryInfo(task.category) || {
    label: task.category || "Неизвестно",
    color: "gray",
    icon: "❓",
  };
  const priorityInfo = TASK_PRIORITIES[task.priority] || TASK_PRIORITIES.medium;

  const handleToggle = (e) => {
    if (isToggling) return;

    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    toggleTask(task.id);

    // Reset toggle state after a short delay
    setTimeout(() => {
      setIsToggling(false);
    }, 200);
  };

  const handleDelete = () => {
    if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
      deleteTask(task.id);
    }
  };

  const handleDuplicate = () => {
    duplicateTask(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== task.text) {
      updateTask(task.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const getCategoryBadge = () => {
    const colorMap = {
      general: {
        bg: "var(--primary-100)",
        color: "var(--primary-800)",
        border: "var(--primary-200)",
      },
      work: {
        bg: "var(--purple-100)",
        color: "var(--purple-800)",
        border: "var(--purple-200)",
      },
      personal: {
        bg: "var(--cyan-100)",
        color: "var(--cyan-800)",
        border: "var(--cyan-200)",
      },
      shopping: {
        bg: "var(--orange-100)",
        color: "var(--orange-800)",
        border: "var(--orange-200)",
      },
      health: {
        bg: "var(--green-100)",
        color: "var(--green-800)",
        border: "var(--green-200)",
      },
      study: {
        bg: "var(--indigo-100)",
        color: "var(--indigo-800)",
        border: "var(--indigo-200)",
      },
      finance: {
        bg: "var(--emerald-100)",
        color: "var(--emerald-800)",
        border: "var(--emerald-200)",
      },
      home: {
        bg: "var(--amber-100)",
        color: "var(--amber-800)",
        border: "var(--amber-200)",
      },
      travel: {
        bg: "var(--sky-100)",
        color: "var(--sky-800)",
        border: "var(--sky-200)",
      },
      hobby: {
        bg: "var(--pink-100)",
        color: "var(--pink-800)",
        border: "var(--pink-200)",
      },
      family: {
        bg: "var(--rose-100)",
        color: "var(--rose-800)",
        border: "var(--rose-200)",
      },
      sport: {
        bg: "var(--lime-100)",
        color: "var(--lime-800)",
        border: "var(--lime-200)",
      },
      other: {
        bg: "var(--gray-100)",
        color: "var(--gray-800)",
        border: "var(--gray-200)",
      },
    };

    const colors = colorMap[task.category] || colorMap.general;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.7rem",
          fontWeight: "600",
          padding: "0.375rem 0.625rem",
          borderRadius: "9999px",
          background: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          "@media (min-width: 640px)": {
            gap: "0.375rem",
            fontSize: "0.75rem",
            padding: "0.5rem 0.875rem",
          },
        }}
      >
        {categoryInfo.icon ? (
          <span
            style={{
              fontSize: "0.75rem",
              "@media (min-width: 640px)": {
                fontSize: "0.875rem",
              },
            }}
          >
            {categoryInfo.icon}
          </span>
        ) : null}
        {categoryInfo.label}
      </span>
    );
  };

  const getPriorityBadge = () => {
    const colorMap = {
      low: {
        bg: "var(--success-100)",
        color: "var(--success-800)",
        border: "var(--success-200)",
      },
      medium: {
        bg: "var(--warning-100)",
        color: "var(--warning-800)",
        border: "var(--warning-200)",
      },
      high: {
        bg: "var(--danger-100)",
        color: "var(--danger-800)",
        border: "var(--danger-200)",
      },
    };

    const colors = colorMap[task.priority] || colorMap.medium;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.7rem",
          fontWeight: "600",
          padding: "0.375rem 0.625rem",
          borderRadius: "9999px",
          background: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          "@media (min-width: 640px)": {
            gap: "0.375rem",
            fontSize: "0.75rem",
            padding: "0.5rem 0.875rem",
          },
        }}
      >
        <div
          style={{
            width: "0.375rem",
            height: "0.375rem",
            borderRadius: "50%",
            background: colors.color,
            "@media (min-width: 640px)": {
              width: "0.5rem",
              height: "0.5rem",
            },
          }}
        />
        {priorityInfo.label}
      </span>
    );
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md hover:border-[var(--primary-200)] dark:hover:border-[var(--primary-800)] ${
        task.completed ? "opacity-75" : ""
      } ${
        isOverdue && !task.completed
          ? "border-[var(--warning-300)] dark:border-[var(--warning-700)] bg-[var(--warning-50)]/50 dark:bg-[var(--warning-900)]/20"
          : ""
      }`}
      style={{
        padding: "1rem",
        marginBottom: "0.75rem",
        position: "relative",
        "@media (min-width: 640px)": {
          padding: "1.25rem",
        },
      }}
    >
      {/* Unified Layout */}
      <Flex
        $gap="0.5rem"
        style={{
          flexDirection: "column",
          gap: "0.75rem",
          "@media (min-width: 640px)": {
            flexDirection: "row",
            gap: "0.75rem",
          },
        }}
      >
        {/* Checkbox + Content Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            width: "100%",
            "@media (min-width: 640px)": {
              flex: 1,
              minWidth: 0,
            },
          }}
        >
          {/* Checkbox */}
          <Checkbox
            onClick={handleToggle}
            className={task.completed ? "completed" : ""}
            style={{
              width: "1.25rem",
              height: "1.25rem",
              flexShrink: 0,
              cursor: isToggling ? "not-allowed" : "pointer",
              opacity: isToggling ? 0.7 : 1,
              transition: "transform 0.1s ease, opacity 0.2s ease",
              "@media (min-width: 640px)": {
                width: "1.5rem",
                height: "1.5rem",
              },
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {task.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check size={12} />
              </motion.div>
            ) : null}
          </Checkbox>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Task Text */}
            {isEditing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.5rem",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--primary-500)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(99, 102, 241, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                  autoFocus
                />
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <GhostButton
                    onClick={() => {
                      setEditText(task.text);
                      setIsEditing(false);
                    }}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <X size={14} style={{ marginRight: "0.25rem" }} />
                    Отмена
                  </GhostButton>
                  <GhostButton
                    onClick={handleSaveEdit}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "var(--primary-600)",
                      border: "1px solid var(--primary-300)",
                      background: "var(--primary-50)",
                    }}
                  >
                    <Save size={14} style={{ marginRight: "0.25rem" }} />
                    Сохранить
                  </GhostButton>
                </div>
              </div>
            ) : (
              <motion.p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--text-primary)",
                  lineHeight: "1.5",
                  margin: 0,
                  marginBottom: "0.75rem",
                  wordBreak: "break-word",
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.7 : 1,
                  "@media (min-width: 640px)": {
                    marginBottom: "1rem",
                  },
                }}
                initial={false}
                animate={{
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.7 : 1,
                }}
              >
                {task.text}
              </motion.p>
            )}

            {/* Task Meta */}
            {!isEditing && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  "@media (min-width: 640px)": {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.75rem",
                  },
                }}
              >
                {/* All meta info in one row on desktop, wrapped on mobile */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.375rem",
                    width: "100%",
                    "@media (min-width: 640px)": {
                      flexWrap: "nowrap",
                      gap: "0.5rem",
                      width: "auto",
                    },
                  }}
                >
                  {/* Category and Priority */}
                  {getCategoryBadge()}
                  {getPriorityBadge()}

                  {/* Due Date */}
                  {task.dueDate ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "0.7rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "9999px",
                        fontWeight: "500",
                        background:
                          isOverdue && !task.completed
                            ? "var(--warning-100)"
                            : "var(--bg-tertiary)",
                        color:
                          isOverdue && !task.completed
                            ? "var(--warning-800)"
                            : "var(--text-secondary)",
                        border:
                          isOverdue && !task.completed
                            ? "1px solid var(--warning-200)"
                            : "1px solid var(--border-color)",
                        "@media (min-width: 640px)": {
                          fontSize: "0.75rem",
                          padding: "0.375rem 0.75rem",
                        },
                      }}
                    >
                      <Calendar size={12} />
                      {formatTaskDate(task.dueDate)}
                      {isOverdue && !task.completed ? (
                        <AlertTriangle
                          size={12}
                          style={{ color: "var(--warning-600)" }}
                        />
                      ) : null}
                    </span>
                  ) : null}

                  {/* Created Date */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.7rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      fontWeight: "500",
                      color: "var(--text-muted)",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      "@media (min-width: 640px)": {
                        fontSize: "0.75rem",
                        padding: "0.375rem 0.75rem",
                      },
                    }}
                  >
                    <Clock size={12} />
                    {formatCreatedDate(task.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isEditing && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              "@media (min-width: 640px)": {
                justifyContent: "flex-start",
              },
            }}
          >
            <GhostButton
              onClick={handleEdit}
              className="p-1.5 hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] dark:hover:bg-[var(--primary-900)]/20 dark:hover:text-[var(--primary-400)]"
              title="Быстрое редактирование"
            >
              <Edit2 size={16} />
            </GhostButton>

            <GhostButton
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] dark:hover:bg-[var(--primary-900)]/20 dark:hover:text-[var(--primary-400)]"
              title="Полное редактирование"
            >
              <Settings size={16} />
            </GhostButton>

            <GhostButton
              onClick={handleDuplicate}
              className="p-1.5 hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] dark:hover:bg-[var(--primary-900)]/20 dark:hover:text-[var(--primary-400)]"
              title="Дублировать"
            >
              <Copy size={16} />
            </GhostButton>

            <GhostButton
              onClick={handleDelete}
              className="p-1.5 hover:bg-[var(--danger-50)] hover:text-[var(--danger-600)] dark:hover:bg-[var(--danger-900)]/20 dark:hover:text-[var(--danger-400)]"
              title="Удалить"
            >
              <Trash2 size={16} />
            </GhostButton>
          </div>
        )}
      </Flex>

      {/* Completion Animation */}
      {task.completed && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-0.5 bg-[var(--success-500)]"
        />
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Card>
  );
};

export default TaskItem;
