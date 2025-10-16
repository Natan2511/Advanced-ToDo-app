module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern:
          "^React$|^motion$|^Helmet$|^Container$|^AppWrapper$|^Header$|^TaskList$|^AddTask$|^Filters$|^StatsModal$|^SettingsModal$|^AuthWrapper$|^Card$|^Input$|^Select$|^PrimaryButton$|^SecondaryButton$|^Flex$|^Grid$|^Text$|^GhostButton$|^ModalOverlay$|^ModalContent$|^ModalHeader$|^ModalBody$|^Check$|^Edit2$|^Trash2$|^Copy$|^Calendar$|^Clock$|^AlertTriangle$|^Settings$|^Save$|^X$|^Plus$|^Tag$|^AlertCircle$|^User$|^Lock$|^Eye$|^EyeOff$|^UserPlus$|^LogIn$|^LogOut$|^Moon$|^Sun$|^BarChart3$|^Search$|^Filter$|^SortAsc$|^Mail$|^Key$|^ArrowLeft$|^CheckCircle$|^CheckCircle2$|^Palette$|^Bell$|^Database$|^Download$|^Upload$|^TrendingUp$|^ClipboardList$|^BrowserRouter$|^QueryClientProvider$|^HelmetProvider$|^Toaster$|^App$|^GlobalStyles$|^ThemeProvider$|^AuthProvider$|^AnimatePresence$|^ForgotPassword$|^Login$|^Register$|^EmailVerification$|^EditTaskModal$|^TaskItem$|^DangerButton$|^PrimaryBadge$|^SuccessBadge$|^WarningBadge$|^DangerBadge$|^Checkbox$|^TASK_CATEGORIES$|^HeaderWrapper$|^Logo$|^Controls$|^ProgressBar$|^HeaderContent$|^ControlsWrapper$|^UserInfo$|^theme$|^text$|^watch$|^useState$|^result$",
      },
    ],
    "no-console": "warn",
    "no-undef": "error",
    "no-case-declarations": "off",
  },
  globals: {
    React: "readonly",
  },
};
