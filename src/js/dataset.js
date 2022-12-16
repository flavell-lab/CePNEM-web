function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
}

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

var table_data = []
fetch("data/summary.json").
then(response => response.json()).
then(data => {
    for (const [key, value] of Object.entries(data)) {
        let datasettype = value.dataset_type;

        idx_neuron1 = getRandomNumber(value.num_neurons)
        idx_neuron2 = getRandomNumber(value.num_neurons)

        list_idx_neuron = [idx_neuron1, idx_neuron2]
        url_plot = `plot_dataset.html?uid=${key}&list_neuron=${list_idx_neuron}&list_behavior=v`
        url_json = `data/${key}.json`
      
        new_html = `<a class="btn btn-outline-dark btn-sm" href=${url_json} role="button">Download</a>` +
            `   <a id="button_plot" class="btn btn-outline-dark btn-sm" href=${url_plot} role="button">Plot neurons</a>`
      
        table_data.push({
            id: key,
            type: getDatasetTypePill(datasettype),
            num_neurons: value.num_neurons,
            max_t: value.max_t,
            num_labeled: value.num_labeled,
            num_encoding_changes: value.num_encoding_changes,
            action: new_html

        })
    }

    $('#dataset_table').bootstrapTable({
        data: table_data
    });
}).
catch(error => console.error(error));