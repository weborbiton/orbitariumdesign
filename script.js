/*!
 * Orbitarium Design v1.1.0
 * https://orbitariumdesign.eu
 * Orbitarium Design License, https://orbitariumdesign.eu/license.html
 */
(function () {
  "use strict";

  function store(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {
      // storage blocked (private mode etc.), ignore
    }
  }

  function read(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  // theme: class="orb-dark" on <html>, saved as "orb-theme"
  var Theme = {
    KEY: "orb-theme",

    get: function () {
      return read(Theme.KEY);
    },

    apply: function (mode) {
      var root = document.documentElement;
      root.classList.toggle("orb-dark", mode === "dark");
      root.setAttribute("data-orb-theme", mode);
      document.querySelectorAll("[data-orb-theme-toggle]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
      });
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", mode === "dark" ? "#050506" : "#f8fafc");
    },

    init: function () {
      var saved = Theme.get();
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      Theme.apply(saved || (prefersDark ? "dark" : "light"));
    },

    toggle: function () {
      var next = document.documentElement.classList.contains("orb-dark") ? "light" : "dark";
      Theme.apply(next);
      store(Theme.KEY, next);
    }
  };

  // accent: [data-orb-accent-set="violet"] sets <html data-orb-accent>
  var Accent = {
    KEY: "orb-accent",

    current: function () {
      return document.documentElement.getAttribute("data-orb-accent") || "default";
    },

    apply: function (name) {
      var root = document.documentElement;
      if (!name || name === "default") root.removeAttribute("data-orb-accent");
      else root.setAttribute("data-orb-accent", name);
      Accent.sync();
    },

    sync: function () {
      var cur = Accent.current();
      document.querySelectorAll("[data-orb-accent-set]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-orb-accent-set") === cur ? "true" : "false");
      });
    },

    set: function (name) {
      Accent.apply(name);
      store(Accent.KEY, !name || name === "default" ? null : name);
    },

    init: function () {
      var saved = read(Accent.KEY);
      if (saved) Accent.apply(saved);
      else Accent.sync();

      document.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-orb-accent-set]");
        if (btn) Accent.set(btn.getAttribute("data-orb-accent-set"));
      });
    }
  };

  // modal: [data-orb-modal-open="id"], [data-orb-modal-close]
  var Modal = {
    _active: null,
    _opener: null,

    open: function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      Modal._opener = document.activeElement;
      el.classList.add("is-open");
      el.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var focusable = el.querySelector("input, select, textarea, [href], button:not(.orb-modal-close)") ||
        el.querySelector("button");
      if (focusable) focusable.focus({ preventScroll: true });
      Modal._active = el;
    },

    close: function (el) {
      if (!el) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (Modal._active === el) Modal._active = null;
      if (Modal._opener && Modal._opener.focus) Modal._opener.focus({ preventScroll: true });
      Modal._opener = null;
    },

    closeActive: function () {
      if (Modal._active) Modal.close(Modal._active);
    },

    init: function () {
      document.addEventListener("click", function (e) {
        var opener = e.target.closest("[data-orb-modal-open]");
        if (opener) {
          Modal.open(opener.getAttribute("data-orb-modal-open"));
          return;
        }
        var closer = e.target.closest("[data-orb-modal-close]");
        if (closer) {
          Modal.close(closer.closest(".orb-modal-overlay"));
          return;
        }
        // backdrop click
        if (e.target.classList && e.target.classList.contains("orb-modal-overlay")) {
          Modal.close(e.target);
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") Modal.closeActive();
      });
    }
  };

  // mobile header menu
  var Menu = {
    set: function (header, open) {
      if (!header) return;
      header.classList.toggle("is-menu-open", open);
      var t = header.querySelector("[data-orb-menu-toggle]");
      if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
    },

    closeAll: function () {
      document.querySelectorAll(".orb-site-header.is-menu-open").forEach(function (h) {
        Menu.set(h, false);
      });
    },

    init: function () {
      document.addEventListener("click", function (e) {
        var toggle = e.target.closest("[data-orb-menu-toggle]");
        if (toggle) {
          var header = toggle.closest(".orb-site-header");
          Menu.set(header, !header.classList.contains("is-menu-open"));
          return;
        }
        var link = e.target.closest(".orb-site-nav a");
        if (link || !e.target.closest(".orb-site-header")) Menu.closeAll();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") Menu.closeAll();
      });

      if (window.matchMedia) {
        var mq = window.matchMedia("(min-width: 769px)");
        var onChange = function (ev) { if (ev.matches) Menu.closeAll(); };
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else if (mq.addListener) mq.addListener(onChange);
      }
    }
  };

  // nav sheet: [data-orb-nav-more] + [data-orb-nav-sheet]
  var NavSheet = {
    init: function () {
      var trigger = document.querySelector("[data-orb-nav-more]");
      var sheet = document.querySelector("[data-orb-nav-sheet]");
      if (!trigger || !sheet) return;

      var backdrop = document.createElement("div");
      backdrop.className = "orb-nav-sheet-backdrop";
      backdrop.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:70;display:none;";
      document.body.appendChild(backdrop);

      function openSheet() {
        sheet.classList.add("open");
        backdrop.style.display = "block";
        trigger.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }

      function closeSheet() {
        sheet.classList.remove("open");
        backdrop.style.display = "none";
        trigger.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }

      trigger.addEventListener("click", function () {
        sheet.classList.contains("open") ? closeSheet() : openSheet();
      });
      backdrop.addEventListener("click", closeSheet);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeSheet();
      });
    }
  };

  // .orb-reveal fades in once it scrolls into view
  var Reveal = {
    init: function () {
      var items = document.querySelectorAll(".orb-reveal");
      if (!items.length) return;

      if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) { el.classList.add("is-visible"); });
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -24px 0px" }
      );

      items.forEach(function (el) { observer.observe(el); });
    }
  };

  // dropdown
  var Dropdown = {
    closeAll: function (except) {
      document.querySelectorAll("[data-orb-dropdown-menu].is-open").forEach(function (m) {
        if (m === except) return;
        m.classList.remove("is-open");
        var t = m.parentElement && m.parentElement.querySelector("[data-orb-dropdown-trigger]");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    },

    init: function () {
      document.querySelectorAll("[data-orb-dropdown-trigger]").forEach(function (t) {
        t.setAttribute("aria-haspopup", "true");
        t.setAttribute("aria-expanded", "false");
      });

      document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-orb-dropdown-trigger]");
        if (trigger) {
          var menu = trigger.parentElement.querySelector("[data-orb-dropdown-menu]");
          if (!menu) return;
          var willOpen = !menu.classList.contains("is-open");
          Dropdown.closeAll(menu);
          menu.classList.toggle("is-open", willOpen);
          trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
          return;
        }
        var item = e.target.closest(".orb-dropdown-item");
        if (item || !e.target.closest("[data-orb-dropdown-menu]")) Dropdown.closeAll();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") Dropdown.closeAll();
      });
    }
  };

  // tabs, also works as a segmented control when tabs have no panels
  var Tabs = {
    select: function (tab) {
      var list = tab.closest('[role="tablist"]');
      if (!list) return;
      list.querySelectorAll('[role="tab"]').forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
        var id = t.getAttribute("aria-controls");
        var panel = id && document.getElementById(id);
        if (panel) panel.hidden = !on;
      });
      tab.dispatchEvent(new CustomEvent("orb:tab", { bubbles: true, detail: { tab: tab } }));
    },

    init: function () {
      document.querySelectorAll('[data-orb-tabs] [role="tablist"]').forEach(function (list) {
        var sel = list.querySelector('[role="tab"][aria-selected="true"]') || list.querySelector('[role="tab"]');
        if (sel) Tabs.select(sel);
      });

      document.addEventListener("click", function (e) {
        var tab = e.target.closest('[data-orb-tabs] [role="tab"]');
        if (tab) Tabs.select(tab);
      });

      document.addEventListener("keydown", function (e) {
        var tab = e.target.closest && e.target.closest('[data-orb-tabs] [role="tab"]');
        if (!tab) return;
        var keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (keys.indexOf(e.key) < 0) return;
        var tabs = Array.prototype.slice.call(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
        var i = tabs.indexOf(tab);
        var n = e.key === "Home" ? 0
          : e.key === "End" ? tabs.length - 1
          : e.key === "ArrowRight" ? (i + 1) % tabs.length
          : (i - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        tabs[n].focus();
        Tabs.select(tabs[n]);
      });
    }
  };

  // toast: Orbitarium.toast("Saved", { tone: "success" }) or [data-orb-toast]
  var Toast = {
    _stack: null,

    show: function (message, opts) {
      opts = opts || {};
      if (!Toast._stack || !document.body.contains(Toast._stack)) {
        Toast._stack = document.createElement("div");
        Toast._stack.className = "orb-toast-stack";
        Toast._stack.setAttribute("role", "status");
        Toast._stack.setAttribute("aria-live", "polite");
        document.body.appendChild(Toast._stack);
      }
      var el = document.createElement("div");
      el.className = "orb-toast" + (opts.tone ? " orb-tone-" + opts.tone : "");
      el.textContent = message;
      el.addEventListener("click", function () { Toast.dismiss(el); });
      Toast._stack.appendChild(el);

      var all = Toast._stack.querySelectorAll(".orb-toast:not(.is-leaving)");
      if (all.length > 4) Toast.dismiss(all[0]);

      var dur = opts.duration == null ? 3200 : opts.duration;
      if (dur > 0) setTimeout(function () { Toast.dismiss(el); }, dur);
      return el;
    },

    dismiss: function (el) {
      if (!el || el.classList.contains("is-leaving")) return;
      el.classList.add("is-leaving");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
    },

    init: function () {
      document.addEventListener("click", function (e) {
        var t = e.target.closest("[data-orb-toast]");
        if (t) Toast.show(t.getAttribute("data-orb-toast"), { tone: t.getAttribute("data-orb-toast-tone") });
      });
    }
  };

  window.Orbitarium = {
    version: "1.1.0",
    theme: Theme,
    accent: Accent,
    modal: Modal,
    tabs: Tabs,
    toast: Toast.show,
    dismissToast: Toast.dismiss
  };

  function init() {
    Theme.init();
    Accent.init();
    Modal.init();
    Menu.init();
    NavSheet.init();
    Reveal.init();
    Dropdown.init();
    Tabs.init();
    Toast.init();

    document.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-orb-theme-toggle]");
      if (toggle) Theme.toggle();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
