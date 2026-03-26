# ML Algos Visualizer

An interactive, browser-first machine learning playground that demonstrates how core algorithms behave step-by-step.

The project focuses on clarity and explainability: each module is isolated, visual, and easy to extend without changing backend logic.

## Highlights

- Interactive algorithm pages with real-time plotting.
- In-browser model training (TensorFlow.js) where applicable.
- Step-wise simulation flows for algorithm internals (for example, assignment/update loops in K-Means).
- Simple Express static server for fast local development.
- Modular file structure designed for adding new visualizers quickly.

## Implemented Visualizers

- Linear Regression
- Multiple Linear Regression
- Logistic Regression (binary classification sigmoid training)
- K-Nearest Neighbors (distance-based classification)
- Naive Bayes (probabilistic classification)
- Decision Tree (step-wise feature splits)
- Support Vector Machine (max-margin separator)
- Random Forest (ensemble-style boundary simulation)
- AdaBoost (iterative weak learner weighting)
- K-Means Clustering (iterative centroid updates with selectable $k$)
- Hierarchical Clustering (agglomerative merge process)

## Project Structure

```text
ML-Algos-Visualizer/
    public/
        index.html
        css/
            style.css
        algorithms/
            *.html                # One view per algorithm
        js/
            main.js
            algorithms/
                *.js                # Logic per algorithm
    server.js                 # Express static server
    package.json
```

## Quick Start

### Prerequisites

- Node.js 14+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Open <http://localhost:3000>.

For development with auto-restart:

```bash
npm run dev
```

## Routing

- Home: `/`
- Algorithm pages: `/algorithms/<name>.html`

Examples:

- `/algorithms/linear-regression.html`
- `/algorithms/multiple-linear-regression.html`
- `/algorithms/logistic-regression.html`
- `/algorithms/knn.html`
- `/algorithms/naive-bayes.html`
- `/algorithms/decision-tree.html`
- `/algorithms/svm.html`
- `/algorithms/random-forest.html`
- `/algorithms/adaboost.html`
- `/algorithms/k-means.html`
- `/algorithms/hierarchical-clustering.html`

## Technology Stack

- Backend: Express.js
- Frontend: HTML, CSS, Vanilla JavaScript
- Visualization: Plotly.js
- ML Runtime (selected modules): TensorFlow.js

## Extending the Project

To add a new algorithm module:

1. Add an HTML view under `public/algorithms/`.
2. Add a JS logic file under `public/js/algorithms/`.
3. Connect the view to its script.
4. Add navigation links where needed.

Detailed contribution guidance is available in `CONTRIBUTING.md`.

## License

MIT
