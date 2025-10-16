import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

export const useKeyboardShortcuts = () => {
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input field
      const target = e.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        // Allow some shortcuts even when typing
        if (e.key === "Escape") {
          // Close any open modals
          const modals = document.querySelectorAll("[data-modal]");
          modals.forEach((modal) => {
            if (modal.classList.contains("active")) {
              modal.classList.remove("active");
            }
          });
        }
        return;
      }

      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "t":
            e.preventDefault();
            const addButton = document.querySelector(
              '[data-shortcut="add-task"]'
            );
            if (addButton) {
              addButton.click();
            } else {
              const input = document.querySelector('input[type="text"]');
              input?.focus();
            }
            break;

          case "f":
            e.preventDefault();
            const searchInput = document.querySelector(
              '[data-shortcut="search"]'
            );
            searchInput?.focus();
            break;

          case "d":
            if (e.shiftKey) {
              e.preventDefault();
              toggleTheme();
            }
            break;

          case "/":
            e.preventDefault();
            toast(
              "Горячие клавиши: Ctrl+T (добавить), Ctrl+F (поиск), Ctrl+Shift+D (тема), Esc (закрыть)",
              {
                duration: 5000,
                icon: "ℹ️",
              }
            );
            break;
        }
      }

      // Single key shortcuts
      switch (e.key) {
        case "Escape":
          // Close any open modals
          const modals = document.querySelectorAll("[data-modal]");
          modals.forEach((modal) => {
            if (modal.classList.contains("active")) {
              modal.classList.remove("active");
            }
          });
          break;

        case "?":
          if (!e.ctrlKey && !e.metaKey) {
            toast(
              "Горячие клавиши: Ctrl+T (добавить), Ctrl+F (поиск), Ctrl+Shift+D (тема), Esc (закрыть)",
              {
                duration: 5000,
                icon: "ℹ️",
              }
            );
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleTheme]);
};
