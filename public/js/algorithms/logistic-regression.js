const data = [
    { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4.5, y: 1 },
    { x: 5, y: 0 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }
];

const xValues = data.map((point) => point.x);
const yValues = data.map((point) => point.y);

const layout = {
    title: "Logistic Regression (Sigmoid Curve)",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { title: "Feature (X)", showgrid: true, gridcolor: "#333333" },
    yaxis: { title: "Probability (Class 1)", showgrid: true, gridcolor: "#333333", range: [-0.1, 1.1] }
};

const traceData = {
    x: xValues,
    y: yValues,
    mode: "markers",
    type: "scatter",
    name: "Data",
    marker: { size: 10, color: "#00bcd4" }
};

Plotly.newPlot("plot", [traceData], layout);

let model;

async function trainModel() {
    const button = document.getElementById("trainBtn");
    button.disabled = true;
    document.getElementById("status").innerText = "Training...";

    const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    const ys = tf.tensor2d(yValues, [yValues.length, 1]);

    model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1], activation: "sigmoid" }));
    model.compile({ optimizer: tf.train.adam(0.1), loss: "binaryCrossentropy" });

    await model.fit(xs, ys, {
        epochs: 100,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                document.getElementById("loss").innerText = `Epoch: ${epoch + 1} - Loss: ${logs.loss.toFixed(4)}`;

                const xLine = Array.from({ length: 100 }, (_, i) => i * 0.1);
                const xPredTensor = tf.tensor2d(xLine, [100, 1]);
                const yLine = Array.from(model.predict(xPredTensor).dataSync());

                const traceCurve = {
                    x: xLine,
                    y: yLine,
                    mode: "lines",
                    name: "Sigmoid Probability",
                    line: { color: "#888888", width: 3 }
                };

                Plotly.react("plot", [traceData, traceCurve], layout);
                xPredTensor.dispose();
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
        }
    });

    xs.dispose();
    ys.dispose();
    document.getElementById("status").innerText = "Training Complete";
    button.disabled = false;
}

document.getElementById("trainBtn").addEventListener("click", trainModel);
