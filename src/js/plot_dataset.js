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

var select_neuron = document.getElementById("select_neuron");
var select_behavior = document.getElementById("select_behavior");
var table_encoding = document.getElementById("table_encoding");

var data_export = [];

const currentUrl = new URL(window.location.href);
const urlParams = new URLSearchParams(currentUrl.search);

const dataset_uid = urlParams.get('uid');
const list_neuron_str = urlParams.get('list_neuron');
const list_neuron = [...new Set(list_neuron_str.split`,`.map(x => +x))]
const list_behavior = urlParams.get('list_behavior').split(",");

const list_behavior_str = ["Velocity", "Head Curve", "Pumping", "Angular Velocity", "Body Curvature"]
const list_behavior_str_short = ["v", "hc", "f", "av", "bc"]

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

fetch(`data/${dataset_uid}.json`).
    then(response => response.json()).
    then(data => {
        // change dataset string
        const str_dataset = document.getElementById('str_dataset');
        str_dataset.innerHTML = `Dataset - ${dataset_uid}`;

        // load neuron list to the picker
        const list_neuron_idx = Array.from({ length: data["num_neurons"] - 1 }, (_, i) => i);
        const labeled = data["labeled"];
        for (var i = 0; i < list_neuron_idx.length; i++) {
            var option = document.createElement("option");
            if ((i + 1) in labeled) {
                option.text = `${i + 1} (${labeled[i + 1]["label"]})`;
            } else {
                option.text = i + 1;
            }
            option.value = i;
            if (list_neuron.includes(i+1)) {
                option.selected = true;
            }
            select_neuron.add(option);
        }

        for (var i = 0; i < 5; i++) {
            var option = document.createElement("option");
            option.text = list_behavior_str[i];
            option.value = list_behavior_str_short[i];
            if (list_behavior.length > 0) {
                if (list_behavior.includes(option.value)) {
                    option.selected = true;
                }
            }
            select_behavior.add(option);
        }

        $(document).ready(function () {
            $("#select_neuron").selectpicker('refresh');
            $("#select_behavior").selectpicker('refresh');
        });

        // plot
        const trace_array = data["trace_array"];

        const velocity_orig = data["velocity"];
        const velocity = velocity_orig.map(x => x * 10);
        const head_curve = data["head_curvature"];
        const pumping = data["pumping"];
        const angular_velocity = data["angular_velocity"];
        const body_curvature = data["body_curvature"];

        const avg_timestep = data["avg_timestep"]
        const timepoints = Array.from({ length: data["max_t"] }, (_, i) => i);
        const time_range = timepoints.map(n => n * avg_timestep);
        const behavior_units = ["0.1 mm/s", "rad", "pumps/sec", "rad/s", "rad"];
        const behaviors = new Array(velocity, head_curve, pumping, angular_velocity, body_curvature);

        PLOT1 = document.getElementById('plot1');
        append = false;
        for (var idx_neuron of list_neuron) {
            plotSpecificNeuralTrace(time_range, trace_array, idx_neuron, 'plot1', append, labeled)
            append = true
            
            data_export.push([idx_neuron in labeled ? labeled[idx_neuron]["label"] : idx_neuron, ...trace_array[idx_neuron]])
        }
        append_behavior = false;
        for (var b of list_behavior) {
            const idx_ = list_behavior_str_short.indexOf(b);
            plotSpecificBehavior(time_range, behaviors[idx_], behavior_units[idx_],
                list_behavior_str[idx_], "plot1", append_behavior)
            append_behavior=true

            data_export.push([`${list_behavior_str[idx_]} (${behavior_units[idx_]})`, ...behaviors[idx_]])
        }
        // analysis modal
        const cor_txt = document.getElementById('cor_txt');
        if (list_neuron.length > 1) {
            txt_cor = ""
            for (let i = 0; i < list_neuron.length; i++) {
                for (let j = 0; j <= i; j++) {
                    if (i != j) {
                        let idx_neuron1 = list_neuron[i]
                        let idx_neuron2 = list_neuron[j]
                        let cor_ = pearson(trace_array[idx_neuron1], trace_array[idx_neuron2]).toFixed(2)

                        let neuron1_txt = idx_neuron1
                        let neuron2_txt = idx_neuron2
                        
                        if ((idx_neuron1) in labeled) {
                            neuron1_txt = `${idx_neuron1} (${labeled[idx_neuron1]["label"]})`
                        }
                        if ((idx_neuron2) in labeled) {
                            neuron2_txt = `${idx_neuron2} (${labeled[idx_neuron2]["label"]})`
                        }
                        txt_cor += `${neuron1_txt}, ${neuron2_txt} = ${cor_}<br>`
                    }
                }
            }
            cor_txt.innerHTML = txt_cor;
        }

        const cor_txt_behavior = document.getElementById('cor_txt_behavior');
        txt_cor_behavior =  ""
        for (let i = 0; i < list_neuron.length; i++) {
            let idx_neuron = list_neuron[i]
            let neuron_txt = idx_neuron
            if ((idx_neuron) in labeled) {
                neuron_txt = `${idx_neuron} (${labeled[idx_neuron]["label"]})`
            }
            txt_cor_behavior += `<b>${neuron_txt}</b><br>`
            for (let j = 0; j < list_behavior.length; j++) {
                let idx_behavior = list_behavior_str_short.indexOf(list_behavior[j])
                let cor_ = pearson(trace_array[idx_neuron], behaviors[idx_behavior]).toFixed(2)
                txt_cor_behavior += `${neuron_txt}, ${list_behavior_str[idx_behavior]} = ${cor_}<br>`
            }
        }
        cor_txt_behavior.innerHTML = txt_cor_behavior;

        // table
        // console.log(data)
        const neuron_cat = data["neuron_categorization"]

        var table_encoding_data = []
        for (var i = 0; i < list_neuron_idx.length; i++) {

            let label_ = ""
            if ((i+1) in labeled) {
                label_ = labeled[i+1]["label"]
            }
            
            let enc_change_ = "No"
            if (data["encoding_changing_neurons"].includes(i + 1)) {
                enc_change_ = "Yes"
            }

            let tune_v_fwd = checkTuning(neuron_cat, "v", "fwd", i+1)
            let tune_v_rev = checkTuning(neuron_cat, "v", "rev", i+1)
            let tune_fwd_slope_p = checkTuning(neuron_cat, "v", "fwd_slope_pos", i+1)
            let tune_fwd_slope_n = checkTuning(neuron_cat, "v", "fwd_slope_neg", i+1)
            let tune_rev_slope_p = checkTuning(neuron_cat, "v", "rev_slope_pos", i+1)
            let tune_rev_slope_n = checkTuning(neuron_cat, "v", "rev_slope_neg", i+1)
            let tune_slope1 = checkTuning(neuron_cat, "v", "rect_pos", i+1)
            let tune_slope2 = checkTuning(neuron_cat, "v", "rect_neg", i+1)

            let tune_dorsal = checkTuning(neuron_cat, "θh", "dorsal", i+1)
            let tune_ventral = checkTuning(neuron_cat, "θh", "ventral", i+1)
            let tune_fd = checkTuning(neuron_cat, "θh", "fwd_dorsal", i+1)
            let tune_fv = checkTuning(neuron_cat, "θh", "fwd_ventral", i+1)
            let tune_rd = checkTuning(neuron_cat, "θh", "rev_dorsal", i+1)
            let tune_rv = checkTuning(neuron_cat, "θh", "rev_ventral", i+1)
            let tune_mdf = checkTuning(neuron_cat, "θh", "rect_dorsal", i+1)
            let tune_mvf = checkTuning(neuron_cat, "θh", "rect_ventral", i+1)

            let tune_act = checkTuning(neuron_cat, "P", "act", i+1)
            let tune_inh = checkTuning(neuron_cat, "P", "inh", i+1)
            let tune_fa = checkTuning(neuron_cat, "P", "fwd_act", i+1)
            let tune_fi = checkTuning(neuron_cat, "P", "fwd_inh", i+1)
            let tune_ra = checkTuning(neuron_cat, "P", "rev_act", i+1)
            let tune_ri = checkTuning(neuron_cat, "P", "rev_inh", i+1)
            let tune_maf = checkTuning(neuron_cat, "P", "rect_act", i+1)
            let tune_mif = checkTuning(neuron_cat, "P", "rect_inh", i+1)

            table_encoding_data.push({
                "neuron": i+1,
                "label": label_,

                "strength_v": data["rel_enc_str_v"][i].toFixed(3),
                "fwdness": data["forwardness"][i].toFixed(2),
                "fwd": tune_v_fwd,
                "rev": tune_v_rev,
                "fwd_slope_p": tune_fwd_slope_p,
                "fwd_slope_n": tune_fwd_slope_n,
                "rev_slope_p": tune_rev_slope_p,
                "rev_slope_n": tune_rev_slope_n,
                "slope_1": tune_slope1,
                "slope_2": tune_slope2,

                "strength_hc": data["rel_enc_str_θh"][i].toFixed(3),
                "dorsalness": data["dorsalness"][i].toFixed(2),
                "dorsal": tune_dorsal,
                "ventral": tune_ventral,
                "fd": tune_fd,
                "fv": tune_fv,
                "rd": tune_rd,
                "rv": tune_rv,
                "mdf": tune_mdf,
                "mvf": tune_mvf,

                "strength_feeding": data["rel_enc_str_P"][i].toFixed(3),
                "feedingness": data["feedingness"][i].toFixed(2),
                "act": tune_act,
                "inh": tune_inh,
                "fa": tune_fa,
                "fi": tune_fi,
                "ra": tune_ra,
                "ri": tune_ri,
                "maf": tune_maf,
                "mif": tune_mif,

                "ewma": data["tau_vals"][i].toFixed(1),
                "enc_change": enc_change_
            })
        }



        $('#table_encoding').bootstrapTable({
            data: table_encoding_data
        });

        
    }).
    catch(error => {
        console.error(error)
        // res.sendStatus(404);
    });

