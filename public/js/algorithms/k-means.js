// Simulated Iris dataset using petal length (x) and width (y) like cluster regions.
const generateIrisData = () => {
    const generatedData = [];
    const addCluster = (cx, cy, spread, count) => {
        for (let i = 0; i < count; i++) {
            generatedData.push({
                x: cx + (Math.random() - 0.5) * spread,
                y: cy + (Math.random() - 0.5) * spread * 0.5
            });
        }
    };

    addCluster(1.5, 0.3, 1.0, 50);
    addCluster(4.0, 1.3, 1.5, 50);
    addCluster(5.5, 2.0, 1.5, 50);
    return generatedData;
};

let data = generateIrisData();
let k = 3;
let centroids = [];
let assignments = new Array(data.length).fill(-1);
let isConverged = false;
let stepState = "assign";

const colors = ["#00bcd4", "#ff4081", "#00e676", "#ffeb3b"];

const layout = {
    title: "K-Means Iteration",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { title: "Petal Length (Scaled)", showgrid: true, gridcolor: "#333333" },
    yaxis: { title: "Petal Width (Scaled)", showgrid: true, gridcolor: "#333333" },
    showlegend: false,
    hovermode: false
};

function renderPlot() {
    const traces = [];

    for (let c = 0; c < Math.max(k, 1); c++) {
        const clusterPoints = data.filter((_, i) => assignments[i] === c || (assignments[i] === -1 && c === 0));
        traces.push({
            x: clusterPoints.map((point) => point.x),
            y: clusterPoints.map((point) => point.y),
            mode: "markers",
            type: "scatter",
            marker: {
                size: 8,
                color: assignments.includes(-1) ? "#9e9e9e" : colors[c],
                opacity: 0.75
            }
        });
    }

    if (centroids.length > 0) {
        traces.push({
            x: centroids.map((centroid) => centroid.x),
            y: centroids.map((centroid) => centroid.y),
            mode: "markers",
            type: "scatter",
            marker: {
                size: 18,
                color: colors.slice(0, k),
                symbol: "x",
                line: { color: "#ffffff", width: 2 }
            }
        });
    }

    Plotly.react("plot", traces, layout);
}

function getDistance(pointA, pointB) {
    return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}

function initializeCentroids() {
    k = parseInt(document.getElementById("kValue").value, 10);
    assignments = new Array(data.length).fill(-1);
    isConverged = false;
    stepState = "assign";

    const shuffled = [...data].sort(() => 0.5 - Math.random());
    centroids = shuffled.slice(0, k).map((point) => ({ ...point }));

    document.getElementById("status").innerText = `Initialized K=${k}`;
    document.getElementById("stepBtn").disabled = false;
    document.getElementById("runBtn").disabled = false;
    renderPlot();
}

function stepKMeans() {
    if (isConverged) {
        return;
    }

    if (stepState === "assign") {
        let changed = false;
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity;
            let minIndex = -1;

            for (let j = 0; j < k; j++) {
                const distance = getDistance(data[i], centroids[j]);
                if (distance < minDist) {
                    minDist = distance;
                    minIndex = j;
                }
            }

            if (assignments[i] !== minIndex) {
                assignments[i] = minIndex;
                changed = true;
            }
        }

        document.getElementById("status").innerText = "Points assigned to nearest centroid.";
        if (!changed) {
            isConverged = true;
            document.getElementById("status").innerText = "Converged!";
            document.getElementById("stepBtn").disabled = true;
            document.getElementById("runBtn").disabled = true;
        }
        stepState = "update";
    } else {
        const newCentroids = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));

        for (let i = 0; i < data.length; i++) {
            const cluster = assignments[i];
            if (cluster >= 0) {
                newCentroids[cluster].x += data[i].x;
                newCentroids[cluster].y += data[i].y;
                newCentroids[cluster].count += 1;
            }
        }

        for (let j = 0; j < k; j++) {
            if (newCentroids[j].count > 0) {
                centroids[j].x = newCentroids[j].x / newCentroids[j].count;
                centroids[j].y = newCentroids[j].y / newCentroids[j].count;
            }
        }

        document.getElementById("status").innerText = "Centroids moved to cluster centers.";
        stepState = "assign";
    }

    renderPlot();
}

async function runToConvergence() {
    document.getElementById("stepBtn").disabled = true;
    document.getElementById("runBtn").disabled = true;

    while (!isConverged) {
        stepKMeans();
        await new Promise((resolve) => setTimeout(resolve, 400));
    }
}

document.getElementById("initBtn").addEventListener("click", initializeCentroids);
document.getElementById("stepBtn").addEventListener("click", stepKMeans);
document.getElementById("runBtn").addEventListener("click", runToConvergence);

renderPlot();
