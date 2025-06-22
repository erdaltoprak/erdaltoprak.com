// Theme management utilities
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // System theme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

function updateThemeIcon(currentTheme) {
  // Hide all icons first
  document.querySelectorAll('.theme-icon').forEach(icon => icon.classList.add('hidden'));
  document.querySelectorAll('[id$="-check"]').forEach(check => check.classList.add('hidden'));
  
  // Show the appropriate icon and check mark
  if (currentTheme === 'system') {
    document.getElementById('system-icon')?.classList.remove('hidden');
    document.getElementById('system-check')?.classList.remove('hidden');
  } else if (currentTheme === 'light') {
    document.getElementById('light-icon')?.classList.remove('hidden');
    document.getElementById('light-check')?.classList.remove('hidden');
  } else if (currentTheme === 'dark') {
    document.getElementById('dark-icon')?.classList.remove('hidden');
    document.getElementById('dark-check')?.classList.remove('hidden');
  }
}

// Initialize theme functionality
function initializeTheme() {
  const currentTheme = getCookie('theme') || 'system';
  
  // Update icon to match current theme (theme was already applied in head)
  updateThemeIcon(currentTheme);

  // Listen for system theme changes when in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getCookie('theme') === 'system') {
      applyTheme('system');
    }
  });

  // Dropdown functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');
  let isThemeDropdownOpen = false;

  if (!themeToggle || !themeDropdown) return;

  function closeThemeDropdown() {
    if (!isThemeDropdownOpen) return;
    isThemeDropdownOpen = false;
    themeDropdown.classList.add('hidden');
    themeDropdown.style.top = null;
    themeDropdown.style.right = null;
  }

  function openThemeDropdown() {
    const toggleRect = themeToggle.getBoundingClientRect();
    themeDropdown.style.top = `${toggleRect.bottom + 8}px`;
    themeDropdown.style.right = `${window.innerWidth - toggleRect.right}px`;
    isThemeDropdownOpen = true;
    themeDropdown.classList.remove('hidden');
  }

  // Toggle dropdown on button click
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isThemeDropdownOpen) {
      closeThemeDropdown();
    } else {
      openThemeDropdown();
    }
  });

  // Handle theme selection
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const selectedTheme = e.currentTarget.dataset.theme;
      setCookie('theme', selectedTheme);
      applyTheme(selectedTheme);
      updateThemeIcon(selectedTheme);
      closeThemeDropdown();
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (isThemeDropdownOpen && !themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
      closeThemeDropdown();
    }
  });

  // Close dropdown on scroll
  window.addEventListener('scroll', () => {
    if (isThemeDropdownOpen) {
      closeThemeDropdown();
    }
  });

  // Close dropdown on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isThemeDropdownOpen) {
      closeThemeDropdown();
    }
  });

  // Expose theme utils for other components like Search
  window.themeUtils = {
    getCookie,
    setCookie,
    applyTheme,
    updateThemeIcon,
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
} 