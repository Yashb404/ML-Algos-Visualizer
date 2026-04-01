const samples = Array.from({ length: 50 }, (_, i) => {
    const x1 = 10 + Math.random() * 40;
    const x2 = 20 + Math.random() * 30;
    const noise = (Math.random() - 0.5) * 6;
    const y = 1.4 * x1 + 0.8 * x2 + 15 + noise;
    return { idx: i + 1, x1, x2, y };
});

const xData = samples.map((sample) => [sample.x1, sample.x2]);
const yData = samples.map((sample) => sample.y);

const layout = {
    title: "Actual vs Predicted (Multiple Regression)",
    paper_bgcolor: "#000000",
    plot_bgcolor: "#000000",
    font: { color: "#ffffff" },
    xaxis: { title: "Sample Index", gridcolor: "#333333" },
    yaxis: { title: "Target Value", gridcolor: "#333333" }
};

const actualTrace = {
    x: samples.map((sample) => sample.idx),
    y: yData,
    mode: "markers",
    type: "scatter",
    name: "Actual",
    marker: { color: "#00bcd4", size: 8 }
};

Plotly.newPlot("plot", [actualTrace], layout);

let isTraining = false;

function resetVisualization() {
    isTraining = false;
    document.getElementById("trainBtn").disabled = false;
    document.getElementById("status").innerText = "Ready to train";
    document.getElementById("loss").innerText = "Loss: -";
    Plotly.react("plot", [actualTrace], layout);
}

async function trainModel() {
    if (isTraining) {
        return;
    }

    isTraining = true;
    const trainBtn = document.getElementById("trainBtn");
    const statusSpan = document.getElementById("status");
    const lossSpan = document.getElementById("loss");

    trainBtn.disabled = true;
    statusSpan.innerText = "Training...";

    const xs = tf.tensor2d(xData, [xData.length, 2]);
    const ys = tf.tensor2d(yData, [yData.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
    model.compile({ optimizer: tf.train.adam(0.08), loss: "meanSquaredError" });

    await model.fit(xs, ys, {
        epochs: 120,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                lossSpan.innerText = `Epoch: ${epoch + 1} - Loss: ${logs.loss.toFixed(3)}`;
                const predTensor = model.predict(xs);
                const preds = Array.from(predTensor.dataSync());

                const predTrace = {
                    x: samples.map((sample) => sample.idx),
                    y: preds,
                    mode: "lines",
                    type: "scatter",
                    name: "Predicted",
                    line: { color: "#888888", width: 2 }
                };

                Plotly.react("plot", [actualTrace, predTrace], layout);
                predTensor.dispose();
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
        }
    });

    xs.dispose();
    ys.dispose();
    statusSpan.innerText = "Training Complete";
    trainBtn.disabled = false;
    isTraining = false;
}

document.getElementById("trainBtn").addEventListener("click", trainModel);
document.getElementById("resetBtn").addEventListener("click", resetVisualization);
