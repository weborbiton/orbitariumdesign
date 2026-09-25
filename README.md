# Orbitarium Design

**A whole design system, dropped in as one file.**

Orbitarium Design is the CSS + JS framework behind WebOrbiton's products, including **MevaSearch**, **NetKrypton**, and **WebAtlas Cloud**. It is now available as a source-available design system.

**No build step. No package manager. No configuration. Just CSS, JS, and real components.**

[![License](https://img.shields.io/badge/license-Orbitarium%20Design%20License-blue.svg)](http://orbitariumdesign.eu/license.html)
[![Version](https://img.shields.io/badge/version-1.1-green.svg)](#)
[![Size](https://img.shields.io/badge/size-~100KB-orange.svg)](#)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

---

## ✨ Features

* **Zero dependencies** — no frameworks or external packages required.
* **No build step** — include the CSS and JS and start building.
* **~100KB** — small enough to keep your stack simple.
* **`orb-` namespaced** — designed to avoid conflicts with Bootstrap, Tailwind, or custom CSS.
* **38 color tones** — reactive theming powered by CSS `color-mix()`.
* **Real components** — buttons, forms, tabs, dropdowns, alerts, toasts, tables, modals, and navigation shells.
* **Keyboard accessible** — interactive components include accessible keyboard behavior.
* **Mobile-first** — responsive navigation, bottom sheets, and mobile-friendly controls.
* **Dynamic theming** — change `--orb-primary` or switch dark mode without reloading.
* **2D depth system** — tactile buttons, tabs, switches, cards, and other surfaces.

---

## 🚀 Quick Start

### CDN

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link
    rel="stylesheet"
    href="https://cdn.orbitariumdesign.eu/style.css"
  >
</head>

<body class="orb-app orb-reset">

  <button class="orb-btn orb-btn-primary">
    Ship it
  </button>

  <button class="orb-btn orb-btn-solid orb-tone-red orb-btn-xl">
    Save
  </button>

  <!-- Optional JavaScript -->
  <script src="https://cdn.orbitariumdesign.eu/script.js"></script>
</body>
</html>
```

`script.js` is optional and provides interactive functionality such as dark mode, tabs, dropdowns, toasts, modals, and mobile navigation.

### Self-hosted

Download `style.css` and `script.js` and serve them from your own project.

---

## 🎨 Theming

Orbitarium Design is built around a small set of reactive design tokens:

```css
--orb-primary
--orb-primary-hover
--orb-primary-dim
--orb-success
--orb-danger
--orb-warning
--orb-info
--orb-surface
--orb-surface-alt
--orb-border
```

Change the primary accent globally:

```css
:root {
  --orb-primary: #635bff;
}
```

Or use a tone class on an individual component:

```html
<button class="orb-btn orb-btn-solid orb-tone-blue">
  Continue
</button>
```

Orbitarium uses `color-mix()` to derive component colors and states from the design tokens.

---

## 🧩 Components

Orbitarium includes:

* Buttons
* Forms & inputs
* Selects & input groups
* Checkboxes & radios
* Switches & range inputs
* Cards & panels
* Pills & badges
* Alerts
* Tabs
* Progress bars
* Avatars & spinners
* Dropdowns
* Tooltips
* Toasts
* Tables
* Modals & bottom sheets
* Navigation shells
* Responsive sidebars

See the complete **[Component Showcase](http://orbitariumdesign.eu/components.html)**.

---

## 📦 Design Philosophy

### No configuration

Orbitarium is designed to be dropped directly into an existing project.

### Namespaced

All framework classes use the `orb-` prefix to minimize CSS collisions.

### One system

Colors, spacing, radius, shadows, animation, typography, and component states follow the same token system.

### Mobile-first

Components adapt to smaller screens without requiring additional application-level markup.

---

## 📁 Project Structure

```text
orbitarium-design/
├── index.html
├── style.css
└── script.js
```

---

## 📄 License

**Orbitarium Design License — Source-Available**

You can use Orbitarium Design in personal and commercial projects.

You may:

* Modify it
* Fork it
* Build on top of it
* Use it commercially
* Use it without attribution

Restrictions:

* Do not redistribute the unchanged original as your own.
* Forks must use a distinct name.
* Official WebOrbiton icons remain property of WebOrbiton.

See the full **[Orbitarium Design License](http://orbitariumdesign.eu/license.html)**.

---

**Orbitarium Design 1.1**
A source-available design system by **WebOrbiton**.

© 2026 WebOrbiton.
