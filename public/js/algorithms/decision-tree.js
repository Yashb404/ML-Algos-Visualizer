const dtPoints = Array.from({ length: 100 }, () => {
    const x = Math.random() * 10;
    const y = Math.random() * 10;
    const cls = x > 5 && y > 5 ? 1 : 0;
    return { x, y, cls };
});

let depth = 0;

const baseLayout = {
    title: "Decision Boundary by Splits",
    paper_bgcolor: "#1e1e1e",
    plot_bgcolor: "#1e1e1e",
    font: { color: "#e0e0e0" },
    xaxis: { range: [0, 10], gridcolor: "#444" },
    yaxis: { range: [0, 10], gridcolor: "#444" }
};

function makeShapes() {
    const shapes = [];
    if (depth >= 1) {
        shapes.push({ type: "line", x0: 5, y0: 0, x1: 5, y1: 10, line: { color: "#58a6ff", width: 3 } });
    }
    if (depth >= 2) {
        shapes.push({ type: "line", x0: 5, y0: 5, x1: 10, y1: 5, line: { color: "#ffa657", width: 3 } });
    }
    if (depth >= 3) {
        shapes.push({ type: "line", x0: 0, y0: 6.5, x1: 5, y1: 6.5, line: { color: "#3fb950", width: 3 } });
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
            marker: { color: "#58a6ff", size: 9 }
        },
        {
            x: dtPoints.filter((p) => p.cls === 1).map((p) => p.x),
            y: dtPoints.filter((p) => p.cls === 1).map((p) => p.y),
            mode: "markers",
            name: "Class 1",
            marker: { color: "#ffa657", size: 9 }
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
