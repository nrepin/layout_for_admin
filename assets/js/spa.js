(() => {
  const enabled = true;
  if (!enabled || !["http:", "https:"].includes(location.protocol)) return;

  document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main-content");
    const sidebar = document.querySelector("aside.sidebar");
    let content = main?.querySelector(":scope > [data-admin-page]");
    const { Alpine, adminPageWidgets: widgets } = window;
    if (!content || !sidebar || !Alpine || !widgets) return;

    const scroller = main.parentElement;
    const directory = new URL("./", location.href).pathname;
    const routes = new Map(
      Array.from(sidebar.querySelectorAll(".menu-dropdown-item[href], .menu-item[href]:not(.sidebar-group-toggle)"), link => [new URL(link.href).pathname, link]),
    );
    routes.set(directory, routes.get(`${directory}index.html`));
    let activeLink = sidebar.querySelector("[aria-current='page']");
    const scrollPositions = new Map();
    let url = new URL(location.href);
    let entry = history.state?.adminEntry ?? 0;
    let nextEntry = entry;
    let pending;
    history.replaceState({ ...history.state, adminEntry: entry }, "");
    history.scrollRestoration = "manual";

    const isSamePage = target => target.pathname === url.pathname && target.search === url.search;

    async function navigate(target, fromHistory = false) {
      pending?.abort();
      const request = new AbortController();
      pending = request;
      const targetEntry = fromHistory ? history.state?.adminEntry : ++nextEntry;
      main.setAttribute("aria-busy", "true");

      try {
        const response = await fetch(target, { signal: request.signal });
        if (!response.ok || response.redirected) throw new Error("Page could not be loaded");
        const html = new DOMParser().parseFromString(await response.text(), "text/html");
        const destination = html.querySelector("#main-content > [data-admin-page]");
        if (!destination) throw new Error("Page content is missing");
        if (request.signal.aborted) return;

        const newContent = document.importNode(destination, true);
        scrollPositions.set(entry, scroller.scrollTop);
        if (!fromHistory) history.pushState({ adminEntry: targetEntry }, "", target);
        url = target;
        entry = targetEntry;
        document.title = html.title;

        widgets.unmount();
        Alpine.mutateDom(() => {
          Alpine.destroyTree(content);
          content.replaceWith(newContent);
          content = newContent;
          const state = Alpine.$data(document.body);
          state.page = content.dataset.adminPage;
          state.section = content.dataset.adminSection;
          if (window.innerWidth < 1280) state.sidebarToggle = false;
          Alpine.initTree(content);
        });
        const nextLink = routes.get(target.pathname);
        if (nextLink && activeLink !== nextLink) {
          activeLink?.removeAttribute("aria-current");
          if (activeLink) setLinkActive(activeLink, false);
          nextLink.setAttribute("aria-current", "page");
          setLinkActive(nextLink, true);
          const group = nextLink.closest("[data-support-menu]");
          if (group) Alpine.$data(group).open = true;
          activeLink = nextLink;
        }
        widgets.mount();

        content.focus({ preventScroll: true });
        scroller.scrollTop = scrollPositions.get(entry) ?? 0;
        if (target.hash && !scrollPositions.has(entry)) {
          const anchor = document.getElementById(decodeURIComponent(target.hash.slice(1)));
          if (anchor && content.contains(anchor)) anchor.scrollIntoView();
        }
      } catch (error) {
        if (request.signal.aborted) return;
        console.warn("SPA navigation fell back to a full page load", error);
        if (location.href === target.href) location.reload();
        else location.assign(target);
      } finally {
        if (pending === request) {
          pending = undefined;
          main.removeAttribute("aria-busy");
        }
      }
    }

    function setLinkActive(link, active) {
      const prefix = link.classList.contains("menu-dropdown-item") ? "menu-dropdown-item" : "menu-item";
      link.classList.toggle(`${prefix}-active`, active);
      link.classList.toggle(`${prefix}-inactive`, !active);
      const icon = link.querySelector(":scope > svg");
      if (icon && prefix === "menu-item") {
        icon.classList.toggle("menu-item-icon-active", active);
        icon.classList.toggle("menu-item-icon-inactive", !active);
      }
    }

    document.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const target = new URL(link.href);
      if (target.origin !== location.origin || !routes.has(target.pathname)) return;
      if (isSamePage(target) && isSamePage(new URL(location.href))) {
        if (target.href === location.href && !target.hash) {
          event.preventDefault();
          pending?.abort();
        }
        return;
      }
      event.preventDefault();
      navigate(target);
    });

    window.addEventListener("popstate", () => {
      const target = new URL(location.href);
      if (isSamePage(target)) {
        pending?.abort();
        url = target;
        return;
      }
      navigate(target, true);
    });

    window.addEventListener("hashchange", () => {
      const target = new URL(location.href);
      if (isSamePage(target)) url = target;
    });
  }, { once: true });
})();
