var table_data = [];
var list_dtype_unique = [];
var select = document.getElementById("select_dtype");
fetch("data/summary.json").
then(response => response.json()).
then(data => {
    for (const [key, value] of Object.entries(data)) {
        let list_dtype = value.dataset_type;

        // selecting 2 random neurons to plot
        idx_neuron1 = getRandomNumber(value.num_neurons)
        idx_neuron2 = getRandomNumber(value.num_neurons)
        let list_idx_neuron = [idx_neuron1, idx_neuron2]
        let url_plot = new URL("plot_dataset.html", document.location);
        url_plot.searchParams.set("uid", key);
        url_plot.searchParams.set("list_neuron", list_idx_neuron);
        url_plot.searchParams.set("list_behavior", "v");
        url_plot.searchParams.set("list_colors", "");
        url_plot.searchParams.set("datasets", false);
        let url_json = `data/${key}.json`
      
        let html_buttons = `<a id="button_plot" class="btn btn-outline-dark btn-sm py-0" href=${url_plot} role="button">Plot neurons</a>`
        let html_dtype = ""
        for (let i = 0; i < list_dtype.length; i++) {
            let dtype_ = list_dtype[i];
            if (!list_dtype_unique.includes(dtype_)) {
                list_dtype_unique.push(dtype_)
                let option = document.createElement("option");
                option.value = dtype_;
                option.text = getDatsetFullStr(dtype_);
                option.selected = true;
                select.add(option);
            }
            html_dtype += getDatasetTypePill(dtype_) + " "
        }

        table_data.push({
            id: key,
            type: html_dtype,
            num_neurons: value.num_neurons,
            max_t: value.max_t,
            num_labeled: value.num_labeled,
            num_encoding_changes: value.num_encoding_changes,
            action: html_buttons
        })
    } // for summary.json

    $('#dataset_table').bootstrapTable({
        data: table_data
    });

    $(document).ready(function () {
        $("#select_dtype").selectpicker('refresh');
    });
}).catch(error => console.error(error));

$("#select_dtype").selectpicker({}).on('change', function () {
    let selected = $(this).val();
    $('#dataset_table').bootstrapTable('filterBy', {id: "filter_dtype"}, {
        'filterAlgorithm': (row, filters) => {
            let list_dtype = row.type;
            for (let i = 0; i < selected.length; i++) {
                return row.type.includes(selected[i]);
                break;
            }
            return false;
      }
    })
});

function clearSelect() {
    $("#select_dtype").selectpicker('val', '');
    $('#dataset_table').bootstrapTable('filterBy', {id: "filter_dtype_reset"}, {
        'filterAlgorithm': (row, filters) => {
            return false;
        }
    })
};

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