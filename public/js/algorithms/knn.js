const points = [];
for (let i = 0; i < 30; i++) {
    points.push({ x: 2 + Math.random() * 3, y: 2 + Math.random() * 3, class: 0 });
}
for (let i = 0; i < 30; i++) {
    points.push({ x: 6 + Math.random() * 3, y: 6 + Math.random() * 3, class: 1 });
}

const targetPoint = { x: 5, y: 5 };

const layout = {
    title: "KNN Classification",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { range: [0, 10], showgrid: true, gridcolor: "#333333" },
    yaxis: { range: [0, 10], showgrid: true, gridcolor: "#333333" }
};

function buildBaseTraces() {
    return [
        {
            x: points.filter((p) => p.class === 0).map((p) => p.x),
            y: points.filter((p) => p.class === 0).map((p) => p.y),
            mode: "markers",
            name: "Class 0",
            marker: { color: "#00bcd4", size: 10 }
        },
        {
            x: points.filter((p) => p.class === 1).map((p) => p.x),
            y: points.filter((p) => p.class === 1).map((p) => p.y),
            mode: "markers",
            name: "Class 1",
            marker: { color: "#ff4081", size: 10, symbol: "cross" }
        },
        {
            x: [targetPoint.x],
            y: [targetPoint.y],
            mode: "markers",
            name: "Target",
            marker: { color: "#ffeb3b", size: 15, symbol: "star" }
        }
    ];
}

function render() {
    Plotly.newPlot("plot", buildBaseTraces(), layout);
}

function syncTargetFromInputs() {
    const x = parseFloat(document.getElementById("targetXInput").value);
    const y = parseFloat(document.getElementById("targetYInput").value);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return false;
    }

    targetPoint.x = Math.max(0, Math.min(10, x));
    targetPoint.y = Math.max(0, Math.min(10, y));
    return true;
}

function resetVisualization() {
    document.getElementById("targetXInput").value = "5";
    document.getElementById("targetYInput").value = "5";
    targetPoint.x = 5;
    targetPoint.y = 5;
    document.getElementById("status").innerText = "Ready";
    render();
}

render();

document.getElementById("classifyBtn").addEventListener("click", () => {
    if (!syncTargetFromInputs()) {
        document.getElementById("status").innerText = "Enter valid target coordinates";
        return;
    }

    const kInput = parseInt(document.getElementById("kInput").value, 10);
    const k = Math.max(1, Math.min(points.length, kInput || 1));

    const sorted = points
        .map((p) => ({ ...p, dist: Math.sqrt((p.x - targetPoint.x) ** 2 + (p.y - targetPoint.y) ** 2) }))
        .sort((a, b) => a.dist - b.dist);

    const neighbors = sorted.slice(0, k);
    const classVotes = neighbors.reduce((acc, item) => {
        acc[item.class] = (acc[item.class] || 0) + 1;
        return acc;
    }, {});

    const predictedClass = (classVotes[1] || 0) > (classVotes[0] || 0) ? 1 : 0;
    const lineColor = predictedClass === 1 ? "#ff4081" : "#00bcd4";

    const neighborLines = neighbors.map((neighbor) => ({
        x: [targetPoint.x, neighbor.x],
        y: [targetPoint.y, neighbor.y],
        mode: "lines",
        showlegend: false,
        line: { color: "#aaaaaa", dash: "dot", width: 2 }
    }));

    const traces = [
        ...buildBaseTraces(),
        {
            x: [targetPoint.x],
            y: [targetPoint.y],
            mode: "markers",
            name: `Predicted Class: ${predictedClass}`,
            marker: { color: lineColor, size: 18, symbol: "star", line: { color: "white", width: 1 } }
        },
        ...neighborLines
    ];

    Plotly.react("plot", traces, layout);
    document.getElementById("status").innerText = `Predicted class: ${predictedClass} using k=${k}`;
});

document.getElementById("resetBtn").addEventListener("click", resetVisualization);
document.getElementById("targetXInput").addEventListener("change", () => {
    if (syncTargetFromInputs()) {
        render();
    }
});
document.getElementById("targetYInput").addEventListener("change", () => {
    if (syncTargetFromInputs()) {
        render();
    }
});
