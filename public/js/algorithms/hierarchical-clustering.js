const basePoints = Array.from({ length: 12 }, (_, idx) => ({
    id: idx,
    x: 1 + Math.random() * 8,
    y: 1 + Math.random() * 8
}));

let clusters = [];
let mergeLines = [];

function centroid(cluster) {
    return {
        x: cluster.points.reduce((sum, p) => sum + p.x, 0) / cluster.points.length,
        y: cluster.points.reduce((sum, p) => sum + p.y, 0) / cluster.points.length
    };
}

function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function resetState() {
    clusters = basePoints.map((point) => ({ points: [point] }));
    mergeLines = [];
}

function findClosestPair() {
    let best = { i: -1, j: -1, d: Infinity };
    for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
            const c1 = centroid(clusters[i]);
            const c2 = centroid(clusters[j]);
            const d = dist(c1, c2);
            if (d < best.d) {
                best = { i, j, d, c1, c2 };
            }
        }
    }
    return best;
}

function mergeStep() {
    if (clusters.length <= 1) {
        return;
    }

    const pair = findClosestPair();
    mergeLines.push({ from: pair.c1, to: pair.c2 });

    const merged = {
        points: [...clusters[pair.i].points, ...clusters[pair.j].points]
    };

    clusters = clusters.filter((_, idx) => idx !== pair.i && idx !== pair.j);
    clusters.push(merged);
}

function render() {
    const traces = [
        {
            x: basePoints.map((p) => p.x),
            y: basePoints.map((p) => p.y),
            mode: "markers",
            type: "scatter",
            marker: { color: "#58a6ff", size: 10 },
            name: "Points"
        },
        ...mergeLines.map((line, idx) => ({
            x: [line.from.x, line.to.x],
            y: [line.from.y, line.to.y],
            mode: "lines",
            showlegend: idx === 0,
            name: "Merge",
            line: { color: "#ffa657", width: 2 }
        }))
    ];

    Plotly.react("plot", traces, {
        title: "Bottom-Up Merge Process",
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
        xaxis: { range: [0, 10], gridcolor: "#444" },
        yaxis: { range: [0, 10], gridcolor: "#444" }
    });

    document.getElementById("status").innerText = `Clusters: ${clusters.length}`;
}

document.getElementById("stepBtn").addEventListener("click", () => {
    mergeStep();
    render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    resetState();
    render();
});

resetState();
render();
