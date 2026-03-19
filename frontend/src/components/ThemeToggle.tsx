import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
        dark:bg-gray-900 dark:border-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900
        bg-white border-gray-200 focus:ring-gray-300 focus:ring-offset-white
        hover:border-gray-400 dark:hover:border-gray-500"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
          ${theme === 'dark'
            ? 'translate-x-7 bg-white'
            : 'translate-x-0 bg-gray-900'
          }`}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-gray-900" />
        ) : (
          <Sun className="w-3 h-3 text-white" />
        )}
      </span>
    </button>
  );
}
