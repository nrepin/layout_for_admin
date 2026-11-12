{
  const sidebar = document.querySelector("aside.sidebar .overflow-y-auto");
  const scrollKey = "adminSidebarScroll";

  if (sidebar) {
    const read = (storage, key) => {
      try {
        return window[storage].getItem(key);
      } catch {
        return null;
      }
    };
    const write = (key, value) => {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // The sidebar remains usable without storage.
      }
    };

    const groupState = new MutationObserver((changes) => {
      for (const { target } of changes) {
        write(target.getAttribute("aria-controls"), target.getAttribute("aria-expanded"));
      }
    });

    for (const control of sidebar.querySelectorAll("[aria-controls^='menu-'][aria-expanded]")) {
      const id = control.getAttribute("aria-controls");
      const panel = document.getElementById(id);
      const saved = read("sessionStorage", id);
      const previousDashboard = id === "menu-dashboard" ? read("localStorage", "_x_selected") : null;
      const initial = previousDashboard === null ? !panel.hidden : previousDashboard === '"Dashboard"';
      const expanded = panel.querySelector("[aria-current='page']") || (saved === null ? initial : saved === "true");

      panel.hidden = !expanded;
      control.setAttribute("aria-expanded", String(Boolean(expanded)));
      groupState.observe(control, { attributeFilter: ["aria-expanded"] });
    }

    sidebar.scrollTop = Number(read("sessionStorage", scrollKey)) || 0;
    const savePosition = () => write(scrollKey, String(sidebar.scrollTop));
    sidebar.addEventListener("scroll", savePosition, { passive: true });
    sidebar.addEventListener("click", savePosition);
  }
}
