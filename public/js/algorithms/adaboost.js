const boostPoints = [
    { x: 1.2, y: -1 }, { x: 2.0, y: -1 }, { x: 2.5, y: -1 }, { x: 3.0, y: -1 },
    { x: 3.8, y: 1 }, { x: 4.6, y: -1 }, { x: 5.0, y: 1 }, { x: 5.7, y: 1 },
    { x: 6.2, y: 1 }, { x: 7.1, y: 1 }
];

const stumps = [3.4, 4.4, 5.4];
let round = 0;
let weights = Array(boostPoints.length).fill(1 / boostPoints.length);

const layout = {
    title: "Weighted Samples and Weak Learners",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { range: [0, 8], title: "Feature", gridcolor: "#333333" },
    yaxis: { range: [-1.6, 1.6], tickvals: [-1, 1], ticktext: ["Class -1", "Class +1"], gridcolor: "#333333" }
};

function stumpPredict(x, threshold) {
    return x < threshold ? -1 : 1;
}

function normalize(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0) || 1;
    return arr.map((val) => val / sum);
}

function updateWeights(threshold) {
    const newWeights = [...weights];
    for (let i = 0; i < boostPoints.length; i++) {
        const p = boostPoints[i];
        const pred = stumpPredict(p.x, threshold);
        if (pred !== p.y) {
            newWeights[i] *= 1.6;
        } else {
            newWeights[i] *= 0.85;
        }
    }
    weights = normalize(newWeights);
}

function render() {
    const activeThresholds = stumps.slice(0, round);
    const shapes = activeThresholds.map((t, idx) => ({
        type: "line",
        x0: t,
        y0: -1.6,
        x1: t,
        y1: 1.6,
        line: { color: ["#ffffff", "#aaaaaa", "#666666"][idx], width: 2, dash: "dot" }
    }));

    const classMinus = boostPoints
        .map((point, idx) => ({ ...point, w: weights[idx] }))
        .filter((point) => point.y === -1);
    const classPlus = boostPoints
        .map((point, idx) => ({ ...point, w: weights[idx] }))
        .filter((point) => point.y === 1);

    const traces = [
        {
            x: classMinus.map((p) => p.x),
            y: classMinus.map((p) => p.y),
            mode: "markers",
            name: "Class -1",
            marker: {
                color: "#2563eb",
                size: classMinus.map((p) => 10 + p.w * 90)
            }
        },
        {
            x: classPlus.map((p) => p.x),
            y: classPlus.map((p) => p.y),
            mode: "markers",
            name: "Class +1",
            marker: {
                color: "#dc2626",
                size: classPlus.map((p) => 10 + p.w * 90)
            }
        }
    ];

    Plotly.react("plot", traces, { ...layout, shapes });
    document.getElementById("status").innerText = `Round: ${round}`;
}

document.getElementById("stepBtn").addEventListener("click", () => {
    if (round >= stumps.length) {
        return;
    }
    updateWeights(stumps[round]);
    round += 1;
    render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    round = 0;
    weights = Array(boostPoints.length).fill(1 / boostPoints.length);
    render();
});

render();
