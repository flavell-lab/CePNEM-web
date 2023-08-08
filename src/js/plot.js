function initPlot(plot_element) {
  // Set the plot layout
	var layout = {
		title: "Neuron GCaMP traces",
		title2: "Behaviors",
		xaxis: { title: "time (min)", color: "#000000" },
		yaxis: { title: "Neuron GCaMP (z-scored)", color: "#000000" , autorange: true},
		yaxis2: { title: "Behavior (see legend for units)", color: "#000000" },
		showlegend: true,
		width: 1350,
		height: 800,	  
		plot_bgcolor: "#FFF",
		paper_bgcolor: "#FFF",
		font: { color: "#000000" },
		grid: {
			ygap:0.1,
			rows: 2,
			columns: 1,
			subplots:[['xy'],['xy2']],
		},
		shapes: []
	};

	Plotly.newPlot(plot_element, [], layout);
}

function plotData(x,y,plot_element,data_label,subplot,trace_id) {
	// Create a new trace for the plot
	var yaxis = 'y' + subplot;
    var trace = {
        x: x,
        y: y,
        type: 'line',
        mode: 'line',
		name: data_label,
		xaxis: 'x',
		yaxis: yaxis,
		trace_id: trace_id
    };

    Plotly.addTraces(plot_element, [trace,]);
}

function plotNeuron(list_t, trace, plot_element, label, trace_id) {
    plotData(list_t, trace, plot_element, label, '', trace_id)
}

function plotBehavior(list_t, behavior, plot_element, label, trace_id) {
	plotData(list_t, behavior, plot_element, label, '2', trace_id)
}