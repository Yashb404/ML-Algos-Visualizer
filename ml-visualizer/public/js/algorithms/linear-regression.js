// Hardcoded dummy data
const data = [
    { x: 1, y: 2 },
    { x: 2, y: 3.8 },
    { x: 3, y: 6.2 },
    { x: 4, y: 8.1 },
    { x: 5, y: 11 },
    { x: 6, y: 13 },
    { x: 7, y: 14.5 },
    { x: 8, y: 17 },
    { x: 9, y: 18.2 },
    { x: 10, y: 21 }
];

// Extract x and y values for plotting
const xValues = data.map(d => d.x);
const yValues = data.map(d => d.y);

// --- Plotly Visualization ---
const trace1 = {
    x: xValues,
    y: yValues,
    mode: 'markers',
    type: 'scatter',
    name: 'Data Points',
    marker: { size: 10, color: '#00bcd4' }
};

const layout = {
    title: 'Linear Regression Data',
    paper_bgcolor: '#1e1e1e',
    plot_bgcolor: '#1e1e1e',
    font: { color: '#e0e0e0' },
    xaxis: { title: 'X', showgrid: true, gridcolor: '#444' },
    yaxis: { title: 'Y', showgrid: true, gridcolor: '#444' },
    showlegend: true
};

// Initial Render
Plotly.newPlot('plot', [trace1], layout);

// --- TensorFlow.js Model ---
let model;
let isTraining = false;

function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Choose an optimizer and loss function
    model.compile({
        optimizer: tf.train.sgd(0.01), // Stochastic Gradient Descent
        loss: 'meanSquaredError'
    });

    return model;
}

async function trainModel() {
    if (isTraining) return;
    isTraining = true;

    const trainBtn = document.getElementById('trainBtn');
    const statusSpan = document.getElementById('status');
    const lossSpan = document.getElementById('loss');

    trainBtn.disabled = true;
    statusSpan.innerText = "Training...";

    // Convert data to Tensors
    const xs = tf.tensor2d(xValues, [xValues.length, 1]);
    const ys = tf.tensor2d(yValues, [yValues.length, 1]);

    model = createModel();

    // Train the model
    await model.fit(xs, ys, {
        epochs: 50,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                lossSpan.innerText = `Epoch: ${epoch + 1} - Loss: ${logs.loss.toFixed(4)}`;

                // Visualize current prediction line
                const xPred = [0, 11];
                const xPredTensor = tf.tensor2d(xPred, [2, 1]);
                const yPredTensor = model.predict(xPredTensor);
                const yPred = Array.from(yPredTensor.dataSync());

                const trace2 = {
                    x: xPred,
                    y: yPred,
                    mode: 'lines',
                    type: 'scatter',
                    name: 'Regression Line',
                    line: { color: '#ff4081', width: 2 }
                };

                // Use Plotly.animate or react for smoother updates, but react is simpler here
                Plotly.react('plot', [trace1, trace2], layout);

                // Clean up tensors inside loop if needed, but for small data it's fine.
                xPredTensor.dispose();
                yPredTensor.dispose();

                // Small delay to make animation visible
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    });

    statusSpan.innerText = "Training Complete";
    trainBtn.disabled = false;
    isTraining = false;

    xs.dispose();
    ys.dispose();
}

document.getElementById('trainBtn').addEventListener('click', trainModel);
