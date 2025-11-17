// Immediately invoked function to set the theme on initial load
(function() {
    const THEME_KEY = 'cw_theme';
    const root = document.documentElement;
    const pageDefault =
        root.getAttribute('data-default-theme') ||
        (document.body ? document.body.getAttribute('data-default-theme') : null);
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else if (savedTheme === 'dark') {
        root.removeAttribute('data-theme');
    } else if (pageDefault === 'light') {
        root.setAttribute('data-theme', 'light');
    } else if (pageDefault === 'dark') {
        root.removeAttribute('data-theme');
    } else {
        // If no theme is saved, check for system preference
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
    }
})();
