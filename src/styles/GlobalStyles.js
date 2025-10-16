import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Light Theme Colors */
    --primary-50: #eef2ff;
    --primary-100: #e0e7ff;
    --primary-200: #c7d2fe;
    --primary-300: #a5b4fc;
    --primary-400: #818cf8;
    --primary-500: #6366f1;
    --primary-600: #4f46e5;
    --primary-700: #4338ca;
    --primary-800: #3730a3;
    --primary-900: #312e81;

    --success-50: #ecfdf5;
    --success-100: #d1fae5;
    --success-200: #a7f3d0;
    --success-300: #6ee7b7;
    --success-400: #34d399;
    --success-500: #10b981;
    --success-600: #059669;
    --success-700: #047857;
    --success-800: #065f46;
    --success-900: #064e3b;

    --warning-50: #fffbeb;
    --warning-100: #fef3c7;
    --warning-200: #fde68a;
    --warning-300: #fcd34d;
    --warning-400: #fbbf24;
    --warning-500: #f59e0b;
    --warning-600: #d97706;
    --warning-700: #b45309;
    --warning-800: #92400e;
    --warning-900: #78350f;

    --danger-50: #fef2f2;
    --danger-100: #fee2e2;
    --danger-200: #fecaca;
    --danger-300: #fca5a5;
    --danger-400: #f87171;
    --danger-500: #ef4444;
    --danger-600: #dc2626;
    --danger-700: #b91c1c;
    --danger-800: #991b1b;
    --danger-900: #7f1d1d;

    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;

    --purple-50: #faf5ff;
    --purple-100: #f3e8ff;
    --purple-200: #e9d5ff;
    --purple-300: #d8b4fe;
    --purple-400: #c084fc;
    --purple-500: #a855f7;
    --purple-600: #9333ea;
    --purple-700: #7c3aed;
    --purple-800: #6b21a8;
    --purple-900: #581c87;

    --cyan-50: #ecfeff;
    --cyan-100: #cffafe;
    --cyan-200: #a5f3fc;
    --cyan-300: #67e8f9;
    --cyan-400: #22d3ee;
    --cyan-500: #06b6d4;
    --cyan-600: #0891b2;
    --cyan-700: #0e7490;
    --cyan-800: #155e75;
    --cyan-900: #164e63;

    --orange-50: #fff7ed;
    --orange-100: #ffedd5;
    --orange-200: #fed7aa;
    --orange-300: #fdba74;
    --orange-400: #fb923c;
    --orange-500: #f97316;
    --orange-600: #ea580c;
    --orange-700: #c2410c;
    --orange-800: #9a3412;
    --orange-900: #7c2d12;

    --green-50: #f0fdf4;
    --green-100: #dcfce7;
    --green-200: #bbf7d0;
    --green-300: #86efac;
    --green-400: #4ade80;
    --green-500: #22c55e;
    --green-600: #16a34a;
    --green-700: #15803d;
    --green-800: #166534;
    --green-900: #14532d;

    --red-50: #fef2f2;
    --red-100: #fee2e2;
    --red-200: #fecaca;
    --red-300: #fca5a5;
    --red-400: #f87171;
    --red-500: #ef4444;
    --red-600: #dc2626;
    --red-700: #b91c1c;
    --red-800: #991b1b;
    --red-900: #7f1d1d;

    --yellow-50: #fefce8;
    --yellow-100: #fef3c7;
    --yellow-200: #fde68a;
    --yellow-300: #fcd34d;
    --yellow-400: #fbbf24;
    --yellow-500: #f59e0b;
    --yellow-600: #d97706;
    --yellow-700: #b45309;
    --yellow-800: #92400e;
    --yellow-900: #78350f;

    --indigo-50: #eef2ff;
    --indigo-100: #e0e7ff;
    --indigo-200: #c7d2fe;
    --indigo-300: #a5b4fc;
    --indigo-400: #818cf8;
    --indigo-500: #6366f1;
    --indigo-600: #4f46e5;
    --indigo-700: #4338ca;
    --indigo-800: #3730a3;
    --indigo-900: #312e81;

    --emerald-50: #ecfdf5;
    --emerald-100: #d1fae5;
    --emerald-200: #a7f3d0;
    --emerald-300: #6ee7b7;
    --emerald-400: #34d399;
    --emerald-500: #10b981;
    --emerald-600: #059669;
    --emerald-700: #047857;
    --emerald-800: #065f46;
    --emerald-900: #064e3b;

    --amber-50: #fffbeb;
    --amber-100: #fef3c7;
    --amber-200: #fde68a;
    --amber-300: #fcd34d;
    --amber-400: #fbbf24;
    --amber-500: #f59e0b;
    --amber-600: #d97706;
    --amber-700: #b45309;
    --amber-800: #92400e;
    --amber-900: #78350f;

    --sky-50: #f0f9ff;
    --sky-100: #e0f2fe;
    --sky-200: #bae6fd;
    --sky-300: #7dd3fc;
    --sky-400: #38bdf8;
    --sky-500: #0ea5e9;
    --sky-600: #0284c7;
    --sky-700: #0369a1;
    --sky-800: #075985;
    --sky-900: #0c4a6e;

    --pink-50: #fdf2f8;
    --pink-100: #fce7f3;
    --pink-200: #fbcfe8;
    --pink-300: #f9a8d4;
    --pink-400: #f472b6;
    --pink-500: #ec4899;
    --pink-600: #db2777;
    --pink-700: #be185d;
    --pink-800: #9d174d;
    --pink-900: #831843;

    --rose-50: #fff1f2;
    --rose-100: #ffe4e6;
    --rose-200: #fecdd3;
    --rose-300: #fda4af;
    --rose-400: #fb7185;
    --rose-500: #f43f5e;
    --rose-600: #e11d48;
    --rose-700: #be123c;
    --rose-800: #9f1239;
    --rose-900: #881337;

    --lime-50: #f7fee7;
    --lime-100: #ecfccb;
    --lime-200: #d9f99d;
    --lime-300: #bef264;
    --lime-400: #a3e635;
    --lime-500: #84cc16;
    --lime-600: #65a30d;
    --lime-700: #4d7c0f;
    --lime-800: #3f6212;
    --lime-900: #365314;

    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;00: #111827;

     --text-primary: #1f2937;
     --text-secondary: #6b7280;
     --text-muted: #9ca3af;
     --bg-primary: #ffffff;
     --bg-primary-rgb: 255, 255, 255;
     --bg-secondary: #f9fafb;
     --bg-tertiary: #f3f4f6;
     --border-color: #e5e7eb;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transitions */
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.3s ease-in-out;
    --transition-slow: 0.5s ease-in-out;
  }

   /* Dark Theme */
   [data-theme="dark"] {
     --text-primary: #f9fafb;
     --text-secondary: #d1d5db;
     --text-muted: #9ca3af;
     --bg-primary: #111827;
     --bg-primary-rgb: 17, 24, 39;
     --bg-secondary: #1f2937;
     --bg-tertiary: #374151;
     --border-color: #374151;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-secondary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color var(--transition-normal), color var(--transition-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  /* Smooth transitions */
  * {
    transition: background-color var(--transition-fast), 
                border-color var(--transition-fast), 
                color var(--transition-fast);
  }

  /* Animation utilities */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Utility classes */
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .animate-bounce-in {
    animation: bounceIn 0.5s ease-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Loading spinner */
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :root {
      --border-color: #000000;
      --text-muted: #666666;
    }
    
    [data-theme="dark"] {
      --border-color: #ffffff;
      --text-muted: #cccccc;
    }
  }

   /* Reduced motion support */
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }

  /* Modal activation */
  #stats-modal.active,
  #settings-modal.active {
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* Modal z-index fixes */
  [data-modal] {
    z-index: 999999 !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    isolation: isolate !important;
  }

  [data-modal] > div {
    z-index: 1000000 !important;
    position: relative !important;
    transform: translateZ(0) !important;
    will-change: transform !important;
  }

  /* Ensure modals are above everything */
  .modal-overlay {
    z-index: 999999 !important;
  }

  .modal-content {
    z-index: 1000000 !important;
  }

  /* Prevent body scroll when modal is open */
  body.modal-open {
    overflow: hidden !important;
  }
`;
