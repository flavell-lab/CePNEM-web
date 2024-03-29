/*
Neuron index info
idx_neuron: javascript (0 based) index
neuron: neuron number/id (1 based) index
*/

const color_rev = 'rgba(255, 0, 0, 0.15)'
const event_style = {"heat": {"color": 'rgba(255,0,0,1)', "width": 2}};

function toggleColumns(table, parent, check_id, column_name) {
    var control = document.getElementById(parent)
    var check = control.querySelector("#" + check_id)
    if (check.checked) {
        $(table).bootstrapTable('showColumn', column_name);
    } else {
        $(table).bootstrapTable('hideColumn', column_name);
    }
}

function toggleChecks(parent, list_check_id, check) {
    var control = document.getElementById(parent)
    for (var i = 0; i < list_check_id.length; i++) {
        control.querySelector("#" + list_check_id[i]).checked = check
    }
}

// encoding table style
function rowStyle(row, index) {
    return {
    //   css: {'font-size': "12px"},
    classes: 'table_exsm'
    }
}

function headerStyle(column) {
    return {
        // css: {'font-size': "12px", "font-weight": "bold"},
      classes: 'table_exsm'
    }
}

function initRev(plot, reversal_events, avg_timestep, color_rev) {
    // generate reversal events
    // let shapes_rev = []
    let shapes = plot.layout.shapes
    //iterate over reversal events
    for (var i = 0; i < reversal_events.length; i++) {
        let [i_s, i_e] = reversal_events[i];
        let t_s = (i_s - 1) * avg_timestep;
        let t_e = (i_e - 1) * avg_timestep;

        dict_ = {}
        dict_["type"] = "rect"
        dict_["x0"] = t_s
        dict_["y0"] = -100
        dict_["x1"] = t_e
        dict_["y1"] = 100
        dict_["name"] = `rev_${i}`
        dict_["visible"] = true
        dict_["line"] = {
            "color": color_rev,
            "width": 0
        }
        dict_["fillcolor"] = color_rev
        
        // add to the plot shape
        shapes.push(dict_)
    }
}

function initEvent(plot, events, avg_timestep, event_style) {
    let shapes = plot.layout.shapes
    for (let event_key in events) {
        let event_array = events[event_key]
        for (let i = 0; i < event_array.length; i++) {
            let x_ = event_array[i] * avg_timestep

            dict_ = {}
            dict_["type"] = "line"
            dict_["x0"] = x_
            dict_["y0"] = -100
            dict_["x1"] = x_
            dict_["y1"] = 100
            dict_["name"] = `event_${event_key}_${i}`
            dict_["visible"] = true
            dict_["line"] =  {
                "color": event_style[event_key]["color"],
                "width": event_style[event_key]["width"]
            }

            // add to the plot shape
            shapes.push(dict_)
        }
    }
}

function toggleRev(q) {
    let update_ = {}
    for (var i = 0; i < plot_main.layout.shapes.length; i++) {
        let shape = plot_main.layout.shapes[i]
        if (shape.name.includes("rev")) {
            update_[`shapes[${i}].visible`] = q
        }
    }
    Plotly.relayout(plot_main, update_);
}

function toggleEvent(q) {
    let update_ = {}
    for (var i = 0; i < plot_main.layout.shapes.length; i++) {
        let shape = plot_main.layout.shapes[i]
        if (shape.name.includes("event")) {
            update_[`shapes[${i}].visible`] = q
        }
    }
    Plotly.relayout(plot_main, update_);
}

function resetYAxis(plot) {
    // console.log("Plot Data length: " + data_export["neuron"].length);
    if(data_export["neuron"].length == 0){
        return;
    }
    let margin = 0.05
    let data_ = plot.data
    let y_max = -1000.
    let y_min = 1000.

    // iterate over data_
    for (var trace of data_) {
        if (trace.trace_id.includes("neuron")) {
            y_ = trace.y
            y_max = Math.max(y_max, maxArray(y_))
            y_min = Math.min(y_min, minArray(y_))
        }
    }    
    let update_ = {"yaxis.range": [y_min - margin * y_min, y_max + margin * y_max]}
    Plotly.relayout(plot_main, update_);
}

// init tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// UI elements
var plot_main = document.getElementById('plot_main');
var select_neuron = document.getElementById("select_neuron");
var select_behavior = document.getElementById("select_behavior");
var table_encoding = document.getElementById("table_encoding");
var button_csv_export = document.getElementById("button_csv_export");
var button_cor = document.getElementById("button_cor");
var switch_rev = document.getElementById('switch_plot_rev');
var switch_event = document.getElementById('switch_plot_event');
var list_uid = []

