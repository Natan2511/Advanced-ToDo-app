import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

// Task categories and priorities
export const TASK_CATEGORIES = {
  general: { label: "Общие", color: "blue", icon: "📋" },
  work: { label: "Работа", color: "purple", icon: "💼" },
  personal: { label: "Личное", color: "cyan", icon: "👤" },
  shopping: { label: "Покупки", color: "orange", icon: "🛒" },
  health: { label: "Здоровье", color: "green", icon: "🏥" },
  study: { label: "Учеба", color: "indigo", icon: "📚" },
  finance: { label: "Финансы", color: "emerald", icon: "💰" },
  home: { label: "Дом", color: "amber", icon: "🏠" },
  travel: { label: "Путешествия", color: "sky", icon: "✈️" },
  hobby: { label: "Хобби", color: "pink", icon: "🎨" },
  family: { label: "Семья", color: "rose", icon: "👨‍👩‍👧‍👦" },
  sport: { label: "Спорт", color: "lime", icon: "⚽" },
  other: { label: "Другое", color: "gray", icon: "🔧" },
};

export const TASK_PRIORITIES = {
  low: { label: "Низкий", color: "green", level: 1, icon: "🟢" },
  medium: { label: "Средний", color: "yellow", level: 2, icon: "🟡" },
  high: { label: "Высокий", color: "red", level: 3, icon: "🔴" },
};

export const TASK_FILTERS = {
  all: { label: "Все задачи", icon: "📋" },
  pending: { label: "Активные", icon: "⏳" },
  completed: { label: "Завершенные", icon: "✅" },
  overdue: { label: "Просроченные", icon: "⚠️" },
};

export const TASK_SORTS = {
  date: { label: "По дате", icon: "📅" },
  priority: { label: "По приоритету", icon: "⚡" },
  category: { label: "По категории", icon: "🏷️" },
  alphabetical: { label: "По алфавиту", icon: "🔤" },
};

// Generate unique ID
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Check if task is overdue
const isTaskOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
};

export const useTaskStore = create(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      filter: "all",
      sort: "date",
      searchQuery: "",

      // Actions
      addTask: (taskData) => {
        const newTask = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));

        toast.success("Задача добавлена!");
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));

        toast.success("Задача обновлена!");
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        toast.success("Задача удалена");
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  completedAt: !task.completed
                    ? new Date().toISOString()
                    : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));

        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          toast.success(
            task.completed ? "Задача завершена!" : "Задача возобновлена"
          );
        }
      },

      duplicateTask: (id) => {
        const originalTask = get().tasks.find((task) => task.id === id);
        if (originalTask) {
          const duplicatedTask = {
            ...originalTask,
            id: generateId(),
            text: `${originalTask.text} (копия)`,
            completed: false,
            completedAt: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: undefined,
          };

          set((state) => ({
            tasks: [duplicatedTask, ...state.tasks],
          }));

          toast.success("Задача дублирована!");
        }
      },

      getCategoryInfo: (categoryKey) => {
        return (
          TASK_CATEGORIES[categoryKey] || {
            label: categoryKey || "Неизвестно",
            color: "gray",
            icon: "❓",
          }
        );
      },

      getAllCategories: () => {
        return TASK_CATEGORIES;
      },

      // Функции для синхронизации с сервером
      setTasks: (newTasks) => {
        set({ tasks: newTasks || [] });
      },

      // Filters and search
      setFilter: (filter) => set({ filter }),
      setSort: (sort) => set({ sort }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Bulk operations
      clearCompleted: () => {
        const completedCount = get().tasks.filter(
          (task) => task.completed
        ).length;
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        }));

        toast.success(`Удалено ${completedCount} завершенных задач`);
      },

      markAllCompleted: () => {
        const pendingTasks = get().tasks.filter((task) => !task.completed);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            !task.completed
              ? {
                  ...task,
                  completed: true,
                  completedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }));

        toast.success(`Завершено ${pendingTasks.length} задач`);
      },

      deleteAllTasks: () => {
        set({ tasks: [] });
        toast.success("Все задачи удалены");
      },

      // Computed values
      getFilteredTasks: () => {
        const { tasks, filter, sort, searchQuery } = get();
        let filtered = tasks;

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter((task) =>
            task.text.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply status filter
        switch (filter) {
          case "pending":
            filtered = filtered.filter((task) => !task.completed);
            break;
          case "completed":
            filtered = filtered.filter((task) => task.completed);
            break;
          case "overdue":
            filtered = filtered.filter((task) => isTaskOverdue(task));
            break;
        }

        // Apply sorting
        filtered.sort((a, b) => {
          switch (sort) {
            case "priority":
              return (
                TASK_PRIORITIES[b.priority].level -
                TASK_PRIORITIES[a.priority].level
              );
            case "category":
              return a.category.localeCompare(b.category);
            case "alphabetical":
              return a.text.localeCompare(b.text);
            case "date":
            default:
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
          }
        });

        return filtered;
      },

      getStats: () => {
        const { tasks, getAllCategories } = get();
        const allCategories = getAllCategories();

        const stats = {
          total: tasks.length,
          completed: tasks.filter((t) => t.completed).length,
          pending: tasks.filter((t) => !t.completed).length,
          overdue: tasks.filter((t) => isTaskOverdue(t)).length,
          byCategory: {},
          byPriority: {
            low: 0,
            medium: 0,
            high: 0,
          },
        };

        // Initialize category counts
        Object.keys(allCategories).forEach((categoryKey) => {
          stats.byCategory[categoryKey] = 0;
        });

        tasks.forEach((task) => {
          stats.byCategory[task.category]++;
          stats.byPriority[task.priority]++;
        });

        return stats;
      },

      isTaskOverdue: (task) => isTaskOverdue(task),
    }),
    {
      name: "todo-app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);
