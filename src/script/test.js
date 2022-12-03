// Import the necessary libraries
//const Plotly = require('plotly.js/lib/core');

// Set up the data for the plot
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];

// Create a new trace for the plot
const trace = {
  x: x,
  y: y,
  type: 'scatter',
  mode: 'lines+markers',
};

// Set the plot layout
const layout = {
  title: 'My Plot',
  xaxis: { title: 'X Axis' },
  yaxis: { title: 'Y Axis' },
};

// Plot the data
TEST = document.getElementById('test');
Plotly.newPlot(TEST, [trace], layout);
