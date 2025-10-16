import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Calendar, Tag, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
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
  Text,
  GhostButton,
  PrimaryButton,
  Input,
  Select,
  Grid,
} from "../styles/styled";

const EditTaskModal = ({ task, isOpen, onClose }) => {
  const { updateTask, getAllCategories } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: task?.text || "",
      category: task?.category || "general",
      priority: task?.priority || "medium",
      dueDate: task?.dueDate || "",
    },
  });

  useEffect(() => {
    if (task && isOpen) {
      reset({
        text: task.text,
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate || "",
      });
    }
  }, [task, isOpen, reset]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    if (!task) return;

    setIsSubmitting(true);
    try {
      updateTask(task.id, {
        text: data.text.trim(),
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      });
      onClose();
    } catch (error) {
      // Ошибка обновления задачи
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
        }}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            maxWidth: "500px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            background: "var(--bg-primary)",
            borderRadius: "1rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid var(--border-color)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 1.5rem 0 1.5rem",
            }}
          >
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
                <Save size={20} style={{ color: "var(--primary-600)" }} />
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
                  Редактировать задачу
                </h2>
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  Изменить параметры задачи
                </Text>
              </div>
            </Flex>
            <GhostButton onClick={onClose} title="Закрыть">
              <X size={20} />
            </GhostButton>
          </div>

          {/* Body */}
          <div style={{ padding: "1.5rem" }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Task Text */}
              <div>
                <Text
                  $size="0.875rem"
                  $weight="500"
                  $color="var(--text-primary)"
                  style={{ marginBottom: "0.75rem", display: "block" }}
                >
                  Текст задачи
                </Text>
                <Input
                  {...register("text", {
                    required: "Пожалуйста, введите текст задачи",
                    minLength: {
                      value: 1,
                      message: "Текст задачи не может быть пустым",
                    },
                    maxLength: {
                      value: 200,
                      message: "Текст задачи не может превышать 200 символов",
                    },
                  })}
                  placeholder="Введите текст задачи..."
                  maxLength={200}
                />
                {errors.text && (
                  <Text
                    $color="var(--danger-500)"
                    $size="0.75rem"
                    style={{ marginTop: "0.5rem", display: "block" }}
                  >
                    {errors.text.message}
                  </Text>
                )}
              </div>

              {/* Task Properties */}
              <Grid
                $columns="repeat(auto-fit, minmax(200px, 1fr))"
                $gap="1.5rem"
              >
                {/* Category */}
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <Tag size={18} style={{ color: "var(--primary-600)" }} />
                    <Text
                      $size="0.875rem"
                      $weight="500"
                      $color="var(--text-primary)"
                    >
                      Категория
                    </Text>
                  </Flex>
                  <Select {...register("category")}>
                    {Object.entries(getAllCategories()).map(
                      ([key, category]) => (
                        <option key={key} value={key}>
                          {category.icon ? `${category.icon} ` : ""}
                          {category.label}
                        </option>
                      )
                    )}
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <AlertCircle
                      size={18}
                      style={{ color: "var(--primary-600)" }}
                    />
                    <Text
                      $size="0.875rem"
                      $weight="500"
                      $color="var(--text-primary)"
                    >
                      Приоритет
                    </Text>
                  </Flex>
                  <Select {...register("priority")}>
                    {Object.entries(TASK_PRIORITIES).map(([key, priority]) => (
                      <option key={key} value={key}>
                        {priority.icon} {priority.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Due Date */}
                <div>
                  <Flex
                    $align="center"
                    $gap="0.5rem"
                    style={{ marginBottom: "0.75rem" }}
                  >
                    <Calendar
                      size={18}
                      style={{ color: "var(--primary-600)" }}
                    />
                    <Text
                      $size="0.875rem"
                      $weight="500"
                      $color="var(--text-primary)"
                    >
                      Срок выполнения
                    </Text>
                  </Flex>
                  <Input
                    type="date"
                    {...register("dueDate")}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </Grid>

              {/* Action Buttons */}
              <Flex
                $justify="flex-end"
                $gap="0.75rem"
                style={{
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <GhostButton
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Отмена
                </GhostButton>
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить"}
                </PrimaryButton>
              </Flex>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default EditTaskModal;
