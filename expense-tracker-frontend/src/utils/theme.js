export const THEME_STORAGE_KEY = "theme";

export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "Light";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme =
    theme === "Dark" ? "dark" : "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}
