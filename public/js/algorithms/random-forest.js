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
}

renderInitial();

document.getElementById("renderBtn").addEventListener("click", () => {
    const axisValues = Array.from({ length: 21 }, (_, idx) => idx * 0.5);
    const gridZ = axisValues.map((y) => axisValues.map((x) => {
        let prediction = x > 2.5 && x < 7.5 && y > 2.5 && y < 7.5 ? 1 : 0;
        if (Math.random() < 0.1) {
            prediction = 1 - prediction;
        }
        return prediction;
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
});
