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
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function updateThemeIcon(currentTheme) {
  document.querySelectorAll('.theme-icon').forEach((icon) => icon.classList.add('hidden'));
  document.querySelectorAll('[id$="-check"]').forEach((check) => check.classList.add('hidden'));

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

const themeRuntime = ((window).__erdalThemeRuntime ??= {
  listenersBound: false,
  mediaQueryBound: false,
});

let isThemeDropdownOpen = false;

const getThemeToggle = () => document.getElementById('theme-toggle');
const getThemeDropdown = () => document.getElementById('theme-dropdown');

function closeThemeDropdown() {
  if (!isThemeDropdownOpen) return;
  isThemeDropdownOpen = false;
  const themeDropdown = getThemeDropdown();
  if (themeDropdown) {
    themeDropdown.classList.add('hidden');
    themeDropdown.style.top = '';
    themeDropdown.style.right = '';
  }
}

function openThemeDropdown() {
  const themeToggle = getThemeToggle();
  const themeDropdown = getThemeDropdown();
  if (!themeToggle || !themeDropdown) return;

  const toggleRect = themeToggle.getBoundingClientRect();
  themeDropdown.style.top = `${toggleRect.bottom + 8}px`;
  themeDropdown.style.right = `${window.innerWidth - toggleRect.right}px`;
  themeDropdown.classList.remove('hidden');
  isThemeDropdownOpen = true;
}

function toggleThemeDropdown() {
  if (isThemeDropdownOpen) {
    closeThemeDropdown();
  } else {
    openThemeDropdown();
  }
}

function applySelectedTheme(theme) {
  setCookie('theme', theme);
  applyTheme(theme);
  updateThemeIcon(theme);
  closeThemeDropdown();
}

function syncThemeUiForPage() {
  const currentTheme = getCookie('theme') || 'system';
  updateThemeIcon(currentTheme);
  isThemeDropdownOpen = false;
  const themeDropdown = getThemeDropdown();
  if (themeDropdown) {
    themeDropdown.classList.add('hidden');
    themeDropdown.style.top = '';
    themeDropdown.style.right = '';
  }

  window.themeUtils = {
    getCookie,
    setCookie,
    applyTheme,
    updateThemeIcon,
    openThemeDropdown,
    closeThemeDropdown,
    toggleThemeDropdown,
  };
}

function bindGlobalThemeListenersOnce() {
  if (themeRuntime.listenersBound) return;
  themeRuntime.listenersBound = true;

  const handleSystemThemeChange = () => {
    if (getCookie('theme') === 'system') {
      applyTheme('system');
      updateThemeIcon('system');
    }
  };

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (!themeRuntime.mediaQueryBound) {
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemThemeChange);
    }
    themeRuntime.mediaQueryBound = true;
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const themeOption = target.closest('#theme-dropdown .theme-option');
    if (themeOption instanceof HTMLElement) {
      const selectedTheme = themeOption.dataset.theme;
      if (selectedTheme) {
        applySelectedTheme(selectedTheme);
      }
      return;
    }

    if (!isThemeDropdownOpen) return;

    const themeToggle = getThemeToggle();
    const themeDropdown = getThemeDropdown();
    if (!themeToggle?.contains(target) && !themeDropdown?.contains(target)) {
      closeThemeDropdown();
    }
  });

  window.addEventListener('scroll', closeThemeDropdown);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeThemeDropdown();
    }
  });
  document.addEventListener('site:close-popovers', closeThemeDropdown);
}

bindGlobalThemeListenersOnce();
document.addEventListener('astro:page-load', syncThemeUiForPage);

if (document.readyState !== 'loading') {
  syncThemeUiForPage();
}

export {};
