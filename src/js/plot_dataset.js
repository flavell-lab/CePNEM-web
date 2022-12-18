/*
Neuron index info
idx_neuron: javascript (0 based) index
neuron: neuron number/id (1 based) index
*/

function pearson(arr1, arr2) {
    // Compute the means of each array
    const mean1 = arr1.reduce((a, b) => a + b) / arr1.length;
    const mean2 = arr2.reduce((a, b) => a + b) / arr2.length;

    // Compute the standard deviations of each array
    const std1 = Math.sqrt(arr1.map(x => Math.pow(x - mean1, 2)).reduce((a, b) => a + b) / arr1.length);
    const std2 = Math.sqrt(arr2.map(x => Math.pow(x - mean2, 2)).reduce((a, b) => a + b) / arr2.length);

    // Compute the Pearson correlation coefficient
    return arr1.map((x, i) => (x - mean1) * (arr2[i] - mean2)).reduce((a, b) => a + b) / (arr1.length * std1 * std2);
}

function get_neuron_label(idx_neuron, neuropal_label) {
    let neuron = idx_neuron + 1;
    if (neuron in neuropal_label) {
        return `${neuron} (${neuropal_label[neuron]['label']})`;
    } else {
        return `${neuron}`;
    }
}

function checkTuning(neuron_cat, behavior, tuning, idx_neuron) {
    let list_idx_tune = []
    for (const [key, value] of Object.entries(neuron_cat)) {
        if (value[behavior][tuning].includes(idx_neuron+1)) {
            list_idx_tune.push(key)
        }
      }

    if (list_idx_tune.length > 0) {
        return list_idx_tune.join(",")
    } else {
        return ""
    }
}

function toggleColumns(check_id, column_name) {
    check = document.getElementById(check_id)
    if (check.checked) {
        $('#table_encoding').bootstrapTable('showColumn', column_name);
    } else {
        $('#table_encoding').bootstrapTable('hideColumn', column_name);
    }
}

////
//// encoding table style
////
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


// init tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

var plot_main = document.getElementById('plot_main');
var select_neuron = document.getElementById("select_neuron");
var select_behavior = document.getElementById("select_behavior");
var table_encoding = document.getElementById("table_encoding");

const current_url = new URL(window.location.href);
const url_params = new URLSearchParams(current_url.search);
const dataset_uid = url_params.get('uid');
const list_neuron_str = url_params.get('list_neuron').split(",");
const list_url_neuron = [...new Set(list_neuron_str.map(x => parseInt(x)).sort(function(a, b) {return a - b;}))]
const list_url_behavior = url_params.get('list_behavior').split(",").sort();
const list_behavior_str = ["Velocity", "Head Curve", "Pumping", "Angular Velocity", "Body Curvature"];
const list_behavior_str_short = ["v", "hc", "f", "av", "bc"];
const behavior_units = ["0.1 mm/s", "rad", "pumps/sec", "rad/s", "rad"];
var n_neuron = 0;
var data_export = {"neuron": [], "behavior": []};

document.getElementById("csv_export").disabled = true;

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
        // send user to error.html
    }
});

