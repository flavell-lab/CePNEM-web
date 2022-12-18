function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
}
function getDatsetFullStr(datasettype) {
    switch (datasettype) {
        case "baseline":
            return "Baseline";
            break;
        case "neuropal":
            return "NeuroPAL";
            break;
        case "gfp":
            return "GFP"
            break;
        case "heat":
            return "Heat"
            break;
        default:
            return "Unknown dataset type";
    }
}

function getDatasetTypePill(datasettype) {
    let color;
    let type_str;
    switch (datasettype) {
        case "baseline":
            type_str = "Baseline";
            color = "secondary";
            break;
        case "neuropal":
            type_str = "NeuroPAL";
            color = "primary";
            break;
        case "gfp":
            type_str = "GFP"
            color = "success";
            break;
        case "heat":
            type_str = "Heat"
            color = "danger";
            break;
        default:
            color = "text-bg-danger";
    }
    result = '<span class="badge rounded-pill text-bg-' + color + ` dtype="${datasettype}">` +
        type_str + '</span>';
    return result;
}   

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
        let url_plot = `plot_dataset.html?uid=${key}&list_neuron=${list_idx_neuron}&list_behavior=v`
        let url_json = `data/${key}.json`
      
        let html_buttons = `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button">Download</a>` +
            `   <a id="button_plot" class="btn btn-outline-dark btn-sm" href=${url_plot} role="button">Plot neurons</a>`
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