const current_url = new URL(window.location.href);
const url_params = new URLSearchParams(current_url.search);
const dataset_uid = url_params.get('uid');
const list_neuron_str = url_params.get('list_neuron').split(",");
const list_url_neuron = [...new Set(list_neuron_str.map(x => parseInt(x)).sort(function(a, b) {return a - b;}))]
const list_url_behavior = url_params.get('list_behavior').split(",").sort();
const list_colors = url_params.get('list_colors').split(",");
const list_behavior_str = ["Velocity", "Head Curvature", "Pumping", "Angular Velocity", "Body Curvature"];
const list_behavior_str_short = ["v", "hc", "f", "av", "bc"];
const behavior_units = ["0.1 mm/s", "rad", "pumps/sec", "rad/s", "rad"];

const cor_txt = document.getElementById('cor_txt');
const cor_txt_behavior = document.getElementById('cor_txt_behavior');
const cor_txt_other_neuron = document.getElementById('cor_txt_other_neuron');

var n_neuron = 0;
var data_export = {"neuron": [], "behavior": []};
var dataload;

function update_data_export(data_export, trace_array, behaviors, list_neuron, list_behavior, neuropal_label) {
    data_export["neuron"] = [];
    data_export["behavior"] = [];
    list_neuron.forEach(function(neuron) {
        let idx_neuron = neuron - 1;
        data_export["neuron"].push([neuron in neuropal_label ? neuropal_label[neuron]["label"] :
            neuron, ...trace_array[idx_neuron]]);
    })

    list_behavior.forEach(function(behavior) {
        let idx_ = list_behavior_str_short.indexOf(behavior);
        data_export["behavior"].push([`${list_behavior_str[idx_]} (${behavior_units[idx_]})`, ...behaviors[idx_]])
    })
}
// check behavior url
list_url_behavior.forEach(function(behavior) {
    if (!list_behavior_str_short.includes(behavior)) {
        // console.error(`Behavior ${behavior} is not valid!`)
    }
});

