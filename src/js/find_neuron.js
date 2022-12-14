var select = document.getElementById("select_neuron");
var table = document.getElementById("dataset_table");

function getDatasetTypePill(datasettype) {
    let color;
    switch (datasettype) {
        case "Baseline":
            color = "secondary";
            break;
        case "NeuroPAL":
            color = "primary";
            break;
        case "GFP Control":
            color = "success";
            break;
        case "Heat-stim":
            color = "danger";
            break;

        default:
            color = "text-bg-danger";
    }
    result = '<span class="badge rounded-pill text-bg-' + color + '">' +
        datasettype + '</span>';
    return result;
}

// populate table
var table_data = [];
fetch("data/summary.json").
    then(response => response.json()).
    then(data => {
        for (const [key, value] of Object.entries(data)) {
            let datasettype = value.dataset_type;
            let url_neuron = "plot_dataset.html?uid=" + key + "&list_neuron=1&list_behavior=v";
            let url_json = `data/${key}.json`

            if (datasettype == "NeuroPAL") {

                table_data.push({
                    id: key,
                    type: getDatasetTypePill(datasettype),
                    num_neurons: value.num_neurons,
                    max_t: value.max_t,
                    num_labeled: value.num_labeled,
                    num_encoding_changes: value.num_encoding_changes,
                    action: `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button">Download</a>`
                    // `   ` + 
                    // `<a id="button_plot" class="btn btn-outline-dark btn-sm" href=${url_neuron} role="button">Plot neurons</a>`
                })
            }
        }

        $('#dataset_table').bootstrapTable({
            data: table_data
        });
    }).
    catch(error => console.error(error));

// populate select/picker and implement neuron finder
fetch("data/matches.json").
    then(response => response.json()).
    then(data => {
        // load dataset list to thje picker
        for (const [key, value] of Object.entries(data)) {
            // console.log(key)
            var option = document.createElement("option");
            option.value = key;
            option.text = key;
            select.add(option);
        };

        $(document).ready(function () {
            $("#select_neuron").selectpicker('refresh');
        });

        // filter
        $("#select_neuron").selectpicker({
            // Other options...
        }).on('change', function () {
            // find neuron
            var selectedOptions = $("#select_neuron").val();
            for (var i = 1; i < table.rows.length; i++) {
                // Get the current row
                var row = table.rows[i];
                var dataCells = row.getElementsByTagName("td");
                var dataset_id = dataCells[0].innerHTML // dataset uid

                // iterate over neurons selected
                var match_all = true;
                var list_idx_neuron = [];
                for (var j = 0; j < selectedOptions.length; j++) {
                    let neuron_class = selectedOptions[j]
                    var neuron_list = data[neuron_class];
                    var list_match_uid = neuron_list.map(function (subarray) {
                        if (subarray[0] == dataset_id) {
                            list_idx_neuron.push(subarray[1])
                        }
                        return subarray[0];
                    });
                    let match_ = list_match_uid.includes(dataset_id)
                    match_all = match_all && match_
                }

                if (match_all == true) {
                    row.style.display = "";
                    url_plot = `plot_dataset.html?uid=${dataset_id}&list_neuron=${list_idx_neuron}&list_behavior=v`
                    url_json = `data/${dataset_id}.json`

                    new_html = `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button">Download</a>` +
                        `   <a id="button_plot" class="btn btn-outline-dark btn-sm" href=${url_plot} role="button">Plot neurons</a>`
                    dataCells[6].innerHTML = new_html
                } else {
                    row.style.display = "none";
                }
            }
        });

    }).
    catch(error => console.error(error))

function clearSelect() {
    $("#select_neuron").selectpicker('val', '');
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        row.style.display = "";
        var dataCells = row.getElementsByTagName("td");
        var dataset_id = dataCells[0].innerHTML // dataset uid

        url_json = `data/${dataset_id}.json`
        new_html = `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button">Download</a>`
        dataCells[6].innerHTML = new_html
    }
}