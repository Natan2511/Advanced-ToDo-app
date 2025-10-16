import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import { Card, Flex, Text, PrimaryButton } from "../styles/styled";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { getFilteredTasks, getStats } = useTaskStore();
  const filteredTasks = getFilteredTasks();
  const stats = getStats();

  if (filteredTasks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-4 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center"
        >
          {stats.total === 0 ? (
            <ClipboardList size={32} className="text-[var(--text-muted)]" />
          ) : (
            <CheckCircle2 size={32} className="text-[var(--success-500)]" />
          )}
        </motion.div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {stats.total === 0 ? "Нет задач" : "Задачи не найдены"}
        </h3>

        <Text $color="var(--text-secondary)" style={{ marginBottom: "1.5rem" }}>
          {stats.total === 0
            ? "Добавьте свою первую задачу, чтобы начать!"
            : "Попробуйте изменить фильтры или поисковый запрос."}
        </Text>

        {stats.total === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PrimaryButton
              onClick={() => {
                const input = document.querySelector('input[type="text"]');
                input?.focus();
              }}
            >
              Добавить первую задачу
            </PrimaryButton>
          </motion.div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Header */}
      <Flex $justify="space-between" $align="center">
        <Flex $align="center" $gap="0.75rem">
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Задачи
          </h2>
          <span
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              background: "var(--primary-100)",
              color: "var(--primary-800)",
              borderRadius: "9999px",
            }}
          >
            {filteredTasks.length}
          </span>
        </Flex>

        {/* Progress Indicator */}
        {filteredTasks.length > 0 && (
          <Flex
            $align="center"
            $gap="0.5rem"
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            <Text $size="0.875rem" $color="var(--text-secondary)">
              Прогресс:
            </Text>
            <Flex $align="center" $gap="0.25rem">
              <div
                style={{
                  width: "4rem",
                  background: "var(--bg-tertiary)",
                  borderRadius: "9999px",
                  height: "0.375rem",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (filteredTasks.filter((task) => task.completed).length /
                        filteredTasks.length) *
                      100
                    }%`,
                  }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  style={{
                    background:
                      "linear-gradient(to right, var(--primary-500), var(--primary-600))",
                    height: "0.375rem",
                    borderRadius: "9999px",
                  }}
                />
              </div>
              <Text $size="0.75rem" $weight="500">
                {filteredTasks.length > 0
                  ? Math.round(
                      (filteredTasks.filter((task) => task.completed).length /
                        filteredTasks.length) *
                        100
                    )
                  : 0}
                %
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>

      {/* Task Items */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TaskItem task={task} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* List Footer */}
      {filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--border-color)]"
        >
          <Flex $align="center" $gap="1rem">
            <Text $size="0.875rem" $color="var(--text-secondary)">
              Завершено: {filteredTasks.filter((task) => task.completed).length}{" "}
              из {filteredTasks.length}
            </Text>
            {filteredTasks.some((task) =>
              useTaskStore.getState().isTaskOverdue(task)
            ) && (
              <Text $size="0.875rem" $color="var(--warning-600)">
                ⚠️ Есть просроченные задачи
              </Text>
            )}
          </Flex>

          <Flex $align="center" $gap="0.5rem">
            <Text $size="0.875rem" $color="var(--text-secondary)">
              Всего задач в системе:
            </Text>
            <Text $size="0.875rem" $weight="500">
              {stats.total}
            </Text>
          </Flex>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
