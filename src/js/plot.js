function initPlot(plot_element) {
  // Set the plot layout
	var layout = {
		title: "Neuron GCaMP traces",
		title2: "Behaviors",
		xaxis: { title: "time (min)", color: "#000000" },
		yaxis: { title: "Neuron GCaMP (z-scored)", color: "#000000" , autorange: true},
		yaxis2: { title: "Behavior (see legend for units)", color: "#000000" },
		showlegend: true,
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

	var config = {responsive: true};

	Plotly.newPlot(plot_element, [], layout, config);
}

var neuronTraces = [];

function plotData(x,y,plot_element,data_label,subplot,trace_id, neuropal_label) {

	// neuron_idx = Number(trace_id.substring(trace_id.indexOf('_')+1, trace_id.length));
	// console.log(data_label + ": " + neuropal_label[neuron_idx]);
	// Create a new trace for the plot
	var yaxis = 'y' + subplot;
    var trace = {
        x: x,
        y: y,
        type: 'line',
        mode: 'line',
		name: data_label,
		// class: neuropal_label != null ? neuropal_label[neuron_idx]['neuron_class'] : null,
		xaxis: 'x',
		yaxis: yaxis,
		trace_id: trace_id
    };

	// if(neuronTraces.length > 0){
	// 	for(var i = 0; i < neuronTraces.length; i++){
	// 		if(neuronTraces[i].class > trace.class){
	// 			var newClass = {
	// 				class: trace.class,
	// 				traces: [trace]
	// 			};
	// 			neuronTraces.splice(i, 0, newClass);
	// 		}
	// 		else if(neuronTraces[i].class === trace.class){
	// 			for(var j = 0; j < neuronTraces[i].traces.length; j++){
	// 				if(neuronTraces[i].traces[j].name.substring(
	// 					neuronTraces[i].traces[j].name.indexOf('('), neuronTraces[i].traces[j].name.length-1) >
	// 					trace.name.substring(trace.name.indexOf('('), trace.name.length-1)){
	// 						neuronTraces[i].traces.splice(j, 0, trace);
	// 					}
	// 			}
	// 		}
	// 	}
	// } else{
	// 	var newClass = {
	// 		class: trace.class,
	// 		traces: [trace]
	// 	};
	// 	neuronTraces.push(newClass);
	// }

	// var outputStr = "";

	// for(var i = 0; i < neuronTraces.length; i++){
	// 	for(var j = 0; j < neuronTraces[i].traces.length; j++){
	// 		outputStr += neuronTraces[i].traces[j].data_label + ", ";
	// 	}
	// }

	// alert(outputStr)

    Plotly.addTraces(plot_element, [trace,]);
}

function addTracesToPlot(){

}

function plotNeuron(list_t, trace, plot_element, label, trace_id, neuropal_label) {
    neuron_idx = Number(trace_id.substring(trace_id.indexOf('_')+1, trace_id.length));
	// console.log(data_label + ": " + neuropal_label[neuron_idx]);
	// Create a new trace for the plot
	var yaxis = 'y';
    var trace = {
        x: list_t,
        y: trace,
        type: 'line',
        mode: 'line',
		name: label,
		class: neuropal_label[neuron_idx]['neuron_class'],
		xaxis: 'x',
		yaxis: yaxis,
		trace_id: trace_id
    };

	console.log("Adding " + label);

	if(neuronTraces.length > 0){
		for(var i = 0; i < neuronTraces.length; i++){
			// console.log("Comparing " + neuronTraces[i].class + " with " + trace.class);
			// console.log("Number of traces " + neuronTraces.length);
			if(neuronTraces[i].class > trace.class || i == neuronTraces.length - 1){
				var newClass = {
					class: trace.class,
					traces: [trace]
				};
				console.log(neuronTraces[i].class + " goes after " + trace.class);
				neuronTraces.splice(i, 0, newClass);
			}
			else if(neuronTraces[i].class === trace.class){
				for(var j = 0; j < neuronTraces[i].traces.length; j++){
					console.log("Comparing " + neuronTraces[i].traces[j].name.substring(
						neuronTraces[i].traces[j].name.indexOf('('), neuronTraces[i].traces[j].name.length-1) + " and " + 
						trace.name.substring(trace.name.indexOf('('), trace.name.length-1));
					if(neuronTraces[i].traces[j].name.substring(
						neuronTraces[i].traces[j].name.indexOf('('), neuronTraces[i].traces[j].name.length-1) >
						trace.name.substring(trace.name.indexOf('('), trace.name.length-1)){
							neuronTraces[i].traces.splice(j, 0, trace);
						}
				}
			}
		}
	} else{
		var newClass = {
			class: trace.class,
			traces: [trace]
		};
		neuronTraces.push(newClass);
		console.log("Added: " + newClass.class);
	}

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].data_label + ", ";
		}
	}

	console.log("Plotted Neurons: " + outputStr);

    Plotly.addTraces(plot_element, [trace,]);
}

function plotBehavior(list_t, behavior, plot_element, label, trace_id) {
    var trace = {
        x: list_t,
        y: behavior,
        type: 'line',
        mode: 'line',
		name: label,
		xaxis: 'x',
		yaxis: 'y2',
		trace_id: trace_id
    };

	Plotly.addTraces(plot_element, [trace,]);
}