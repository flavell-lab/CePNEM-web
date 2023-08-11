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
var curr_colors = list_colors;

function plotNeuron(list_t, trace, plot_element, label, trace_id, neuropal_label) {
	var neuron_idx = Number(trace_id.substring(trace_id.indexOf('_')+1, trace_id.length));
	var offset = 0;
	if(neuropal_label[neuron_idx] != undefined){
		var LR = neuropal_label[neuron_idx]["LR"]
		var DV = neuropal_label[neuron_idx]["DV"]
		offset = LR == 'R' ? 1 + (DV == 'V' ? 2 : 0) : (DV == 'V' ? 2 : 0)
	}
	// console.log(data_label + ": " + neuropal_label[neuron_idx]);
	// Create a new trace for the plot
	var yaxis = 'y';
    var trace = {
        x: list_t,
        y: trace,
        type: 'line',
        mode: 'line',
		name: label,
		class: neuropal_label[neuron_idx] != undefined ? neuropal_label[neuron_idx]['neuron_class'] : neuron_idx,
		xaxis: 'x',
		yaxis: yaxis,
		trace_id: trace_id,
		offset: offset,
		line: {
			color: null,
			dash: 'solid'
		}
    };
	

	// URL: list_colors=CEPD_1%2CADA_2%2C3_3
	// list_colors=[CEPD_1, ADA_2, 3_3]

	// console.log("Adding " + label);

	

	var used_colors = curr_colors.map(x => curr_colors.length > 0 ? parseInt(x.split("_")[1]) : []);
	
	var next_available_color = 0;
	for(var i = 0; i < used_colors.length; i++){
		console.log("I: " + i + ", Used_Colors: " + used_colors);
		if(used_colors[i] != i){
			next_available_color = i;
		} else if(i == used_colors.length - 1){
			next_available_color = i+1;
		}
	}
	console.log("Next Available Color: " + next_available_color);

	var new_colors = [];

	if(neuronTraces.length > 0){
		for(var i = 0; i < neuronTraces.length; i++){
			// console.log("Comparing " + neuronTraces[i].class + " with " + trace.class);
			// console.log("Number of traces " + neuronTraces.length);
			if(neuronTraces[i].class === trace.class){
				neuronTraces[i].traces.push(trace);
				break;
			}
			else if(i == neuronTraces.length - 1){
				var newClass = {
					class: trace.class,
					traces: [trace],
					color_idx: next_available_color
				};
				new_colors.push(trace.class + "_" + next_available_color);
				neuronTraces.push(newClass);
				
				break;
			}
		}
	} else{
		var newClass = {
			class: trace.class,
			traces: [trace],
			color_idx: next_available_color
		};
		new_colors.push(trace.class + "_" + next_available_color);
		neuronTraces.push(newClass);
		console.log("Added: " + newClass.class);
	}

	

	// var new_colors_list = [];

	// let url = new URL(window.location.href);
    // url.searchParams.set("list_colors", new_colors_list);
    // window.history.pushState({}, "", url);

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + (2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 1 : 0))+ ", ";
		}
	}

	console.log("Plotted Neurons: " + outputStr);

	curr_colors = new_colors;

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

function removeTrace(trace_id){
	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			console.log(j);
			if(neuronTraces[i].traces[j].trace_id == trace_id){
				neuronTraces[i].traces.splice(j, 1);
			}
			if(neuronTraces[i].traces.length == 0){
				neuronTraces.splice(i, 1);
				break;
			}
		}
	}
	// var outputStr = "";

	// for(var i = 0; i < neuronTraces.length; i++){
	// 	for(var j = 0; j < neuronTraces[i].traces.length; j++){
	// 		outputStr += neuronTraces[i].traces[j].name + ": " + (4*i + neuronTraces[i].traces[j].offset) + ", ";
	// 	}
	// }

	// console.log("Plotted Neurons: " + outputStr);
}

function removeBehavior(label){
	// console.log("Removing: " + label)
	for(var i = 0; i < behaviorTraces.length; i++){
		// console.log("Checking: " + behaviorTraces[i].name);
		if(label == behaviorTraces[i].name){
			// console.log("Removing: " + label)
			behaviorTraces.splice(i, 1);
			break;
		}
	}
}

const color_list = ['#3366CC', '#FF7F0E', '#2CA02C', '#990099', '#00FE35', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'];
const behaviors = ["v", "hc", "f", "av", "bc"];

function pushToPlot(plot_element){

	var used_colors = [];

	while(plot_element.data.length){
		Plotly.deleteTraces(plot_element, [0])
	}

	var class_idx = 0;
	for(var i = 0; i < neuronTraces.length; i++){
		used_colors.push(neuronTraces[i].class + "_" + neuronTraces[i].color_idx)
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			neuronTraces[i].traces[j].line.color = color_list[2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 1 : 0)];
			neuronTraces[i].traces[j].line.dash = (neuronTraces[i].traces[j].offset > 1 ? 'dashdot' : 'solid')

			Plotly.addTraces(plot_element, [neuronTraces[i].traces[j],]);
		}
	}

	for(var i = 0; i < behaviorTraces.length; i++){
		behaviorTraces[i].line.color = color_list[behaviors.indexOf(behaviorTraces[i].trace_id.split('_')[1])];
		Plotly.addTraces(plot_element, [behaviorTraces[i],]);
	}

	let url = new URL(window.location.href);
	url.searchParams.set("list_colors", used_colors);
	window.history.pushState({}, "", url);

}