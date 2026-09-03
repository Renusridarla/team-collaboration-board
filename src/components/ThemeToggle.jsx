import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Magnetic from './Magnetic';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Magnetic strength={4}>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 shadow-sm ${
          isLight
            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-slate-200'
            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
        }`}
      >
        {isLight ? (
          <Moon size={18} className="transition-transform duration-200 hover:rotate-12 text-indigo-600" />
        ) : (
          <Sun size={18} className="transition-transform duration-200 hover:rotate-45 text-amber-400" />
        )}
      </button>
    </Magnetic>
  );
}
