const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{theme === 'light' ? '☀️' : '🌙'}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 dark:bg-gray-600 transition"></div>
        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-full peer-checked:bg-white"></div>
      </label>
    </div>
  );
};

export default ThemeToggle;