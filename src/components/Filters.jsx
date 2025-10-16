import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, SortAsc } from "lucide-react";
import { useTaskStore, TASK_FILTERS, TASK_SORTS } from "../store/useTaskStore";
import {
  Card,
  Input,
  Select,
  SecondaryButton,
  Flex,
  Grid,
  Text,
} from "../styles/styled";

const Filters = () => {
  const {
    filter,
    sort,
    searchQuery,
    setFilter,
    setSort,
    setSearchQuery,
    getFilteredTasks,
    getStats,
    markAllCompleted,
    clearCompleted,
    deleteTask,
  } = useTaskStore();

  const filteredTasks = getFilteredTasks();
  const stats = getStats();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleMarkAllCompleted = () => {
    const pendingTasks = filteredTasks.filter((task) => !task.completed);
    if (pendingTasks.length > 0) {
      markAllCompleted();
    }
  };

  const handleClearCompleted = () => {
    if (confirm("Удалить все завершенные задачи?")) {
      clearCompleted();
    }
  };

  return (
    <Card style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Search Bar */}
        <div>
          <Text
            $size="0.875rem"
            $weight="500"
            $color="var(--text-primary)"
            style={{ marginBottom: "0.75rem", display: "block" }}
          >
            Поиск задач
          </Text>
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "1rem",
                height: "1rem",
                color: "var(--text-muted)",
              }}
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Введите текст для поиска..."
              style={{
                paddingLeft: "2.5rem",
                paddingRight: searchQuery ? "2.5rem" : "1rem",
              }}
              data-shortcut="search"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  lineHeight: 1,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--text-muted)")
                }
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Filter Buttons */}
          <div>
            <Flex
              $align="center"
              $gap="0.5rem"
              style={{ marginBottom: "0.75rem" }}
            >
              <Filter size={18} style={{ color: "var(--primary-600)" }} />
              <Text $size="0.875rem" $weight="500" $color="var(--text-primary)">
                Фильтры
              </Text>
            </Flex>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                padding: "1rem",
                background: "var(--bg-secondary)",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-color)",
              }}
            >
              {Object.entries(TASK_FILTERS).map(([key, filterInfo]) => (
                <SecondaryButton
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    background:
                      filter === key
                        ? "var(--primary-500)"
                        : "var(--bg-primary)",
                    color: filter === key ? "white" : "var(--text-primary)",
                    border:
                      filter === key
                        ? "1px solid var(--primary-500)"
                        : "1px solid var(--border-color)",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    borderRadius: "0.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== key) {
                      e.target.style.background = "var(--primary-50)";
                      e.target.style.borderColor = "var(--primary-300)";
                      e.target.style.color = "var(--primary-600)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== key) {
                      e.target.style.background = "var(--bg-primary)";
                      e.target.style.borderColor = "var(--border-color)";
                      e.target.style.color = "var(--text-primary)";
                    }
                  }}
                >
                  <span style={{ marginRight: "0.25rem" }}>
                    {filterInfo.icon}
                  </span>
                  {filterInfo.label}
                  {key !== "all" && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.125rem 0.375rem",
                        fontSize: "0.75rem",
                        background:
                          filter === key
                            ? "rgba(255,255,255,0.2)"
                            : "var(--bg-tertiary)",
                        borderRadius: "9999px",
                        fontWeight: "600",
                      }}
                    >
                      {key === "pending" && stats.pending}
                      {key === "completed" && stats.completed}
                      {key === "overdue" && stats.overdue}
                    </span>
                  )}
                </SecondaryButton>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <Flex
              $align="center"
              $gap="0.5rem"
              style={{ marginBottom: "0.75rem" }}
            >
              <SortAsc size={18} style={{ color: "var(--primary-600)" }} />
              <Text $size="0.875rem" $weight="500" $color="var(--text-primary)">
                Сортировка
              </Text>
            </Flex>
            <div
              style={{
                padding: "1rem",
                background: "var(--bg-secondary)",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-color)",
              }}
            >
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(TASK_SORTS).map(([key, sortInfo]) => (
                  <option key={key} value={key}>
                    {sortInfo.icon} {sortInfo.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: "1rem",
            background: "var(--bg-secondary)",
            borderRadius: "0.75rem",
            border: "1px solid var(--border-color)",
            borderTop: "3px solid var(--primary-500)",
          }}
        >
          <Flex
            $justify="space-between"
            $align="center"
            style={{ marginBottom: "0.75rem" }}
          >
            <Flex $align="center" $gap="1rem">
              <Text $size="0.875rem" $color="var(--text-primary)" $weight="500">
                Показано:{" "}
                <strong style={{ color: "var(--primary-600)" }}>
                  {filteredTasks.length}
                </strong>{" "}
                из{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {stats.total}
                </strong>
              </Text>
              {searchQuery && (
                <Text
                  $size="0.875rem"
                  $color="var(--primary-600)"
                  $weight="500"
                >
                  По запросу: "{searchQuery}"
                </Text>
              )}
            </Flex>

            {filteredTasks.length > 0 && (
              <Flex $align="center" $gap="0.5rem">
                <Text $size="0.875rem" $color="var(--text-secondary)">
                  Завершено:
                </Text>
                <Flex $align="center" $gap="0.25rem">
                  <div
                    style={{
                      width: "0.5rem",
                      height: "0.5rem",
                      background: "var(--success-500)",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <Text
                    $size="0.875rem"
                    $weight="600"
                    $color="var(--success-600)"
                  >
                    {filteredTasks.filter((task) => task.completed).length}
                  </Text>
                </Flex>
                <Text $size="0.875rem" $color="var(--text-muted)">
                  /
                </Text>
                <Text $size="0.875rem" $weight="600">
                  {filteredTasks.length}
                </Text>
              </Flex>
            )}
          </Flex>

          {/* Quick Actions */}
          {filteredTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <Text
                $size="0.875rem"
                $color="var(--text-secondary)"
                $weight="500"
              >
                Быстрые действия:
              </Text>

              {/* Mark all completed - показываем для всех фильтров кроме completed */}
              {filter !== "completed" &&
                filteredTasks.filter((task) => !task.completed).length > 0 && (
                  <SecondaryButton
                    onClick={handleMarkAllCompleted}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--success-600)",
                      border: "1px solid var(--success-300)",
                      background: "var(--success-50)",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--success-100)";
                      e.target.style.borderColor = "var(--success-400)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--success-50)";
                      e.target.style.borderColor = "var(--success-300)";
                    }}
                  >
                    ✅ Завершить все
                  </SecondaryButton>
                )}

              {/* Clear completed - показываем для всех фильтров кроме pending */}
              {filter !== "pending" &&
                filteredTasks.filter((task) => task.completed).length > 0 && (
                  <SecondaryButton
                    onClick={handleClearCompleted}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--danger-600)",
                      border: "1px solid var(--danger-300)",
                      background: "var(--danger-50)",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--danger-100)";
                      e.target.style.borderColor = "var(--danger-400)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--danger-50)";
                      e.target.style.borderColor = "var(--danger-300)";
                    }}
                  >
                    🗑️ Удалить завершенные
                  </SecondaryButton>
                )}

              {/* Clear all - показываем для всех фильтров */}
              {filteredTasks.length > 0 && (
                <SecondaryButton
                  onClick={() => {
                    if (confirm(`Удалить все ${filteredTasks.length} задач?`)) {
                      filteredTasks.forEach((task) => {
                        deleteTask(task.id);
                      });
                    }
                  }}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--danger-600)",
                    border: "1px solid var(--danger-300)",
                    background: "var(--danger-50)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--danger-100)";
                    e.target.style.borderColor = "var(--danger-400)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--danger-50)";
                    e.target.style.borderColor = "var(--danger-300)";
                  }}
                >
                  🗑️ Удалить все
                </SecondaryButton>
              )}

              {/* Clear search */}
              {searchQuery && (
                <SecondaryButton
                  onClick={clearSearch}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-tertiary)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--bg-primary)";
                    e.target.style.borderColor = "var(--primary-300)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--bg-tertiary)";
                    e.target.style.borderColor = "var(--border-color)";
                  }}
                >
                  🔍 Очистить поиск
                </SecondaryButton>
              )}

              {/* Reset filters */}
              {filter !== "all" && (
                <SecondaryButton
                  onClick={() => setFilter("all")}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary-600)",
                    border: "1px solid var(--primary-300)",
                    background: "var(--primary-50)",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--primary-100)";
                    e.target.style.borderColor = "var(--primary-400)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--primary-50)";
                    e.target.style.borderColor = "var(--primary-300)";
                  }}
                >
                  🔄 Сбросить фильтры
                </SecondaryButton>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Card>
  );
};

export default Filters;
