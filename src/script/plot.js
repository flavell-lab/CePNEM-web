function plotData(x,y,element,xlabel,ylabel,title,data_label,append) {
    // Create a new trace for the plot
    var trace = {
        x: x,
        y: y,
        type: 'line',
        mode: 'line',
	name: data_label,
    };

    // Set the plot layout
    var layout = {
        title: title,
        xaxis: { title: xlabel, color: "#ddd" },
        yaxis: { title: ylabel, color: "#ddd" },
	plot_bgcolor: "#222",
	paper_bgcolor: "#222",
	font: { color: "#eee" },
    };

    // Plot the data
    var plot_element = document.getElementById(element);
    if (append) {
        Plotly.addTraces(plot_element, [trace]);
    } else {
        Plotly.newPlot(plot_element, [trace], layout);
    }
}

function plotNeuralTrace(time_range, trace_array, neuron_element, div_element, append) {
    var n = parseInt(document.getElementById(neuron_element).value);
    plotData(time_range, trace_array[n-1], div_element, 'time (min)', 'Neuron GCaMP (z-scored)', 'Neuron GCaMP traces', "Neuron " + n, append)
}
