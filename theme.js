// Theme Toggle Script
(function () {
    const STORAGE_KEY = 'theme-preference';

    function getThemePreference() {
        if (localStorage.getItem(STORAGE_KEY)) {
            return localStorage.getItem(STORAGE_KEY);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Set initial theme
    setTheme(getThemePreference());

    // Expose toggle function globally
    window.toggleTheme = toggleTheme;
})();
