import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Tag, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useTaskStore,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from "../store/useTaskStore";
import {
  Card,
  Input,
  Select,
  PrimaryButton,
  SecondaryButton,
  Flex,
  Grid,
  Text,
} from "../styles/styled";

const AddTask = ({ showWelcome = false }) => {
  const { addTask, getAllCategories } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: "",
      category: "general",
      priority: "medium",
      dueDate: "",
    },
  });

  const onSubmit = (data) => {
    if (!data.text.trim()) {
      return;
    }

    addTask({
      text: data.text.trim(),
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
    });

    reset();
    setIsExpanded(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const allCategories = getAllCategories();

  return (
    <Card style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Welcome Message for Empty State */}
        {showWelcome && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Добро пожаловать в To-Do Pro! 🎉
              </h2>
              <Text
                $size="1rem"
                $color="var(--text-secondary)"
                style={{ margin: 0 }}
              >
                Создайте свою первую задачу, чтобы начать работу
              </Text>
            </motion.div>
          </div>
        )}

        {/* Header */}
        <div>
          <Flex
            $align="center"
            $gap="0.5rem"
            style={{ marginBottom: "0.75rem" }}
          >
            <Plus size={18} style={{ color: "var(--primary-600)" }} />
            <Text $size="0.875rem" $weight="500" $color="var(--text-primary)">
              {showWelcome ? "Создайте первую задачу" : "Быстрое добавление"}
            </Text>
          </Flex>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Main Input */}
          <div style={{ position: "relative" }}>
            <Input
              {...register("text", {
                required: "Пожалуйста, введите текст задачи",
              })}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Введите текст новой задачи..."
              maxLength={200}
              style={{ paddingRight: "3rem" }}
            />
            <PrimaryButton
              type="submit"
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "0.5rem",
              }}
              data-shortcut="add-task"
            >
              <Plus size={16} />
            </PrimaryButton>
          </div>

          {errors.text && (
            <Text $color="var(--danger-500)" $size="0.875rem">
              {errors.text.message}
            </Text>
          )}

          {/* Expanded Options */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "1.5rem",
                background: "var(--bg-secondary)",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-color)",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
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
                      {Object.entries(allCategories).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.icon ? `${category.icon} ` : ""}
                          {category.label}
                        </option>
                      ))}
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
                      {Object.entries(TASK_PRIORITIES).map(
                        ([key, priority]) => (
                          <option key={key} value={key}>
                            {priority.label}
                          </option>
                        )
                      )}
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
                  <SecondaryButton
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Свернуть
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Добавить задачу
                  </PrimaryButton>
                </Flex>
              </div>
            </div>
          </motion.div>
        </form>

        {/* Quick Add Buttons */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "1rem",
              background: "var(--bg-secondary)",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-color)",
            }}
          >
            <Text
              $size="0.875rem"
              $weight="500"
              $color="var(--text-primary)"
              style={{ marginBottom: "0.75rem", display: "block" }}
            >
              Быстрые шаблоны:
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                <SecondaryButton
                  key={key}
                  onClick={() => {
                    reset({ category: key });
                    setIsExpanded(true);
                    const input = document.querySelector('input[type="text"]');
                    input?.focus();
                  }}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.5rem 0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--primary-50)";
                    e.target.style.borderColor = "var(--primary-300)";
                    e.target.style.color = "var(--primary-600)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--bg-primary)";
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.color = "var(--text-primary)";
                  }}
                >
                  <span style={{ marginRight: "0.25rem" }}>
                    {category.icon}
                  </span>
                  {category.label}
                </SecondaryButton>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default AddTask;
