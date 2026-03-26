const classA = Array.from({ length: 40 }, () => ({ x: 2 + Math.random() * 2, y: 2 + Math.random() * 2 }));
const classB = Array.from({ length: 40 }, () => ({ x: 6 + Math.random() * 2, y: 6 + Math.random() * 2 }));
const target = { x: 5, y: 4.8 };

const layout = {
    title: "Feature Space",
    paper_bgcolor: "#1e1e1e",
    plot_bgcolor: "#1e1e1e",
    font: { color: "#e0e0e0" },
    xaxis: { range: [0, 10], gridcolor: "#444" },
    yaxis: { range: [0, 10], gridcolor: "#444" }
};

function mean(values) {
    return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function variance(values, avg) {
    const v = values.reduce((acc, value) => acc + (value - avg) ** 2, 0) / values.length;
    return Math.max(v, 1e-4);
}

function gaussianPdf(x, mu, sigma2) {
    const denom = Math.sqrt(2 * Math.PI * sigma2);
    return Math.exp(-((x - mu) ** 2) / (2 * sigma2)) / denom;
}

function getStats(points) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const mx = mean(xs);
    const my = mean(ys);
    return {
        mx,
        my,
        vx: variance(xs, mx),
        vy: variance(ys, my)
    };
}

function renderScatter() {
    Plotly.newPlot("plot", [
        {
            x: classA.map((p) => p.x),
            y: classA.map((p) => p.y),
            mode: "markers",
            name: "Class 0",
            marker: { color: "#58a6ff", size: 9 }
        },
        {
            x: classB.map((p) => p.x),
            y: classB.map((p) => p.y),
            mode: "markers",
            name: "Class 1",
            marker: { color: "#ffa657", size: 9 }
        },
        {
            x: [target.x],
            y: [target.y],
            mode: "markers",
            name: "Target",
            marker: { color: "#ffffff", size: 16, symbol: "star" }
        }
    ], layout);
}

function renderPosterior(p0, p1) {
    Plotly.react("posterior", [
        {
            x: ["Class 0", "Class 1"],
            y: [p0, p1],
            type: "bar",
            marker: { color: ["#58a6ff", "#ffa657"] }
        }
    ], {
        title: "Posterior Probabilities",
        paper_bgcolor: "#1e1e1e",
        plot_bgcolor: "#1e1e1e",
        font: { color: "#e0e0e0" },
        yaxis: { range: [0, 1], gridcolor: "#444" }
    });
}

function classify() {
    const s0 = getStats(classA);
    const s1 = getStats(classB);

    const prior0 = classA.length / (classA.length + classB.length);
    const prior1 = classB.length / (classA.length + classB.length);

    const like0 = gaussianPdf(target.x, s0.mx, s0.vx) * gaussianPdf(target.y, s0.my, s0.vy);
    const like1 = gaussianPdf(target.x, s1.mx, s1.vx) * gaussianPdf(target.y, s1.my, s1.vy);

    const num0 = like0 * prior0;
    const num1 = like1 * prior1;
    const norm = num0 + num1;

    const p0 = num0 / norm;
    const p1 = num1 / norm;
    renderPosterior(p0, p1);

    const predicted = p1 > p0 ? "Class 1" : "Class 0";
    document.getElementById("status").innerText = `Predicted: ${predicted} (P1=${p1.toFixed(3)})`;
}

renderScatter();
renderPosterior(0.5, 0.5);
document.getElementById("classifyBtn").addEventListener("click", classify);