fetch(`data/${dataset_uid}.json`).then(response => response.json()).then(data => {
    n_neuron = data["num_neurons"];
    button_csv_export.disabled = true;
    button_cor.disabled = true;
    dataload = url_params.get('datasets');
    dataload = dataload === 'true' ? true : false
    
    if(dataload){
        document.getElementById('collapseTable').style.display = 'block';
        
    } else{
        document.getElementById('collapseTable').style.display = 'none';
    }

     // Get dataset dtype to include in title
    let list_dtype = data.dataset_type;

    let html_dtype = "";
    for (let i = 0; i < list_dtype.length; i++) {
        let dtype_ = list_dtype[i];
        html_dtype += getDatasetTypePill(dtype_) + " "
    }

    // check neuron url
    list_url_neuron.forEach(function(idx_neuron) {
        if (idx_neuron < 0 || n_neuron <= idx_neuron) {
            // console.error(`Neuron ${idx_neuron} is not valid!`)
        }
    });

    // change dataset string
    const str_dataset = document.getElementById('str_dataset');
    str_dataset.innerHTML = `Dataset - ${dataset_uid} ` + html_dtype; 
    
    // load neuron list to the picker
    const list_idx_neuron = Array.from({ length: n_neuron }, (_, i) => i);
    const neuropal_label = data["labeled"];
    for (var idx_neuron = 0; idx_neuron < n_neuron; idx_neuron++) {
        var option = document.createElement("option");
        option.text = get_neuron_label(idx_neuron, neuropal_label);
        option.value = idx_neuron;
        if (list_url_neuron.includes(idx_neuron+1)) {
            option.selected = true;
        }
        select_neuron.add(option);
    }

    // load behavior list to the picker
    for (var i = 0; i < 5; i++) {
        var option = document.createElement("option");
        option.text = list_behavior_str[i];
        option.value = list_behavior_str_short[i];
        if (list_url_behavior.length > 0) {
            if (list_url_behavior.includes(option.value)) {
                option.selected = true;
            }
        }
        select_behavior.add(option);
    }

    // refresh pickers
    $(document).ready(function () {
        $("#select_neuron").selectpicker('refresh');
        $("#select_behavior").selectpicker('refresh');
    });

    // load data
    const trace_array = data["trace_array"];
    const velocity_raw = data["velocity"];
    const velocity = velocity_raw.map(x => x * 10);
    const head_curve = data["head_curvature"];
    const pumping = data["pumping"];
    const angular_velocity = data["angular_velocity"];
    const body_curvature = data["body_curvature"];
    const avg_timestep = data["avg_timestep"]
    const list_idx_t = Array.from({ length: data["max_t"] }, (_, i) => i);
    const list_t = list_idx_t.map(n => n * avg_timestep);
    const behaviors = new Array(velocity, head_curve, pumping, angular_velocity, body_curvature);
    const reversal_events = data["reversal_events"]

    // plot data
    initPlot(plot_main)
    initRev(plot_main, reversal_events, avg_timestep, color_rev)
    toggleRev(false);

    // check if data has key events
    if ("events" in data) {
        // plot events
        initEvent(plot_main, data["events"], avg_timestep, event_style)
        toggleEvent(true);

        // enable and check event switch
        switch_event.disabled = false;
        switch_event.checked = true;
    }
    
    q_plot_neuron = list_url_neuron.length > 0 && !isNaN(list_url_neuron[0])
    q_plot_behavior = list_url_behavior.length > 0 && list_url_behavior[0]

    if (q_plot_neuron) {
        // plot neuron
        for (var neuron of list_url_neuron) {
            let idx_neuron = neuron - 1;
            let neuron_label = "Neuron " + get_neuron_label(idx_neuron, neuropal_label);
            let trace = trace_array[idx_neuron];
            plotNeuron(list_t, trace, plot_main, neuron_label, `neuron_${neuron}`, neuropal_label)
        }
    }

    // plot behavior
    if (q_plot_behavior) {
        for (var behavior of list_url_behavior) {
            let idx_behavior = list_behavior_str_short.indexOf(behavior);
            let label = `${list_behavior_str[idx_behavior]} (${behavior_units[idx_behavior]})`;
            let behavior_data = behaviors[idx_behavior];
            plotBehavior(list_t, behavior_data, plot_main, label, `behavior_${behavior}`)
        }
    }

    

    if (q_plot_neuron && q_plot_behavior) {
        // update correlation modal
        updateCorrelationModel(trace_array, behaviors, list_url_neuron, list_url_behavior,
            list_behavior_str_short, neuropal_label)

        // update data export
        update_data_export(data_export, trace_array, behaviors, list_url_neuron,
            list_url_behavior, neuropal_label)
        
        // enable csv export button, correlation button
        button_csv_export.disabled = false;
        button_cor.disabled = false;
    }

    // plot all traces
    pushToPlot(plot_main);
    // configure y axis
    resetYAxis(plot_main)

    // update list of datasets that fit selections
    populate_side_table();

    // find matching datasets and update the side table
    if(dataload){
        fetch("data/matches.json").
            then(response => response.json()).
            then(match_data => {
                find_matches(neuropal_label, match_data);
        }).catch(error => console.error(error));
    }   

    // neuron selector update
    $('#select_neuron').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        let idx_neuron = clickedIndex;
        let neuron = idx_neuron + 1;

        // find the ploty trace id if exists
        let trace_idx = -1; // -1 if not exists
        for (var i=0; i < plot_main.data.length; i++) {
            let trace_id = plot_main.data[i].trace_id;
            if (trace_id.includes("neuron_")) {
                let neuron_trace = parseInt(trace_id.split("_")[1]);
                if (neuron_trace == neuron) {
                    trace_idx = i;
                    break;
                }
            }
        }
        
        if (isSelected && trace_idx == -1) {
            // plot neuron if selected
            let neuron_label = "Neuron " + get_neuron_label(idx_neuron, neuropal_label);
            let trace = trace_array[idx_neuron];
            plotNeuron(list_t, trace, plot_main, neuron_label, `neuron_${neuron}`, neuropal_label)
        } else if (!isSelected && trace_idx == -1) {
            // remove but trace does not exist. do nothing
        } else {
            // remove existing neuron if deselected
            let neuron_label = "Neuron " + get_neuron_label(idx_neuron, neuropal_label);
            removeTrace(`neuron_${neuron}`, neuropal_label[neuron] != undefined ? neuropal_label[neuron]['neuron_class'] : neuron);
            Plotly.deleteTraces(plot_main, i);
        }

        let selected_idx_neuron_str = $(this).val();
        let selected_neuron_str = selected_idx_neuron_str.map(num => {
            // Convert the string to a number, add 1, and then convert it back to a string
            return (Number(num) + 1).toString();
        });
        let selected_neuron = selected_neuron_str.map(num => {return parseInt(num)});
        
        // update cor modal
        let selected_behavior_str_short = $("#select_behavior").selectpicker('val');
        updateCorrelationModel(trace_array, behaviors, selected_neuron, selected_behavior_str_short,
            list_behavior_str_short, neuropal_label)
        button_cor.disabled = false;
    
        // update data export
        update_data_export(data_export, trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, neuropal_label)    
        button_csv_export.disabled = false;

        // plot all traces
        pushToPlot(plot_main);
        // update y
        resetYAxis(plot_main);

        // update the current URL
        let url = new URL(window.location.href);
        url.searchParams.set("list_neuron", selected_neuron_str);
        window.history.pushState({}, "", url);

        // find matching datasets and update the side table
        if(dataload){
            fetch("data/matches.json").
                then(response => response.json()).
                then(match_data => {
                    find_matches(neuropal_label, match_data);
            }).catch(error => console.error(error));
        }   
    });

    // behavior selector update
    $('#select_behavior').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        // console.log(`Behavior ${clickedIndex} is ${isSelected ? 'selected' : 'deselected'} previous value: ${previousValue}`);
        let idx_behavior = clickedIndex;
        let behavior = list_behavior_str_short[idx_behavior];

        // find the ploty trace id if exists
        let trace_idx = -1; // -1 if not exists
        for (var i=0; i < plot_main.data.length; i++) {
            let trace_id = plot_main.data[i].trace_id;
            if (trace_id.includes("behavior_")) {
                let behavior_trace = trace_id.split("_")[1];
                if (behavior_trace == behavior) {
                    trace_idx = i;
                    break;
                }
            }
        }
        
        if (isSelected && trace_idx == -1) {
            // plot behavior if selected
            let label = `${list_behavior_str[idx_behavior]} (${behavior_units[idx_behavior]})`;
            let behavior_data = behaviors[idx_behavior];
            plotBehavior(list_t, behavior_data, plot_main, label, `behavior_${behavior}`)
        } else if (!isSelected && trace_idx == -1) {
            // remove but trace does not exist. do nothing
        } else {
            
            // remove existing behavior if deselected
            let label = `${list_behavior_str[idx_behavior]} (${behavior_units[idx_behavior]})`;
            removeBehavior(label);
            Plotly.deleteTraces(plot_main, i);
        }

        // update cor modal
        let selected_idx_neuron_str = $("#select_neuron").val();
        let selected_neuron_str = selected_idx_neuron_str.map(num => {
            // Convert the string to a number, add 1, and then convert it back to a string
            return (Number(num) + 1).toString();
        });
        let selected_neuron = selected_neuron_str.map(num => {return parseInt(num)});
        let selected_behavior_str_short = $(this).selectpicker('val');
        updateCorrelationModel(trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, list_behavior_str_short, neuropal_label)
        button_cor.disabled = false;

        // update data export
        update_data_export(data_export, trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, neuropal_label)
        button_csv_export.disabled = false;

        pushToPlot(plot_main);
        resetYAxis(plot_main);

        // update the current URL
        let url = new URL(window.location.href);
        url.searchParams.set("list_behavior", selected_behavior_str_short);
        window.history.pushState({}, "", url);

        // find matching datasets and update the side table
        if(dataload){
            fetch("data/matches.json").
                then(response => response.json()).
                then(match_data => {
                    find_matches(neuropal_label, match_data);
            }).catch(error => console.error(error))
        }   
        
    });

    // Depending on URL state, choose to display side table
    if(dataload){
        document.getElementById('collapseTable').style.display = 'block';
    } else{
        document.getElementById('collapseTable').style.display = 'none';
    }

    // table
    var table_encoding_data = getEncodingTable(data)

    $('#table_encoding').bootstrapTable({
        data: table_encoding_data
    });    
}).catch(error => { console.error(error) });

