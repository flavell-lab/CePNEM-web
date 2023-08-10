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
var behaviorTraces = [];

function plotNeuron(list_t, trace, plot_element, label, trace_id, neuropal_label) {
    neuron_idx = Number(trace_id.substring(trace_id.indexOf('_')+1, trace_id.length));
	var LR = neuropal_label[neuron_idx]["LR"]
	var DV = neuropal_label[neuron_idx]["DV"]
	var offset = LR == 'R' ? 1 + (DV == 'V' ? 2 : 0) : (DV == 'V' ? 2 : 0)
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
		trace_id: trace_id,
		offset: offset,
		line: {
			color: null,
			dash: 'solid'
		}
    };

	console.log("Adding " + label);

	if(neuronTraces.length > 0){
		var added = false;
		for(var i = 0; i < neuronTraces.length; i++){
			if(neuronTraces[i].class === trace.class){
				neuronTraces[i].traces.push(trace);
				added = true;
				break;
			}
			// // console.log("Comparing " + neuronTraces[i].class + " with " + trace.class);
			// // console.log("Number of traces " + neuronTraces.length);
			// if(neuronTraces[i].class.localeCompare(trace.class) > 0){
			// 	var newClass = {
			// 		class: trace.class,
			// 		traces: [trace]
			// 	};
			// 	console.log(neuronTraces[i].class + " goes after " + trace.class);
			// 	neuronTraces.splice(i, 0, newClass);
			// 	break;
			// }
			// else if(neuronTraces[i].class === trace.class){
			// 	for(var j = 0; j < neuronTraces[i].traces.length; j++){
			// 		var currentLabel = neuronTraces[i].traces[j].name.substring(
			// 			neuronTraces[i].traces[j].name.indexOf('(')+1, neuronTraces[i].traces[j].name.length-1);
			// 		var newLabel = trace.name.substring(trace.name.indexOf('(')+1, trace.name.length-1);
			// 		console.log("Comparing " + currentLabel + " and " + newLabel);
			// 		if(currentLabel > newLabel){
			// 			neuronTraces[i].traces.splice(j, 0, trace);
			// 			break;
			// 		}
			// 		else if(currentLabel < newLabel){
			// 			neuronTraces[i].traces.push(trace);
			// 			break;
			// 		}
			// 	}
			// 	break;
			// }
			// else if(i == neuronTraces.length - 1){
			// 	var newClass = {
			// 		class: trace.class,
			// 		traces: [trace]
			// 	};
			// 	neuronTraces.push(newClass);
			// 	break;
			// }
		}
		if(!added){
			var newClass = {
				class: trace.class,
				traces: [trace]
			};
			neuronTraces.push(newClass);
			console.log("Added: " + newClass.class);
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
			outputStr += neuronTraces[i].traces[j].name + ": " + (4*i + neuronTraces[i].traces[j].offset) + ", ";
		}
	}

	console.log("Plotted Neurons: " + outputStr);

    // Plotly.addTraces(plot_element, [trace,]);
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
		trace_id: trace_id,
		line:{
			color: null
		}
    };

	behaviorTraces.push(trace);

	// Plotly.addTraces(plot_element, [trace,]);
}

function removeTrace(label, neuron_idx, neuropal_label){
	var neuron_class = neuropal_label[neuron_idx]['neuron_class']
	for(var i = 0; i < neuronTraces.length; i++){
		if(neuronTraces[i].class == neuron_class){
			for(var j = 0; j < neuronTraces[i].traces.length; j++){
				if(neuronTraces[i].traces[j].name == label){
					neuronTraces[i].traces.splice(j, 1);
				}
			}
			if(neuronTraces[i].traces.length == 0){
				neuronTraces.splice(i, 1)
			}
		}
	}
	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + (4*i + neuronTraces[i].traces[j].offset) + ", ";
		}
	}

	console.log("Plotted Neurons: " + outputStr);
}

const color_list = ['#3366CC', '#FF7F0E', '#2CA02C', '#990099', '#00FE35', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
const behaviors = ["v", "hc", "f", "av", "bc"];

function pushToPlot(plot_element){

	while(plot_element.data.length){
		Plotly.deleteTraces(plot_element, [0])
	}

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			neuronTraces[i].traces[j].line.color = color_list[2*i + (neuronTraces[i].traces[j].offset % 2 == 0 ? 0 : 1)];
			neuronTraces[i].traces[j].line.dash = (neuronTraces[i].traces[j].offset > 1 ? 'dot' : 'solid')

			Plotly.addTraces(plot_element, [neuronTraces[i].traces[j],]);
		}
	}

	for(var i = 0; i < behaviorTraces.length; i++){
		behaviorTraces[i].line.color = color_list[behaviors.indexOf(behaviorTraces[i].trace_id.split('_')[1])];
		Plotly.addTraces(plot_element, [behaviorTraces[i],]);
	}

}