fetch(`data/${dataset_uid}.json`).then(response => response.json()).then(data => {
    n_neuron = data["num_neurons"];
    
    // check neuron url
    list_url_neuron.forEach(function(idx_neuron) {
        if (idx_neuron < 0 || n_neuron <= idx_neuron) {
            // send user to error.html
        }
    });

    // change dataset string
    const str_dataset = document.getElementById('str_dataset');
    str_dataset.innerHTML = `Dataset - ${dataset_uid}`; 
    
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
    const list_t = Array.from({ length: data["max_t"] }, (_, i) => i);
    const time_range = list_t.map(n => n * avg_timestep);
    const behaviors = new Array(velocity, head_curve, pumping, angular_velocity, body_curvature);

    ////
    //// plot data
    ////
    initPlot(plot_main);

    if (list_url_neuron.length > 0 && !isNaN(list_url_neuron[0]) &&
        list_url_behavior.length > 0 && list_url_behavior[0]) {
        // plot neuron
        for (var neuron of list_url_neuron) {
            let idx_neuron = neuron - 1;
            let neuron_label = "Neuron " + get_neuron_label(idx_neuron, neuropal_label);
            let trace = trace_array[idx_neuron];
            plotNeuron(list_t, trace, plot_main, neuron_label, `neuron_${neuron}`)
        }

        // plot behavior
        for (var behavior of list_url_behavior) {
            let idx_behavior = list_behavior_str_short.indexOf(behavior);
            let label = `${list_behavior_str[idx_behavior]} (${behavior_units[idx_behavior]})`;
            let behavior_data = behaviors[idx_behavior];
            plotBehavior(list_t, behavior_data, plot_main, label, `behavior_${behavior}`)
        }

        // update correlation modal
        updateCorrelationModel(trace_array, behaviors, list_url_neuron, list_url_behavior,
            list_behavior_str_short, neuropal_label)

        update_data_export(data_export, trace_array, behaviors, list_url_neuron,
            list_url_behavior, neuropal_label)
        document.getElementById("csv_export").disabled = false;
    }

    // neuron selector update
    $("#select_neuron").selectpicker({
        // Other options...
    }).on('change', function () {
        let selected_idx_neuron_str = $(this).val();
        let selected_neuron_str = selected_idx_neuron_str.map(num => {
            // Convert the string to a number, add 1, and then convert it back to a string
            return (Number(num) + 1).toString();
        });
        let selected_neuron = selected_neuron_str.map(str=>parseInt(str));
        
        // remove existing neuron if deselected
        for(var i=0; i < plot_main.data.length; i++) {
            let trace_id = plot_main.data[i].trace_id;
            let neuron = parseInt(trace_id.split("_")[1]);
            let idx_neuron_str = (neuron - 1).toString();
            if (trace_id.includes("neuron_")) {
                if (!selected_idx_neuron_str.includes(idx_neuron_str)) {
                    Plotly.deleteTraces(plot_main, i);
                }
            }
        }
        // plot new neuron if new
        for (var idx_neuron_str of selected_idx_neuron_str) {
            let idx_neuron = parseInt(idx_neuron_str);
            let neuron = idx_neuron + 1;
            
            // check if neuron is already plotted
            let trace_id = `neuron_${neuron}`;
            if (!plot_main.data.map(x => x.trace_id).includes(trace_id)) {
                let neuron_label = "Neuron " + get_neuron_label(idx_neuron, neuropal_label);
                let trace = trace_array[idx_neuron];
                plotNeuron(list_t, trace, plot_main, neuron_label, `neuron_${neuron}`)
            }
        }            

        let selected_behavior_str_short = $("#select_behavior").selectpicker('val');
        updateCorrelationModel(trace_array, behaviors, selected_neuron, selected_behavior_str_short,
            list_behavior_str_short, neuropal_label)
    
        update_data_export(data_export, trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, neuropal_label)    
        
        document.getElementById("csv_export").disabled = false;

        // update the current URL
        let url = new URL(window.location.href);
        url.searchParams.set("list_neuron", selected_neuron_str);
        window.history.pushState({}, "", url);
    });

    // behavior selector update
    $("#select_behavior").selectpicker({
        // Other options...
    }).on('change', function () {
        let selected_behavior_str_short = $(this).val();
        // remove existing behavior if deselected
        for(var i=0; i < plot_main.data.length; i++) {
            let trace_id = plot_main.data[i].trace_id;
            let behavior = trace_id.split("_")[1];
            if (trace_id.includes("behavior_")) {
                if (!selected_behavior_str_short.includes(behavior)) {
                    Plotly.deleteTraces(plot_main, i);
                }
            }
        }
        // plot new behavior if new
        for (var behavior of selected_behavior_str_short) {
            // check if behavior is already plotted
            let trace_id = `behavior_${behavior}`;
            if (!plot_main.data.map(x => x.trace_id).includes(trace_id)) {
                let idx_behavior = list_behavior_str_short.indexOf(behavior);
                let label = `${list_behavior_str[idx_behavior]} (${behavior_units[idx_behavior]})`;
                let behavior_data = behaviors[idx_behavior];
                plotBehavior(list_t, behavior_data, plot_main, label, `behavior_${behavior}`)
            }
        }

        let selected_idx_neuron_str = $("#select_neuron").val();
        let selected_neuron_str = selected_idx_neuron_str.map(num => {
            // Convert the string to a number, add 1, and then convert it back to a string
            return (Number(num) + 1).toString();
        });
        let selected_neuron = selected_neuron_str.map(str=>parseInt(str));
        
        updateCorrelationModel(trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, list_behavior_str_short, neuropal_label)
        
        update_data_export(data_export, trace_array, behaviors, selected_neuron,
            selected_behavior_str_short, neuropal_label)
        document.getElementById("csv_export").disabled = false;
        // update the current URL
        let url = new URL(window.location.href);
        url.searchParams.set("list_behavior", selected_behavior_str_short);
        window.history.pushState({}, "", url);
    });


    ////// table
    const neuron_cat = data["neuron_categorization"]
    var table_encoding_data = []
    for (var idx_neuron = 0; idx_neuron < list_idx_neuron.length; idx_neuron++) {
        let neuron = idx_neuron + 1;
        let label_ = ""
        if (neuron in neuropal_label) {
            label_ = neuropal_label[neuron]["label"]
        }
        
        let enc_change_ = "No"
        if (data["encoding_changing_neurons"].includes(neuron)) {
            enc_change_ = "Yes"
        }

        let tune_v_fwd = checkTuning(neuron_cat, "v", "fwd", neuron)
        let tune_v_rev = checkTuning(neuron_cat, "v", "rev", neuron)
        let tune_fwd_slope_p = checkTuning(neuron_cat, "v", "fwd_slope_pos", neuron)
        let tune_fwd_slope_n = checkTuning(neuron_cat, "v", "fwd_slope_neg", neuron)
        let tune_rev_slope_p = checkTuning(neuron_cat, "v", "rev_slope_pos", neuron)
        let tune_rev_slope_n = checkTuning(neuron_cat, "v", "rev_slope_neg", neuron)
        let tune_slope1 = checkTuning(neuron_cat, "v", "rect_pos", neuron)
        let tune_slope2 = checkTuning(neuron_cat, "v", "rect_neg", neuron)

        let tune_dorsal = checkTuning(neuron_cat, "θh", "dorsal", neuron)
        let tune_ventral = checkTuning(neuron_cat, "θh", "ventral", neuron)
        let tune_fd = checkTuning(neuron_cat, "θh", "fwd_dorsal", neuron)
        let tune_fv = checkTuning(neuron_cat, "θh", "fwd_ventral", neuron)
        let tune_rd = checkTuning(neuron_cat, "θh", "rev_dorsal", neuron)
        let tune_rv = checkTuning(neuron_cat, "θh", "rev_ventral", neuron)
        let tune_mdf = checkTuning(neuron_cat, "θh", "rect_dorsal", neuron)
        let tune_mvf = checkTuning(neuron_cat, "θh", "rect_ventral", neuron)

        let tune_act = checkTuning(neuron_cat, "P", "act", neuron)
        let tune_inh = checkTuning(neuron_cat, "P", "inh", neuron)
        let tune_fa = checkTuning(neuron_cat, "P", "fwd_act", neuron)
        let tune_fi = checkTuning(neuron_cat, "P", "fwd_inh", neuron)
        let tune_ra = checkTuning(neuron_cat, "P", "rev_act", neuron)
        let tune_ri = checkTuning(neuron_cat, "P", "rev_inh", neuron)
        let tune_maf = checkTuning(neuron_cat, "P", "rect_act", neuron)
        let tune_mif = checkTuning(neuron_cat, "P", "rect_inh", neuron)

        table_encoding_data.push({
            "neuron": neuron,
            "label": label_,

            "strength_v": data["rel_enc_str_v"][idx_neuron].toFixed(3),
            "fwdness": data["forwardness"][idx_neuron].toFixed(2),
            "fwd": tune_v_fwd,
            "rev": tune_v_rev,
            "fwd_slope_p": tune_fwd_slope_p,
            "fwd_slope_n": tune_fwd_slope_n,
            "rev_slope_p": tune_rev_slope_p,
            "rev_slope_n": tune_rev_slope_n,
            "slope_1": tune_slope1,
            "slope_2": tune_slope2,

            "strength_hc": data["rel_enc_str_θh"][idx_neuron].toFixed(3),
            "dorsalness": data["dorsalness"][idx_neuron].toFixed(2),
            "dorsal": tune_dorsal,
            "ventral": tune_ventral,
            "fd": tune_fd,
            "fv": tune_fv,
            "rd": tune_rd,
            "rv": tune_rv,
            "mdf": tune_mdf,
            "mvf": tune_mvf,

            "strength_feeding": data["rel_enc_str_P"][idx_neuron].toFixed(3),
            "feedingness": data["feedingness"][idx_neuron].toFixed(2),
            "act": tune_act,
            "inh": tune_inh,
            "fa": tune_fa,
            "fi": tune_fi,
            "ra": tune_ra,
            "ri": tune_ri,
            "maf": tune_maf,
            "mif": tune_mif,

            "ewma": data["tau_vals"][idx_neuron].toFixed(1),
            "enc_change": enc_change_
        })
    }
    $('#table_encoding').bootstrapTable({
        data: table_encoding_data
    });    
}).catch(error => { console.error(error) });

