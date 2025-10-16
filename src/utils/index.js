import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
  parseISO,
} from "date-fns";
import { ru } from "date-fns/locale";

// Date formatting utilities
export const formatTaskDate = (dateString) => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return "Сегодня";
  }

  if (isTomorrow(date)) {
    return "Завтра";
  }

  if (isYesterday(date)) {
    return "Вчера";
  }

  const diffDays = differenceInDays(date, new Date());

  if (diffDays > 0 && diffDays <= 7) {
    return `Через ${diffDays} дн.`;
  }

  if (diffDays < 0 && diffDays >= -7) {
    return `${Math.abs(diffDays)} дн. назад`;
  }

  return format(date, "d MMM", { locale: ru });
};

export const formatCreatedDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, "d MMM yyyy", { locale: ru });
};

export const isOverdue = (dateString) => {
  const date = parseISO(dateString);
  return date < new Date();
};

// Local storage utilities
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ошибка сохранения в localStorage
  }
};

export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Generate unique ID
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

// Download file
export const downloadFile = (content, filename, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Get contrast color
export const getContrastColor = (hexColor) => {
  // Remove # if present
  const color = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Animate element
export const animateElement = (element, animation, duration = 300) => {
  return new Promise((resolve) => {
    element.style.animation = `${animation} ${duration}ms ease-out`;
    setTimeout(() => {
      element.style.animation = "";
      resolve();
    }, duration);
  });
};

// Get system theme
export const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Listen for system theme changes
export const onSystemThemeChange = (callback) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => mediaQuery.removeEventListener("change", handleChange);
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

// Keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const shortcuts = {
    "ctrl+n": () => {
      const addButton = document.querySelector('[data-shortcut="add-task"]');
      if (addButton) {
        addButton.click();
      } else {
        const input = document.querySelector('input[type="text"]');
        input?.focus();
      }
    },
    "ctrl+k": () => {
      const searchInput = document.querySelector('[data-shortcut="search"]');
      searchInput?.focus();
    },
    "ctrl+d": () => {
      const themeButton = document.querySelector('[data-shortcut="theme"]');
      themeButton?.click();
    },
    escape: () => {
      // Close any open modals
      const modals = document.querySelectorAll("[data-modal]");
      modals.forEach((modal) => {
        if (modal.classList.contains("active")) {
          modal.classList.remove("active");
        }
      });
    },
  };

  return shortcuts;
};
