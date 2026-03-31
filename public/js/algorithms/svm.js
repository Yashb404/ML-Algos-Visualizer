const svmA = Array.from({ length: 35 }, () => ({ x: 1 + Math.random() * 3, y: 5 + Math.random() * 3 }));
const svmB = Array.from({ length: 35 }, () => ({ x: 6 + Math.random() * 3, y: 1 + Math.random() * 3 }));

const layout = {
    title: "Linear Separation with Margin",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { range: [0, 10], gridcolor: "#333333" },
    yaxis: { range: [0, 10], gridcolor: "#333333" }
};

function meanPoint(points) {
    return {
        x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
        y: points.reduce((sum, p) => sum + p.y, 0) / points.length
    };
}

function render(withBoundary) {
    const traces = [
        {
            x: svmA.map((p) => p.x),
            y: svmA.map((p) => p.y),
            mode: "markers",
            name: "Class -1",
            marker: { color: "#2563eb", size: 9 }
        },
        {
            x: svmB.map((p) => p.x),
            y: svmB.map((p) => p.y),
            mode: "markers",
            name: "Class +1",
            marker: { color: "#dc2626", size: 9, symbol: "cross" }
        }
    ];

    if (withBoundary) {
        const mA = meanPoint(svmA);
        const mB = meanPoint(svmB);
        const mid = { x: (mA.x + mB.x) / 2, y: (mA.y + mB.y) / 2 };

        const dx = mB.x - mA.x;
        const dy = mB.y - mA.y;

        const nx = -dy;
        const ny = dx;
        const norm = Math.sqrt(nx * nx + ny * ny) || 1;
        const ux = nx / norm;
        const uy = ny / norm;

        const length = 8;
        const marginShift = 0.7;

        const lineEnds = [
            { x: mid.x - ux * length, y: mid.y - uy * length },
            { x: mid.x + ux * length, y: mid.y + uy * length }
        ];

        const margin1 = lineEnds.map((p) => ({ x: p.x + (dx / (Math.sqrt(dx * dx + dy * dy) || 1)) * marginShift, y: p.y + (dy / (Math.sqrt(dx * dx + dy * dy) || 1)) * marginShift }));
        const margin2 = lineEnds.map((p) => ({ x: p.x - (dx / (Math.sqrt(dx * dx + dy * dy) || 1)) * marginShift, y: p.y - (dy / (Math.sqrt(dx * dx + dy * dy) || 1)) * marginShift }));

        traces.push({
            x: lineEnds.map((p) => p.x),
            y: lineEnds.map((p) => p.y),
            mode: "lines",
            name: "Decision Boundary",
            line: { color: "#ffffff", width: 3 }
        });

        traces.push({
            x: margin1.map((p) => p.x),
            y: margin1.map((p) => p.y),
            mode: "lines",
            name: "Margin",
            line: { color: "#aaaaaa", width: 2, dash: "dot" }
        });

        traces.push({
            x: margin2.map((p) => p.x),
            y: margin2.map((p) => p.y),
            mode: "lines",
            showlegend: false,
            line: { color: "#aaaaaa", width: 2, dash: "dot" }
        });
    }

    Plotly.react("plot", traces, layout);
}

render(false);

document.getElementById("fitBtn").addEventListener("click", () => {
    render(true);
    document.getElementById("status").innerText = "Boundary and margins rendered";
});
