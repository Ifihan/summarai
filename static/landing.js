document.addEventListener('DOMContentLoaded', () => {
    // Theme toggling
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const icon = themeButton.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.className = `${savedTheme}-theme`;
    updateThemeIcon();

    themeButton.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
        updateThemeIcon();
        
        // Save theme preference
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    function updateThemeIcon() {
        const isDark = body.classList.contains('dark-theme');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
});