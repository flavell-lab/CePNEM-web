var select = document.getElementById("select_neuron");
var table = document.getElementById("dataset_table");

// populate table
var table_data = [];
var list_uid = [];
fetch("data/summary.json").then(response => response.json()).then(data => {
    for (const [key, value] of Object.entries(data)) {
        let list_dtype = value.dataset_type;
        let url_neuron = "plot_dataset.html?uid=" + key + "&list_neuron=1&list_behavior=v&list_colors=&datasets=true";
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
                num_neurons: value.num_neurons,
                max_t: value.max_t,
                num_labeled: value.num_labeled,
                num_encoding_changes: value.num_encoding_changes,
                action: `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button" download=${key}.json>Download</a>`
            })
        }
        list_uid.push(key)
    }
            
    $('#dataset_table').bootstrapTable({
        data: table_data
    });

    for (var i = 1; i < list_uid.length; i++) {
        var dataset_uid = list_uid[i];
        $('#dataset_table').bootstrapTable("hideRow", {uniqueId: dataset_uid});
    }
}).catch(error => console.error(error));

// populate select/picker and implement neuron finder
fetch("data/matches.json").
    then(response => response.json()).
    then(data => {
    // load dataset list to the picker
    for (const [key, value] of Object.entries(data)) {
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
        let selectedOptions = $("#select_neuron").val();
        
        if (selectedOptions.length > 0) {
            for (var i = 1; i < list_uid.length; i++) {
                let dataset_uid = list_uid[i];
                let row = $('#dataset_table').bootstrapTable('getRowByUniqueId', dataset_uid);
                // iterate over neurons selected
                let match_all = true;
                let list_idx_neuron = [];
                for (let j = 0; j < selectedOptions.length; j++) {
                    let neuron_class = selectedOptions[j]
                    let neuron_list = data[neuron_class];
                    let list_match_uid = neuron_list.map(function (subarray) {
                        if (subarray[0] == dataset_uid) {
                            list_idx_neuron.push(subarray[1])
                        }
                        return subarray[0];
                    });
                    let match_ = list_match_uid.includes(dataset_uid)
                    match_all = match_all && match_
                }

                if (match_all == true) {
                    let url_plot = new URL("plot_dataset.html", document.location);
                    url_plot.searchParams.set("uid", dataset_uid);
                    url_plot.searchParams.set("list_neuron", list_idx_neuron);
                    url_plot.searchParams.set("list_behavior", "v");
                    url_plot.searchParams.set("list_colors", "");
                    url_plot.searchParams.set("datasets", true);
                    let url_json = `data/${dataset_uid}.json`
                    let new_html = `<a id="button_plot" class="btn btn-outline-dark btn-sm py-0" href=${url_plot} role="button">Plot neurons</a>`
                    $('#dataset_table').bootstrapTable('updateCellByUniqueId', {
                        id: dataset_uid,
                        field: "action",
                        value: new_html,
                        reinit: true
                    });
                    $('#dataset_table').bootstrapTable('showRow', {uniqueId: dataset_uid});
                } else {
                    $('#dataset_table').bootstrapTable("hideRow", {uniqueId: dataset_uid});
                }
            }
        } else {// if (selectedOptions.length < 0)
            for (let i = 1; i < list_uid.length; i++) {
                let dataset_uid = list_uid[i];
                $('#dataset_table').bootstrapTable("hideRow", {uniqueId: dataset_uid});
            }
        }
    });

}).catch(error => console.error(error))

function clearSelect() {
    $("#select_neuron").selectpicker('val', '');

    for (let i = 1; i < list_uid.length; i++) {
        let dataset_uid = list_uid[i];
        $('#dataset_table').bootstrapTable("hideRow", {uniqueId: dataset_uid});
    }
}

function downloadSelected(){
    // Get a list of the selected rows
    var idsToDownload = $("#dataset_table").bootstrapTable("getSelections")

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
  
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))