function clearSelect() {
    // clear picker
    $("#select_neuron").selectpicker('val','');
    $('#select_behavior').selectpicker('val','');

    // clear plot
    while(plot_main.data.length>0)
    {
      Plotly.deleteTraces(plot_main, -1);
    }
    
    // clear correlation text
    const cor_txt = document.getElementById('cor_txt');
    cor_txt.innerHTML = "2 or more neurons need to be selected";
    const cor_txt_behavior = document.getElementById('cor_txt_behavior');
    cor_txt_behavior.innerHTML = "";

    document.getElementById("csv_export").disabled = true;
    data_export["neuron"] = [];
    data_export["behavior"] = [];

    // update the current URL
    let url = new URL(window.location.href);
    url.searchParams.set("list_neuron", "");
    url.searchParams.set("list_behavior", "");
    window.history.pushState({}, "", url);
}

////
//// table UI control
////
function updateTableColumn() {
    toggleColumns("check_v_s", "strength_v")
    toggleColumns("check_v_fwdness", "fwdness")
    toggleColumns("check_v_fwd", "fwd")
    toggleColumns("check_v_rev", "rev")
    toggleColumns("check_fwd_slope_p", "fwd_slope_p")
    toggleColumns("check_fwd_slope_n", "fwd_slope_n")
    toggleColumns("check_rev_slope_p", "rev_slope_p")
    toggleColumns("check_rev_slope_n", "rev_slope_n")
    toggleColumns("check_slope_1", "slope_1")
    toggleColumns("check_slope_2", "slope_2")

    // head curvature columns
    toggleColumns("check_hc_s", "strength_hc")
    toggleColumns("check_hc_dorsalness", "dorsalness")
    toggleColumns("check_hc_dorsal", "dorsal")
    toggleColumns("check_hc_ventral", "ventral")
    toggleColumns("check_hc_fd", "fd")
    toggleColumns("check_hc_fv", "fv")
    toggleColumns("check_hc_rd", "rd")
    toggleColumns("check_hc_rv", "rv")
    toggleColumns("check_hc_mdf", "mdf")
    toggleColumns("check_hc_mvf", "mvf")

    // feeding columns
    toggleColumns("check_f_strength", "strength_feeding")
    toggleColumns("check_feedness", "feedingness")
    toggleColumns("check_f_act", "act")
    toggleColumns("check_f_inh", "inh")
    toggleColumns("check_f_fa", "fa")
    toggleColumns("check_f_fi", "fi")
    toggleColumns("check_f_ra", "ra")
    toggleColumns("check_f_ri", "ri")
    toggleColumns("check_f_maf", "maf")
    toggleColumns("check_f_mif", "mif")

    // others
    toggleColumns("check_o_ewma", "ewma")
    toggleColumns("check_o_label", "label")
    toggleColumns("check_o_enc_change", "enc_change")
}