function populate_side_table(){
    // populate table
    var table_data = [];
    list_uid = [];
    fetch("data/summary.json").then(response => response.json()).then(data => {
        for (const [key, value] of Object.entries(data)) {
            let list_dtype = value.dataset_type;
            let url_neuron = "plot_dataset.html?uid=" + key + "&list_neuron=1&list_behavior=v&list_colors=&datasets=";
            let url_json = `data/${key}.json`

            if (list_dtype.includes("neuropal")) {
                let html_dtype = "";
                for (let i = 0; i < list_dtype.length; i++) {
                    let dtype_ = list_dtype[i];
                    html_dtype += getDatasetTypePill(dtype_) + " "
                }
                table_data.push({
                    id: key,
                    type: html_dtype,
                    url: url_neuron
                })
            }
            list_uid.push(key)
        }

        curr_url = new URL(window.location.href);
        url_param_list = new URLSearchParams(curr_url.search);
        dataset_uid = url_param_list.get('uid');

        $('#small_dataset_table').bootstrapTable({
            data: table_data,
            onClickRow: function(row, element, field) {
                window.location.href = row.url; // Navigates to the specified URL in the 'url' field of the clicked row
            },
            onPageChange: function(number, size){
                var $rows = $('#small_dataset_table').find('tbody > tr');
                if(highlighted_dataset_idx < $rows.length)
                    $rows[highlighted_dataset_idx].classList.add('table-active');
            }
        });

        for (var i = 1; i < list_uid.length; i++) {
            var dataset_uid = list_uid[i];
            $('#small_dataset_table').bootstrapTable("hideRow", {uniqueId: dataset_uid});
        }
    }).catch(error => console.error(error));
}

