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

	var config = {responsive: true,
		toImageButtonOptions: {
			format: 'svg', // one of png, svg, jpeg, webp
			filename: 'data',
			height: 800,
			scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
		  }
	};

	Plotly.newPlot(plot_element, [], layout, config);
}

var neuronTraces = [];
var behaviorTraces = [];
var curr_colors = list_colors;

function plotNeuron(list_t, trace, plot_element, label, trace_id, neuropal_label) {
	var neuron_idx = Number(trace_id.substring(trace_id.indexOf('_')+1, trace_id.length));
	var offset = 0;

	// If neuron is neuroPAL labeled, calculate offset for indexing later
	if(neuropal_label[neuron_idx] != undefined){
		var LR = neuropal_label[neuron_idx]["LR"]
		var DV = neuropal_label[neuron_idx]["DV"]
		offset = LR == 'R' ? 1 + (DV == 'D' ? 2 : (DV == 'V' ? 4 : 0)) : (DV == 'D' ? 2 : (DV == 'V' ? 4 : 0))
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

	// List to keep track of colors that have been used by existing neurons
	var used_colors = [];

	// Access any used colors specified in the URL already. This makes colors consistant when sharing URLs with others
	for(var i = 0; i < curr_colors.length; i++){
		var colors = [curr_colors[i].split("_")[1], curr_colors[i].split("_")[2], curr_colors[i].split("_")[3]];
		for(var j = 0; j < colors.length; j++){
			if(!isNaN(colors[j]) && colors[j] != -1)
				used_colors.push(parseInt(colors[j]));
		}
	}
	
	// The loop below assumes the used colors are sorted in order to find an available color
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

	// Colors in the URL are encoded as "<class>_<undefined>_<dorsal>_<ventral> eg RME_0_1_2, where RMER/L have color 0, RMEDR/L have color 1, and REMVR/L have color 2"
	// color_idx specifies which index refers to the specific neuron 
	var color_idx = Math.floor(trace.offset / 2);


	if(neuronTraces.length > 0){
		// Loop through existing neuronTraces to find if the class of the inserted neuron already exists
		// If the neuron class exists this new trace potentially inherits a predefined color
		for(var i = 0; i < neuronTraces.length; i++){
			if(neuronTraces[i].class === trace.class){
				var traces = neuronTraces[i].traces;
				traces.push(trace);
				neuronTraces[i].color_idx[color_idx] = next_available_color;
				for(var k = 0; k < curr_colors.length; k++){
					if(curr_colors[k].split("_")[0] == trace.class){
						var colors = [curr_colors[k].split("_")[1], curr_colors[k].split("_")[2], curr_colors[k].split("_")[3]];
						for(var j = 0; j < colors.length; j++){
							if(parseInt(colors[j]) != -1)
								neuronTraces[i].color_idx[j] = parseInt(colors[j]);
						}
						break;
					}
				}

				traces[traces.length-1].line.color = color_list[((2*neuronTraces[i].color_idx[color_idx] + (trace.offset % 2)) % color_list.length)];
				break;
			}
			else if(i == neuronTraces.length - 1){ // add the neuron class and trace if the class has not been inserted yet
				var newClass = {
					class: trace.class,
					traces: [trace],
					color_idx: [-1,-1,-1]
				};
				newClass.color_idx[color_idx] = next_available_color;
				for(var k = 0; k < curr_colors.length; k++){
					if(curr_colors[k].split("_")[0] == trace.class){
						var colors = [curr_colors[k].split("_")[1], curr_colors[k].split("_")[2], curr_colors[k].split("_")[3]];
						for(var j = 0; j < colors.length; j++){
							if(parseInt(colors[j]) != -1)
								newClass.color_idx[j] = parseInt(colors[j]);
						}
						break;
					}
				}
				newClass.traces[0].line.color = color_list[((2*newClass.color_idx[color_idx] + (newClass.traces[0].offset % 2)) % color_list.length)];
				neuronTraces.push(newClass);
				break;
			}
		}
	} else{
		var newClass = {
			class: trace.class,
			traces: [trace],
			color_idx: [-1,-1,-1]
		};
		newClass.color_idx[color_idx] = next_available_color;
		for(var k = 0; k < curr_colors.length; k++){
			if(curr_colors[k].split("_")[0] == trace.class){
				var colors = [curr_colors[k].split("_")[1], curr_colors[k].split("_")[2], curr_colors[k].split("_")[3]];
				for(var j = 0; j < colors.length; j++){
					if(parseInt(colors[j]) != -1)
						newClass.color_idx[j] = parseInt(colors[j]);
				}
				break;
			}
		}
		newClass.traces[0].line.color = color_list[((2*newClass.color_idx[color_idx] + (newClass.traces[0].offset % 2)) % color_list.length)];
		neuronTraces.push(newClass);
	}


	var new_colors_list = [];

	// Write back in the currently used colors
	for(var i = 0; i < neuronTraces.length; i++){
		var list_to_add = neuronTraces[i].color_idx[0].toString() + "_" + neuronTraces[i].color_idx[1].toString() + "_" + neuronTraces[i].color_idx[2].toString();
		new_colors_list.push(neuronTraces[i].class + "_" + list_to_add);
	}
	curr_colors = new_colors_list;

	// Push changes to the URL so the state is saved
	let url = new URL(window.location.href);
    url.searchParams.set("list_colors", new_colors_list);
    window.history.pushState({}, "", url);


	// For debugging, prints out currently plotted neurons and what colors they are assigned

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + ((2*neuronTraces[i].color_idx[color_idx] + (neuronTraces[i].traces[j].offset % 2)) % color_list.length)+ ", ";
		}
	}
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
			color: behavior_colors[behaviors.indexOf(trace_id.split('_')[1])]
		}
    };

	behaviorTraces.push(trace);

	// Plotly.addTraces(plot_element, [trace,]);
}

function removeTrace(trace_id, neuron_class){
	
	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			// console.log(j);
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


// Define the color selections of each neuron. Each neuron class will be given 2 consequtive colors so L and R neurons are associated.
// The VS Code extension "Margin Colors" was used to visualize each color in the margin, hence the formatting
const color_list = ['#0000ff', 
					'#8585ff', 
					'#ff5900', 
					'#ff8e52', 
					'#148400', 
					'#5faf50', 
					'#9e02f7', 
					'#c766ff', 
					'#fffb08',
					'#fcfb95', 
					'#00c9b5', 
					'#74d6cc',
					'#ff08d6', 
					'#ff75e8',
					'#3cee00', 
					'#53ee82', 
					'#ff0000', 
					'#ff8c8c'];
const behavior_colors = ['#505050', 
						'#915d24', 
						'#55801d', 
						'#6c3a9e', 
						'#1d6980'];
const behaviors = ["v", "hc", "f", "av", "bc"];

// Push all traces to the plot in order so the display remains consistant across instances
function pushToPlot(plot_element){

	neuronTraces.sort(function (a, b) {return a.class.toString().localeCompare(b.class.toString())});//(typeof a.class == 'number' ? (typeof b.class == 'number' ? a.class - b.class : 1) : (typeof b == 'number' ? -1 : a.class.toString().localeCompare(b.class.toString())))})

	while(plot_element.data.length){
		Plotly.deleteTraces(plot_element, [0])
	}

	for(var i = 0; i < neuronTraces.length; i++){
		Plotly.addTraces(plot_element, neuronTraces[i].traces);
	}

	Plotly.addTraces(plot_element, behaviorTraces);

}