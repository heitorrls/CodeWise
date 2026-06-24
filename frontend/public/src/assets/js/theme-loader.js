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
        // Default CodeWise theme is light when the user has not chosen one yet.
        root.setAttribute('data-theme', 'light');
    }
})();
