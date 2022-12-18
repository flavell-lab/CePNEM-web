function getRandomNumber(x) {
    return Math.floor(Math.random() * x);
}

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