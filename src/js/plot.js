function plotData(x,y,element,data_label,append,subplot) {
	
	var yaxis = 'y' + subplot;
    // Create a new trace for the plot
    var trace = {
        x: x,
        y: y,
        type: 'line',
        mode: 'line',
		name: data_label,
		xaxis: 'x',
		yaxis: yaxis,
    };

    // Set the plot layout
    var layout = {
        title: "Neuron GCaMP traces",
		title2: "Behaviors",
        xaxis: { title: "time (min)", color: "#000000" },
        yaxis: { title: "Neuron GCaMP (z-scored)", color: "#000000" },
		yaxis2: { title: "Behavior (see legend for units)", color: "#000000" },
		showlegend: true,
		width: 1350,
		height: 800,	  
		plot_bgcolor: "#FFF",
		paper_bgcolor: "#FFF",
		font: { color: "#000000" },
		grid: {
			rows: 2,
			columns: 1,
			subplots:[['xy'],['xy2']],
		},
    };

    // Plot the data
    var plot_element = document.getElementById(element);
    if (append) {
        Plotly.addTraces(plot_element, [trace,]);
    } else {
        Plotly.newPlot(plot_element, [trace,], layout);
    }
}

// function plotNeuralTrace(time_range, trace_array, neuron_element, neuron_plot_element, append) {
//     var n = parseInt(document.getElementById(neuron_element).value);
//     plotData(time_range, trace_array[n-1], neuron_plot_element, 'Neuron ' + n, append, '')
// }

function plotNeuralTrace(time_range, trace_array, n, neuron_plot_element, append) {
	console.log("hello")
    // var n = parseInt(document.getElementById(neuron_element).value);
	// var n = neuron_element
    plotData(time_range, trace_array[n-1], neuron_plot_element, 'Neuron ' + n, append, '')
}

function plotSpecificNeuralTrace(time_range, trace_array, n, neuron_plot_element, append, neuropal_labels) {
	if (n in neuropal_labels) {
	    plotData(time_range, trace_array[n-1], neuron_plot_element, neuropal_labels[n]['label'], append, '')
	} else {
	    plotData(time_range, trace_array[n-1], neuron_plot_element, 'Neuron ' + n, append, '')
	}
}

function plotBehavior(time_range, behaviors, behavior_units, behavior_select_element, behavior_plot_element, append_behavior) {
	var beh_elt = document.getElementById(behavior_select_element);
	var beh_idx = beh_elt.selectedIndex;
	var beh_text = beh_elt.options[beh_idx].text;
	plotData(time_range, behaviors[beh_idx], behavior_plot_element, beh_text + ' (' + behavior_units[beh_idx] + ')', append, '2')
}

function plotSpecificBehavior(time_range, behavior, unit, label, behavior_plot_element, append_behavior) {
	plotData(time_range, behavior, behavior_plot_element, label + ' (' + unit + ')', append, '2')
}
