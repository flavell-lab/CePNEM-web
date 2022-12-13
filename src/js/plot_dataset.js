var select_neuron = document.getElementById("select_neuron");
var select_behavior = document.getElementById("select_behavior");
var table_encoding = document.getElementById("table_encoding");

const currentUrl = new URL(window.location.href);
const urlParams = new URLSearchParams(currentUrl.search);

const dataset_uid = urlParams.get('uid');
const list_neuron_str = urlParams.get('list_neuron');
const list_neuron = [...new Set(list_neuron_str.split`,`.map(x => +x))]
const list_behavior = urlParams.get('list_behavior').split(",");
const list_behavior_str = ["Velocity", "Head Curve", "Pumping", "Angular Velocity", "Body Curvature"]
const list_behavior_str_short = ["v", "hc", "f", "av", "bc"]

fetch(`data/${dataset_uid}.json`).
    then(response => response.json()).
    then(data => {
        // change dataset string
        const str_dataset = document.getElementById('str_dataset');
        str_dataset.innerHTML = dataset_uid;

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
        }
        append_behavior = false;
        for (var b of list_behavior) {
            const idx_ = list_behavior_str_short.indexOf(b);
            plotSpecificBehavior(time_range, behaviors[idx_], behavior_units[idx_],
                list_behavior_str[idx_], "plot1", append_behavior)
            append_behavior=true
        }

        // table
        console.log(data)
        const neuron_cat = data["neuron_categorization"]

        var table_encoding_data = []
        for (var i = 0; i < list_neuron_idx.length; i++) {

            let label_ = "~"
            if ((i+1) in labeled) {
                label_ = labeled[i+1]["label"]
            }
            
            let enc_change_ = "No"
            if (data["encoding_changing_neurons"].includes(i + 1)) {
                enc_change_ = "Yes"
            }

            let tune_v_fwd = "-"
            v_fwd_1 = neuron_cat[1]["v"]["fwd"].includes(i+1)
            v_fwd_2 = neuron_cat[2]["v"]["fwd"].includes(i+1)
            if (v_fwd_1 && v_fwd_2) {
                tune_v_fwd = "1,2"
            } else if (v_fwd_1) {
                tune_v_fwd = "1"
            } else if (v_fwd_2) {
                tune_v_fwd = "2"
            }

            let tune_v_rev = "-"
            v_rev_1 = neuron_cat[1]["v"]["rev"].includes(i+1)
            v_rev_2 = neuron_cat[2]["v"]["rev"].includes(i+1)
            if (v_rev_1 && v_rev_2) {
                tune_v_rev = "1,2"
            } else if (v_rev_1) {
                tune_v_rev = "1"
            } else if (v_rev_2) {
                tune_v_rev = "2"
            }


            table_encoding_data.push({
                "neuron": i,
                "label": label_,

                "strength_v": data["rel_enc_str_v"][i].toFixed(3),
                "fwdness": data["forwardness"][i].toFixed(2),
                "fwd": tune_v_fwd,
                "rev": tune_v_rev,
                "ewma": data["tau_vals"][i],
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
    })

function plotSelect() {
    var selectedNeurons = $("#select_neuron").val();
    const selectedNeurons1 = selectedNeurons.map(num => {
        // Convert the string to a number, add 1, and then convert it back to a string
        return (Number(num) + 1).toString();
      });
      
    if (selectedNeurons.length > 0) {
        // Modify the URL as desired
        var currentUrl = window.location.href;
        var currentUrlStrRoot = currentUrl.split('?')[0]
        var newUrl = currentUrlStrRoot + "?uid=" + dataset_uid + "&list_neuron=" + selectedNeurons1.join() +
            "&list_behavior=" + $("#select_behavior").val();
        
        // Use pushState to update the URL
        // window.history.pushState({}, "", newUrl);        
        window.location.replace(newUrl);
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