var lastShownDataset = null;
var previousDatasetURL = null;
var nextDatasetURL = null;
var highlighted_dataset_idx = -1;

function find_matches(neuropal_label, data){
    let selectedOptions = [];

    let neuron_indices = $("#select_neuron").val()
    
    for(let i = 0; i < neuron_indices.length; i++){
        let idx_neuron = Number(neuron_indices[i]) + 1;
        if(idx_neuron in neuropal_label){
            selectedOptions.push({class: neuropal_label[idx_neuron]["neuron_class"], 
                                LR: neuropal_label[idx_neuron]["LR"],
                                DV: neuropal_label[idx_neuron]["DV"]})
        }
    }

    if (selectedOptions.length > 0) {
        var curr_dataset_idx = 0;
        var first_dataset_idx = list_uid.length;
        var last_dataset_idx = 0;
        var next_idx = 0;
        var preb_idx = 0;
        var shown_count = 0;
        var curr_url = new URL(window.location.href);
        var url_param_list = new URLSearchParams(curr_url.search);
        var curr_list_url_behavior = url_param_list.get('list_behavior').split(",").sort();
        var url_colors_list = url_param_list.get('list_colors').split(",");
        // console.log(url_colors_list);
        for (var i = 1; i < list_uid.length; i++) {
            let curr_dataset_uid = list_uid[i];
            // iterate over neurons selected
            let match_all = true;
            let list_idx_neuron = [];
            for (let j = 0; j < selectedOptions.length; j++) {
                let neuron_class = selectedOptions[j].class;
                let LR = selectedOptions[j].LR;
                let DV = selectedOptions[j].DV;
                let neuron_list = data[neuron_class + DV + LR];
                if(neuron_list == undefined){
                    neuron_list = data[neuron_class + DV];
                }
                if(neuron_list == undefined){
                    neuron_list = data[neuron_class + LR];
                }
                if(neuron_list == undefined){
                    neuron_list = data[neuron_class];
                }
                if(neuron_list == undefined && DV == "missing"){
                    neuron_list = data[neuron_class + "D"].concat(data[neuron_class + "V"])
                }
                if(neuron_list == undefined){
                    console.error("Unable to find Neuron in dataset")
                    continue;
                }
                let list_match_uid = neuron_list.map(function (subarray) {
                    if (subarray[0] == curr_dataset_uid) {
                        list_idx_neuron.push(subarray[1])
                    }
                    return subarray[0];
                });
                let match_ = list_match_uid.includes(curr_dataset_uid)
                match_all = match_all && match_
            }

            

            if (match_all == true) {
                let url_plot = new URL("plot_dataset.html", document.location);
                url_plot.searchParams.set("uid", curr_dataset_uid);
                url_plot.searchParams.set("list_neuron", list_idx_neuron);
                url_plot.searchParams.set("list_behavior", curr_list_url_behavior);
                url_plot.searchParams.set("list_colors", url_colors_list);
                url_plot.searchParams.set("datasets", true);
                $('#small_dataset_table').bootstrapTable('updateCellByUniqueId', {
                    id: curr_dataset_uid,
                    field: "url",
                    value: url_plot,
                    reinit: true
                });

                $('#small_dataset_table').bootstrapTable('showRow', {uniqueId: curr_dataset_uid});
                
                if(i < first_dataset_idx){
                    first_dataset_idx = i;
                }
                if(i > last_dataset_idx){
                    last_dataset_idx = i;
                }

                if(curr_dataset_uid === dataset_uid){
                    curr_dataset_idx = i;
                    highlighted_dataset_idx = shown_count;

                    if(lastShownDataset != null){
                        previousDatasetURL = $('#small_dataset_table').bootstrapTable('getRowByUniqueId', lastShownDataset).url;
                    }  
                }
                if(lastShownDataset == list_uid[curr_dataset_idx]){
                    nextDatasetURL = $('#small_dataset_table').bootstrapTable('getRowByUniqueId', list_uid[i]).url;
                }   
                lastShownDataset = curr_dataset_uid;
                shown_count++;
            } else {
                $('#small_dataset_table').bootstrapTable("hideRow", {uniqueId: curr_dataset_uid});
            }
        }
        if(previousDatasetURL == null){
            previousDatasetURL = $('#small_dataset_table').bootstrapTable('getRowByUniqueId', list_uid[last_dataset_idx]).url;
        }
        if(nextDatasetURL == null){
            nextDatasetURL = $('#small_dataset_table').bootstrapTable('getRowByUniqueId', list_uid[first_dataset_idx]).url;
        }
        var $rows = $('#small_dataset_table').find('tbody > tr');
        if(highlighted_dataset_idx != -1 && highlighted_dataset_idx < $rows.length){
            $rows[highlighted_dataset_idx].classList.add('table-active');
        }
        
    } else {// if (selectedOptions.length <= 0)
        for (let i = 1; i < list_uid.length; i++) {
            let curr_dataset_uid = list_uid[i];
            $('#small_dataset_table').bootstrapTable("hideRow", {uniqueId: curr_dataset_uid});
        }
    }
    
}

