function setAdminTheme(darkMode, persist = true) {
  const root = document.documentElement;
  root.classList.toggle("dark", darkMode);
  root.dataset.colorScheme = darkMode ? "dark" : "light";

  if (persist) {
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch {
      // The current page still supports theme changes when storage is unavailable.
    }
  }
}

try {
  setAdminTheme(localStorage.getItem("darkMode") === "true", false);
} catch {
  setAdminTheme(false, false);
}
