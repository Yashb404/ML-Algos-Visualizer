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

function trainLinearSvm(points, labels, options = {}) {
    const epochs = options.epochs ?? 1200;
    const learningRate = options.learningRate ?? 0.01;
    const lambda = options.lambda ?? 0.02;

    let w1 = 0;
    let w2 = 0;
    let b = 0;

    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let i = 0; i < points.length; i++) {
            const x1 = points[i].x;
            const x2 = points[i].y;
            const y = labels[i];
            const margin = y * (w1 * x1 + w2 * x2 + b);

            if (margin >= 1) {
                w1 -= learningRate * (2 * lambda * w1);
                w2 -= learningRate * (2 * lambda * w2);
            } else {
                w1 -= learningRate * (2 * lambda * w1 - y * x1);
                w2 -= learningRate * (2 * lambda * w2 - y * x2);
                b += learningRate * y;
            }
        }
    }

    return { w1, w2, b };
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
        const trainingPoints = [...svmA, ...svmB];
        const labels = [...Array(svmA.length).fill(-1), ...Array(svmB.length).fill(1)];
        const model = trainLinearSvm(trainingPoints, labels);

        const eps = 1e-8;
        const { w1, w2, b } = model;

        let decisionX;
        let marginPosX;
        let marginNegX;
        let decisionY;
        let marginPosY;
        let marginNegY;

        if (Math.abs(w2) > eps) {
            decisionX = [0, 10];
            decisionY = decisionX.map((x) => (-(w1 * x + b)) / w2);
            marginPosY = decisionX.map((x) => (-(w1 * x + b - 1)) / w2);
            marginNegY = decisionX.map((x) => (-(w1 * x + b + 1)) / w2);
            marginPosX = decisionX;
            marginNegX = decisionX;
        } else {
            const x0 = -b / (w1 || eps);
            const xPos = (1 - b) / (w1 || eps);
            const xNeg = (-1 - b) / (w1 || eps);
            decisionX = [x0, x0];
            decisionY = [0, 10];
            marginPosX = [xPos, xPos];
            marginPosY = [0, 10];
            marginNegX = [xNeg, xNeg];
            marginNegY = [0, 10];
        }

        traces.push({
            x: decisionX,
            y: decisionY,
            mode: "lines",
            name: "Decision Boundary",
            line: { color: "#ffffff", width: 3 }
        });

        traces.push({
            x: marginPosX,
            y: marginPosY,
            mode: "lines",
            name: "Margin",
            line: { color: "#aaaaaa", width: 2, dash: "dot" }
        });

        traces.push({
            x: marginNegX,
            y: marginNegY,
            mode: "lines",
            showlegend: false,
            line: { color: "#aaaaaa", width: 2, dash: "dot" }
        });
    }

    Plotly.react("plot", traces, layout);
}

render(false);

function resetVisualization() {
    render(false);
    document.getElementById("status").innerText = "Ready";
}

document.getElementById("fitBtn").addEventListener("click", () => {
    render(true);
    document.getElementById("status").innerText = "Boundary and margins rendered";
});

document.getElementById("resetBtn").addEventListener("click", resetVisualization);