function nextDataset(){
    if(nextDatasetURL != null)
        window.location.href = nextDatasetURL;
}

function previousDataset(){
    if(previousDatasetURL != null)
        window.location.href = previousDatasetURL;
}

function clearSelect() {
    // clear picker
    $("#select_neuron").selectpicker("deselectAll");
    $("#select_behavior").selectpicker("deselectAll");

    neuronTraces = [];
    behaviorTraces = []
    curr_colors = [];

    // clear plot
    while(plot_main.data.length>0)
    {
      Plotly.deleteTraces(plot_main, -1);
    }
    
    // clear correlation text
    cor_txt.innerHTML = "2 or more neurons need to be selected";
    cor_txt_behavior.innerHTML = "1 or more neurons need to be selected";
    cor_txt_other_neuron.innerHTML = "1 or more neurons need to be selected";

    button_cor.disabled = true;

    // disable/reset export csv
    button_csv_export.disabled = true;
    data_export["neuron"] = [];
    data_export["behavior"] = [];

    // disable next and previous buttons
    nextDatasetURL = null;
    previousDatasetURL = null;

    // update the current URL
    let url = new URL(window.location.href);
    url.searchParams.set("list_neuron", "");
    url.searchParams.set("list_behavior", "");
    url.searchParams.set("list_colors", "");
    url.searchParams.set("datasets", dataload);
    window.history.pushState({}, "", url);
}

// table UI control
function updateTableColumn(table, parent) {
    // v
    toggleColumns(table, parent, "check_v_s", "strength_v")
    toggleColumns(table, parent, "check_v_fwdness", "fwdness")
    toggleColumns(table, parent, "check_v_fwd", "fwd")
    toggleColumns(table, parent, "check_v_rev", "rev")
    toggleColumns(table, parent, "check_fwd_slope_p", "fwd_slope_p")
    toggleColumns(table, parent, "check_fwd_slope_n", "fwd_slope_n")
    toggleColumns(table, parent, "check_rev_slope_p", "rev_slope_p")
    toggleColumns(table, parent, "check_rev_slope_n", "rev_slope_n")
    toggleColumns(table, parent, "check_slope_1", "slope_1")
    toggleColumns(table, parent, "check_slope_2", "slope_2")

    // hc
    toggleColumns(table, parent, "check_hc_s", "strength_hc")
    toggleColumns(table, parent, "check_hc_dorsalness", "dorsalness")
    toggleColumns(table, parent, "check_hc_dorsal", "dorsal")
    toggleColumns(table, parent, "check_hc_ventral", "ventral")
    toggleColumns(table, parent, "check_hc_fd", "fd")
    toggleColumns(table, parent, "check_hc_fv", "fv")
    toggleColumns(table, parent, "check_hc_rd", "rd")
    toggleColumns(table, parent, "check_hc_rv", "rv")
    toggleColumns(table, parent, "check_hc_mdf", "mdf")
    toggleColumns(table, parent, "check_hc_mvf", "mvf")

    // feeding
    toggleColumns(table, parent, "check_f_strength", "strength_feeding")
    toggleColumns(table, parent, "check_feedness", "feedingness")
    toggleColumns(table, parent, "check_f_act", "act")
    toggleColumns(table, parent, "check_f_inh", "inh")
    toggleColumns(table, parent, "check_f_fa", "fa")
    toggleColumns(table, parent, "check_f_fi", "fi")
    toggleColumns(table, parent, "check_f_ra", "ra")
    toggleColumns(table, parent, "check_f_ri", "ri")
    toggleColumns(table, parent, "check_f_maf", "maf")
    toggleColumns(table, parent, "check_f_mif", "mif")
    
    // other
    toggleColumns(table, parent, "check_o_ewma", "ewma")
    toggleColumns(table, parent, "check_o_enc_change", "enc_change")
}

