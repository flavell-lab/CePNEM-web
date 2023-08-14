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

	// Parse the index numbers of the colors that have been used.
	var used_colors = curr_colors.map(x => parseInt(x.split("_")[1]));
	
	if(isNaN(used_colors[0])){
		curr_colors.splice(0, 1);
	}
	used_colors.sort();
	
	// Determine the next color that is available to the new trace
	var next_available_color = 0;
	for(var i = 0; i < used_colors.length; i++){
		if(used_colors[i] != i){
			next_available_color = i;
			break;
		} else if(i == used_colors.length - 1){
			next_available_color = i+1;
			break;
		}
	}

	if(neuronTraces.length > 0){
		for(var i = 0; i < neuronTraces.length; i++){
			if(neuronTraces[i].class === trace.class){
				neuronTraces[i].traces.push(trace);
				neuronTraces[i].traces[neuronTraces[i].traces.length-1].line.color = color_list[(2*neuronTraces[i].color_idx + (neuronTraces[i].traces[newClass.traces.length-1].offset % 2 == 0 ? 0 : 1) % color_list.length)];
				neuronTraces[i].traces[neuronTraces[i].traces.length-1].line.dash = (neuronTraces[i].traces[newClass.traces.length-1].offset > 1 ? 'dashdot' : 'solid')
				break;
			}
			else if(i == neuronTraces.length - 1){
				var newClass = {
					class: trace.class,
					traces: [trace],
					color_idx: next_available_color
				};
				var foundClass = false;
				for(var k = 0; k < curr_colors.length; k++){
					if(curr_colors[k].split("_")[0] == trace.class){
						newClass.color_idx = parseInt(curr_colors[k].split("_")[1]);
						foundClass = true;
						break;
					}
				}
				if(!foundClass)
					curr_colors.splice(next_available_color, 0, trace.class + "_" + next_available_color);
				newClass.traces[0].line.color = color_list[(2*newClass.color_idx + (newClass.traces[0].offset % 2 == 0 ? 0 : 1) % color_list.length)];
				newClass.traces[0].line.dash = (newClass.traces[0].offset > 1 ? 'dashdot' : 'solid')
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
		var foundClass = false;
		for(var k = 0; k < curr_colors.length; k++){
			if(curr_colors[k].split("_")[0] == trace.class){
				newClass.color_idx = parseInt(curr_colors[k].split("_")[1]);
				foundClass = true;
				break;
			}
		}
		if(!foundClass)
			curr_colors.splice(next_available_color, 0, trace.class + "_" + next_available_color);
		newClass.traces[0].line.color = color_list[(2*newClass.color_idx + (newClass.traces[0].offset % 2 == 0 ? 0 : 1) % color_list.length)];
		newClass.traces[0].line.dash = (newClass.traces[0].offset > 1 ? 'dashdot' : 'solid')
		neuronTraces.push(newClass);
	}

	

	// var new_colors_list = [];

	// let url = new URL(window.location.href);
    // url.searchParams.set("list_colors", new_colors_list);
    // window.history.pushState({}, "", url);

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + (2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 0 : 1))+ ", ";
		}
	}

	// console.log("Colors: " + curr_colors);
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

function removeTrace(trace_id, neuron_class){
	
	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			console.log(j);
			if(neuronTraces[i].traces[j].trace_id == trace_id){
				neuronTraces[i].traces.splice(j, 1);
			}
			if(neuronTraces[i].traces.length == 0){
				neuronTraces.splice(i, 1);
				for(var k = 0; k < curr_colors.length; k++){
					if(curr_colors[k].split("_")[0] == neuron_class){
						curr_colors.splice(k, 1);
						break;
					}
				}
				break;
			}
		}
	}

	console.log("Removed " + neuron_class);

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + (2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 0 : 1))+ ", ";
		}
	}

	console.log("Plotted Neurons: " + outputStr);
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

const color_list = ['#0000ff', 
					'#8585ff', 
					'#ff5900', 
					'#ff8e52', 
					'#148400', 
					'#5faf50', 
					'#9e02f7', 
					'#c766ff', 
					'#00c9b5', 
					'#74d6cc', 
					'#fffb08', 
					'#fcfb95', 
					'#3cee00', 
					'#53ee82', 
					'#ff0000', 
					'#ff8c8c', 
					'#ff08d6', 
					'#ff75e8'];
const behavior_colors = ['#0000ff', 
						'#ff5900', 
						'#148400', 
						'#9e02f7', 
						'#00c9b5'];
const behaviors = ["v", "hc", "f", "av", "bc"];

function pushToPlot(plot_element){

	var used_colors = [];

	neuronTraces.sort(function (a, b) {return (typeof a == 'number' ? (typeof b == 'number' ? a - b : 1) : (typeof b == 'number' ? -1 : a.class.toString().localeCompare(b.class.toString())))})

	while(plot_element.data.length){
		Plotly.deleteTraces(plot_element, [0])
	}

	for(var i = 0; i < neuronTraces.length; i++){
		used_colors.push(neuronTraces[i].class + "_" + neuronTraces[i].color_idx)
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			// neuronTraces[i].traces[j].line.color = color_list[(2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 0 : 1) % color_list.length)];
			// neuronTraces[i].traces[j].line.dash = (neuronTraces[i].traces[j].offset > 1 ? 'dashdot' : 'solid')

			Plotly.addTraces(plot_element, [neuronTraces[i].traces[j],]);
		}
	}

	for(var i = 0; i < behaviorTraces.length; i++){
		behaviorTraces[i].line.color = behavior_colors[behaviors.indexOf(behaviorTraces[i].trace_id.split('_')[1])];
		Plotly.addTraces(plot_element, [behaviorTraces[i],]);
	}

	let url = new URL(window.location.href);
	url.searchParams.set("list_colors", used_colors);
	window.history.pushState({}, "", url);

}