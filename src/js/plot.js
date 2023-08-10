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

	alert(neuropal_label)
	// Create a new trace for the plot
	var yaxis = 'y' + subplot;
    var trace = {
        x: x,
        y: y,
        type: 'line',
        mode: 'line',
		name: data_label,
		class: neuropal_label != null ? neuropal_label[parseInt(trace_id)]['neuron_class'] : null,
		xaxis: 'x',
		yaxis: yaxis,
		trace_id: trace_id
    };

	if(neuronTraces.length > 0){
		for(var i = 0; i < neuronTraces.length; i++){
			if(neuronTraces[i].class > trace.class){
				var newClass = {
					class: trace.class,
					traces: [trace]
				};
				neuronTraces.splice(i, 0, newClass);
			}
			else if(neuronTraces[i].class === trace.class){
				for(var j = 0; j < neuronTraces[i].traces.length; j++){
					if(neuronTraces[i].traces[j].name.substring(
						neuronTraces[i].traces[j].name.indexOf('('), neuronTraces[i].traces[j].name.length-2) >
						trace.name.substring(trace.name.indexOf('('), trace.name.length-2)){
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
	}

	var outputStr = "";

	for(var i = 0; i < neuronTraces.length; i++){
		outputStr += neuronTraces[i].traces + ", ";
	}

	alert(outputStr)

    Plotly.addTraces(plot_element, [trace,]);
}

function addTracesToPlot(){

}

function plotNeuron(list_t, trace, plot_element, label, trace_id, neuropal_label) {
    plotData(list_t, trace, plot_element, label, '', trace_id, neuropal_label)
}

function plotBehavior(list_t, behavior, plot_element, label, trace_id) {
	plotData(list_t, behavior, plot_element, label, '2', trace_id, null)
}