function plotSelect() {
    var selectedNeurons = $("#select_neuron").val();
    var selectedBehaviors = $("#select_behavior").val();
    const selectedNeurons1 = selectedNeurons.map(num => {
        // Convert the string to a number, add 1, and then convert it back to a string
        return (Number(num) + 1).toString();
      });
      
    if (selectedNeurons.length > 0 && selectedBehaviors.length > 0) {
        // Modify the URL as desired
        var currentUrl = window.location.href;
        var currentUrlStrRoot = currentUrl.split('?')[0]
        var newUrl = currentUrlStrRoot + "?uid=" + dataset_uid + "&list_neuron=" + selectedNeurons1.join() +
            "&list_behavior=" + $("#select_behavior").val();
        
        // Use pushState to update the URL
        // window.history.pushState({}, "", newUrl);        
        window.location.replace(newUrl);
    } else {
        alert("Please select at least one neuron and one behavior")
    }
}

function clearSelect() {
    $("#select_neuron").selectpicker('val', '');
    $("#select_behavior").selectpicker('val', '');
    // for (var i = 1; i < table.rows.length; i++) {
    //     var row = table.rows[i];
    //     row.style.display = "";
    // }
}

function toggleColumns(check_id, column_name) {
    check = document.getElementById(check_id)
    if (check.checked) {
        $('#table_encoding').bootstrapTable('showColumn', column_name);
    } else {
        $('#table_encoding').bootstrapTable('hideColumn', column_name);
    }
}

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

function exportCSV() {
    var csvString = data_export.map(row => row.join(",")).join("\n");

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