function selectDefault() {
    all_checks = document.getElementsByClassName("form-check-input")
    for (var i = 0; i < all_checks.length; i++) {
        all_checks[i].checked = false
    }
    
    check_v_fwd.checked = true
    check_v_rev.checked = true
    check_hc_dorsal.checked = true
    check_hc_ventral.checked = true
    check_f_act.checked = true
    check_f_inh.checked = true
    check_o_label.checked = true
    check_o_ewma.checked = true

    updateTableColumn()
}

function toggleV() {
    var button_v_all = document.getElementById("button_v_all")
    if (button_v_all.innerHTML == "Select All") {
        button_v_all.innerHTML = "Deselect All"

        check_v_fwdness.checked = true
        check_v_fwd.checked = true
        check_v_rev.checked = true
        check_v_s.checked = true
        check_v_fwdness.checked = true
        check_v_fwd.checked = true
        check_v_rev.checked = true
        check_fwd_slope_p.checked = true
        check_fwd_slope_n.checked = true
        check_rev_slope_p.checked = true
        check_rev_slope_n.checked = true
        check_slope_1.checked = true
        check_slope_2.checked = true

    } else {
        button_v_all.innerHTML = "Select All"

        check_v_fwdness.checked = false
        check_v_fwd.checked = false
        check_v_rev.checked = false
        check_v_s.checked = false   
        check_v_fwdness.checked = false
        check_v_fwd.checked = false
        check_v_rev.checked = false
        check_fwd_slope_p.checked = false
        check_fwd_slope_n.checked = false
        check_rev_slope_p.checked = false
        check_rev_slope_n.checked = false
        check_slope_1.checked = false
        check_slope_2.checked = false
    }
}

