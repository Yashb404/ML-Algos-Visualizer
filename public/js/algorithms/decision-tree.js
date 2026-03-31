const dtPoints = Array.from({ length: 100 }, () => {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const cls = x > 5 && y > 5 ? 1 : 0;
    return { x, y, cls };
});

let depth = 0;

const baseLayout = {
    title: "Decision Boundary by Splits",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { range: [0, 10], gridcolor: "#333333" },
    yaxis: { range: [0, 10], gridcolor: "#333333" }
};

function makeShapes() {
    const shapes = [];
    if (depth >= 1) {
        shapes.push({ type: "line", x0: 5, y0: 0, x1: 5, y1: 10, line: { color: "#ffffff", width: 3 } });
    }
    if (depth >= 2) {
        shapes.push({ type: "line", x0: 5, y0: 5, x1: 10, y1: 5, line: { color: "#aaaaaa", width: 3 } });
    }
    if (depth >= 3) {
        shapes.push({ type: "line", x0: 0, y0: 6.5, x1: 5, y1: 6.5, line: { color: "#666666", width: 3 } });
    }
    return shapes;
}

function render() {
    const traces = [
        {
            x: dtPoints.filter((p) => p.cls === 0).map((p) => p.x),
            y: dtPoints.filter((p) => p.cls === 0).map((p) => p.y),
            mode: "markers",
            name: "Class 0",
            marker: { color: "#00bcd4", size: 9 }
        },
        {
            x: dtPoints.filter((p) => p.cls === 1).map((p) => p.x),
            y: dtPoints.filter((p) => p.cls === 1).map((p) => p.y),
            mode: "markers",
            name: "Class 1",
            marker: { color: "#ff4081", size: 9, symbol: "cross" }
        }
    ];

    Plotly.react("plot", traces, { ...baseLayout, shapes: makeShapes() });
    document.getElementById("status").innerText = `Depth: ${depth}`;
}

document.getElementById("stepBtn").addEventListener("click", () => {
    depth = Math.min(3, depth + 1);
    render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    depth = 0;
    render();
});

render();
