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
			filename: 'custom_image',
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
	if(neuropal_label[neuron_idx] != undefined){
		var LR = neuropal_label[neuron_idx]["LR"]
		var DV = neuropal_label[neuron_idx]["DV"]
		offset = LR == 'R' ? 1 + (DV == 'undefined' ? 0 : (DV == 'V' ? 4 : 2)) : (DV == 'undefined' ? 0 : (DV == 'V' ? 4 : 2))
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

	console.log("New Loop:");

	console.log("Current colors: " + curr_colors[0]);

	// Parse the index numbers of the colors that have been used.
	// var class_colors = curr_colors.map(x => x.split("_")[1]);
	// console.log(class_colors);
	var used_colors = [];

	// console.log("Class Colors: " + class_colors[0]);

	// if(class_colors[0] == ""){
	// 	class_colors.splice(0, 1);
	// }

	for(var i = 0; i < curr_colors.length; i++){
		var colors = [curr_colors[i].split("_")[1], curr_colors[i].split("_")[2], curr_colors[i].split("_")[3]];
		for(var j = 0; j < colors.length; j++){
			if(!isNaN(colors[j]) && colors[j] != -1)
				used_colors.push(parseInt(colors[j]));
		}
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

	console.log("Used Colors: " + used_colors);
	console.log("Next available color: " + next_available_color);
	console.log("Adding neuron: " + label + " with offset: " + offset);

	/*
	TODO: Figure out allocating colors to the same class with different position modifiers
	Non-designated in D or V neurons should be given a different color from each D and V modified neurons
	Left and Right neurons will continue to have slight offset in color
	URL is currently splitting up the list that designates the color indices for each position modified neuron
	To fix the above I tried delinating indices with dashes instead of commas. Things seem to be broken now.
	Try print statements!
	*/

	if(neuronTraces.length > 0){
		for(var i = 0; i < neuronTraces.length; i++){
			if(neuronTraces[i].class === trace.class){
				var traces = neuronTraces[i].traces;
				traces.push(trace);
				neuronTraces[i].color_idx[traces[traces.length-1].offset / 2] = next_available_color;
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
				console.log("Class found and allocating color: " + ((2*neuronTraces[i].color_idx[trace.offset / 2] + (trace.offset % 2)) % color_list.length) + " to neuron: " + label);
				// curr_colors.splice(i, 0, trace.class + "_" + neuronTraces[i].color_idx.toString());
				traces[traces.length-1].line.color = color_list[((2*neuronTraces[i].color_idx[trace.offset / 2] + (trace.offset % 2)) % color_list.length)];
				break;
			}
			else if(i == neuronTraces.length - 1){
				var newClass = {
					class: trace.class,
					traces: [trace],
					color_idx: [-1,-1,-1]
				};
				newClass.color_idx[newClass.traces[0].offset / 2] = next_available_color;
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
				// if(!foundClass)
				// 	curr_colors.splice(neuronTraces.length, 0, trace.class + "_" + newClass.color_idx.toString());
				newClass.traces[0].line.color = color_list[((2*newClass.color_idx[newClass.traces[0].offset / 2] + (newClass.traces[0].offset % 2)) % color_list.length)];
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
		newClass.color_idx[newClass.traces[0].offset / 2] = next_available_color;
		console.log("Making a new class " + trace.class + " with Color Indices: " + newClass.color_idx);
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
		// if(!foundClass)
		// 	curr_colors.splice(neuronTraces.length, 0, trace.class + "_" + newClass.color_idx.toString());
		newClass.traces[0].line.color = color_list[((2*newClass.color_idx[newClass.traces[0].offset / 2] + (newClass.traces[0].offset % 2)) % color_list.length)];
		neuronTraces.push(newClass);
	}


	var new_colors_list = [];

	console.log("Current have " + neuronTraces.length + " neuron classes");

	for(var i = 0; i < neuronTraces.length; i++){
		var list_to_add = neuronTraces[i].color_idx[0].toString() + "_" + neuronTraces[i].color_idx[1].toString() + "_" + neuronTraces[i].color_idx[2].toString();
		console.log("Pushing color list to URL: " + list_to_add);
		new_colors_list.push(neuronTraces[i].class + "_" + list_to_add);
	}
	curr_colors = new_colors_list;

	let url = new URL(window.location.href);
    url.searchParams.set("list_colors", new_colors_list);
    window.history.pushState({}, "", url);

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		for(var j = 0; j < neuronTraces[i].traces.length; j++){
			outputStr += neuronTraces[i].traces[j].name + ": " + ((2*neuronTraces[i].color_idx[neuronTraces[i].traces[j].offset / 2] + (neuronTraces[i].traces[j].offset % 2)) % color_list.length)+ ", ";
		}
	}

	console.log("Colors: " + curr_colors);
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

	// console.log("Removed " + neuron_class);

	// var outputStr = "";

	// for(var i = 0; i < neuronTraces.length; i++){
	// 	for(var j = 0; j < neuronTraces[i].traces.length; j++){
	// 		outputStr += neuronTraces[i].traces[j].name + ": " + (2*neuronTraces[i].color_idx + (neuronTraces[i].traces[j].offset % 2 == 0 ? 0 : 1))+ ", ";
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

	neuronTraces.sort(function (a, b) {return (typeof a == 'number' ? (typeof b == 'number' ? a - b : 1) : (typeof b == 'number' ? -1 : a.class.toString().localeCompare(b.class.toString())))})

	while(plot_element.data.length){
		Plotly.deleteTraces(plot_element, [0])
	}

	for(var i = 0; i < neuronTraces.length; i++){
		Plotly.addTraces(plot_element, neuronTraces[i].traces);
	}

	Plotly.addTraces(plot_element, behaviorTraces);

}