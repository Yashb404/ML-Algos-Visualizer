const pts = [];
for (let i = 0; i < 100; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const cls = x > 3 && x < 7 && y > 3 && y < 7 ? 1 : 0;
    pts.push({ x, y, class: cls });
}

const layout = {
    title: "Ensemble Decision Boundary",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { range: [0, 10], showgrid: false },
    yaxis: { range: [0, 10], showgrid: false }
};

function giniImpurity(labels) {
    if (!labels.length) {
        return 0;
    }

    const ones = labels.filter((value) => value === 1).length;
    const p1 = ones / labels.length;
    const p0 = 1 - p1;
    return 1 - (p0 * p0 + p1 * p1);
}

function majorityClass(samples) {
    const ones = samples.filter((sample) => sample.class === 1).length;
    return ones >= samples.length - ones ? 1 : 0;
}

function splitSamples(samples, feature, threshold) {
    const left = [];
    const right = [];

    for (const sample of samples) {
        if (sample[feature] <= threshold) {
            left.push(sample);
        } else {
            right.push(sample);
        }
    }

    return { left, right };
}

function bestSplit(samples, featureNames) {
    let best = null;
    let bestGini = Infinity;

    for (const feature of featureNames) {
        const sortedValues = [...new Set(samples.map((sample) => sample[feature]).sort((a, b) => a - b))];
        if (sortedValues.length < 2) {
            continue;
        }

        for (let i = 0; i < sortedValues.length - 1; i++) {
            const threshold = (sortedValues[i] + sortedValues[i + 1]) / 2;
            const { left, right } = splitSamples(samples, feature, threshold);
            if (!left.length || !right.length) {
                continue;
            }

            const leftGini = giniImpurity(left.map((sample) => sample.class));
            const rightGini = giniImpurity(right.map((sample) => sample.class));
            const weighted = (left.length / samples.length) * leftGini + (right.length / samples.length) * rightGini;

            if (weighted < bestGini) {
                bestGini = weighted;
                best = { feature, threshold, left, right };
            }
        }
    }

    return best;
}

function buildTree(samples, depth, maxDepth, featureSubsetSize) {
    const classes = new Set(samples.map((sample) => sample.class));
    if (depth >= maxDepth || classes.size === 1 || samples.length < 4) {
        return { leaf: true, prediction: majorityClass(samples) };
    }

    const allFeatures = ["x", "y"];
    const shuffled = [...allFeatures].sort(() => Math.random() - 0.5);
    const selectedFeatures = shuffled.slice(0, Math.max(1, featureSubsetSize));
    const split = bestSplit(samples, selectedFeatures);

    if (!split) {
        return { leaf: true, prediction: majorityClass(samples) };
    }

    return {
        leaf: false,
        feature: split.feature,
        threshold: split.threshold,
        left: buildTree(split.left, depth + 1, maxDepth, featureSubsetSize),
        right: buildTree(split.right, depth + 1, maxDepth, featureSubsetSize)
    };
}

function predictTree(tree, point) {
    if (tree.leaf) {
        return tree.prediction;
    }

    if (point[tree.feature] <= tree.threshold) {
        return predictTree(tree.left, point);
    }

    return predictTree(tree.right, point);
}

function bootstrapSamples(samples) {
    const boot = [];
    for (let i = 0; i < samples.length; i++) {
        const idx = Math.floor(Math.random() * samples.length);
        boot.push(samples[idx]);
    }
    return boot;
}

function trainForest(samples, nTrees = 21, maxDepth = 4) {
    const trees = [];
    const featureSubsetSize = 1;

    for (let i = 0; i < nTrees; i++) {
        const boot = bootstrapSamples(samples);
        trees.push(buildTree(boot, 0, maxDepth, featureSubsetSize));
    }

    return trees;
}

function predictForest(trees, point) {
    const votes = trees.reduce((acc, tree) => acc + predictTree(tree, point), 0);
    return votes >= trees.length / 2 ? 1 : 0;
}

function pointTraces() {
    return [
        {
            x: pts.filter((p) => p.class === 0).map((p) => p.x),
            y: pts.filter((p) => p.class === 0).map((p) => p.y),
            mode: "markers",
            name: "Class 0",
            marker: { color: "#2563eb", line: { color: "#222222", width: 1 } }
        },
        {
            x: pts.filter((p) => p.class === 1).map((p) => p.x),
            y: pts.filter((p) => p.class === 1).map((p) => p.y),
            mode: "markers",
            name: "Class 1",
            marker: { color: "#dc2626", symbol: "cross", line: { color: "#222222", width: 1 } }
        }
    ];
}

function renderInitial() {
    Plotly.newPlot("plot", pointTraces(), layout);
    document.getElementById("status").innerText = "Ready";
}

renderInitial();

document.getElementById("renderBtn").addEventListener("click", () => {
    const forest = trainForest(pts, 25, 4);
    const axisValues = Array.from({ length: 21 }, (_, idx) => idx * 0.5);
    const gridZ = axisValues.map((y) => axisValues.map((x) => {
        return predictForest(forest, { x, y });
    }));

    const contour = {
        z: gridZ,
        x: axisValues,
        y: axisValues,
        type: "contour",
        colorscale: [
            [0, "rgba(255, 255, 255, 0.12)"],
            [1, "rgba(136, 136, 136, 0.18)"]
        ],
        showscale: false,
        line: { width: 0 }
    };

    Plotly.react("plot", [contour, ...pointTraces()], layout);
    document.getElementById("status").innerText = "Ensemble boundary generated";
});

document.getElementById("resetBtn").addEventListener("click", renderInitial);