function toggleHC(){
    button_hc_all = document.getElementById("button_hc_all")
    
    if (button_hc_all.innerHTML == "Select All"){
        button_hc_all.innerHTML = "Deselect All"
        check_hc_s.checked = true
        check_hc_dorsalness.checked = true
        check_hc_dorsal.checked = true
        check_hc_ventral.checked = true
        check_hc_fd.checked = true
        check_hc_fv.checked = true
        check_hc_rd.checked = true
        check_hc_rv.checked = true
        check_hc_mdf.checked = true
        check_hc_mvf.checked = true
    } else {
        button_hc_all.innerHTML = "Select All"
        check_hc_s.checked = false
        check_hc_dorsalness.checked = false
        check_hc_dorsal.checked = false
        check_hc_ventral.checked = false
        check_hc_fd.checked = false
        check_hc_fv.checked = false
        check_hc_rd.checked = false
        check_hc_rv.checked = false
        check_hc_mdf.checked = false
        check_hc_mvf.checked = false
    }
}

function toggleF() {
    button_f_all = document.getElementById("button_f_all")
    if (button_f_all.innerHTML == "Select All") {
        button_f_all.innerHTML = "Deselect All"
        check_f_strength.checked = true
        check_feedness.checked = true
        check_f_act.checked = true
        check_f_inh.checked = true
        check_f_fa.checked = true
        check_f_fi.checked = true
        check_f_ra.checked = true
        check_f_ri.checked = true
        check_f_maf.checked = true
        check_f_mif.checked = true
    }   else {
        button_f_all.innerHTML = "Select All"
        check_f_strength.checked = false
        check_feedness.checked = false
        check_f_act.checked = false
        check_f_inh.checked = false
        check_f_fa.checked = false
        check_f_fi.checked = false
        check_f_ra.checked = false
        check_f_ri.checked = false
        check_f_maf.checked = false
        check_f_mif.checked = false
    }
}

function toggleO() {
    button_o_all = document.getElementById("button_o_all")
    if (button_o_all.innerHTML == "Select All") {
        button_o_all.innerHTML = "Deselect All"
        check_o_ewma.checked = true
        check_o_label.checked = true
        check_o_enc_change.checked = true
    } else {
        button_o_all.innerHTML = "Select All"
        check_o_ewma.checked = false
        check_o_label.checked = false
        check_o_enc_change.checked = false
    }
}

function copyURL() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard");
}

function updateCorrelationModel(trace_array, behaviors, list_neuron, list_behavior,
    list_behavior_str_short, neuropal_label) {
        // analysis modal
        const cor_txt = document.getElementById('cor_txt');
        if (list_neuron.length > 1) {
            txt_cor = ""
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
            cor_txt.innerHTML = txt_cor;
        }

        const cor_txt_behavior = document.getElementById('cor_txt_behavior');
        txt_cor_behavior =  ""
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
        cor_txt_behavior.innerHTML = txt_cor_behavior;
}


////
//// CSV export
////
function exportCSV() {
    if (data_export["neuron"].length == 0) {
        alert("No data to export")
    } else {
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
    }
}