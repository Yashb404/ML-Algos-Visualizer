# Contributing to ML Visualizer

We welcome contributions! The project is designed to be modular so you can easily add new ML algorithms.

## How to Add a New Algorithm

The file structure for algorithms is strict to ensure consistency.

### 1. Create the Logic File

Create a new JavaScript file in `public/js/algorithms/`.
Example: `public/js/algorithms/k-means.js`

This file should handle:

- Data generation/loading.
- Chart initialization (Plotly/Chart.js).
- TensorFlow.js model creation and training loop.
- UI updates (loss selection, animations).

### 2. Create the View File

Create a new HTML file in `public/algorithms/`.
Example: `public/algorithms/k-means.html`

Copy the structure from `linear-regression.html`:

- Use the sidebar navigation.
- Link the styles: `<link rel="stylesheet" href="../css/style.css">`.
- Link your specific script: `<script src="../js/algorithms/k-means.js"></script>`.
- Add any algorithm-specific controls (buttons, inputs).

### 3. Update Global Navigation (Optional)

If you want your algorithm to be listed on the home page or sidebar, update:

- `public/index.html`
- The sidebar in `public/algorithms/*.html` files (we currently duplicate the sidebar in HTML for simplicity, though a shared JS loader could be used in the future).

## Style Guide

- **Colors**: Use the CSS variables defined in `style.css` (`--accent-color`, `--bg-color`).
- **Charts**: Use a dark theme for charts to match the UI.