function selectDefault(table, parent) {
    var control = document.getElementById(parent)
    all_checks = control.getElementsByClassName("form-check-input")
    for (var i = 0; i < all_checks.length; i++) {
        all_checks[i].checked = false
    }

    let list_check_id = ["check_v_fwd", "check_v_rev", "check_hc_dorsal", "check_hc_ventral",
        "check_f_act", "check_f_inh", "check_o_ewma"]
    toggleChecks(parent, list_check_id, true)

    updateTableColumn(table, parent)
}

function toggleV(parent) {
    var control = document.getElementById(parent)
    var button_v_all = control.querySelector("#button_v_all")

    let list_check_id = ["check_v_fwdness", "check_v_fwd", "check_v_rev", "check_v_s",
        "check_fwd_slope_p", "check_fwd_slope_n", "check_rev_slope_p", "check_rev_slope_n", "check_slope_1", "check_slope_2"]


    if (button_v_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_v_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_v_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

function toggleHC(parent) {
    var control = document.getElementById(parent)
    var button_hc_all = control.querySelector("#button_hc_all")

    let list_check_id = ["check_hc_s", "check_hc_dorsalness", "check_hc_dorsal", "check_hc_ventral",
        "check_hc_fd", "check_hc_fv", "check_hc_rd", "check_hc_rv", "check_hc_mdf", "check_hc_mvf"]

    if (button_hc_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_hc_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_hc_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)   
    }
}

function toggleF(parent) {
    var control = document.getElementById(parent)
    var button_f_all = control.querySelector("#button_f_all")

    let list_check_id = ["check_f_strength", "check_feedness", "check_f_act", "check_f_inh",
        "check_f_fa", "check_f_fi", "check_f_ra", "check_f_ri", "check_f_maf", "check_f_mif"]

    if (button_f_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_f_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_f_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

function toggleO(parent) {
    var control = document.getElementById(parent)
    var button_o_all = control.querySelector("#button_o_all")

    let list_check_id = ["check_o_ewma", "check_o_enc_change"]

    if (button_o_all.innerHTML.replace(/\s+/g, '') == "SelectAll") {
        button_o_all.innerHTML = "Deselect All"
        toggleChecks(parent, list_check_id, true)
    } else {
        button_o_all.innerHTML = "Select All"
        toggleChecks(parent, list_check_id, false)
    }
}

function copyURL() {
    var currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard");
}

function updateCorrelationModel(trace_array, behaviors, list_neuron, list_behavior,
    list_behavior_str_short, neuropal_label) {
    // analysis modal
    let txt_cor = ""
    let txt_cor_behavior =  ""
    let txt_cor_other_neurons = ""

    // neuron txt
    if (list_neuron.length > 1) {
        for (let i = 0; i < list_neuron.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (i != j) {
                    let neuron1 = list_neuron[j]
                    let neuron2 = list_neuron[i]
                    let idx_neuron1 = neuron1 - 1
                    let idx_neuron2 = neuron2 - 1
                    let cor_ = pearson(trace_array[idx_neuron1], trace_array[idx_neuron2]).toFixed(2)

                    let neuron1_txt = get_neuron_label(idx_neuron1, neuropal_label)
                    let neuron2_txt = get_neuron_label(idx_neuron2, neuropal_label)
                    txt_cor += `${neuron1_txt}, ${neuron2_txt} = ${cor_}<br>`
                }
            }
        }
    } else {
        txt_cor = "2 or more neurons need to be selected";
    }

    // behavior txt
    if (list_neuron.length > 0 && list_behavior.length > 0) {
        for (let i = 0; i < list_neuron.length; i++) {
            let idx_neuron = list_neuron[i] - 1
            let neuron_txt = get_neuron_label(idx_neuron, neuropal_label)
            txt_cor_behavior += `<b>${neuron_txt}</b><br>`
            for (let j = 0; j < list_behavior.length; j++) {
                let idx_behavior = list_behavior_str_short.indexOf(list_behavior[j])
                let cor_ = pearson(trace_array[idx_neuron], behaviors[idx_behavior]).toFixed(2)
                txt_cor_behavior += `${neuron_txt}, ${list_behavior_str[idx_behavior]} = ${cor_}<br>`
            }
            txt_cor_behavior += "<br>"
        }
    } else if (list_behavior.length == 0) {
        txt_cor_behavior = "1 or more behaviors need to be selected";
    } else {
        txt_cor_behavior = "1 or more neurons need to be selected";
    }

    // correlation with other neurons: top 3 neurons
    if (list_neuron.length > 0) {
        for (let i = 0; i < list_neuron.length; i++) {
            let idx_neuron = list_neuron[i] - 1
            let neuron_txt = get_neuron_label(idx_neuron, neuropal_label)
            txt_cor_other_neurons += `<b>${neuron_txt}</b><br>`
            let cor_array = []
            
            for (let j = 0; j < trace_array.length; j++) {
                if (j != idx_neuron) {
                    let cor_ = pearson(trace_array[idx_neuron], trace_array[j]).toFixed(2)
                    cor_array.push([j, cor_])
                }
            }
            let cor_array_sorted = cor_array.sort(function(a, b) {
                return Math.abs(b[1]) - Math.abs(a[1]);
            });

            for (let j = 0; j < 3; j++) {
                let neuron_txt_ = get_neuron_label(cor_array_sorted[j][0], neuropal_label)
                txt_cor_other_neurons += `${neuron_txt_} = ${cor_array_sorted[j][1]}<br>`
            }
            txt_cor_other_neurons += "<br>"
        }
    } else {
        txt_cor_other_neurons = "1 or more neurons need to be selected";
    }

    cor_txt.innerHTML = txt_cor;
    cor_txt_behavior.innerHTML = txt_cor_behavior;
    cor_txt_other_neuron.innerHTML = txt_cor_other_neurons;
}

// CSV export
function exportCSV() {
    if (data_export["neuron"].length > 0 && data_export["behavior"].length > 0) {
        var csvString = data_export["neuron"].map(row => row.join(",")).join("\n");
        csvString += "\n" + data_export["behavior"].map(row => row.join(",")).join("\n");

        // Create a link element
        var link = document.createElement("a");

        // Set the link's href to a data URI containing the CSV string
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

        // Set the link's download attribute to the desired file name
        link.download = "data.csv";

        // Append the link to the DOM
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
    } else {
        alert("Need at least 1 neuron and 1 behavior selected to export data.")
    }
}

function downloadSelected(){
    // Get a list of the selected rows
    var idsToDownload = $("#small_dataset_table").bootstrapTable("getSelections")

    // Loop through selections and download each using the IDs
    for(let i = 0; i < idsToDownload.length; i++){
        downloadJson(JSON.parse(JSON.stringify(idsToDownload[i])).id)
    }

}

function downloadJson(jsonUID) {
    const jsonUrl = `data/${jsonUID}.json`; // JSON file URL

    // Fetch JSON data
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {

            //alert(data)
            // Create a blob from the JSON data
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});

            // Create an object URL for the blob
            const url = URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.download = `${jsonUID}.json`; // specify downloaded file name

            // Append the link element to the body
            document.body.appendChild(link);

            // Simulate a click on the link
            link.click();

            // Cleanup - remove the link element from the body
            document.body.removeChild(link);
        })
        .catch(error => console.error('An error occurred:', error));
}

function toggleDataLoad(){
    // var content = document.getElementById("small_dataset_table");
    if(dataload){
        dataload = false;
        document.getElementById('collapseTable').style.display = 'none';
        
    } else{
        dataload = true;
        document.getElementById('collapseTable').style.display = 'block';
        $('#select_behavior').trigger('changed.bs.select');
    }

    // update the current URL
    let url = new URL(window.location.href);
    url.searchParams.set("datasets", dataload);
    window.history.pushState({}, "", url);
}

function switchRev() {
    toggleRev(switch_rev.checked)
    resetYAxis(plot_main)
}

function switchEvent() {
    toggleEvent(switch_event.checked)
    resetYAxis(plot_main)
}